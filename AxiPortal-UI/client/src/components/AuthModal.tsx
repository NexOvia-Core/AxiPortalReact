import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, User, UserPlus } from "lucide-react";
import { useAuthModal } from "@/contexts/AuthContext";
import OtpModal from "./OtpModal";
import { bff } from "@/lib/bff";
import AccountProvisionModal from "./AccountProvisionModal";
import type { Schema } from "@/lib/bff";
import { getBrowserId } from "@/lib/browser-id";
import { readSelectedPackages } from "@/lib/package-selection";
import ProvisionProgressModal from "./ProvisionProgressModal";
import PasswordModal from "./PasswordModal";
import { savePackageSetupFlow } from "@/lib/package-setup-flow";
import { getSchemaValidationError } from "@/lib/schema-validation";
import RedirectingModal from "./RedirectingModal";
import { useLocation, useRouter, useSearch } from "wouter";
import { assetUrl } from "@/lib/paths";

export default function AuthModal() {
  const [currentPath, setLocation] = useLocation();
  const searchString = useSearch();
  const router = useRouter();
  const {
    isOpen,
    mode,
    setMode,
    closeModal,
    openLogin,
    openSignUp,
    targetUrl,
    clearSelectedPackage,
    selectedPackage,
  } = useAuthModal();

  const [email, setEmail] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP sub-modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [challenge, setChallenge] = useState<{
    challengeId: string;
    expiresInSeconds: number;
    resendInSeconds: number;
  }>();
  const [showAccountProvision, setShowAccountProvision] = useState(false);
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [rememberedAccounts, setRememberedAccounts] = useState<string[]>([]);
  const [showRememberedAccounts, setShowRememberedAccounts] = useState(false);
  const [rememberedAccountLoading, setRememberedAccountLoading] = useState("");
  const [redirecting, setRedirecting] = useState<{
    url: string;
    message: string;
  }>();
  const [browserId, setBrowserId] = useState("");
  const [secondaryAuth, setSecondaryAuth] = useState<{
    email: string;
    ssoKey: string;
    ssoProvider: string;
  }>();
  const [signupSso, setSignupSso] = useState<{
    provider: string;
    id: string;
    isEmailVerified: boolean;
  }>();
  const [error, setError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSsoAuthenticated, setIsSsoAuthenticated] = useState(false);
  const [selectedSchemaId, setSelectedSchemaId] = useState("");
  const [provisioningSchema, setProvisioningSchema] = useState<Schema>();
  const directLoginStarted = useRef(false);
  const linkedInCallbackHandled = useRef(false);

  const getCurrentUrl = () => {
    const url = new URL(
      router.hrefs(router.base + currentPath, router),
      window.location.origin
    );
    url.search = searchString;
    return url.href;
  };

  const dismiss = () => {
    setEmail("");
    setKeepSignedIn(false);
    setUseOtp(false);
    setChallenge(undefined);
    setShowOtpModal(false);
    setShowAccountProvision(false);
    setSchemas([]);
    setSecondaryAuth(undefined);
    setSignupSso(undefined);
    setShowPasswordModal(false);
    setIsSsoAuthenticated(false);
    setSelectedSchemaId("");
    setShowRememberedAccounts(false);
    setRememberedAccountLoading("");
    setRedirecting(undefined);
    setProvisioningSchema(undefined);
    setError("");
    clearSelectedPackage();
    closeModal();
  };

  const handleOAuthResult = (result: import("@/lib/bff").OAuthResult) => {
    setEmail(result.email);
    setIsSsoAuthenticated(true);
    if (mode === "signup")
      setSignupSso({
        provider: result.provider,
        id: result.sub,
        isEmailVerified: result.isEmailVerified,
      });
    if (result.nextAction === "otp-required" && result.challengeId) {
      setChallenge({
        challengeId: result.challengeId,
        expiresInSeconds: Number(result.expiresInSeconds) || 300,
        resendInSeconds: 30,
      });
      setShowOtpModal(true);
      return;
    }
    if (result.nextAction === "auth-update")
      setSecondaryAuth({
        email: result.email,
        ssoKey: result.sub,
        ssoProvider: result.provider,
      });
    if (result.schemas?.length) {
      setSchemas(result.schemas);
      setSelectedSchemaId(
        result.schemas.length === 1 ? result.schemas[0].axiaccid : ""
      );
      if (result.schemas.length === 1) {
        const schemaError = getSchemaValidationError(result.schemas[0]);
        if (schemaError) setError(schemaError);
      }
    }
  };

  // Reset useOtp & showOtpModal when switching between login and signup modes
  useEffect(() => {
    setKeepSignedIn(false);
    setUseOtp(false);
    setShowOtpModal(false);
    setError("");
    setSchemas([]);
    setShowPasswordModal(false);
    setIsSsoAuthenticated(false);
    setSelectedSchemaId("");
  }, [mode]);

  // Handle keep me signin
  useEffect(() => {
    const search = new URLSearchParams(searchString);

    if (
      search.has("sessionId") ||
      search.has("key") ||
      window.location.hash.includes("access_token")
    )
      return;

    let active = true;
    void getBrowserId()
      .then(async id => {
        if (!active) return;
        setBrowserId(id);
        const accounts = await bff.rememberedAccounts(id);
        if (!active) return;
        setRememberedAccounts(accounts);
        if (accounts.length > 0) setShowRememberedAccounts(true);
      })
      .catch(() => setRememberedAccounts([]));
    return () => {
      active = false;
    };
  }, [searchString]);

  // Handle direct login
  useEffect(() => {
    if (directLoginStarted.current) return;

    const search = new URLSearchParams(searchString);
    // The legacy portal accepts sessionId. Accept key as a compatibility alias
    // for existing email links, while preserving the BFF's SessionId contract.
    const sessionId = search.get("sessionId") || search.get("key");
    if (!sessionId) return;

    directLoginStarted.current = true;

    const timer = window.setTimeout(() => {
      void bff
        .directLogin(sessionId)
        .then(result => {
          // Remove sessionId/key from the URL only after processing
          setLocation(currentPath);

          if (result.success && result.redirectUrl) {
            setRedirecting({
              url: result.redirectUrl,
              message: "Opening your AXI application...",
            });
            return;
          }

          const message =
            result.error === "UNDER_PROVISION"
              ? "Account setup is in progress. Please try again shortly or check your email for confirmation."
              : result.error === "PROVISION_FAILED"
                ? "Login failed, please check your email."
                : result.error === "UNAUTHORIZED"
                  ? "Session expired. Please log in again."
                  : "Something went wrong, please contact support.";
          setError(message);
          openLogin();
        })
        .catch(requestError => {
          setLocation(currentPath);

          setError(
            requestError instanceof Error
              ? requestError.message
              : "Something went wrong, please contact support."
          );
          openLogin();
        });
    }, 500);

    return () => window.clearTimeout(timer);
  }, [currentPath, openLogin, searchString, setLocation]);

  // Handle linkedIn response
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const search = new URLSearchParams(window.location.search);

    const hasAccessToken = hash.has("access_token");
    const hasOAuthError = hash.has("error") || search.has("error");
    const oauthError = hash.get("error") || search.get("error");
    const oauthErrorDescription =
      hash.get("error_description") || search.get("error_description");

    // Nothing related to LinkedIn OAuth is present.
    if (!hasAccessToken && !hasOAuthError) return;

    // Prevent the callback from being processed more than once.
    if (linkedInCallbackHandled.current) return;

    linkedInCallbackHandled.current = true;

    const finishLinkedIn = async () => {
      try {
        const isSignup = sessionStorage.getItem("axi_oauth_mode") === "signup";

        if (isSignup) openSignUp();
        else openLogin();

        setLoading(true);
        setError("");

        // Handle LinkedIn/Supabase OAuth errors first.
        if (oauthError) {
          // Check for user cancellation specifically
          if (
            oauthError === "user_cancelled_login" ||
            oauthError === "access_denied" ||
            oauthErrorDescription?.includes("cancelled")
          ) {
            throw new Error("LinkedIn sign-in was cancelled.");
          }
          throw new Error(
            oauthErrorDescription
              ? decodeURIComponent(oauthErrorDescription)
              : "LinkedIn sign-in failed. Please try again."
          );
        }

        const supabaseWindow = window as unknown as {
          supabase?: {
            createClient: (
              url: string,
              key: string
            ) => {
              auth: {
                getSession: () => Promise<{
                  data: {
                    session: {
                      access_token: string;
                    } | null;
                  };
                }>;
              };
            };
          };
        };

        if (!supabaseWindow.supabase) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");

            script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
            script.async = true;
            script.defer = true;

            script.onload = () => resolve();
            script.onerror = () =>
              reject(new Error("LinkedIn sign-in could not load."));

            document.head.appendChild(script);
          });
        }

        const config = (await bff.oauthConfig()) as {
          supabase?: {
            url?: string;
            publicKey?: string;
          };
        };

        if (!config.supabase?.url || !config.supabase.publicKey) {
          throw new Error("LinkedIn sign-in is not configured.");
        }

        const session = await supabaseWindow
          .supabase!.createClient(
            config.supabase.url,
            config.supabase.publicKey
          )
          .auth.getSession();

        if (!session.data.session) {
          throw new Error("LinkedIn sign-in was cancelled.");
        }

        const result = await bff.oauth(
          "supabase",
          session.data.session.access_token,
          isSignup,
          "linkedin_oidc"
        );

        handleOAuthResult(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "LinkedIn sign-in failed. Please try again."
        );
      } finally {
        setLoading(false);
        // Remove OAuth params from URL without triggering React Router
        const url = new URL(window.location.href);
        url.hash = "";
        // Remove error params from search
        url.searchParams.delete("error");
        url.searchParams.delete("error_description");
        window.history.replaceState(window.history.state, "", url.toString());
        sessionStorage.removeItem("axi_oauth_mode");
      }
    };

    void finishLinkedIn();
  }, [openLogin, openSignUp]);

  const loginRememberedAccount = async (userName: string) => {
    setRememberedAccountLoading(userName);
    setError("");
    try {
      const id = browserId || (await getBrowserId());
      setBrowserId(id);
      const result = await bff.rememberSignIn(id, userName);
      if (!result.redirectUrl)
        throw new Error("The remembered session has expired.");
      setRedirecting({
        url: result.redirectUrl,
        message: `Signing in as ${userName}...`,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in with this account."
      );
    } finally {
      setRememberedAccountLoading("");
    }
  };

  const hasActivePortalFlow =
    isOpen ||
    showOtpModal ||
    showPasswordModal ||
    showAccountProvision ||
    Boolean(provisioningSchema) ||
    showRememberedAccounts ||
    Boolean(redirecting);
  if (!hasActivePortalFlow) return null;

  const showAuthCard =
    isOpen &&
    !showOtpModal &&
    !showPasswordModal &&
    !showAccountProvision &&
    !provisioningSchema &&
    !showRememberedAccounts;

  // ── Helper: log the social provider attempt then redirect ──────
  const handleSocialLogin = async (
    provider: "google" | "office365" | "linkedin"
  ) => {
    if (provider === "google") {
      setLoading(true);
      setError("");

      try {
        const googleIdentity = window as unknown as {
          google?: {
            accounts?: {
              oauth2?: {
                initTokenClient: (config: {
                  client_id: string;
                  scope: string;
                  callback: (response: {
                    access_token?: string;
                    error?: string;
                  }) => void;
                  error_callback?: (error: {
                    type?: string;
                    message?: string;
                  }) => void;
                }) => {
                  requestAccessToken: (config: { prompt: string }) => void;
                };
              };
            };
          };
        };

        if (!googleIdentity.google?.accounts?.oauth2) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;

            script.onload = () => resolve();
            script.onerror = () =>
              reject(new Error("Google sign-in could not load."));

            document.head.appendChild(script);
          });
        }

        const config = (await bff.oauthConfig()) as {
          google?: {
            clientId?: string;
          };
        };

        if (!config.google?.clientId) {
          throw new Error("Google sign-in is not configured.");
        }

        const client = googleIdentity.google!.accounts!.oauth2!.initTokenClient(
          {
            client_id: config.google.clientId,
            scope: "openid email profile",

            callback: async response => {
              try {
                if (response.error) {
                  throw new Error("Google sign-in failed. Please try again.");
                }

                if (!response.access_token) {
                  throw new Error("Google sign-in was cancelled.");
                }

                const result = await bff.oauth(
                  "google",
                  response.access_token,
                  mode === "signup"
                );

                handleOAuthResult(result);
              } catch (error) {
                setError(
                  error instanceof Error
                    ? error.message
                    : "Google sign-in failed."
                );
              } finally {
                setLoading(false);
              }
            },

            // Important: handles popup close / popup failure.
            error_callback: error => {
              if (error.type === "popup_closed") {
                setError("Google sign-in was cancelled.");
              } else if (error.type === "popup_failed_to_open") {
                setError(
                  "Unable to open Google sign-in. Please allow popups and try again."
                );
              } else {
                setError("Google sign-in failed. Please try again.");
              }

              setLoading(false);
            },
          }
        );

        client.requestAccessToken({
          prompt: "select_account",
        });
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Google sign-in failed."
        );

        setLoading(false);
      }

      return;
    }
    if (provider === "office365") {
      setLoading(true);
      setError("");
      try {
        const msalWindow = window as unknown as {
          msal?: {
            PublicClientApplication: new (config: unknown) => {
              initialize: () => Promise<void>;
              loginPopup: (config: unknown) => Promise<{ accessToken: string }>;
            };
          };
        };
        if (!msalWindow.msal)
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
              "https://alcdn.msauth.net/browser/2.38.2/js/msal-browser.min.js";
            script.onload = () => resolve();
            script.onerror = () =>
              reject(new Error("Microsoft sign-in could not load."));
            document.head.append(script);
          });
        const config = (await bff.oauthConfig()) as {
          office365?: { clientId?: string; tenantId?: string };
        };
        if (!config.office365?.clientId)
          throw new Error("Microsoft sign-in is not configured.");
        const client = new msalWindow.msal!.PublicClientApplication({
          auth: {
            clientId: config.office365.clientId,
            authority: `https://login.microsoftonline.com/${config.office365.tenantId || "common"}`,
            redirectUri: window.location.origin,
          },
          cache: { cacheLocation: "sessionStorage" },
        });
        await client.initialize();
        const response = await client.loginPopup({
          scopes: ["openid", "email", "profile", "User.Read"],
          prompt: "select_account",
        });
        const result = await bff.oauth(
          "microsoft",
          response.accessToken,
          mode === "signup"
        );
        handleOAuthResult(result);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Microsoft sign-in failed."
        );
      } finally {
        setLoading(false);
      }
      return;
    }
    if (provider === "linkedin") {
      setLoading(true);
      setError("");
      // debugger;

      try {
        const config = (await bff.oauthConfig()) as {
          supabase?: {
            url?: string;
            publicKey?: string;
          };
        };

        if (!config.supabase?.url || !config.supabase.publicKey) {
          throw new Error("LinkedIn sign-in is not configured.");
        }

        const { url, publicKey } = config.supabase;
        sessionStorage.setItem("axi_oauth_mode", mode);
        const supabaseWindow = window as unknown as {
          supabase?: {
            createClient: (
              url: string,
              key: string
            ) => {
              auth: {
                signInWithOAuth: (options: unknown) => Promise<{
                  error?: {
                    message?: string;
                  } | null;
                }>;
              };
            };
          };
        };

        if (!supabaseWindow.supabase) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");

            script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
            script.async = true;
            script.defer = true;

            script.onload = () => resolve();
            script.onerror = () =>
              reject(new Error("LinkedIn sign-in could not load."));

            document.head.appendChild(script);
          });
        }

        const { error } = await supabaseWindow
          .supabase!.createClient(url, publicKey)
          .auth.signInWithOAuth({
            provider: "linkedin_oidc",
            options: {
              redirectTo: getCurrentUrl(),
            },
          });

        if (error) {
          throw new Error(
            error.message || "LinkedIn sign-in failed. Please try again."
          );
        }

        // OAuth redirect is now owned by the browser.
        // The callback flow will finish in the effect above.
        return;
      } catch (error) {
        sessionStorage.removeItem("axi_oauth_mode");

        setError(
          error instanceof Error
            ? error.message
            : "LinkedIn sign-in failed. Please try again."
        );

        setLoading(false);
      }

      return;
    }
  };

  // ── OTP checkbox toggled on Login page ───────
  const handleOtpToggle = () => setUseOtp(value => !value);

  // ── Form submit ─────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Enter your work email.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (mode === "login" && schemas.length === 0) {
        const result = await bff.verifyEmailSchemas(email);
        if (!result.schemas?.length) {
          throw new Error(
            "No active applications are available for this account."
          );
        }
        setSchemas(result.schemas);
        setSelectedSchemaId(
          result.schemas.length === 1 ? result.schemas[0].axiaccid : ""
        );
        if (result.schemas.length === 1) {
          const schemaError = getSchemaValidationError(result.schemas[0]);
          if (schemaError) throw new Error(schemaError);
          if (useOtp) {
            const challengeResult = await bff.checkAndSendOtp(email, "login");
            setChallenge(challengeResult);
            setShowOtpModal(true);
          } else {
            setShowPasswordModal(true);
          }
        }
        return;
      }

      if (mode === "login") {
        const schema = schemas.find(item => item.axiaccid === selectedSchemaId);
        if (!schema) throw new Error("Please select an application first.");
        const schemaError = getSchemaValidationError(schema);
        if (schemaError) throw new Error(schemaError);

        if (isSsoAuthenticated) {
          await completeLogin(schema);
          return;
        }

        if (useOtp) {
          const result = await bff.checkAndSendOtp(email, "login");
          setChallenge(result);
          setShowOtpModal(true);
          return;
        }

        setShowPasswordModal(true);
        return;
      }

      const result = await bff.checkAndSendOtp(email, mode);
      setChallenge(result);
      setShowOtpModal(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Submission failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Called when OTP verification succeeds ─────────────────────
  const handleOtpSuccess = (result: { schemas?: Schema[] }) => {
    setShowOtpModal(false);
    if (mode === "signup") {
      setShowAccountProvision(true);
      return;
    }
    const schema =
      schemas.find(item => item.axiaccid === selectedSchemaId) ??
      result.schemas?.[0];
    if (!schema) {
      setError("No active applications are available for this account.");
      return;
    }
    const schemaError = getSchemaValidationError(schema);
    if (schemaError) {
      setError(schemaError);
      return;
    }
    void completeLogin(schema);
  };

  const completeLogin = async (schema: Schema, currentPassword?: string) => {
    setLoading(true);
    setError("");
    try {
      const schemaError = getSchemaValidationError(schema);
      if (schemaError) throw new Error(schemaError);
      if (secondaryAuth)
        await bff.authUpdate(
          secondaryAuth.email,
          schema.axiaccid,
          secondaryAuth.ssoKey,
          secondaryAuth.ssoProvider
        );

      const packages = readSelectedPackages();
      if (schema.isprimary === "T" && packages.length > 0) {
        setShowPasswordModal(false);
        savePackageSetupFlow({ schema });
        closeModal();
        setLocation("/packages/setup");
        return;
      }

      const currentBrowserId = browserId || (await getBrowserId());
      setBrowserId(currentBrowserId);
      const result = await bff.signinInfo(
        schema,
        keepSignedIn,
        currentPassword,
        currentBrowserId
      );
      if (!result.redirectUrl)
        throw new Error("The BFF did not return a redirect URL.");

      setRedirecting({
        url: result.redirectUrl,
        message: `Loading ${schema.axiaccid}...`,
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to continue to AXI."
      );
    } finally {
      setLoading(false);
    }
  };

  const showSsoSchemaStep =
    mode === "login" && isSsoAuthenticated && schemas.length > 0;

  if (redirecting) {
    return (
      <RedirectingModal
        redirectUrl={redirecting.url}
        message={redirecting.message}
      />
    );
  }

  return (
    <>
      <AnimatePresence>
        {showRememberedAccounts && (
          <div className="fixed inset-0 z-[230] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={dismiss}
              className="fixed inset-0 bg-[#0a0c1a]/70 backdrop-blur-md transition-opacity"
            />

            {/* Modal Card */}
            <motion.section
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="remembered-accounts-title"
              className="relative w-full max-w-[460px] bg-[#fff8ee] bg-[radial-gradient(circle_at_85%_85%,rgba(254,180,140,0.35)_0%,transparent_55%)] rounded-3xl shadow-2xl shadow-indigo-950/20 border border-[#f3e2cc] overflow-hidden z-10 p-6 sm:p-8 text-slate-800"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={dismiss}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-[#f3e2cc]/50 transition-colors focus:outline-none"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Logo & Header */}
              <div className="text-center mb-6">
                <img
                  src={assetUrl("AXI_LOGO_AXPERT.png")}
                  alt="Axi Logo"
                  className="h-10 mx-auto mb-3 object-contain"
                />
                <h2
                  id="remembered-accounts-title"
                  className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] tracking-tight"
                >
                  Continue to AXI
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium max-w-xs mx-auto">
                  Choose an account to continue without entering your credentials.
                </p>
              </div>

              {error && (
                <p
                  role="alert"
                  className="mb-4 rounded-xl border border-red-200 bg-red-50/80 px-3.5 py-2.5 text-xs font-medium text-red-700"
                >
                  {error}
                </p>
              )}

              {/* Account List */}
              <div className="space-y-3">
                {rememberedAccounts.map(userName => (
                  <button
                    key={userName}
                    type="button"
                    disabled={Boolean(rememberedAccountLoading)}
                    onClick={() => void loginRememberedAccount(userName)}
                    className="group relative w-full rounded-2xl border border-[#e8d7c3] bg-white/80 hover:bg-white p-3.5 sm:p-4 text-left transition-all duration-200 hover:border-[#d6573c] hover:shadow-md hover:shadow-[#d6573c]/5 disabled:cursor-wait disabled:opacity-60 flex items-center gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#1E1B4B]/5 group-hover:bg-[#d6573c]/10 flex items-center justify-center text-[#1E1B4B] group-hover:text-[#d6573c] transition-colors flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-[#1E1B4B] truncate flex-1">
                      {rememberedAccountLoading === userName
                        ? "Signing in..."
                        : `Continue as ${userName}`}
                    </span>
                  </button>
                ))}

                {/* Login with another account */}
                <button
                  type="button"
                  onClick={() => {
                    setShowRememberedAccounts(false);
                    setError("");
                    openLogin();
                  }}
                  className="mt-3 group w-full rounded-2xl border-2 border-dashed border-[#e8d7c3] hover:border-[#d6573c] bg-white/40 hover:bg-white/90 p-3.5 sm:p-4 text-left transition-all duration-200 flex items-center gap-3.5"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1E1B4B]/5 group-hover:bg-[#d6573c]/10 flex items-center justify-center text-[#1E1B4B] group-hover:text-[#d6573c] transition-colors flex-shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-[#1E1B4B]">
                    Login with another account
                  </span>
                </button>
              </div>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAuthCard && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={dismiss}
              className="fixed inset-0 bg-[#0a0c1a]/70 backdrop-blur-md transition-opacity"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-[460px] bg-[#fff8ee] bg-[radial-gradient(circle_at_85%_85%,rgba(254,180,140,0.35)_0%,transparent_55%)] rounded-3xl shadow-2xl shadow-indigo-950/20 border border-[#f3e2cc] overflow-hidden z-10 p-6 sm:p-8 text-slate-800"
            >
              {/* Close Button */}
              <button
                onClick={dismiss}
                className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors focus:outline-none"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {/* Top Pill Badge */}
              <div className="text-center mb-3">
                <span className="inline-block px-4 py-1 text-[11px] font-extrabold tracking-wider text-[#d6573c] uppercase bg-[#d6573c]/10 rounded-full">
                  START YOUR JOURNEY
                </span>
              </div>

              {/* Logo & Header Title */}
              <div className="text-center mb-6">
                {mode === "signup" && (
                  <img
                    src={assetUrl("AXI_LOGO_AXPERT.png")}
                    alt="Axi Logo"
                    className="h-10 mx-auto mb-3 object-contain"
                  />
                )}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] tracking-tight">
                  {showSsoSchemaStep
                    ? "Choose your application"
                    : mode === "login"
                      ? "Welcome Back to Axi"
                      : "Account Registration"}
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {showSsoSchemaStep
                    ? "Select the application you want to open"
                    : mode === "login"
                      ? "Sign in to access your intelligent enterprise platform"
                      : "Register your account to experience living intelligence"}
                </p>
              </div>

              {selectedPackage && (
                <p className="mb-5 rounded-lg border border-[#d6573c]/20 bg-[#d6573c]/10 px-3 py-2 text-center text-sm text-[#7a2a1b]">
                  Selected package:{" "}
                  <strong>{selectedPackage.packageName}</strong>
                </p>
              )}

              {/* Social Auth Buttons */}
              {!showSsoSchemaStep && (
                <div className="space-y-3 mb-5">
                  {/* Google */}
                  <button
                    type="button"
                    id="auth-google-btn"
                    onClick={() => handleSocialLogin("google")}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-full border border-[#e8d7c3] bg-[#fff8ee] hover:bg-[#fff2e0] transition-all font-semibold text-slate-700 text-sm flex items-center justify-center gap-3 shadow-xs hover:border-[#d6c2ab] active:scale-[0.99]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.04.01 12c0 1.96.45 3.8 1.26 5.42l4.01-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Office 365 */}
                  <button
                    type="button"
                    id="auth-office365-btn"
                    onClick={() => handleSocialLogin("office365")}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-full border border-[#e8d7c3] bg-[#fff8ee] hover:bg-[#fff2e0] transition-all font-semibold text-slate-700 text-sm flex items-center justify-center gap-3 shadow-xs hover:border-[#d6c2ab] active:scale-[0.99]"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 21 21" fill="none">
                      <rect x="0" y="0" width="10" height="10" fill="#F25022" />
                      <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
                      <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
                      <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
                    </svg>
                    <span>Continue with Office 365</span>
                  </button>

                  {/* LinkedIn */}
                  <button
                    type="button"
                    id="auth-linkedin-btn"
                    onClick={() => handleSocialLogin("linkedin")}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-full border border-[#e8d7c3] bg-[#fff8ee] hover:bg-[#fff2e0] transition-all font-semibold text-slate-700 text-sm flex items-center justify-center gap-3 shadow-xs hover:border-[#d6c2ab] active:scale-[0.99]"
                  >
                    <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.6a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                    </svg>
                    <span>Continue with LinkedIn</span>
                  </button>
                </div>
              )}

              {/* Divider */}
              {!showSsoSchemaStep && (
                <div className="relative my-5 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e8d7c3]" />
                  </div>
                  <span className="relative bg-[#fff8ee] px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    OR
                  </span>
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!showSsoSchemaStep && (
                  <div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        setError("");
                        setSchemas([]);
                        setSelectedSchemaId("");
                        setShowPasswordModal(false);
                        setIsSsoAuthenticated(false);
                      }}
                      placeholder="Enter your work email"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#FAF8F5] text-slate-800 text-sm font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c1380] focus:border-transparent transition-all"
                    />
                  </div>
                )}

                {/* Login mode options */}
                {mode === "login" && !showSsoSchemaStep && (
                  <div className="space-y-2.5 pt-1">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={keepSignedIn}
                      onClick={() => setKeepSignedIn(value => !value)}
                      className="flex items-center gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none"
                    >
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          keepSignedIn
                            ? "bg-[#1E1B4B] border-[#1E1B4B] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {keepSignedIn && <Check size={12} strokeWidth={3} />}
                      </span>
                      <span>Keep me signed in</span>
                    </button>

                    <label className="flex items-center gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                      <div
                        onClick={handleOtpToggle}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          useOtp
                            ? "bg-[#1E1B4B] border-[#1E1B4B] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {useOtp && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span>Use OTP authentication</span>
                    </label>
                  </div>
                )}

                {showSsoSchemaStep && (
                  <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <label className="block text-xs font-semibold text-slate-700">
                      Application
                      <select
                        value={selectedSchemaId}
                        disabled={schemas.length === 1}
                        onChange={event => {
                          setSelectedSchemaId(event.target.value);
                          setError(
                            getSchemaValidationError(
                              schemas.find(
                                schema => schema.axiaccid === event.target.value
                              )
                            ) || ""
                          );
                        }}
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#5c1380] disabled:cursor-not-allowed disabled:bg-slate-100"
                      >
                        {schemas.length > 1 && (
                          <option value="" disabled>
                            Select an application
                          </option>
                        )}
                        {schemas.map(schema => (
                          <option key={schema.axiaccid} value={schema.axiaccid}>
                            {schema.axiaccid}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={keepSignedIn}
                      onClick={() => setKeepSignedIn(value => !value)}
                      className="flex items-center gap-2.5 text-xs font-medium text-slate-600"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          keepSignedIn
                            ? "border-[#1E1B4B] bg-[#1E1B4B] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {keepSignedIn && <Check size={12} strokeWidth={3} />}
                      </span>
                      <span>Keep me signed in</span>
                    </button>
                  </div>
                )}

                {mode === "login" &&
                  !showSsoSchemaStep &&
                  schemas.length > 1 && (
                    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <label className="block text-xs font-semibold text-slate-700">
                        Select your application
                        <select
                          value={selectedSchemaId}
                          onChange={event => {
                            setSelectedSchemaId(event.target.value);
                            setShowPasswordModal(false);
                            setError(
                              getSchemaValidationError(
                                schemas.find(
                                  schema =>
                                    schema.axiaccid === event.target.value
                                )
                              ) || ""
                            );
                          }}
                          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#5c1380]"
                        >
                          <option value="" disabled>
                            Select an application
                          </option>
                          {schemas.map(schema => (
                            <option
                              key={schema.axiaccid}
                              value={schema.axiaccid}
                            >
                              {schema.axiaccid}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    {error}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  id="auth-submit-btn"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-white text-sm tracking-wider uppercase bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] shadow-lg hover:shadow-xl hover:opacity-95 transition-all transform active:scale-[0.99] disabled:opacity-50"
                >
                  {loading
                    ? "PROCESSING..."
                    : showSsoSchemaStep
                      ? "CONTINUE"
                      : mode === "login"
                        ? useOtp
                          ? "CONTINUE WITH OTP →"
                          : "NEXT"
                        : "REGISTER NOW →"}
                </button>
              </form>

              {/* Bottom Link */}
              {!showSsoSchemaStep && (
                <div className="text-center mt-5 pt-2">
                  <p className="text-xs text-slate-600 font-medium">
                    {mode === "login" ? (
                      <>
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("signup")}
                          className="text-[#00007f] font-bold underline hover:text-[#5c1380] transition-colors"
                        >
                          Create Here!
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("login")}
                          className="text-[#00007f] font-bold underline hover:text-[#5c1380] transition-colors"
                        >
                          Login Here!
                        </button>
                      </>
                    )}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OTP Sub-Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccess={handleOtpSuccess}
        actionType={mode}
        email={email}
        challengeId={challenge?.challengeId}
        expiresInSeconds={challenge?.expiresInSeconds}
        resendInSeconds={challenge?.resendInSeconds}
      />
      {showPasswordModal && (
        <PasswordModal
          applicationName={selectedSchemaId}
          error={error}
          loading={loading}
          onClose={() => setShowPasswordModal(false)}
          onSubmit={async password => {
            const schema = schemas.find(
              item => item.axiaccid === selectedSchemaId
            );
            if (!schema) throw new Error("Please select an application first.");
            await completeLogin(schema, password);
          }}
        />
      )}
      {showAccountProvision && (
        <AccountProvisionModal
          email={email}
          sso={signupSso}
          onProvisioningStarted={schema => {
            setShowAccountProvision(false);
            setProvisioningSchema(schema);
          }}
          onClose={() => {
            setShowAccountProvision(false);
            setSignupSso(undefined);
            dismiss();
          }}
        />
      )}
      {provisioningSchema && (
        <ProvisionProgressModal
          onReady={() => {
            savePackageSetupFlow({ schema: provisioningSchema });
            setProvisioningSchema(undefined);
            closeModal();
            setLocation("/packages/setup");
          }}
          onDismiss={() => {
            setProvisioningSchema(undefined);
            dismiss();
          }}
        />
      )}
    </>
  );
}
