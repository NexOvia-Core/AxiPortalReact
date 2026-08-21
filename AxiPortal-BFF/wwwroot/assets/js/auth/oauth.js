// ============================================================
//  oauth.js  —  Social Login Providers for AxiPortal BFF
//
//  RESPONSIBILITY SPLIT:
//    Browser (this file)  → SDK init, access_token acquisition (popup / redirect)
//    BFF (OAuthService.cs) → validates token with provider, orchestrates AxiClient
//
//  WHAT STAYS CLIENT-SIDE (browser SDK requirement — cannot move to BFF):
//    Google   → google.accounts.oauth2.initTokenClient().requestAccessToken()  (popup)
//    MSAL     → msal.PublicClientApplication.loginPopup()                       (popup)
//    Supabase → supabase.auth.signInWithOAuth() + onAuthStateChange             (redirect)
//
//  SECURITY:
//    The browser NEVER sends a self-reported email for identity decisions.
//    It sends only the raw access_token. OAuthService.cs validates it
//    server-to-server with the provider; the response is authoritative.
//
//  DEPENDENCIES: auth.js (must load first — provides window.ui, window.api,
//    window.axiProceedToSchemaSelection, window.openOTPModal, window._axiHandleOTP)
// ============================================================

"use strict";

/* ═══════════════════════════════════════════════════════════
   §1  PROVIDER CONFIG  (public keys only — loaded from BFF)
═══════════════════════════════════════════════════════════ */

const AXI_CONFIG = {
  google: {},
  office365: {},
  supabase: {},
};

let errEl, errCredEl, modalEl, loader;

/* ═══════════════════════════════════════════════════════════
   §2  CONFIG LOADER
   Fetches public client IDs from the BFF — no secrets exposed.
═══════════════════════════════════════════════════════════ */

async function _loadOAuthConfig() {
  try {
    const res = await fetch("/api/oauth/config", {
      credentials: "include",
    });
    if (!res.ok) return;
    const { data: config } = await res.json();
    Object.assign(AXI_CONFIG.google, config?.google || {});
    Object.assign(AXI_CONFIG.office365, config?.office365 || {});
    Object.assign(AXI_CONFIG.supabase, config?.supabase || {});
    _initSupabaseListener(); // no _sb reset — guard now makes this call idempotent
  } catch (e) {
    console.warn("[oauth.js] Config load failed:", e);
  }
}
window.addEventListener("load", _loadOAuthConfig);

/* ═══════════════════════════════════════════════════════════
   §3  BFF TRANSPORT
   Sends the raw provider access_token to /api/oauth/{provider}.
   OAuthService validates it server-to-server — token never
   touches any other client-side code.
═══════════════════════════════════════════════════════════ */

/**
 * POST to /api/oauth/{provider} with provider token + mode flag.
 * @param {"google"|"microsoft"|"supabase"} provider
 * @param {{ accessToken: string, isSignup: boolean, provider?: string }} params
 * @returns {OAuthVerifyResult} BFF-authoritative identity + nextAction
 */
