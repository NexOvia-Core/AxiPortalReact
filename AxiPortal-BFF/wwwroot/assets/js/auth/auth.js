// ============================================================
//  auth.js  —  Credential & Account flows for AxiPortal BFF
//
//  RESPONSIBILITY:
//    • UI state  — modals, loaders, error messages, OTP timers
//    • Credential flow orchestration — calls BFF /api/auth/* endpoints
//    • Exposes window.axiProceedToSchemaSelection for oauth.js
//
//  WHAT LIVES ON THE SERVER (never in JS):
//    • Email existence check + OTP dispatch (single BFF round-trip)
//    • AxiVerifyUser — OTP verification + Redis token storage
//    • Schema list fetch (requires server-side auth token)
//    • AddAxiAccount — account + user + admin queue in one call
//    • AES-encrypted redirect URL generation
//    • All AxiClient secrets, backend URLs, shared DB name
//
//  DEPENDENCIES: oauth.js (social providers), intl-tel-input (mobile)
// ============================================================

"use strict";

/* ═══════════════════════════════════════════════════════════
   §1  CONSTANTS & APP STATE
═══════════════════════════════════════════════════════════ */

const Region = { city: "", state: "", country: "" };
const pages = { packages: "packages.html" };

/* ═══════════════════════════════════════════════════════════
   §2  BFF TRANSPORT LAYER
═══════════════════════════════════════════════════════════ */

/**
 * POST to /api/auth/{endpoint}.
 * Sends session cookie, unwraps ApiResponse envelope, maps errors.
 * @returns {Promise<any>} contents of `data` field
 */
