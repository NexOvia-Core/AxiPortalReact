import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Phone } from "lucide-react";
import { useAuthModal } from "@/contexts/AuthContext";
import { toast } from "sonner";
import OtpModal from "./OtpModal";
import { bff } from "@/lib/bff";
import AccountProvisionModal from "./AccountProvisionModal";
import SchemaSelectionModal from "./SchemaSelectionModal";
import type { Schema } from "@/lib/bff";
import { getBrowserId } from "@/lib/browser-id";

// ── External OAuth URLs ────────────────────────────────────────────────────
const GOOGLE_AUTH_URL =
  "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Faccounts.google.com%2Fgsi%2Fselect%3Fclient_id%3D990339570472-k6nqn1tpmitg8pui82bfaun3jrpmiuhs.apps.googleusercontent.com%26auto_select%3Dtrue%26ux_mode%3Dpopup%26ui_mode%3Dcard%26context%3Dsignin%26as%3D5zpfOzHjU779kRjzxSLP0Q%26channel_id%3Dddf0eef750007715681c7150ca8b56af11c2e99c12b9affdd144c2525dc770a2%26origin%3Dhttps%3A%2F%2Fwww.linkedin.com&dsh=S-1171815638%3A1786016042881362&faa=1&rip=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin&ifkv=Ac50bxtxl0SlrOTm72Zxmc6lEYd9PDGSs2C4vKIfZwJualgBmBGHP60kAojd1_BkvhAuSZ0wfmmm";

const MICROSOFT_AUTH_URL =
  "https://login.live.com/oauth20_authorize.srf?client_id=3fa91358-6f74-4525-b5df-da149652be36&scope=openid+profile+User.Read+email+offline_access&redirect_uri=https%3a%2f%2fwww.linkedin.com%2fmicrosoft-login%2fhandler&response_type=code&response_mode=form_post&uaid=b61353ce817e416c9169c2472339511c&msproxy=1&issuer=mso&tenant=consumers&ui_locales=en-US&epctrc=Z7GFDkyBolbmYfGapWNQv%2f9o7pCv0CtoaDVuxFdfKaw%3d9%3a1%3aCANARY%3abBvK%2bbI3A6LvRplnEb9orfOjPkAxsvK9%2btn5nf2ynUY%3d&epct=PAQABDgEAAAAdDD7nC9b5Q7JPd_okEQRFRXZvU3RzQXJ0aWZhY3RzCAAAAAAAw9HjIV01x20ZGYBv1bAfHI7EqFOL9y0ZU4NJ5cIMQKvPXqlpu-A3p0P2Ug9E9qqL-kmUKN_-liA-opeiz1P1qtf2duOjiHUdTFLIiARXkQQpldTaHeHk4ENhtPpbfuFU1z4WQV3yqOfvHVmpaXVfpdniQ1cOO4xoismLKBgjmCqGYoOUbN46S519UDNSqJWPAehFt1DDJ6Ej_fuv4JXDUyAA&jshs=0#";