async function _oauthBff(provider, params) {
  let response, data;

  try {
    response = await fetch(`/api/oauth/${provider}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  } catch {
    throw Object.assign(new Error("Network error during OAuth validation."), {
      code: "NETWORK",
    });
  }

  try {
    data = await response.json();
  } catch {
    throw Object.assign(new Error("Invalid server response."), {
      code: "PARSE",
    });
  }

  if (response.status === 401)
    throw Object.assign(new Error("OAuth token is invalid or expired."), {
      code: "UNAUTHORIZED",
    });

  if (!response.ok || data?.success === false)
    throw Object.assign(
      new Error(data?.message || "OAuth validation failed."),
      { code: "OAUTH_ERROR" },
    );

  return data?.data ?? data;
}

/* ═══════════════════════════════════════════════════════════
   §4  SUPABASE CLIENT  (lazy init after config loads)
═══════════════════════════════════════════════════════════ */

let _sb = null;
function _getSupabase() {
  if (
    !_sb &&
    window.supabase &&
    AXI_CONFIG.supabase.url &&
    AXI_CONFIG.supabase.publicKey
  ) {
    _sb = supabase.createClient(
      AXI_CONFIG.supabase.url,
      AXI_CONFIG.supabase.publicKey,
    );
  }
  return _sb;
}

/* ═══════════════════════════════════════════════════════════
   §5  PUBLIC ENTRY POINT
   Called from HTML login/signup buttons.
═══════════════════════════════════════════════════════════ */

/**
 * Route to the correct provider handler.
 * @param {"Google"|"Office365"|"GitHub"|"LinkedIn"} provider
 * @param {"login"|"signup"} authMode
 */
window.axiSocialLogin = function (provider, authMode) {
  const isSignup = authMode === "signup";

  setupElements(isSignup);

  window.ui?.clearErr(errEl);
  window.ui?.clearErr(errCredEl);

  const handlers = {
    Google: () => _googleLogin(isSignup),
    Office365: () => _msLogin(isSignup),
    GitHub: () => _githubLogin(isSignup),
    LinkedIn: () => _linkedinLogin(isSignup),
  };
  const fn = handlers[provider];
  if (fn) fn();
  else window.ui?.showErr(errEl, "Unknown provider: " + provider);
};

/* ═══════════════════════════════════════════════════════════
   §6  GOOGLE
   SDK stay client-side (popup API requirement).
   access_token is immediately forwarded to BFF — never used locally.
═══════════════════════════════════════════════════════════ */

function _googleLogin(isSignup) {
  // const loginModalEl = document.getElementById("loginModel");

  if (!window.google?.accounts) {
    window.ui?.showInfo(
      errEl,
      "Google Sign-In is not ready. Please refresh the page.",
    );
    return;
  }

  google.accounts.oauth2
    .initTokenClient({
      client_id: AXI_CONFIG.google.clientId,
      scope: "openid email profile",
      callback: async ({ error, access_token }) => {
        if (error) {
          console.error("[Google OAuth]", error);
          window.ui?.showErr(errEl, "Google sign-in was cancelled or failed.");
          return;
        }
        try {
          window.ui?.setLoading(
            modalEl,
            `axi-${loader}-loader`,
            `axi-${loader}-loader-text`,
            true,
            "Verifying…",
          );
          const result = await _oauthBff("google", {
            accessToken: access_token,
            isSignup,
          });
          await _handleOAuthResult(result, "google", isSignup);
        } catch (err) {
          const { msg } = _classifyOAuthError(err);
          window.ui?.showErr(errEl, msg);
          //await _clearProviderSession("google");
        } finally {
          window.ui?.setLoading(
            modalEl,
            `axi-${loader}-loader`,
            `axi-${loader}-loader-text`,
            false,
          );
        }
      },
    })
    .requestAccessToken({
      prompt: "select_account",
    });
}

/* ═══════════════════════════════════════════════════════════
   §7  MICROSOFT  (MSAL v3)
   SDK stays client-side (popup API requirement).
═══════════════════════════════════════════════════════════ */

let _msal = null;

async function _getMsal() {
  if (_msal) return _msal;
  if (typeof msal === "undefined") {
    console.error("[oauth.js] MSAL library not loaded.");
    return null;
  }
  _msal = new msal.PublicClientApplication({
    auth: {
      clientId: AXI_CONFIG.office365.clientId,
      authority:
        "https://login.microsoftonline.com/" +
        (AXI_CONFIG.office365.tenantId || "common"),
      redirectUri: window.location.origin,
    },
    cache: { cacheLocation: "sessionStorage" },
  });
  await _msal.initialize();
  return _msal;
}

async function _msLogin(isSignup) {
  // const loginModalEl = document.getElementById("loginModel");

  try {
    window.ui?.setLoading(
      modalEl,
      `axi-${loader}-loader`,
      `axi-${loader}-loader-text`,
      true,
      "Verifying…",
    );

    const inst = await _getMsal();
    if (!inst)
      throw new Error("Microsoft login is not available. Please refresh.");

    const res = await inst.loginPopup({
      scopes: ["openid", "email", "profile", "User.Read"],
      prompt: "select_account",
    });
    const result = await _oauthBff("microsoft", {
      accessToken: res.accessToken,
      isSignup,
    });
    await _handleOAuthResult(result, "office365", isSignup);
  } catch (err) {
    // console.error("[MSAL]", err);
    const { msg } = _classifyOAuthError(err);
    window.ui?.showErr(errEl, msg);
    //await _clearProviderSession("office365");
  } finally {
    window.ui?.setLoading(
      modalEl,
      `axi-${loader}-loader`,
      `axi-${loader}-loader-text`,
      false,
    );
  }
}

/* ═══════════════════════════════════════════════════════════
   §8  GITHUB & LINKEDIN  (Supabase OAuth redirect flow)
   signInWithOAuth triggers a page redirect; the callback is
   handled by _initSupabaseListener after the page reloads.
═══════════════════════════════════════════════════════════ */

function _githubLogin(isSignup) {
  _supabaseOAuth("github", isSignup);
}
function _linkedinLogin(isSignup) {
  _supabaseOAuth("linkedin_oidc", isSignup);
}

async function _supabaseOAuth(provider, isSignup) {
  // const loginModalEl = document.getElementById("loginModel");

  try {
    window.ui?.setLoading(
      modalEl,
      `axi-${loader}-loader`,
      `axi-${loader}-loader-text`,
      true,
      "Redirecting…",
    );

    const sb = _getSupabase();
    if (!sb)
      throw new Error("Supabase client not initialised. Check OAuth config.");

    // Store intent so the auth-state listener can use it after redirect
    sessionStorage.setItem("axi_oauth_mode", isSignup ? "signup" : "login");

    const { error } = await sb.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + "/" },
    });
    if (error) throw error;
    // Page will now redirect — loader stays visible intentionally
  } catch (err) {
    console.error("[Supabase OAuth]", err);
    window.ui?.showErr(
      errEl,
      err.message || "Sign-in failed. Please try again.",
    );
  } finally {
    window.ui?.setLoading(
      modalEl,
      `axi-${loader}-loader`,
      `axi-${loader}-loader-text`,
      false,
    );
  }
}

/* ═══════════════════════════════════════════════════════════
   §9  SUPABASE AUTH STATE LISTENER
   Fires after the OAuth redirect returns to the app.
   Picks up the Supabase session and forwards the access_token to BFF.
═══════════════════════════════════════════════════════════ */

let _listenerInitialised = false;

function _initSupabaseListener() {
  if (_listenerInitialised) return;
  const sb = _getSupabase();
  if (!sb) return;
  _listenerInitialised = true;
  const isSignup = false;

  const {
    data: { subscription },
  } = sb.auth.onAuthStateChange(async (event, session) => {
    if (event !== "SIGNED_IN" || !session?.user) return;
    if (sessionStorage.getItem("axi_social_handled")) return;
    pageLoader(`axi-page-loader`, `axi-page-loader-text`, true, "Verifying…");

    sessionStorage.setItem("axi_social_handled", "1");

    const isSignup = sessionStorage.getItem("axi_oauth_mode") === "signup";
    setupElements(isSignup);

    const provider = session.user.app_metadata?.provider || "supabase-oauth";
    sessionStorage.removeItem("axi_oauth_mode");

    try {
      const result = await _oauthBff("supabase", {
        accessToken: session.access_token,
        provider,
        isSignup,
      });
      subscription.unsubscribe(); // done — stop listening before any redirect delay
      pageLoader(
        `axi-page-loader`,
        `axi-page-loader-text`,
        false,
        "Verifying…",
      );
      await _handleOAuthResult(result, provider, isSignup);
    } catch (err) {
      // console.error("[Supabase listener]", err);
      if (!isSignup) {
        await window.ui.showModal("loginModel");
        window.ui?.showErr(
          errEl,
          err.message || "Sign-in failed. Please try again.",
        );
      } else {
        await window.ui.showModal("signupform");
        window.ui?.showErr(
          errEl,
          err.message || "Sign-up failed. Please try again.",
        );
      }
      // window.ui?.showInfo(
      //   errElement,
      //   err.message || "Sign-in failed. Please try again.",
      // );
    } finally {
      sessionStorage.removeItem("axi_social_handled"); // always clear, not just on error
      sb.auth.signOut().catch(() => {});
      if (window.history.replaceState)
        window.history.replaceState(null, null, window.location.pathname);
      pageLoader(
        `axi-page-loader`,
        `axi-page-loader-text`,
        false,
        "Verifying…",
      );
    }
  });
}

//window.addEventListener("load", _initSupabaseListener);

/* ═══════════════════════════════════════════════════════════
   §10  POST-OAUTH RESULT HANDLER
   Routes UI based on the BFF-authoritative nextAction value.
   The browser NEVER makes a trust decision based on provider data —
   all identity resolution happened server-to-server in OAuthService.cs.

   OAuthVerifyResult shape (set by BFF):
     { email, name, sub, isEmailVerified, provider,
       nextAction, challengeId?, expiresInSeconds?,
       resendInSeconds?, schemas? }

   nextAction values:
     "otp-required"  BFF dispatched OTP (SSO signup)
                     → open OTP modal with pre-dispatched challengeId
     "schema-ready"  Primary SSO login; schemas already fetched
                     → proceed to schema selection
     "auth-update"   Secondary SSO login; schemas ready, provider not yet linked
                     → proceed to schema selection; auth-update fires after schema pick
═══════════════════════════════════════════════════════════ */

/** Providers whose session must be cleaned up via Supabase signOut. */
const _SUPABASE_PROVIDERS = new Set([
  "github",
  "linkedin_oidc",
  "supabase-oauth",
]);

async function _clearProviderSession(provider) {
  try {
    if (_SUPABASE_PROVIDERS.has(provider)) {
      await _getSupabase()?.auth.signOut();
    } else {
      // Clears MSAL cache + Google token from sessionStorage
      sessionStorage.clear();
    }
  } catch (e) {
    console.warn("[oauth.js] Session clear failed:", e);
  }
}

/**
 * Central result handler. Called after every successful BFF validation.
 * @param {object}  result    OAuthVerifyResult from BFF
 * @param {string}  provider  canonical provider key (e.g. "google", "github")
 * @param {boolean} isSignup
 */
async function _handleOAuthResult(result, provider, isSignup) {
  // Persist validated identity for the signup wizard UI (not for security)
  // const now = Math.floor(Date.now() / 1000);
  // sessionStorage.setItem(
  //   "axi_social_user",
  //   JSON.stringify({
  //     ...result,
  //     provider,
  //     exp: now + 5 * 60,
  //     validatedAt: now,
  //   }),
  // );

  window.setAuthState({
    email: result.email,
    isEmailVerified: result.isEmailVerified,
    provider: result.provider,
    ssoKey: result.sub,
    name: result.name,
  });

  // try {
  switch (result.nextAction) {
    // ── SSO signup: OTP already dispatched by BFF ─────────
    case "otp-required":
      // Do NOT call _axiHandleOTP — that would send a second OTP.
      // Just open the OTP modal using the challengeId BFF already created.
      await window.openOTPModal(
        "signup",
        result.email,
        result.provider,
        result.sub,
        result.challengeId,
        Number(result.expiresInSeconds) || 300,
        Number(result.resendInSeconds) || 30,
      );
      break;

    // ── SSO primary login: schemas already fetched ────────
    case "schema-ready":
    //await window.axiProceedToSchemaSelection(
    //  // { email: result.email },
    //  result.schemas,
    //);
    //break;

    // ── SSO secondary login: schemas ready, auth-update pending ──
    // The auth-update call itself fires inside initLogin's schema
    // selection handler (when the user picks a schema with isverified="F").
    case "auth-update":
      await window.axiProceedToSchemaSelection(
        // { email: result.email },
        result.schemas,
      );
      break;

    default:
      console.warn("[oauth.js] Unknown nextAction:", result.nextAction);
      throw new Error("Unexpected response from server. Please try again.");
  }
  // } catch (err) {
  // console.error("[_handleOAuthResult]", err);
  //   window.ui?.toast(
  //     err.message || "Something went wrong. Please try again.",
  //   );
  //   await _clearProviderSession(provider);
  // }
}

function setupElements(isSignup) {
  if (!isSignup) {
    errEl = document.getElementById("axi-login-oauth-error");
    errCredEl = document.getElementById("axi-login-credential-error");
    modalEl = document.getElementById("loginModel");
    loader = "login";
  } else {
    errEl = document.getElementById("axi-signup-oauth-error");
    errCredEl = document.getElementById("axi-signup-credential-error");
    modalEl = document.getElementById("signupform");
    loader = "signup";
  }
}

function pageLoader(loaderId, textId, on, text) {
  const loader = document.getElementById(loaderId);
  const textEl = document.getElementById(textId);
  if (!loader) return;
  loader.classList.toggle("d-none", !on);
  if (textEl && text) textEl.textContent = text;
  // document.querySelectorAll("input, select, textarea, button").forEach((el) => {
  //   if (!loader.contains(el)) el.disabled = !!on;
  // });
}
/* ═══════════════════════════════════════════════════════════
   §11  ERROR HELPERS
═══════════════════════════════════════════════════════════ */

function _classifyOAuthError(err) {
  const m = String(err?.message || "").toLowerCase();

  if (/user.*cancel|popup.*cancel|access.*denied|user_cancelled/i.test(m))
    return { msg: "Sign-in was cancelled.", type: "info" };
  if (/network|failed to fetch|load failed/i.test(m))
    return {
      msg: "Connection failed. Check your network and try again.",
      type: "warning",
    };
  if (/token.*invalid|token.*expired|unauthorized/i.test(m))
    return {
      msg: "Sign-in session expired. Please try again.",
      type: "warning",
    };
  if (/already registered|email.*exist/i.test(m))
    return {
      msg: "This email is already registered. Please log in instead.",
      type: "error",
    };
  //if (/no account|not.*found/i.test(m))
  //  return {
  //    msg: "No account found for this email. Please sign up first.",
  //    type: "error",
  //  };
  //if (/account.*expired|app.*expired/i.test(m))
  //  return {
  //    msg: "Your account has expired. Please contact support.",
  //    type: "error",
  //  };
  return {
    msg: err.message || "Sign-in failed. Please try again.",
    type: "error",
  };
}