async function _bff(endpoint, params = {}) {
  let response, body;

  try {
    response = await fetch(`/api/auth/${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  } catch {
    throw _mkErr("Network error. Check your connection.", "NETWORK");
  }

  try {
    body = await response.json();
  } catch {
    throw _mkErr("Invalid server response.", "PARSE");
  }

  if (response.status === 429)
    throw _mkErr("Too many attempts. Please wait and try again.", "RATE_LIMIT");

  if (!response.ok || body?.success === false) {
    if (response.status === 401 && body?.errorCode === "UNAUTHORIZED") {
      window.dispatchEvent(new Event("axi:session-expired"));
      throw _mkErr("Session expired. Please log in again.", "UNAUTHORIZED");
    }
    throw _mkErr(
      body?.message || `Request failed (HTTP ${response.status})`,
      body?.errorCode || "API_ERROR",
      response.status,
    );
  }

  return body?.data ?? body;
}

/**
 * GET /api/auth/{endpoint}.
 * Used for schema-list (no request body needed).
 */
// async function _bffGet(endpoint, email) {
//   let response, body;

//   try {
//     response = await fetch(`/api/auth/${endpoint}?email=${email}`, {
//       method: "GET",
//       credentials: "include",
//     });
//   } catch {
//     throw _mkErr("Network error. Check your connection.", "NETWORK");
//   }

//   try {
//     body = await response.json();
//   } catch {
//     throw _mkErr("Invalid server response.", "PARSE");
//   }

//   if (!response.ok || body?.success === false)
//     throw _mkErr(
//       body?.message || `Request failed (HTTP ${response.status})`,
//       body?.errorCode || "API_ERROR",
//     );

//   return body?.data ?? body;
// }

function _mkErr(message, code, status) {
  return Object.assign(new Error(message), { code, status });
}

/* ═══════════════════════════════════════════════════════════
   §3  BFF API SURFACE
   All names match the updated BFF endpoint map.
   Keep this in sync with AuthController.cs endpoint comments.
═══════════════════════════════════════════════════════════ */

/**
 * window.api — consumed by this file and by oauth.js.
 *
 * checkAndSendOtp  POST /api/auth/check-send-otp   combined email-check + OTP dispatch
 * verifyUser       POST /api/auth/verify-user       OTP or SSO verification → schemas for login
 * authUpdate       POST /api/auth/auth-update       SSO secondary auth update [SECURE]
 * accountCheck     POST /api/auth/check-account     AxiAccId availability check
 * schemaList       GET  /api/auth/schema-list        fetch schemas independently [SECURE]
 * setupAccount     POST /api/auth/setup-account      send to queue [SECURE]
 * signinInfo       POST /api/auth/signin-info        AES-encrypted redirect URL [SECURE]
 * logout           POST /api/auth/logout             invalidate session + Redis token
 */
window.api = {
  /**
   * Combines email-existence check + OTP dispatch into one BFF call.
   * Replaces the old separate emailCheck + axiUserLoginWithOTP pattern.
   * @returns {{ challengeId, expiresInSeconds, resendInSeconds }}
   */
  checkAndSendOtp: (email, mode) => _bff("check-send-otp", { email, mode }),

  /**
   * Verifies OTP (credential flow) or SSO token.
   * On success the BFF stores the JWT in Redis and returns schemas for login.
   * @returns {{ success, schemas }}   schemas is null for signup purpose
   */
  verifyUser: (req) =>
    _bff("verify-user", {
      email: req.email,
      otp: req.otp ?? "",
      challengeId: req.challengeId ?? "",
      ssoKey: req.ssoKey ?? "",
      ssoProvider: req.ssoProvider ?? "",
      purpose: req.purpose,
    }),

  /** Auth update for SSO secondary-login users [SECURE]. */
  authUpdate: (req) => _bff("auth-update", req),

  /**
   * AxiAccId availability check.
   * @returns {{ Success: bool }}  Success = true means already taken
   */
  accountCheck: (axiAccId) => _bff("check-account", { axiAccId }),

  /**
   * Re-fetch schema list independently [SECURE].
   * Normally schemas come back from verifyUser; this is the fallback.
   */
  // schemaList: (email) => _bffGet("schema-list", email),

  /**
   * Sending details to queue to create account
   */
  setupAccount: (req) => _bff("setup-account", req),

  /** AES-encrypted signin redirect URL [SECURE]. */
  signinInfo: (req) => _bff("signin-info", req),

  /** Invalidate server session and Redis token. */
  logout: () => _bff("logout"),

  /** Direct login using session cookie or explicit sessionId [SECURE]. */
  directLogin: (sessionId) =>
    _bff("direct-login", { sessionId: sessionId || "" }),

  /**
   * Verify email existence + fetch schemas (password flow, Step 1→2).
   * BFF performs email check and returns schema list in one round-trip.
   * Does NOT dispatch OTP. Keeps session token server-side.
   * @returns {{ schemas: Array }}
   */
  verifyEmailAndGetSchemas: (email) => _bff("verify-email-schemas", { email }),

  _keepSigninDetails: (brId) => _bff("keepme-signin-list", { brId }),
  keepMeSigninConfirm: (brId, userName) =>
    _bff("keepme-signin", { brId, userName }),
};

/* ═══════════════════════════════════════════════════════════
   §4  STORAGE HELPERS  (non-sensitive UI state only)
═══════════════════════════════════════════════════════════ */

// const storage = {
//   getLastId: () => localStorage.getItem("axiLastLoginAccountId") || "",
//   setLastId: (v) =>
//     v
//       ? localStorage.setItem("axiLastLoginAccountId", v)
//       : localStorage.removeItem("axiLastLoginAccountId"),
// };

// function _getSocialUser() {
//   try {
//     return JSON.parse(sessionStorage.getItem("axi_social_user"));
//   } catch {
//     return null;
//   }
// }

/* ═══════════════════════════════════════════════════════════
   §5  VALIDATION HELPERS  (client-side only)
═══════════════════════════════════════════════════════════ */

const validators = {
  email: {
    label: "Email",
    validate(value) {
      value = String(value || "")
        .trim()
        .toLowerCase();

      if (!value) return "Email is required.";

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Please enter a valid email address.";

      return null;
    },
  },

  axiId: {
    label: "Axi Account ID",
    validate(value) {
      value = String(value || "")
        .trim()
        .toUpperCase();

      if (!value) return "Axi Account ID is required.";

      if (value.length < 5)
        return "Axi Account ID must be at least 5 characters.";

      if (value.length > 16)
        return "Axi Account ID cannot exceed 16 characters.";

      if (!/^[A-Z]{5}/.test(value))
        return "The first 5 characters must be letters.";

      if (!/^[A-Z0-9]+$/.test(value))
        return "Only letters and numbers are allowed.";

      return null;
    },
  },

  orgName: {
    validate(value) {
      value = String(value || "").trim();

      if (!value) return "Organization name is required.";

      if (value.length < 2)
        return "Organization name must be at least 2 characters.";

      if (value.length > 100)
        return "Organization name cannot exceed 100 characters.";

      if (!/^[A-Za-z0-9][A-Za-z0-9 .,'&()/-]{1,99}$/.test(value))
        return "Organization name contains invalid characters.";

      return null;
    },
  },

  userName: {
    validate(value) {
      value = String(value || "").trim();

      if (!value) return "Username is required.";

      if (value.length < 3) return "Username must be at least 3 characters.";

      if (value.length > 32) return "Username cannot exceed 32 characters.";

      if (!/^[a-zA-Z0-9_-]+$/.test(value))
        return "Username can only contain letters, numbers, '_' and '-'";

      return null;
    },
  },

  password: {
    label: "Password",
    validate(value) {
      if (!String(value || "")) return "Password is required.";
      return null;
    },
  },

  mobile: {
    validate(value) {
      value = String(value || "").trim();

      if (value && !/^[0-9+\-\s]{7,20}$/.test(value))
        return "Please enter a valid mobile number.";

      return null;
    },
  },
};

/* ═══════════════════════════════════════════════════════════
   §5b  FIELD-LEVEL VALIDATION UI
   blur → validate + show inline error · input → clear that field's
   error · validateFieldGroup() → gate "Continue"/"Submit", focusing
   the first invalid field. Reuses .is-invalid / .error-feedback.
═══════════════════════════════════════════════════════════ */

function _fieldErrorEl(input) {
  const wrap = input.closest(".input-field") || input.parentElement;
  let err = wrap.querySelector(":scope > .error-feedback");
  if (!err) {
    err = document.createElement("div");
    err.className = "error-feedback d-none";
    wrap.appendChild(err);
  }
  return err;
}

function _setFieldError(input, message) {
  input.classList.toggle("is-invalid", !!message);
  const err = _fieldErrorEl(input);
  err.textContent = message || "";
  err.classList.toggle("d-none", !message);
}

/** Wires one input: blur validates + shows error, typing clears it. */
function attachFieldValidation(input, field) {
  if (!input || input._axiValidationBound) return;
  input._axiValidationBound = true;
  input.addEventListener("blur", () => {
    const { valid, message } = window.validateField(field, input.value);
    _setFieldError(input, valid ? null : message);
  });
  input.addEventListener("input", () => _setFieldError(input, null));
}

/**
 * Validates a group of fields together (call before proceeding/submitting).
 * @param {Array<{input: HTMLElement, field: string}>} group
 * @returns {boolean} true only if every field is valid
 */
function validateFieldGroup(group) {
  let firstInvalid = null;
  for (const { input, field } of group) {
    if (!input) continue;
    const { valid, message } = window.validateField(field, input.value);
    _setFieldError(input, valid ? null : message);
    if (!valid && !firstInvalid) firstInvalid = input;
  }
  firstInvalid?.focus();
  return !firstInvalid;
}

window.validateField = function (field, value) {
  const validator = validators[field];

  if (!validator) return { valid: true };

  const message = validator.validate(value);

  return {
    valid: !message,
    message,
  };
};

/* ═══════════════════════════════════════════════════════════
   §6  AXI ACCOUNT-ID GENERATION
═══════════════════════════════════════════════════════════ */

// function _generateAxiId(orgName) {
//   const cleaned =
//     (orgName || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "axixx";
//   const prefix = cleaned.substring(0, 5).padEnd(5, "X");
//   return prefix + String(Math.floor(Math.random() * 1000)).padStart(3, "0");
// }

/**
 * Generates a candidate AxiAccId and verifies uniqueness via BFF.
 * Retries up to 4 times on collision.
 * @returns {boolean} true if a unique ID was set into accountIdInput
 */
// async function _assignAxiId(orgNameInput, accountIdInput, errEl) {
//   for (let attempt = 0; attempt < 4; attempt++) {
//     const candidate = _generateAxiId(orgNameInput?.value || "");
//     try {
//       const res = await window.api.accountCheck(candidate);
//       if (res?.Success !== true) {
//         // Success = true means taken
//         if (accountIdInput) accountIdInput.value = candidate.toUpperCase();
//         return true;
//       }
//     } catch (err) {
//       // window.ui.toast(err.message, "warning");
//       throw err;
//     }
//   }
//   window.ui.showErr(
//     errEl,
//     "Unable to generate a unique AXI Account ID. Please try a different name.",
//   );
//   return false;
// }

/* ═══════════════════════════════════════════════════════════
   §7  ERROR CLASSIFIER
   Maps raw error messages to friendly copy + toast type.
═══════════════════════════════════════════════════════════ */

function _classifyError(err) {
  const m = String(err?.message || err || "").toLowerCase();

  if (/failed to fetch|networkerror|load failed|etimedout/i.test(m))
    return {
      msg: "Connection failed. Check your network and try again.",
      type: "warning",
    };
  // if (/unauthorized|401/i.test(m))
  //   return { msg: "Session expired. Please log in again.", type: "warning" };
  if (/forbidden|403/i.test(m))
    return {
      msg: "Access denied. You don't have permission for this action.",
      type: "error",
    };
  if (/too many|rate.?limit|max.*attempt/i.test(m))
    return {
      msg: "Too many attempts. Please try again later.",
      type: "warning",
    };
  if (/invalid.*verif|verif.*invalid|incorrect.*code|wrong.*code/i.test(m))
    return {
      msg: "Incorrect verification code. Please try again.",
      type: "error",
    };
  if (/verif.*expired|expired.*verif|code.*expired/i.test(m))
    return {
      msg: "Verification code expired. Request a new one.",
      type: "warning",
    };
  if (
    /duplicate.*email|email.*(already\.exist|registered|not\.available)/i.test(
      m,
    )
  )
    return {
      msg: "This email is already registered. Please log in instead.",
      type: "error",
    };
  if (/duplicate.*axiaccid/i.test(m))
    return {
      msg: "This Account ID is taken. Click Regenerate.",
      type: "error",
    };
  if (/duplicate.*mobno/i.test(m))
    return { msg: "This mobile number is already registered.", type: "error" };
  if (/duplicate/i.test(m))
    return {
      msg: "This value is already in use. Please try another.",
      type: "error",
    };
  //if (m.includes("user not found") && m.includes("app expired"))
  //if (m.includes("user not found"))
  //  return {
  //    msg: "No account found with this email. Please sign up first.",
  //    type: "error",
  //  };
  //if (/account.*expired|app.*expired/i.test(m))
  //  return {
  //    msg: "Your account has expired. Please contact support.",
  //    type: "error",
  //  };
  //if (/no.*schema|no.*app/i.test(m))
  //  return {
  //    msg: "No apps found for your account. Please contact support.",
  //    type: "error",
  //  };
  if (
    /invalid.*credential|invalid.*password|wrong.*password|incorrect.*password/i.test(
      m,
    )
  )
    return {
      msg: "Incorrect email or password. Please try again.",
      type: "error",
    };
  if (/account.*locked|too many.*password/i.test(m))
    return {
      msg: "Account temporarily locked. Please try again later or use OTP.",
      type: "warning",
    };
  //if (err?.message)
  //  return {
  //    msg: err.message,
  //    type: "error",
  //  };

  return {
    msg: err.message || "Something went wrong. Please try again.",
    type: "error",
  };
}

/* ═══════════════════════════════════════════════════════════
   §8  SESSION EVENTS
═══════════════════════════════════════════════════════════ */

window.addEventListener("axi:session-expired", async () => {
  window.ui?.toast?.("Your session expired. Please log in again.", "warning");
  try {
    await api.logout();
  } catch (err) {
    console.error(err.message);
  }
  setTimeout(() => (window.location.href = "/"), 1000);
});

async function setPackage(packageName, packageVersion) {
  if (!packageName) return;

  window.axiStoragePackage.set(packageName, packageVersion);

  await ui.showModal("signupform");

  const selectedPackageEls = document.getElementsByClassName(
    "axi-selected-package",
  );

  Array.from(selectedPackageEls).forEach((el) => {
    el.innerHTML = `
        <p>
            Selected Package:
            <span>
                ${packageName}
            </span>
        </p>
    `;
  });
}

// async function initPackageSelection() {
//   const packSection = document.getElementById("Packages");

//   if (!packSection) return;

//   packSection.addEventListener("click", async (e) => {
//     const btn = e.target.closest(".package-install-btn");

//     if (!btn) return;

//     const packageName = btn.dataset.package;
//     const version = btn.dataset.version;

//     if (!packageName) return;

//     await setPackage(packageName, version);
//   });
// }

window.axiStoragePackage = {
  set(name, version) {
    sessionStorage.setItem(
      "axi_selected_package",
      JSON.stringify({
        name,
        version,
        createdAt: Date.now(),
      }),
    );
  },

  clear() {
    sessionStorage.removeItem("axi_selected_package");
  },

  get() {
    try {
      const value = sessionStorage.getItem("axi_selected_package");

      if (!value) return null;

      const data = JSON.parse(value);
      return data;
    } catch {
      this.clear();
      return null;
    }
  },
};

/* ═══════════════════════════════════════════════════════════
   §9  UI HELPERS  (window.ui — used by auth.js, oauth.js, HTML)
═══════════════════════════════════════════════════════════ */

window.ui = {
  showErr(el, msg) {
    if (!el) return;
    el.textContent = msg || "Something went wrong.";
    el.classList.remove("alert-info");
    el.classList.remove("d-none");
    el.classList.add("alert-danger");
  },
  showInfo(el, msg) {
    if (!el) return;
    el.textContent = msg || "Information";
    el.classList.remove("alert-danger");
    el.classList.remove("d-none");
    el.classList.add("alert-info");
  },

  clearErr(el) {
    if (!el) return;
    el.textContent = "";
    el.classList.add("d-none");
  },

  /**
   * Creates a self-dismissing toast notification.
   * Rendered via .axi-toast-container / .axi-toast-{type} from styles.css.
   */
  toast(msg, type = "error", duration = 5500) {
    if (!msg) return;
    let container = document.getElementById("axi-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "axi-toast-container";
      document.body.appendChild(container);
    }
    const el = document.createElement("div");
    el.className = `axi-toast axi-toast-${type}`;
    el.innerHTML = `
      <span>${((el.textContent = msg), el.textContent)}</span>
      <button aria-label="Dismiss"
              style="background:none;border:none;color:inherit;cursor:pointer;
                     font-size:18px;line-height:1;padding:0 0 0 12px;opacity:0.7">×</button>`;
    el.querySelector("button").onclick = () => el.remove();
    container.appendChild(el);
    setTimeout(() => el.remove(), duration);
  },

  /**
   * Toggles loading state on a modal section.
   * Disables all inputs/buttons inside modalEl while loading.
   * @param {Element}  modalEl   the modal root element
   * @param {string}   loaderId  id of the loader overlay element
   * @param {string}   textId    id of the loader text element
   * @param {boolean}  on        true = show loader, false = hide
   * @param {string}   [text]    optional loader label
   */
  setLoading(modalEl, loaderId, textId, on, text) {
    if (!modalEl) return;
    const loader = document.getElementById(loaderId);
    const textEl = document.getElementById(textId);
    if (!loader) return;
    loader.classList.toggle("d-none", !on);
    if (textEl && text) textEl.textContent = text;
    modalEl
      .querySelectorAll("input, select, textarea, button")
      .forEach((el) => {
        if (!loader.contains(el)) el.disabled = !!on;
      });
  },

  getModal(el) {
    // const el = document.getElementById(id);
    if (!el || !window.bootstrap) return null;
    return (
      window.bootstrap.Modal.getInstance(el) || new window.bootstrap.Modal(el)
    );
  },
  // showModal: (id) => window.ui.getModal(id)?.show(),
  showModal(id) {
    return new Promise((resolve) => {
      const el = document.getElementById(id);
      if (!el) return resolve(null);

      const modal = window.ui.getModal(el);

      if (el.classList.contains("show")) {
        resolve(modal);
        return;
      }

      el.addEventListener("shown.bs.modal", () => resolve(modal), {
        once: true,
      });

      modal.show();
    });
  },
  hideModal(id) {
    return new Promise((resolve) => {
      const el = document.getElementById(id);
      if (!el) return resolve(null);

      const modal = window.ui.getModal(el);

      if (!el.classList.contains("show")) {
        resolve(modal);
        return;
      }

      el.addEventListener("hidden.bs.modal", () => resolve(modal), {
        once: true,
      });

      modal.hide();
    });
  },
  // hideModal: (id) => window.ui.getModal(id)?.hide(),
};

/* ═══════════════════════════════════════════════════════════
   §10  OTP TIMERS
═══════════════════════════════════════════════════════════ */

let _resendInterval = null;
let _expiryInterval = null;
let _otpExpirySeconds = 0;
let _otpResendSeconds = 0;

function _startResendTimer() {
  const btn = document.getElementById("resend-otp-btn");
  const timerEl = document.getElementById("timer-span");
  if (!btn || !timerEl) return;

  clearInterval(_resendInterval);
  let t = _otpResendSeconds;
  btn.disabled = true;
  timerEl.style.display = "inline";
  timerEl.textContent = `(${t}s)`;

  _resendInterval = setInterval(() => {
    timerEl.textContent = `(${--t}s)`;
    if (t <= 0) {
      clearInterval(_resendInterval);
      btn.disabled = false;
      timerEl.style.display = "none";
    }
  }, 1000);
}

function _startExpiryTimer() {
  const expiryEl = document.getElementById("otp-expiry-time");
  const otpInputs = document.querySelectorAll(".otp-input");
  if (!expiryEl) return;

  clearInterval(_expiryInterval);
  let t = _otpExpirySeconds;

  otpInputs.forEach((inp) => {
    inp.disabled = false;
  });
  expiryEl.classList.remove("expiry-timer-dead");
  expiryEl.classList.add("expiry-timer-active");

  _expiryInterval = setInterval(() => {
    const m = Math.floor(--t / 60);
    const s = t % 60;
    expiryEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

    if (t <= 0) {
      clearInterval(_expiryInterval);
      expiryEl.textContent = "Expired";
      expiryEl.classList.remove("expiry-timer-active");
      expiryEl.classList.add("expiry-timer-dead");
      otpInputs.forEach((inp) => {
        inp.disabled = true;
        inp.value = "";
      });
    }
  }, 1000);
}

function _getOtpValue() {
  return [...document.querySelectorAll(".otp-input")]
    .map((i) => i.value)
    .join("");
}

/* ═══════════════════════════════════════════════════════════
   §11  SHARED FLOW HELPERS
   Used by both credential (this file) and SSO (oauth.js) flows.
═══════════════════════════════════════════════════════════ */

/**
 * Opens the OTP modal.
 * Accepts timing values so SSO flows can pass BFF-returned data directly
 * (OTP was already dispatched server-side — no need to call checkAndSendOtp again).
 *
 * @param {string}  mode            "SIGNUP" | "LOGIN"
 * @param {string}  email
 * @param {string}  [provider]      provider key for SSO flows
 * @param {string}  [ssoKey]        provider sub for SSO flows
 * @param {string}  [challengeId]
 * @param {number}  [expirySeconds] defaults to last known value
 * @param {number}  [resendSeconds] defaults to last known value
 */
window.openOTPModal = async function (
  mode,
  email,
  provider,
  ssoKey,
  challengeId,
  expirySeconds,
  resendSeconds,
) {
  const titleEl = document.getElementById("axiOTPTitle");
  const errEl = document.getElementById("axi-otp-error");

  if (titleEl)
    titleEl.textContent = `Enter the verification code sent to ${email}`;
  if (errEl) window.ui.clearErr(errEl);

  window.setAuthState({
    mode: mode,
    email: email,
    provider: provider ?? "",
    ssoKey: ssoKey ?? "",
    challengeId: challengeId,
  });

  _otpExpirySeconds = Number(expirySeconds) || _otpExpirySeconds || 300;
  _otpResendSeconds = Number(resendSeconds) || _otpResendSeconds || 30;

  await window.ui.hideModal("signupform");
  await window.ui.hideModal("loginModel");
  await window.ui.showModal("otpModal");

  _startResendTimer();
  _startExpiryTimer();
};

/**
 * Credential-flow OTP dispatch entry point.
 * Calls checkAndSendOtp (combined email check + OTP send), then opens OTP modal.
 * Exposed on window so oauth.js can trigger it for SSO-signup OTP resend.
 *
 * NOTE: For SSO flows where BFF already dispatched the OTP,
 *       call window.openOTPModal() directly with the BFF-returned timing values.
 */
window._axiHandleOTP = async function ({ email, mode }) {
  try {
    const result = await window.api.checkAndSendOtp(email, mode);
    if (!result?.challengeId) {
      throw _mkErr(result?.message || "User not found or Failed to OTP");
    }
    _otpExpirySeconds = Number(result?.expiresInSeconds) || 300;
    _otpResendSeconds = Number(result?.resendInSeconds) || 30;
    window.setAuthState({ challengeId: result?.challengeId });
    await window.openOTPModal(
      mode.toLowerCase(),
      email,
      "",
      "",
      result?.challengeId,
      _otpExpirySeconds,
      _otpResendSeconds,
    );
    return true;
  } catch (err) {
    // const { msg, type } = _classifyError(err);
    // window.ui.toast(msg, type);
    // return {success: false, message: msg};
    throw err;
  }
};

/**
 * Verifies OTP and extracts the schema list from the BFF response.
 * Called only when schemas have NOT already been loaded (credential login path).
 */
async function _verifyAndGetSchemas(userData) {
  const result = await window.api.verifyUser(userData);
  const schemas = result?.schemas;
  // if (!Array.isArray(schemas) || schemas.length === 0)
  //   throw _mkErr("No apps found for this account.", "NO_SCHEMAS");
  return schemas;
}

/**
 * Core post-auth routing: renders schema selection or auto-redirects (single schema).
 * Exposed on window so oauth.js can call it after SSO token validation.
 *
 * @param {object}   userData          – must include { email }; OTP fields if still verifying
 * @param {Array}    [preloadedSchemas] – pass when BFF already returned schemas (SSO flows)
 */
window.axiProceedToSchemaSelection = async function (
  // userData,
  schemas,
  // preloadedSchemas = null,
) {
  const loginModalEl = document.getElementById("loginModel");
  const loginErrEl = document.getElementById("axi-login-oauth-error");

  try {
    window.ui.setLoading(
      loginModalEl,
      "axi-login-loader",
      "axi-login-loader-text",
      true,
      "Loading…",
    );
    // const schemas = preloadedSchemas ?? (await _verifyAndGetSchemas(userData));

    if (!schemas || schemas.length === 0) {
      //await window.ui.hideModal("otpModal");
      await window.ui.showModal("loginModel");
      window.ui.showErr(
        loginErrEl,
        "No active apps found for this account. Please contact your administrator.",
      );
      return;
    }

    // if (schemas.length === 1) {
    //   let keepMeSignIn = window.getAuthState("rememberMe");
    //   // if (!keepMeSignIn) {
    //   //   await window.ui.hideModal("otpModal");
    //   //   await window.ui.hideModal("loginModel");
    //   //   keepMeSignIn = await _confirmKeepMeSignIn();
    //   // }
    //   // let keepMeSignIn = await _confirmSSOKeepMeSignIn();
    //   // await _redirectToAxpertWeb(schemas[0], keepMeSignIn);
    //   await _redirectToAxpertWeb(schemas[0], keepMeSignIn);
    //   return;
    // }

    window.setAuthState({
      loginFlow: "sso",
      schemasLoaded: true,
      multiSchema: true,
    });
    //await window.ui.hideModal("otpModal");
    await window.ui.showModal("loginModel");
    _showSchemaOnlyStep(schemas);
  } catch (err) {
    throw err;
  } finally {
    window.ui.setLoading(
      loginModalEl,
      "axi-login-loader",
      "axi-login-loader-text",
      false,
    );
  }
};

/* ═══════════════════════════════════════════════════════════
   §12  EPHEMERAL AUTH STATE
   Holds in-flight flow data (OTP challenge, provider hint).
   NOT used for security decisions — those live server-side in Redis.
═══════════════════════════════════════════════════════════ */

let _authState = {
  mode: "",
  email: "",
  name: "",
  axiaccid: "",
  ssoKey: "",
  provider: "",
  challengeId: "",
  rememberMe: false,
  useOtp: false,
  selectedSchema: null,
  schemasLoaded: false,
  multiSchema: false,
  loginFlow: "", // "password" | "otp" | "sso"
  brId: "",
  isEmailVerified: false,
};
window.getAuthState = (key) => _authState[key];
window.setAuthState = (patch) => Object.assign(_authState, patch);

function _resetLoginState() {
  window.setAuthState({
    email: "",
    name: "",
    useOtp: false,
    rememberMe: false,
    selectedSchema: null,
    schemasLoaded: false,
    multiSchema: false,
    loginFlow: "",
    ssoKey: "",
    provider: "",
  });

  const preferences = document.querySelector(".login-preferences");
  preferences?.prepend(document.getElementById("remember-preference"));

  document
    .getElementById("axi-login-email-id")
    ?.closest(".input-field")
    ?.classList.remove("d-none");
  document.getElementById("otp-preference")?.classList.remove("d-none");
  document.getElementById("remember-preference")?.classList.remove("mt-3");
  // document.getElementById("social-login-btns")?.classList.add("d-none");
  document.getElementById("social-login-divider")?.classList.remove("d-none");
  document.getElementById("schema-login-divider")?.classList.remove("d-none");
  document.getElementById("login-note")?.classList.remove("d-none");

  document.getElementById("axi-login-step-1")?.classList.remove("d-none");
  const btnSpan = document
    .getElementById("axi-login-continue")
    ?.querySelector("span");
  if (btnSpan) {
    btnSpan.textContent = "Next";
    btnSpan.dataset.text = "Next";
  }
  document.getElementById("axi-login-continue")?.focus();
}

function _showPasswordStep() {
  document.getElementById("axi-login-step-1")?.classList.add("d-none");
  document.getElementById("social-login-btns")?.classList.add("d-none");
  document.getElementById("social-login-divider")?.classList.add("d-none");
  document.getElementById("login-note")?.classList.add("d-none");
  document.getElementById("axi-login-step-3")?.classList.remove("d-none");
  document.getElementById("axi-login-password")?.focus();
  window.ui.clearErr(document.getElementById("axi-login-credential-error"));
  window.ui.clearErr(document.getElementById("axi-login-oauth-error"));
}

/** SSO variant of step 1 — email already known, so hide email/checkboxes
 *  and show only the shared app dropdown. Same DOM, no separate modal. */
function _showSchemaOnlyStep(schemas) {
  document
    .getElementById("axi-login-email-id")
    ?.closest(".input-field")
    ?.classList.add("d-none");
  document.getElementById("otp-preference")?.classList.add("d-none");
  document.getElementById("remember-preference")?.classList.add("mt-3");
  document.getElementById("social-login-btns")?.classList.add("d-none");
  document.getElementById("social-login-divider")?.classList.add("d-none");
  document.getElementById("schema-login-divider")?.classList.add("d-none");
  document.getElementById("login-note")?.classList.add("d-none");
  window.axiPopulateAppDropdown(
    document.getElementById("axi-login-schema-select"),
    schemas,
    document.getElementById("axi-login-oauth-error"),
  );
  document
    .getElementById("axi-login-schema-wrapper")
    ?.classList.remove("d-none");

  document
    .getElementById("remember-preference-placeholder")
    ?.appendChild(document.getElementById("remember-preference"));

  document.getElementById("axi-login-step-1")?.classList.remove("d-none");
  const btnSpan = document
    .getElementById("axi-login-continue")
    ?.querySelector("span");
  if (btnSpan) {
    btnSpan.textContent = "Continue";
    btnSpan.dataset.text = "Continue";
  }
  document.getElementById("axi-login-continue")?.focus();
}

/** Routes to the next step once a schema is confirmed (auto or user-picked). */
async function _afterSchemaSelected() {
  if (window.getAuthState("loginFlow") === "sso") {
    await _redirectToAxpertWeb(
      window.getAuthState("selectedSchema"),
      window.getAuthState("rememberMe"),
    );
    return;
  }
  if (
    window.getAuthState("loginFlow") === "otp" &&
    window.getAuthState("useOtp") == true
  ) {
    await window._axiHandleOTP({
      email: window.getAuthState("email"),
      mode: "login",
    });
    return;
  }
  _showPasswordStep();
}
/* ═══════════════════════════════════════════════════════════
   §13  REDIRECT & SCHEMA HELPERS
═══════════════════════════════════════════════════════════ */

async function _redirectToAxpertWeb(schema, keepMeSignIn = false) {
  const isValid =
    schema?.statusmessage === "Success" ||
    (schema?.isverified === "F" &&
      schema?.statusmessage === "Invalid auth provider");

  if (!isValid) {
    console.error("[_redirectToAxpertWeb] invalid schema:", schema);
    return;
  }

  if (schema?.isverified === "F") {
    // const social = _getSocialUser();
    if (
      window.getAuthState("provider") &&
      window.getAuthState("ssoKey") &&
      window.getAuthState("isEmailVerified")
    )
      await window.api.authUpdate({
        email: schema?.email,
        axiAccId: schema?.axiaccid,
        ssoKey: window.getAuthState("ssoKey"),
        ssoProvider: window.getAuthState("provider"),
      });
  }

  return _completeLogin(schema, () =>
    window.api.signinInfo({
      schemaName: schema.axiaccid,
      email: schema.email,
      userName: schema.username,
      isPrimary: schema.isprimary,
      keepMeSignIn: !!keepMeSignIn,
      brId: window.getAuthState("brId") || "",
      installedPackages: schema?.installedpackages || "",
    }),
  );
}

/**
 * Single choke point for "auth succeeded, now what". Always resolves (and
 * persists server-side) the signin redirect URL, then either redirects
 * immediately or hands off to the intermediate packages page.
 */
async function _completeLogin(schema, buildRedirectUrl) {
  let result;
  try {
    result = await buildRedirectUrl();
  } catch (err) {
    window.ui.toast(err.message, "error");
    return;
  }

  if (!(result?.success === true && result?.redirectUrl)) {
    window.ui.toast("Could not build redirect URL. Please try again.", "error");
    return;
  }

  if (schema?.isprimary === "T" && window.axiStoragePackage.get()) {
    setConnectionAndUsername(schema?.axiaccid, schema.username);
    window.location.href = new URL(pages.packages, window.location.href).href;
    return;
  }

  await _triggerSuccessRedirect(
    `Loading ${schema.axiaccid}…`,
    result.redirectUrl,
  );
}

function setConnectionAndUsername(axiaccid, username) {
  sessionStorage.setItem("axi_connection_name", axiaccid ?? "");
  sessionStorage.setItem("axi_user_name", username ?? "");
}

async function _triggerSuccessRedirect(msg, redirectUrl) {
  const msgEl = document.getElementById("redirectModalMessage");
  if (msgEl) msgEl.innerText = msg;
  await window.ui.showModal("redirectModal");
  setTimeout(() => {
    window.location.href = redirectUrl;
  }, 1000);
}
// Keep existing callers working
// window.triggerSuccessRedirect = _triggerSuccessRedirect;

async function _triggerSignupSuccessPopup(companyModalEl) {
  window.ui.setLoading(
    companyModalEl,
    "axi-companydetails-loader",
    "axi-companydetails-loader-text",
    false,
  );
  await window.ui.hideModal("axiCompanyDetailsModal");
  await window.ui.showModal("signupSuccessModal");

  const provisionErrEl = document.getElementById("axi-provision-error");

  ui.clearErr(provisionErrEl);

  // ── Wire up the Login button inside signupSuccessModal ──
  await _setupSignupSuccessLoginButton();
}

/**
 * Attaches click handler to the Login button inside signupSuccessModal.
 * Calls directLogin to redirect user to their app.
 */
async function _setupSignupSuccessLoginButton() {
  const loginBtn = document.getElementById("directLogin");
  if (!loginBtn || loginBtn._directLoginWired) return;
  const provisionErrEl = document.getElementById("axi-provision-error");

  ui.clearErr(provisionErrEl);
  loginBtn._directLoginWired = true;
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Show loading state on the button
    const originalText = loginBtn.textContent;
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in…";

    const success = await window.directLoginHandler();

    if (!success) {
      // Reset button on failure
      loginBtn.disabled = false;
      loginBtn.textContent = originalText;
    } else {
      ui.toast(
        success?.Message || "Something went wrong, please login instead",
        "error",
      );
      await window.ui.showModal("loginModel");
    }
    // On success, page redirects so no reset needed
  });
}