export default function AuthModal() {
  const {
    isOpen,
    mode,
    setMode,
    closeModal,
    openLogin,
    openSignUp,
    targetUrl,
  } = useAuthModal();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [useOtp, setUseOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP sub-modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [challenge, setChallenge] = useState<{
    challengeId: string;
    expiresInSeconds: number;
  }>();
  const [showAccountProvision, setShowAccountProvision] = useState(false);
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [rememberedAccounts, setRememberedAccounts] = useState<string[]>([]);
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

  const handleOAuthResult = (result: import("@/lib/bff").OAuthResult) => {
    setEmail(result.email);
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
    if (result.schemas) setSchemas(result.schemas);
  };

  // Reset useOtp & showOtpModal when switching between login and signup modes
  useEffect(() => {
    setUseOtp(false);
    setShowOtpModal(false);
  }, [mode]);

  useEffect(() => {
    if (!isOpen || mode !== "login") return;
    getBrowserId()
      .then(async id => {
        setBrowserId(id);
        setRememberedAccounts(await bff.rememberedAccounts(id));
      })
      .catch(() => setRememberedAccounts([]));
  }, [isOpen, mode]);

  useEffect(() => {
    if (!window.location.hash.includes("access_token")) return;
    const finishLinkedIn = async () => {
      try {
        const isSignup = sessionStorage.getItem("axi_oauth_mode") === "signup";
        if (isSignup) openSignUp();
        else openLogin();
        const supabaseWindow = window as unknown as {
          supabase?: {
            createClient: (
              url: string,
              key: string
            ) => {
              auth: {
                getSession: () => Promise<{
                  data: { session: { access_token: string } | null };
                }>;
              };
            };
          };
        };
        if (!supabaseWindow.supabase)
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
            script.onload = () => resolve();
            script.onerror = () =>
              reject(new Error("LinkedIn sign-in could not load."));
            document.head.append(script);
          });
        const config = (await bff.oauthConfig()) as {
          supabase?: { url?: string; publicKey?: string };
        };
        if (!config.supabase?.url || !config.supabase.publicKey)
          throw new Error("LinkedIn sign-in is not configured.");
        const session = await supabaseWindow
          .supabase!.createClient(
            config.supabase.url,
            config.supabase.publicKey
          )
          .auth.getSession();
        if (!session.data.session)
          throw new Error("LinkedIn sign-in was cancelled.");
        const result = await bff.oauth(
          "supabase",
          session.data.session.access_token,
          isSignup,
          "linkedin_oidc"
        );
        handleOAuthResult(result);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "LinkedIn sign-in failed."
        );
      } finally {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        sessionStorage.removeItem("axi_oauth_mode");
      }
    };
    void finishLinkedIn();
  }, []);

  const loginRememberedAccount = async (userName: string) => {
    try {
      const result = await bff.rememberSignIn(browserId, userName);
      if (!result.redirectUrl)
        throw new Error("The remembered session has expired.");
      window.location.assign(result.redirectUrl);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to sign in with this account."
      );
    }
  };

  if (!isOpen) return null;

  // ── Helper: log the social provider attempt then redirect ──────
  const handleSocialLogin = async (
    provider: "google" | "office365" | "linkedin",
    redirectUrl: string
  ) => {
    if (provider === "google") {
      setLoading(true);
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
                }) => {
                  requestAccessToken: (config: { prompt: string }) => void;
                };
              };
            };
          };
        };
        if (!googleIdentity.google?.accounts?.oauth2)
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.onload = () => resolve();
            script.onerror = () =>
              reject(new Error("Google sign-in could not load."));
            document.head.append(script);
          });
        const config = (await bff.oauthConfig()) as {
          google?: { clientId?: string };
        };
        if (!config.google?.clientId)
          throw new Error("Google sign-in is not configured.");
        googleIdentity
          .google!.accounts!.oauth2!.initTokenClient({
            client_id: config.google.clientId,
            scope: "openid email profile",
            callback: async response => {
              try {
                if (!response.access_token)
                  throw new Error("Google sign-in was cancelled.");
                handleOAuthResult(
                  await bff.oauth(
                    "google",
                    response.access_token,
                    mode === "signup"
                  )
                );
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Google sign-in failed."
                );
              } finally {
                setLoading(false);
              }
            },
          })
          .requestAccessToken({ prompt: "select_account" });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Google sign-in failed."
        );
        setLoading(false);
      }
      return;
    }
    if (provider === "office365") {
      setLoading(true);
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
        toast.error(
          error instanceof Error ? error.message : "Microsoft sign-in failed."
        );
      } finally {
        setLoading(false);
      }
      return;
    }
    if (provider === "linkedin") {
      const config = (await bff.oauthConfig()) as {
        supabase?: { url?: string; publicKey?: string };
      };
      if (!config.supabase?.url || !config.supabase.publicKey)
        return toast.error("LinkedIn sign-in is not configured.");
      sessionStorage.setItem("axi_oauth_mode", mode);
      const supabaseWindow = window as unknown as {
        supabase?: {
          createClient: (
            url: string,
            key: string
          ) => {
            auth: { signInWithOAuth: (options: unknown) => Promise<unknown> };
          };
        };
      };
      if (!supabaseWindow.supabase) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        document.head.append(script);
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error("LinkedIn sign-in could not load."));
        });
      }
      await supabaseWindow
        .supabase!.createClient(config.supabase.url, config.supabase.publicKey)
        .auth.signInWithOAuth({
          provider: "linkedin_oidc",
          options: { redirectTo: window.location.href },
        });
      return;
    }
    try {
      await fetch("/api/auth/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `${provider}_user@axi.com`,
          auth_provider: provider,
          keep_signed_in: keepSignedIn,
          use_otp: false,
          action_type: mode,
        }),
      });
    } catch {
      // Best-effort redirect even if offline
    }
    window.location.href = redirectUrl;
  };

  // ── OTP checkbox toggled on Login page ───────
  const handleOtpToggle = () => {
    if (!useOtp) {
      setUseOtp(true);
    } else {
      setUseOtp(false);
    }
  };

  // ── Form submit ─────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // In login mode, if OTP checkbox is checked, open OTP modal
    if (mode === "login" && useOtp) {
      setShowOtpModal(true);
      return;
    }

    if (!email) {
      toast.error("Please enter your work email");
      return;
    }

    setLoading(true);
    try {
      const result = await bff.checkAndSendOtp(email, mode);
      setChallenge(result);
      setShowOtpModal(true);
      toast.success("A verification code has been sent to your email.");
    } catch (error) {
      toast.error(
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
    if (mode === "signup") {
      setShowAccountProvision(true);
      return;
    }
    if (result.schemas?.length) {
      setSchemas(result.schemas);
      return;
    }
    closeModal();
    window.location.href = targetUrl;
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-[#0a0c1a]/70 backdrop-blur-md transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-2xl shadow-indigo-950/30 border border-slate-100 overflow-hidden z-10 p-6 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
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
                  src="/AXI_LOGO_AXPERT.png"
                  alt="Axi Logo"
                  className="h-10 mx-auto mb-3 object-contain"
                />
              )}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] tracking-tight">
                {mode === "login"
                  ? "Welcome Back to Axi"
                  : "Account Registration"}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {mode === "login"
                  ? "Sign in to access your intelligent enterprise platform"
                  : "Register your account to experience living intelligence"}
              </p>
            </div>

            {/* Social Auth Buttons */}
            {mode === "login" && rememberedAccounts.length > 0 && (
              <div className="space-y-2 mb-5">
                {rememberedAccounts.map(userName => (
                  <button
                    key={userName}
                    type="button"
                    onClick={() => loginRememberedAccount(userName)}
                    className="w-full py-3 px-4 rounded-full border border-slate-200 bg-white font-semibold text-slate-700 text-sm"
                  >
                    Continue as {userName}
                  </button>
                ))}
              </div>
            )}
            <div className="space-y-3 mb-5">
              {/* Google */}
              <button
                type="button"
                id="auth-google-btn"
                onClick={() => handleSocialLogin("google", GOOGLE_AUTH_URL)}
                disabled={loading}
                className="w-full py-3 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50/80 transition-all font-semibold text-slate-700 text-sm flex items-center justify-center gap-3 shadow-xs hover:border-slate-300 active:scale-[0.99]"
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
                onClick={() =>
                  handleSocialLogin("office365", MICROSOFT_AUTH_URL)
                }
                disabled={loading}
                className="w-full py-3 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50/80 transition-all font-semibold text-slate-700 text-sm flex items-center justify-center gap-3 shadow-xs hover:border-slate-300 active:scale-[0.99]"
              >
                <svg className="w-5 h-5" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                <span>Continue with Office 365</span>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                id="auth-linkedin-btn"
                onClick={() =>
                  handleSocialLogin(
                    "linkedin",
                    "https://www.linkedin.com/login"
                  )
                }
                disabled={loading}
                className="w-full py-3 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50/80 transition-all font-semibold text-slate-700 text-sm flex items-center justify-center gap-3 shadow-xs hover:border-slate-300 active:scale-[0.99]"
              >
                <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.6a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                </svg>
                <span>Continue with LinkedIn</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                OR
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#FAF8F5] text-slate-800 text-sm font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c1380] focus:border-transparent transition-all"
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#FAF8F5] text-slate-800 text-sm font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c1380] focus:border-transparent transition-all"
                />
              </div>

              {/* Login mode options */}
              {mode === "login" && (
                <div className="space-y-2.5 pt-1">
                  <label className="flex items-center gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                    <div
                      onClick={() => setKeepSignedIn(!keepSignedIn)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        keepSignedIn
                          ? "bg-[#00007f] border-[#00007f] text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {keepSignedIn && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span>Keep me signed in</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                    <div
                      onClick={handleOtpToggle}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        useOtp
                          ? "bg-[#00007f] border-[#00007f] text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {useOtp && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span>Use OTP authentication</span>
                  </label>
                </div>
              )}

              {/* Sign up mode alternate Mobile/OTP option */}
              {mode === "signup" && (
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      toast.error(
                        "Mobile-number signup is not supported by the BFF. Use your work email."
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00007f] hover:text-[#5c1380] transition-colors py-1 cursor-pointer"
                  >
                    <Phone size={14} />
                    <span>Or Sign Up using Mobile Number</span>
                  </button>
                </div>
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
                  : mode === "login"
                    ? useOtp
                      ? "CONTINUE WITH OTP →"
                      : "NEXT"
                    : "REGISTER NOW →"}
              </button>
            </form>

            {/* Bottom Link */}
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
          </motion.div>
        </div>
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
      />
      {showAccountProvision && (
        <AccountProvisionModal
          email={email}
          sso={signupSso}
          onClose={() => {
            setShowAccountProvision(false);
            setSignupSso(undefined);
            closeModal();
          }}
        />
      )}
      {schemas.length > 0 && (
        <SchemaSelectionModal
          schemas={schemas}
          keepMeSignIn={keepSignedIn}
          secondaryAuth={secondaryAuth}
          onClose={() => {
            setSchemas([]);
            setSecondaryAuth(undefined);
          }}
        />
      )}
    </>
  );
}