/**
 * Shared app-dropdown populator — used by OTP/SSO (axiSchemaModal) and
 * Password (inline) flows so all three render apps identically.
 * Invalid apps stay selectable (not disabled) but get a muted style;
 * they're actually blocked at "Continue" time via axiValidateSelectedApp.
 */
window.axiPopulateAppDropdown = function (selectEl, schemas, errEl = null) {
  if (!selectEl) return;
  selectEl.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.text = "Select an app";
  placeholder.disabled = true;
  placeholder.selected = true;
  selectEl.appendChild(placeholder);

  (schemas || []).forEach((schema) => {
    const isValid = schema.statusmessage === "Success";
    const opt = document.createElement("option");
    opt.value = schema.axiaccid;
    opt.text = schema.axiaccid;
    opt.classList.toggle("axi-app-invalid", !isValid);
    opt.dataset.axiaccid = schema.axiaccid;
    opt.dataset.username = schema.username;
    opt.dataset.email = schema.email;
    opt.dataset.isprimary = schema.isprimary;
    opt.dataset.isverified = schema.isverified;
    opt.dataset.statusmessage = schema?.statusmessage || "";
    opt.dataset.installedpackages = schema?.installedpackages || "";
    selectEl.appendChild(opt);
  });

  // Auto-select and lock when there is only one app.
  if (schemas?.length === 1) {
    selectEl.selectedIndex = 1; // Skip placeholder
    selectEl.disabled = true;
    if (errEl) {
      window.axiValidateSelectedApp(selectEl, errEl);
    }
  } else {
    selectEl.selectedIndex = 0; // Placeholder
    selectEl.disabled = false;
  }

  if (errEl) {
    selectEl.onchange = () => window.axiValidateSelectedApp(selectEl, errEl);
  }
};

/**
 * Validates the selected option's statusmessage and shows the same
 * inline error box the rest of the form uses. Returns the schema data
 * on success, or null after displaying the error.
 */
window.axiValidateSelectedApp = function (selectEl, errEl) {
  window.ui.clearErr(errEl);
  const continueBtn = document.getElementById("axi-login-continue");
  // || document.getElementById("axi-schema-continue"); // whichever is present

  if (!selectEl?.value) {
    if (continueBtn) continueBtn.disabled = true;
    window.ui.showErr(errEl, "Please select an app to continue.");
    return null;
  }

  const opt = selectEl.options[selectEl.selectedIndex];
  const statusmessage = opt.dataset.statusmessage;

  if (statusmessage && statusmessage !== "Success") {
    window.ui.showErr(errEl, statusmessage);
    if (continueBtn) continueBtn.disabled = true;
    return null;
  }

  if (continueBtn) continueBtn.disabled = false;
  return {
    axiaccid: opt.dataset.axiaccid || selectEl.value,
    email: opt.dataset.email,
    username: opt.dataset.username,
    isprimary: opt.dataset.isprimary,
    isverified: opt.dataset.isverified,
    statusmessage: opt.dataset.statusmessage,
    installedpackages: opt.dataset?.installedpackages,
  };
};

window.renderSchemaSelection = function (schemas) {
  window.axiPopulateAppDropdown(
    document.getElementById("axi-login-schema-select"),
    schemas,
    document.getElementById("axi-login-schema-error"),
  );
};

/* ═══════════════════════════════════════════════════════════
   §14  OTP FORM  (shared by signup + login)
═══════════════════════════════════════════════════════════ */

function initOtpInput() {
  const otpInputs = document.querySelectorAll(".otp-input");
  const resendBtn = document.getElementById("resend-otp-btn");
  const otpForm = document.getElementById("axi-otp-form");
  const otpErrEl = document.getElementById("axi-otp-error");
  const otpModalEl = document.getElementById("otpModal");

  if (!otpForm) return;

  // ── Input navigation (type-forward, backspace-back, paste) ──
  otpInputs.forEach((input, i) => {
    input.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
      if (e.target.value && i < otpInputs.length - 1) otpInputs[i + 1].focus();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && i > 0)
        otpInputs[i - 1].focus();
    });
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const digits = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, otpInputs.length);
      digits.split("").forEach((ch, j) => {
        if (i + j < otpInputs.length) {
          otpInputs[i + j].value = ch;
          if (i + j < otpInputs.length - 1) otpInputs[i + j + 1].focus();
          else otpInputs[i + j].blur();
        }
      });
    });
  });

  // ── Resend OTP ─────────────────────────────────────────────
  resendBtn?.addEventListener("click", async () => {
    otpInputs.forEach((inp) => {
      inp.value = "";
      inp.disabled = false;
    });
    otpInputs[0]?.focus();
    window.ui.clearErr(otpErrEl);

    try {
      const result = await window.api.checkAndSendOtp(
        window.getAuthState("email"),
        window.getAuthState("mode") === "login" ? "login" : "signup",
      );
      _otpExpirySeconds = Number(result?.expiresInSeconds) || 300;
      _otpResendSeconds = Number(result?.resendInSeconds) || 30;
      window.setAuthState({ challengeId: result?.challengeId });
      _startResendTimer();
      _startExpiryTimer();
    } catch (err) {
      const { msg, type } = _classifyError(err);
      window.ui.showErr(otpErrEl, msg);
      // window.ui.toast(msg, type);
    }
  });

  // ── Submit ─────────────────────────────────────────────────
  otpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.ui.clearErr(otpErrEl);

    const otp = _getOtpValue();
    if (otp.length !== otpInputs.length) {
      window.ui.showErr(
        otpErrEl,
        "Please enter the complete verification code.",
      );
      return;
    }

    const mode = window.getAuthState("mode");
    const userData = {
      email: window.getAuthState("email"),
      ssoKey: window.getAuthState("ssoKey"),
      ssoProvider: window.getAuthState("provider"),
      otp,
      challengeId: window.getAuthState("challengeId"),
      purpose: mode === "login" ? "login" : "signup",
    };

    try {
      window.ui.setLoading(
        otpModalEl,
        "axi-otp-loader",
        "axi-otp-loader-text",
        true,
        "Verifying…",
      );

      if (mode === "login") {
        await window.api.verifyUser(userData);
        if (!window.getAuthState("selectedSchema")) {
          window.ui.showErr(otpErrEl, "Session expired. Please start over.");
          await window.ui.hideModal("otpModal");
          return;
        }
        await _redirectToAxpertWeb(
          window.getAuthState("selectedSchema"),
          window.getAuthState("rememberMe"),
        );
      } else {
        // Signup: verify OTP, then open company-details modal
        await window.api.verifyUser(userData);
        const hasSso =
          window.getAuthState("ssoKey") && window.getAuthState("provider");
        await window.openCompanyDetailsModal(
          hasSso ? "" : window.getAuthState("email"),
        );
      }
      otpForm.reset();
    } catch (err) {
      const { msg, type } = _classifyError(err);
      window.ui.showErr(otpErrEl, msg);
      //window.ui.toast(msg, type);
    } finally {
      window.ui.setLoading(
        otpModalEl,
        "axi-otp-loader",
        "axi-otp-loader-text",
        false,
      );
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   §15  SIGNUP WIZARD
       Step 1 — email validate   (#signupform → #axi-signup-form)
       Step 2 — OTP              (#otpModal)
       Step 3 — company details  (#axiCompanyDetailsModal)
═══════════════════════════════════════════════════════════ */

function initSignup() {
  const signupModalEl = document.getElementById("signupform");
  const companyModalEl = document.getElementById("axiCompanyDetailsModal");
  if (!signupModalEl || !companyModalEl) return;

  // ── DOM refs ────────────────────────────────────────────
  const emailInput = document.getElementById("axi-email");
  const signupNextBtn = document.getElementById("axi-signup-next-btn");
  const companyContinueBtn = document.getElementById(
    "axi-company-continue-btn",
  );
  const signupCloseBtn = document.getElementById("signup-close-btn");
  const selectedPackageEls = document.getElementsByClassName(
    "axi-selected-package",
  );
  const signupErrEl = document.getElementById("axi-signup-credential-error");
  const signupOauthErrEl = document.getElementById("axi-signup-oauth-error");
  const companyForm = document.getElementById("axi-company-form");
  const companyErrEl = document.getElementById("axi-company-error");
  const provisionErrEl = document.getElementById("axi-provision-error");
  const orgNameInput = document.getElementById("axi-company-org-name");
  const userNameInput = document.getElementById("axi-user-name");
  const countryInput = document.getElementById("axi-country");
  const stateInput = document.getElementById("axi-state");
  const addressInput = document.getElementById("axi-address");
  const contactInput = document.getElementById("axi-contact-person");
  const taxNoInput = document.getElementById("axi-tax-no");
  const mobileInput = document.getElementById("axi-mobile");
  const accountIdInput = document.getElementById("axi-account-id");
  // const regenerateBtn = document.getElementById("axi-regenerate-id");
  // const checkIdBtn = document.getElementById("axi-check-id");

  // ── intl-tel-input (mobile) ─────────────────────────────
  let iti = null;
  if (mobileInput && window.intlTelInput) {
    iti = window.intlTelInput(mobileInput, {
      initialCountry: "in",
      separateDialCode: true,
      nationalMode: true,
      countrySearch: true,
      dropdownContainer: companyModalEl || document.body,
      utilsScript:
        "https://cdn.jsdelivr.net/npm/intl-tel-input@23.8.0/build/js/utils.js",
    });
    const syncCountry = () => {
      if (countryInput)
        countryInput.value = iti.getSelectedCountryData()?.name || "";
    };
    mobileInput.addEventListener("countrychange", () => {
      mobileInput.value = "";
      syncCountry();
    });
    syncCountry();
  }

  // ── Dropdown direction (avoid clipping at bottom of viewport) ──
  mobileInput?.addEventListener("focus", () => {
    const rect = mobileInput.getBoundingClientRect();
    mobileInput
      .closest(".iti")
      ?.classList.toggle("drop-up", window.innerHeight - rect.bottom < 250);
  });

  // ── Reset loaders when modals close ────────────────────
  signupModalEl.addEventListener("hidden.bs.modal", () =>
    window.ui.setLoading(
      signupModalEl,
      "axi-signup-loader",
      "axi-signup-loader-text",
      false,
    ),
  );
  companyModalEl.addEventListener("hidden.bs.modal", () =>
    window.ui.setLoading(
      companyModalEl,
      "axi-companydetails-loader",
      "axi-companydetails-loader-text",
      false,
    ),
  );
  signupModalEl.addEventListener(
    "shown.bs.modal",
    () => window.ui.clearErr(signupErrEl),
    window.ui.clearErr(signupOauthErrEl),
  );

  signupCloseBtn.addEventListener("click", () => {
    Array.from(selectedPackageEls).forEach((el) => {
      el.innerHTML = "";
    });
    window.axiStoragePackage.clear();
  });

  [
    [emailInput, "email"],
    [userNameInput, "userName"],
    [orgNameInput, "orgName"],
    [accountIdInput, "axiId"],
    [mobileInput, "mobile"],
  ].forEach(([input, field]) => attachFieldValidation(input, field));

  // ── Enable Next only when email format is valid ─────────
  if (signupNextBtn) signupNextBtn.disabled = true;
  emailInput?.addEventListener("input", () => {
    window.ui.clearErr(signupErrEl);
    window.ui.clearErr(signupOauthErrEl);

    const isValidEmail = validateField("email", emailInput.value?.trim());
    if (signupNextBtn) signupNextBtn.disabled = !isValidEmail.valid;

    // signupNextBtn.disabled = !validate.email(emailInput.value.trim());
  });

  // ── Step 1: email → checkAndSendOtp → OTP modal ─────────
  document
    .getElementById("axi-signup-form")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      window.ui.clearErr(signupErrEl);
      window.ui.clearErr(signupOauthErrEl);
      const email = emailInput?.value.trim();

      // const isValidEmail = validateField("email", email);
      // if (!isValidEmail.valid) {
      //   window.ui.showErr(signupErrEl, fmt.message);
      //   emailInput?.focus();
      //   return;
      // }

      if (!validateFieldGroup([{ input: emailInput, field: "email" }])) return;

      try {
        window.ui.setLoading(
          signupModalEl,
          "axi-signup-loader",
          "axi-signup-loader-text",
          true,
        );
        const otpRes = await window._axiHandleOTP({ email, mode: "signup" });
      } catch (err) {
        const { msg, type } = _classifyError(err);
        window.ui.showErr(signupErrEl, msg);
        // window.ui.toast(msg, type);
      } finally {
        window.ui.setLoading(
          signupModalEl,
          "axi-signup-loader",
          "axi-signup-loader-text",
          false,
        );
      }
    });

  // ── Opens company-details modal (called after OTP verify or SSO) ──
  window.openCompanyDetailsModal = async function (email) {
    await window.ui.hideModal("signupform");
    await window.ui.hideModal("otpModal");

    // const social = _getSocialUser();
    let emailId = email || window.getAuthState("email") || "";
    let userName =
      emailId != ""
        ? emailId
            .trim()
            .split("@")[0]
            .replace(/[^a-zA-Z0-9_-]/g, "")
        : "";
    if (emailInput) {
      emailInput.value = emailId;
    }
    if (userNameInput) {
      userNameInput.value = userName;
    }

    await window.ui.showModal("axiCompanyDetailsModal");
  };

  // ── Auto-generate AxiAccId when org name loses focus ────
  // orgNameInput?.addEventListener("blur", async () => {
  //   if (
  //     !accountIdInput ||
  //     accountIdInput._manualEdit ||
  //     !orgNameInput.value.trim()
  //   )
  //     return;
  //   try {
  //     window.ui.setLoading(
  //       companyModalEl,
  //       "axi-companydetails-loader",
  //       "axi-companydetails-loader-text",
  //       true,
  //       "Generating AXI ID…",
  //     );
  //     await _assignAxiId(orgNameInput, accountIdInput, companyErrEl);
  //   } catch {
  //     window.ui.showErr(
  //       companyErrEl,
  //       "Unable to generate a unique AXI Account ID. Try regenerating.",
  //     );
  //   } finally {
  //     window.ui.setLoading(
  //       companyModalEl,
  //       "axi-companydetails-loader",
  //       "axi-companydetails-loader-text",
  //       false,
  //     );
  //   }
  // });

  // ── Manual AxiAccId edit → show Check button ────────────
  // accountIdInput?.addEventListener("input", () => {
  //   accountIdInput._manualEdit = accountIdInput.value.length > 0;
  //   checkIdBtn?.classList.remove("d-none");
  // });

  // ── Regenerate button ────────────────────────────────────
  // regenerateBtn?.addEventListener("click", async () => {
  //   if (!accountIdInput) return;
  //   window.ui.clearErr(companyErrEl);
  //   accountIdInput._manualEdit = false;
  //   checkIdBtn?.classList.add("d-none");
  //   try {
  //     window.ui.setLoading(
  //       companyModalEl,
  //       "axi-companydetails-loader",
  //       "axi-companydetails-loader-text",
  //       true,
  //       "Generating…",
  //     );
  //     await _assignAxiId(orgNameInput, accountIdInput, companyErrEl);
  //   } catch {
  //     window.ui.showErr(
  //       companyErrEl,
  //       "Unable to generate a unique AXI Account ID. Try again.",
  //     );
  //   } finally {
  //     window.ui.setLoading(
  //       companyModalEl,
  //       "axi-companydetails-loader",
  //       "axi-companydetails-loader-text",
  //       false,
  //     );
  //   }
  // });

  // ── Check ID button (manual-entry availability check) ───
  // checkIdBtn?.addEventListener("click", async () => {
  //   if (!accountIdInput._manualEdit) return;
  //   const accId = accountIdInput.value.trim();
  //   if (!accId) return;
  //   window.ui.clearErr(companyErrEl);
  //   try {
  //     window.ui.setLoading(
  //       companyModalEl,
  //       "axi-companydetails-loader",
  //       "axi-companydetails-loader-text",
  //       true,
  //       "Checking…",
  //     );
  //     const res = await window.api.accountCheck(accId);
  //     if (res?.Success === true) {
  //       window.ui.showErr(
  //         companyErrEl,
  //         "This AXI Account ID is already taken. Please regenerate.",
  //       );
  //     } else {
  //       checkIdBtn.classList.add("d-none");
  //     }
  //   } catch {
  //     window.ui.showErr(
  //       companyErrEl,
  //       "Unable to verify AXI Account ID. Please try again.",
  //     );
  //   } finally {
  //     window.ui.setLoading(
  //       companyModalEl,
  //       "axi-companydetails-loader",
  //       "axi-companydetails-loader-text",
  //       false,
  //     );
  //   }
  // });

  // ── Step 3: company form submit → setupAccount ────────────
  companyForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.ui.clearErr(companyErrEl);

    // const profile = _getSocialUser();
    const email =
      emailInput?.value.trim() || window.getAuthState("email") || "";
    const axiaccid = (accountIdInput?.value || "").trim().toUpperCase();
    const orgname = orgNameInput?.value?.trim() || "";
    const userName = userNameInput?.value?.trim() || "";
    const mobileRaw = mobileInput?.value?.trim() || "";

    window.ui.setLoading(
      companyModalEl,
      "axi-companydetails-loader",
      "axi-companydetails-loader-text",
      true,
      "Creating your account…",
    );
    try {
      // ── Client-side field validation ─────────────────────
      const isValidEmail = validateField("email", email);
      if (!isValidEmail.valid) {
        window.ui.showErr(companyErrEl, isValidEmail.message);
        // emailInput?.focus();
        return;
      }

      // const isValidUsername = validateField("userName", userName);
      // if (!isValidUsername.valid) {
      //   window.ui.showErr(companyErrEl, isValidUsername.message);
      //   userNameInput?.focus();
      //   return;
      // }

      // const isValidOrgname = validateField("orgName", orgname);
      // if (!isValidOrgname.valid) {
      //   window.ui.showErr(companyErrEl, isValidOrgname.message);
      //   orgNameInput?.focus();
      //   return;
      // }

      // const isValidId = validateField("axiId", axiaccid);
      // if (!isValidId.valid) {
      //   window.ui.showErr(companyErrEl, isValidId.message);
      //   accountIdInput?.focus();
      //   return;
      // } else {
      //   const idCheck = await window.api.accountCheck(axiaccid);
      //   if (idCheck?.Success === true)
      //     throw Object.assign(new Error("DUP_ID"), { code: "DUP_ID" });
      // }

      // ── Client-side field validation ─────────────────────
      const fieldsOk = validateFieldGroup([
        // { input: emailInput, field: "email" },
        { input: userNameInput, field: "userName" },
        { input: orgNameInput, field: "orgName" },
        { input: accountIdInput, field: "axiId" },
        { input: mobileInput, field: "mobile" },
      ]);
      if (!fieldsOk) return;

      const idCheck = await window.api.accountCheck(axiaccid);
      if (idCheck?.Success === true)
        throw Object.assign(new Error("DUP_ID"), { code: "DUP_ID" });

      // ── Mobile: extract dial code + national number ──────
      let cntrycode = "",
        mobno = mobileRaw;
      if (iti) {
        cntrycode = iti.getSelectedCountryData()?.dialCode || "";
        const e164 = iti.getNumber() || "";
        mobno = e164
          .replace(/^\+/, "")
          .replace(new RegExp("^" + cntrycode), "");
      }

      await _loadSettings();

      window.setAuthState({ name: userName, axiaccid });

      // Single combined call: account + user + admin queue
      const response = await window.api.setupAccount({
        email,
        orgName: orgname,
        userName,
        nickName: window.getAuthState("name")?.trim().split(" ")[0] || userName,
        axiAccId: axiaccid,
        country: countryInput?.value.trim() || "",
        state: stateInput?.value.trim() || "",
        address: addressInput?.value.trim() || "",
        contactPersonName: contactInput?.value.trim() || "",
        taxNo: taxNoInput?.value.trim() || "",
        countryCode: cntrycode,
        mobileNo: mobno,
        region: Region?.country,
        // Auth fields — derived from SSO session when present
        isVerified: window.getAuthState("isEmailVerified") ? "T" : "F",
        authProvider: window.getAuthState("provider") || "credential",
        ssoId: window.getAuthState("ssoKey") || "",
      });

      if (response.Success != true) {
        const { msg } = _classifyError(response?.error);
        window.ui.showErr(companyErrEl, msg);
        return;
      } else {
        // storage.setLastId(axiaccid);
        companyForm.reset();
        document.getElementById("axi-signup-form")?.reset();
        await _triggerSignupSuccessPopup(companyModalEl);
      }
    } catch (err) {
      if (err.code === "DUP_ID") {
        window.ui.showErr(
          companyErrEl,
          "This Axi Account ID is already in use. Please choose a different ID.",
        );
      } else {
        const { msg, type } = _classifyError(err);
        window.ui.showErr(companyErrEl, msg);
        // window.ui.toast(msg, type);
      }
    } finally {
      window.ui.setLoading(
        companyModalEl,
        "axi-companydetails-loader",
        "axi-companydetails-loader-text",
        false,
      );
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   §16  ENHANCED LOGIN FLOW
       Step 1 — email + preferences → conditional routing
       Step 2a — OTP modal (if use-otp checked)
       Step 2b — Schema selection (if use-otp unchecked)
       Step 3 — Password input (password flow only)
       Step 4 — redirect
═══════════════════════════════════════════════════════════ */

function initLogin() {
  const loginModalEl = document.getElementById("loginModel");
  if (!loginModalEl) return;

  const loginForm = document.getElementById("axi-login-form");
  const loginErrEl = document.getElementById("axi-login-credential-error");
  const loginErrOauthEl = document.getElementById("axi-login-oauth-error");
  const emailInput = document.getElementById("axi-login-email-id");
  const useOtpCheckbox = document.getElementById("axi-login-use-otp");
  const rememberCheckbox = document.getElementById("axi-login-remember");
  const continueBtn = document.getElementById("axi-login-continue");
  const selectedPackageEls = document.getElementsByClassName(
    "axi-selected-package",
  );

  // Step containers
  const step1El = document.getElementById("axi-login-step-1");
  const step3El = document.getElementById("axi-login-step-3");
  const socialBts = document.getElementById("social-login-btns");
  const divider = document.getElementById("social-login-divider");
  const loginNote = document.getElementById("login-note");

  // Inline schema elements (now inside step 1)
  const schemaWrapper = document.getElementById("axi-login-schema-wrapper");
  const schemaSelectEl = document.getElementById("axi-login-schema-select");
  // const schemaErrEl = document.getElementById("axi-login-schema-error");

  // Step 3 elements
  const passwordInput = document.getElementById("axi-login-password");
  const backToStep1Btn = document.getElementById("axi-login-back-to-step1");
  const loginCloseBtn = document.getElementById("login-close-btn");

  // ── Reset on open / close ─────────────────────────────
  loginModalEl.addEventListener("shown.bs.modal", () => {
    window.ui.clearErr(loginErrEl);
    window.ui.clearErr(loginErrOauthEl);
    _resetToStep1();
  });
  loginModalEl.addEventListener("hidden.bs.modal", () => {
    window.ui.setLoading(
      loginModalEl,
      "axi-login-loader",
      "axi-login-loader-text",
      false,
    );
    loginForm.reset();
    _resetToStep1();
  });

  loginCloseBtn.addEventListener("click", () => {
    _resetLoginState();
    Array.from(selectedPackageEls).forEach((el) => {
      el.innerHTML = "";
    });
    window.axiStoragePackage.clear();
  });

  attachFieldValidation(emailInput, "email");
  attachFieldValidation(passwordInput, "password");

  // ═══════════════════════════════════════════════════════
  //  STEP HELPERS
  // ═══════════════════════════════════════════════════════

  function _resetToStep1() {
    step1El?.classList.remove("d-none");
    // emailInput?.closest(".input-field")?.classList.remove("d-none");
    // document.querySelector(".login-preferences")?.classList.remove("d-none");
    socialBts?.classList.remove("d-none");
    divider?.classList.remove("d-none");
    loginNote?.classList.remove("d-none");
    step3El?.classList.add("d-none");

    // Hide inline schema selector
    schemaWrapper?.classList.add("d-none");
    if (schemaSelectEl)
      schemaSelectEl.innerHTML =
        '<option value="" disabled selected>Select an app</option>';
    if (passwordInput) passwordInput.value = "";
    window.ui.clearErr(loginErrEl);
    window.ui.clearErr(loginErrOauthEl);
    // _resetLoginState();
    const isValidEmail = validateField(
      "email",
      emailInput?.value?.trim() || "",
    );
    if (continueBtn) continueBtn.disabled = !isValidEmail.valid;
  }

  // ═══════════════════════════════════════════════════════
  //  EVENT LISTENERS
  // ═══════════════════════════════════════════════════════

  emailInput?.addEventListener("input", () => {
    window.ui.clearErr(loginErrEl);
    window.ui.clearErr(loginErrOauthEl);
    // If user changes email after schemas were loaded, reset schema state
    if (window.getAuthState("schemasLoaded")) {
      window.setAuthState({
        schemasLoaded: false,
        multiSchema: false,
        selectedSchema: null,
      });
      schemaWrapper?.classList.add("d-none");
    }
    // if (continueBtn)
    //   continueBtn.disabled = !validate.email(emailInput.value.trim());
    const isValidEmail = validateField("email", emailInput.value?.trim() || "");
    if (continueBtn) continueBtn.disabled = !isValidEmail.valid;
  });

  useOtpCheckbox?.addEventListener("change", () => {
    window.setAuthState({ useOtp: useOtpCheckbox.checked });
    useOtpCheckbox.checked && window.setAuthState({ loginFlow: "otp" });
  });

  rememberCheckbox?.addEventListener("change", () => {
    window.setAuthState({ rememberMe: rememberCheckbox.checked });
  });

  // Back from password → step 1 (always)
  backToStep1Btn?.addEventListener("click", (e) => {
    e.preventDefault();
    step3El?.classList.add("d-none");
    step1El?.classList.remove("d-none");
    socialBts?.classList.remove("d-none");
    divider?.classList.remove("d-none");
    loginNote?.classList.remove("d-none");
    if (passwordInput) passwordInput.value = "";
    window.ui.clearErr(loginErrEl);
    window.ui.clearErr(loginErrOauthEl);
    emailInput?.focus();
  });

  // ═══════════════════════════════════════════════════════
  //  MAIN FORM SUBMIT
  // ═══════════════════════════════════════════════════════
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.ui.clearErr(loginErrEl);
    window.ui.clearErr(loginErrOauthEl);

    try {
      window.ui.setLoading(
        loginModalEl,
        "axi-login-loader",
        "axi-login-loader-text",
        true,
      );

      // SSO: step 1 is showing only the app dropdown — validate & route
      if (window.getAuthState("loginFlow") === "sso") {
        const selected = window.axiValidateSelectedApp(
          schemaSelectEl,
          loginErrOauthEl,
        );
        if (!selected) return;
        window.setAuthState({ selectedSchema: selected });
        await _afterSchemaSelected();
        return;
      }

      if (!step3El.classList.contains("d-none")) {
        await _handlePasswordLogin();
        return;
      }

      if (!window.getAuthState("schemasLoaded")) {
        const email = emailInput?.value.trim() || "";
        // const isValidEmail = validateField("email", email);

        // if (!isValidEmail.valid) {
        //   window.ui.showErr(loginErrEl, isValidEmail.message);
        //   emailInput?.focus();
        //   return;
        // }

        if (!validateFieldGroup([{ input: emailInput, field: "email" }]))
          return;

        window.setAuthState({
          email: email,
          useOtp: useOtpCheckbox?.checked ?? true,
          rememberMe: rememberCheckbox?.checked ?? false,
          loginFlow: window.getAuthState("useOtp") ? "otp" : "password",
        });
        await _loadAndShowSchemas();
        return;
      }

      if (window.getAuthState("multiSchema")) {
        const selected = window.axiValidateSelectedApp(
          schemaSelectEl,
          loginErrEl,
        );
        if (!selected) return;
        window.setAuthState({ selectedSchema: selected });
      }
      await _afterSchemaSelected();
    } catch (err) {
      const { msg } = _classifyError(err);
      window.ui.showErr(
        window.getAuthState("loginFlow") === "sso"
          ? loginErrOauthEl
          : loginErrEl,
        msg,
      );
    } finally {
      window.ui.setLoading(
        loginModalEl,
        "axi-login-loader",
        "axi-login-loader-text",
        false,
      );
    }
  });

  // ═══════════════════════════════════════════════════════
  //  LOAD SCHEMAS (password flow step 1 → inline select or direct to password)
  // ═══════════════════════════════════════════════════════
  async function _loadAndShowSchemas() {
    let schemas;

    try {
      const result = await window.api.verifyEmailAndGetSchemas(
        window.getAuthState("email"),
      );
      schemas = Array.isArray(result) ? result : result?.schemas;
    } catch (err) {
      // Network / BFF hard error (404, 500, no account etc.)
      const { msg } = _classifyError(err);
      throw _mkErr(
        msg || "Unable to verify your account. Please try again.",
        "VERIFY_FAILED",
      );
    }

    // No schemas at all returned
    if (!Array.isArray(schemas) || schemas.length === 0) {
      throw _mkErr(
        "No active apps found for this account. Please contact your administrator.",
        "NO_SCHEMAS",
      );
    }

    window.setAuthState({ schemasLoaded: true });

    // Single schema — auto-select and go straight to password
    if (schemas.length === 1) {
      const s = schemas[0];
      if (s.statusmessage && s.statusmessage !== "Success") {
        throw _mkErr(s.statusmessage, "APP_UNAVAILABLE");
      }
      window.setAuthState({
        selectedSchema: {
          axiaccid: s.axiaccid,
          email: s.email,
          username: s.username,
          isprimary: s.isprimary,
          isverified: s.isverified,
          statusmessage: s.statusmessage,
          installedpackages: s?.installedpackages,
        },
        multiSchema: false,
      });
      await _afterSchemaSelected();
      return;
    }

    // Multiple schemas — show inline dropdown, stay on step 1
    window.setAuthState({ multiSchema: true });
    window.axiPopulateAppDropdown(schemaSelectEl, schemas, loginErrEl);
    schemaWrapper?.classList.remove("d-none");
    schemaSelectEl?.focus();

    const btnSpan = continueBtn?.querySelector("span");
    if (btnSpan) {
      btnSpan.textContent = "Continue";
      btnSpan.dataset.text = "Continue";
    }
  }

  // ═══════════════════════════════════════════════════════
  //  PASSWORD LOGIN
  // ═══════════════════════════════════════════════════════
  async function _handlePasswordLogin() {
    const password = passwordInput?.value || "";
    // if (!password) {
    //   window.ui.showErr(loginErrEl, "Please enter your password.");
    //   passwordInput?.focus();
    //   return;
    // }
    if (!validateFieldGroup([{ input: passwordInput, field: "password" }]))
      return;

    if (!window.getAuthState("selectedSchema")) {
      window.ui.showErr(loginErrEl, "Please select an app first.");
      _resetToStep1();
      return;
    }

    try {
      window.ui.setLoading(
        loginModalEl,
        "axi-login-loader",
        "axi-login-loader-text",
        true,
        "Signing in…",
      );
      passwordInput.value = "";
      const schema = window.getAuthState("selectedSchema");
      return _completeLogin(schema, () =>
        window.api.signinInfo({
          email: window.getAuthState("email"),
          password,
          schemaName: schema?.axiaccid,
          userName: schema?.username,
          isPrimary: schema?.isprimary,
          keepMeSignIn: window.getAuthState("rememberMe"),
          brId: window.getAuthState("brId") || "",
          installedPackages: schema?.installedpackages || "",
        }),
      );
    } catch (err) {
      const { msg, type } = _classifyError(err);
      window.ui.showErr(loginErrEl, msg);
      if (passwordInput) passwordInput.value = "";
      passwordInput?.focus();
      throw err;
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   §17  URL INTENT DETECTION
   ?login / #login  → auto-open login modal
   ?signup / #signup → auto-open signup modal
═══════════════════════════════════════════════════════════ */

async function _checkUrlIntent() {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash;
  const clean = window.location.pathname;

  if (params.has("login") || hash === "#login") {
    await window.ui.showModal("loginModel");
    window.history.replaceState(null, "", clean);
  }
  if (params.has("signup") || hash === "#signup") {
    await window.ui.showModal("signupform");
    window.history.replaceState(null, "", clean);
  }
}

/* ═══════════════════════════════════════════════════════════
   §17B  DIRECT LOGIN HANDLER
   Called from signupSuccessModal "Login" button
   and on page load when ?sessionId= is present
═══════════════════════════════════════════════════════════ */

/**
 * Calls BFF directLogin endpoint.
 * On success, redirects to the returned URL.
 * On failure, shows error toast.
 *
 * @param {string} [sessionId] - optional explicit sessionId (from URL query)
 * @returns {Promise<boolean>} true if login succeeded
 */
window.directLoginHandler = async function (sessionId) {
  try {
    const provisionErrEl = document.getElementById("axi-provision-error");
    window.ui.clearErr(provisionErrEl);

    const result = await window.api.directLogin(sessionId || null);

    // if (result?.success === true && result?.redirectUrl) {
    //   await window.ui.hideModal("signupSuccessModal");
    //   const msgEl = document.getElementById("redirectModalMessage");
    //   if (msgEl) msgEl.innerText = "Loading...";
    //   await window.ui.showModal("redirectModal");
    //   setTimeout(() => {
    //     // Redirect to the URL returned by BFF
    //     window.location.href = result.redirectUrl;
    //     return true;
    //   }, 500);
    if (result?.success === true) {
      setConnectionAndUsername(
        window.getAuthState("axiaccid"),
        window.getAuthState("name"),
      );
      window.location.href = new URL(pages.packages, window.location.href).href;
    } else {
      let message = "";
      switch (result?.error) {
        case "UNDER_PROVISION":
          message =
            "Account setup is in progress. Please try again shortly or check your email for confirmation.";
          break;
        case "PROVISION_FAILED":
          message = "Login failed, please check your email.";
          break;
        case "UNAUTHORIZED":
          message = "Session expired";
          window.dispatchEvent(new Event("axi:session-expired"));
          // throw _mkErr("Session expired. Please log in again.", "UNAUTHORIZED");
          return false;
        default:
          message = "Something went wrong, please contact support.";
      }

      window.ui.showInfo(provisionErrEl, message);

      return false;
    }
  } catch (err) {
    const { msg, type } = _classifyError(err);
    window.ui.toast(msg, type);
    return false;
  }
};

/**
 * Checks URL for ?sessionId= parameter on page load.
 * If present, triggers directLogin automatically.
 */
function _checkDirectLoginIntent() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("sessionId");

  if (sessionId) {
    // Clean URL without reloading
    const cleanUrl = window.location.pathname;
    window.history.replaceState(null, "", cleanUrl);

    // Delay slightly to let modals/UI initialize
    setTimeout(async () => await window.directLoginHandler(sessionId), 500);
  }
}

/* ═══════════════════════════════════════════════════════════
   §18  SETTINGS LOADER
═══════════════════════════════════════════════════════════ */

async function _loadSettings() {
  // Region detection — non-sensitive, client-side is fine
  try {
    const r = await fetch("https://ipapi.co/json/");
    if (r.ok) {
      const ip = await r.json();
      Region.city = ip.city;
      Region.state = ip.region;
      Region.country = ip.country;
    }
  } catch (err) {
    /* non-critical */
    console.warn("[auth.js] loadSettings failed:", err);
  }
}

async function _getKeepMeSignInInfo() {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash;
  const sessionId = params.get("sessionId");

  if (sessionId) return;

  const fpPromise = import("../fingerprintjs/FingerprintJS.min.js").then(
    (FingerprintJS) => FingerprintJS.load(),
  );
  fpPromise
    .then((fp) => fp.get())
    .then((result) => {
      const visitorId = result.visitorId;
      const ua = navigator.userAgent;
      let brName = "unknown";
      if (ua.includes("Edg/")) {
        brName = "msedge";
      } else if (ua.includes("Chrome")) {
        brName = "chrome";
      } else if (ua.includes("Firefox")) {
        brName = "mozilla";
      } else if (ua.includes("Safari")) {
        brName = "safari";
      }
      if (visitorId && brName) {
        const brId = visitorId + "-" + brName;
        window.setAuthState({ brId: brId });
        if (hash.includes("#access_token")) {
          return;
        }
        _keepSigninDetails(brId);
      }
    });
}

async function _keepSigninDetails(brId) {
  try {
    const response = await window.api._keepSigninDetails(brId);
    const profiles = response?.profiles;
    if (Array.isArray(profiles) && profiles.length > 0) {
      await _keepMeSigninConfirm(profiles, brId);
    }
  } catch (e) {
    console.error("KeepMeSignin list fetch failed:", e);
  }
}

async function _keepMeSigninConfirm(profiles, brId) {
  const listEl = document.getElementById("axi-keepme-profiles");
  if (!listEl) return;
  listEl.innerHTML = "";

  profiles.forEach((userName) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "axi-keepme-profile-btn";

    btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
    <span class="axi-keepme-name">${userName}</span>`;

    btn.addEventListener("click", () => _loginKeepSigninUser(brId, userName));

    listEl.appendChild(btn);
  });

  // "Login with another account"
  const altBtn = document.createElement("button");
  altBtn.type = "button";
  altBtn.className = "axi-keepme-profile-btn axi-keepme-alt";
  altBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      <line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/>
    </svg>
    <span class="axi-keepme-name">Login with another account</span>`;
  altBtn.addEventListener("click", async () => {
    await window.ui.hideModal("axiKeepMeSigninModal");
    await window.ui.showModal("loginModel");
  });
  listEl.appendChild(altBtn);

  await window.ui.showModal("axiKeepMeSigninModal");
}

async function _loginKeepSigninUser(brId, userName) {
  const modalEl = document.getElementById("axiKeepMeSigninModal");
  const errEl = document.getElementById("axi-keepme-error");
  window.ui.clearErr(errEl);

  try {
    window.ui.setLoading(
      modalEl,
      "axi-keepme-loader",
      "axi-keepme-loader-text",
      true,
      "Signing in…",
    );

    const result = await window.api.keepMeSigninConfirm(brId, userName);

    if (result?.success === true && result?.redirectUrl) {
      await window.ui.hideModal("axiKeepMeSigninModal");
      await _triggerSuccessRedirect(
        `Signing in as ${userName}…`,
        result.redirectUrl,
      );
    } else {
      throw _mkErr(
        result?.message || "Login failed. Please try again.",
        result?.errorCode || "LOGIN_FAILED",
      );
    }
  } catch (err) {
    const { msg, type } = _classifyError(err);
    window.ui.showErr(errEl, msg);
    window.ui.toast(msg, type);
  } finally {
    window.ui.setLoading(
      modalEl,
      "axi-keepme-loader",
      "axi-keepme-loader-text",
      false,
    );
  }
}

/* ═══════════════════════════════════════════════════════════
   §19  BOOT
═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", async () => {
  // await _loadSettings();
  await _getKeepMeSignInInfo();
  initSignup();
  initLogin();
  initOtpInput();
  await _checkUrlIntent();
  _checkDirectLoginIntent();
  // await initPackageSelection();
});
