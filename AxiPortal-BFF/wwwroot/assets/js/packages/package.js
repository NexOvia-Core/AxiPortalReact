/* ═══════════════════════════════════════════════════════════
   §2  BFF TRANSPORT LAYER
═══════════════════════════════════════════════════════════ */

/**
 * POST to /api/package/{endpoint}.
 * Sends session cookie, unwraps ApiResponse envelope, maps errors.
 * @returns {Promise<any>} contents of `data` field
 */
async function _bff(endpoint, params = {}) {
  let response, body;

  try {
    response = await fetch(`/api/package/${endpoint}`, {
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

function _mkErr(message, code, status) {
  return Object.assign(new Error(message), { code, status });
}

/* ═══════════════════════════════════════════════════════════
   API HELPERS
═══════════════════════════════════════════════════════════ */

window.api = {
  /**
   * Checks package status
   */
  checkPackageStatus: (req) => _bff("check-status", req),
  /**
   * Installs a single package
   */
  installPackage: (req) => _bff("install", req),
  /**
   * Installs multiple packages (server loops + pushes each to RMQ)
   */
  installPackages: (req) => _bff("install-bulk", req),
  /**
   * Reads current install progress for a set of packages from Redis
   */
  getInstallProgress: (req) => _bff("progress", req),
  getRedirectUrl: () => _bff("get-redirecturl"),
};

/* ═══════════════════════════════════════════════════════════
   UI HELPERS
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
    // modalEl
    //   .querySelectorAll("input, select, textarea, button")
    //   .forEach((el) => {
    //     if (!loader.contains(el)) el.disabled = !!on;
    //   });
  },
  pageLoader: {
    show(text) {
      const loader = document.getElementById("axi-page-loader");
      const textEl = document.getElementById("axi-page-loader-text");
      if (!loader) return;
      loader.classList.toggle("d-none", false);
      if (textEl && text) textEl.textContent = text;
    },
    hide(loaderId, textId, on, text) {
      const loader = document.getElementById("axi-page-loader");
      if (!loader) return;
      loader.classList.toggle("d-none", true);
    },
    update(text) {
      const loader = document.getElementById("axi-page-loader");
      const textEl = document.getElementById("axi-page-loader-text");
      if (!loader || loader.classList.contains("d-none")) return;
      if (textEl && text) textEl.textContent = text;
    },
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

      if (!el.classList.contains("fade")) {
        resolve(modal);
      }
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
  /**
   * Generic Promise-based modal runner
   * @returns {Promise<boolean>} Resolves to true on confirm, false on cancel/close
   */
  confirmModal({
    title = "Confirm",
    iconClass = "bi bi-info-circle text-primary",
    bodyHtml = "",
    confirmText = "Continue",
    confirmClass = "btn-primary",
    cancelText = "Cancel",
    infoModal = false,
  } = {}) {
    return new Promise((resolve) => {
      const modalEl = document.getElementById("packageModal");
      const modal = this.getModal(modalEl);

      // Set UI text & styles
      document.getElementById("packageModalTitleText").innerText = title;
      document.getElementById("packageModalIcon").className =
        `me-2 ${iconClass}`;
      document.getElementById("packageModalBody").innerHTML = bodyHtml;

      const actionBtn = document.getElementById("packageModalActionBtn");
      const cancelBtn = document.getElementById("packageModalCancelBtn");

      actionBtn.innerText = confirmText;
      actionBtn.className = `btn ${confirmClass} px-4`;

      if (infoModal) {
        cancelBtn.classList.add("d-none");
      } else {
        cancelBtn.classList.remove("d-none");
        cancelBtn.innerText = cancelText;
      }

      let confirmed = false;

      // Clean up & detach listeners once hidden
      const onHidden = () => {
        modalEl.removeEventListener("hidden.bs.modal", onHidden);
        actionBtn.removeEventListener("click", onConfirm);
        resolve(confirmed);
      };

      const onConfirm = () => {
        confirmed = true;
        modal.hide();
      };

      // Attach temporary listeners
      actionBtn.addEventListener("click", onConfirm);
      modalEl.addEventListener("hidden.bs.modal", onHidden);

      modal.show();
    });
  },
  infoModal({
    title = "Confirm",
    iconClass = "bi bi-info-circle text-primary",
    bodyHtml = "",
    confirmText = "Close",
  } = {}) {
    return this.confirmModal({
      title,
      iconClass,
      bodyHtml,
      confirmText: "Close",
      confirmClass: "btn-primary",
      infoModal: true,
    });
  },
};

/* ═══════════════════════════════════════════════════════════
   STORAGE HELPERS
═══════════════════════════════════════════════════════════ */

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
   HELPERS
═══════════════════════════════════════════════════════════ */

function getConnectionAndUsername() {
  return {
    axiaccid: sessionStorage.getItem("axi_connection_name"),
    username: sessionStorage.getItem("axi_user_name"),
  };
}

// How often we poll Redis for install progress. Override by setting
// window.AXI_CONFIG = { packageProgressPollIntervalMs: 10000 } before this script loads.
const PACKAGE_PROGRESS_POLL_INTERVAL_MS =
  window.AXI_CONFIG?.packageProgressPollIntervalMs || 10000;

// Redis progress values -> UI state. Anything not in this map (or not yet
// reported) is treated as "queued".
const PACKAGE_STATUS_META = {
  QUEUED: { label: "Queued", cls: "status-queued", terminal: false },
  PREPARING: {
    label: "Preparing…",
    cls: "status-preparing",
    terminal: false,
  },
  DOWNLOADING: {
    label: "Downloading…",
    cls: "status-downloading",
    terminal: false,
  },
  EXTRACTING: {
    label: "Extracting…",
    cls: "status-extracting",
    terminal: false,
  },
  INSTALLING: {
    label: "Installing…",
    cls: "status-installing",
    terminal: false,
  },
  INSTALLED: { label: "Installed", cls: "status-installed", terminal: true },
  FAILED: {
    label: "Installation failed",
    cls: "status-failed",
    terminal: true,
  },
};

/* ═══════════════════════════════════════════════════════════
   REDIRECT (shared by "Skip to Axi" and "Continue to Axi")
═══════════════════════════════════════════════════════════ */

async function redirectToAxi() {
  window.ui.pageLoader.show("Redirecting…");
  const result = await window.api.getRedirectUrl(); // same BFF call auth.js already uses
  if (result?.redirectUrl) window.location.href = result.redirectUrl;
  else window.ui.pageLoader.hide();
}

/* ═══════════════════════════════════════════════════════════
   MULTI-SELECT STATE (packages grid)
═══════════════════════════════════════════════════════════ */

window.axiPackageSelection = {
  selected: new Map(), // name -> { name, version }

  async toggle(cardEl) {
    const name = cardEl.dataset.package;
    const version = cardEl.dataset.version;
    if (this.selected.has(name)) {
      this.selected.delete(name);
      cardEl.classList.remove("selected");
      cardEl.setAttribute("aria-pressed", "false");
    } else {
      const pkgData = { name, version };
      const response = await checkAndHandlePkgProgress(pkgData);

      if (response != "NEW") return;

      this.selected.set(name, pkgData);
      cardEl.classList.add("selected");
      cardEl.setAttribute("aria-pressed", "true");
    }
    this._syncBar();
  },

  clear() {
    this.selected.clear();
    document
      .querySelectorAll(".feature-box.package-select.selected")
      .forEach((el) => {
        el.classList.remove("selected");
        el.setAttribute("aria-pressed", "false");
      });
    this._syncBar();
  },

  list() {
    return Array.from(this.selected.values());
  },

  _syncBar() {
    const installBtn = document.getElementById("installSelectedBtn");
    const count = document.getElementById("selectedPkgCount");
    const n = this.selected.size;
    if (!installBtn || !count) return;
    installBtn.classList.toggle("d-none", n === 0);
    count.textContent = n === 0 ? "" : `(${n})`;
  },
};

/* ═══════════════════════════════════════════════════════════
   INSTALL PROGRESS MODAL (multi-package, polled)
═══════════════════════════════════════════════════════════ */

window.axiInstallProgress = {
  packages: [],
  pollTimer: null,
  running: false,
  polling: false,

  async start(packageList) {
    if (this.running) {
      return;
    }

    window.axiPackageSelection.clear();
    document.getElementById("installOverlay").classList.remove("d-none");
    document.getElementById("installMini").classList.add("d-none");

    const { axiaccid, username } = getConnectionAndUsername();
    const schemaName = axiaccid?.toUpperCase();

    this.packages = packageList.map((p) => ({
      ...p,
      status: "QUEUED",
    }));

    this.running = true;
    this._renderShell();
    this._renderRows();
    this._setRedirectDisabled(true);

    try {
      const response = await window.api.installPackages({
        schemaName,
        requestedBy: username,
        packages: this.packages.map((p) => ({
          packageName: p.name,
          packageVersion: p.version,
        })),
      });

      (response?.results || []).forEach((r) => {
        const pkg = this.packages.find((p) => p.name === r.packageName);

        if (pkg && r.success === false) {
          pkg.status = "FAILED";
        }
      });

      this._renderRows();

      // Everything failed before entering the queue.
      if (this.packages.every((p) => PACKAGE_STATUS_META[p.status]?.terminal)) {
        this._finish();
        return;
      }

      // Start exactly one polling chain.
      this._schedulePoll(0);
    } catch (err) {
      this.packages.forEach((p) => {
        p.status = "FAILED";
      });

      this._renderRows();

      window.ui.toast(
        err?.message || "Failed to start package installation.",
        "error",
      );

      this._finish();
    }
  },

  async _poll() {
    // Prevent accidental overlapping polls.
    if (!this.running || this.polling) {
      return;
    }

    const pending = this.packages.filter(
      (p) => !PACKAGE_STATUS_META[p.status]?.terminal,
    );

    if (pending.length === 0) {
      this._finish();
      return;
    }

    this.polling = true;

    try {
      const { axiaccid, username } = getConnectionAndUsername();

      const response = await window.api.getInstallProgress({
        schemaName: axiaccid?.toUpperCase(),
        username,
        packageNames: pending.map((p) => p.name),
      });

      (response?.statuses || []).forEach((s) => {
        const pkg = this.packages.find((p) => p.name === s.packageName);

        if (pkg && PACKAGE_STATUS_META[s.status]) {
          pkg.status = s.status;
        }
      });

      this._renderRows();

      const completed = this.packages.every(
        (p) => PACKAGE_STATUS_META[p.status]?.terminal,
      );

      if (completed) {
        this._finish();
        return;
      }
    } catch (err) {
      // Keep installation running.
      // A temporary Redis/API failure should not mark packages failed.
      console.warn("Progress poll failed:", err?.message);
    } finally {
      this.polling = false;
    }
  },

  _schedulePoll(delay = PACKAGE_PROGRESS_POLL_INTERVAL_MS) {
    if (!this.running) {
      return;
    }

    // Never allow multiple timers.
    this._clearPollTimer();

    this.pollTimer = setTimeout(async () => {
      this.pollTimer = null;

      if (!this.running) {
        return;
      }

      await this._poll();

      if (this.running) {
        this._schedulePoll();
      }
    }, delay);
  },

  _clearPollTimer() {
    if (this.pollTimer !== null) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  },

  _finish() {
    this._clearPollTimer();

    this.running = false;
    this.polling = false;

    this._setRedirectDisabled(false);

    const failed = this.packages.filter((p) => p.status === "FAILED").length;

    const total = this.packages.length;

    let title;
    let subtitle;

    if (failed === 0) {
      title = "Installation Completed";
      subtitle = "All selected packages were installed successfully";
    } else if (failed === total) {
      title = "Installation Failed";
      subtitle = "None of the selected packages could be installed";
    } else {
      title = "Installation Completed with Errors";
      subtitle = `${total - failed} of ${total} packages were installed`;
    }

    document.getElementById("installModalTitle").textContent = title;
    document.getElementById("installModalSubtitle").textContent = subtitle;

    document.getElementById("installIcon").classList.add("completed");
    document.getElementById("miniIcon").classList.add("completed");

    document.getElementById("installFooterMessage").textContent =
      failed > 0
        ? "Installation completed with errors"
        : "All packages installed successfully";

    document.getElementById("closeInstallBtn").classList.remove("d-none");

    document
      .getElementById("closeInstallBtn")
      .addEventListener("click", () => this._close(), { once: true });

    window.ui.toast(
      failed > 0
        ? `${total - failed} of ${total} packages installed. ${failed} failed.`
        : `All ${total} package(s) installed successfully.`,
      failed > 0 ? "error" : "success",
    );
  },

  _close() {
    this._clearPollTimer();

    document.getElementById("installOverlay").classList.add("d-none");

    document.getElementById("installMini").classList.add("d-none");
  },

  _setRedirectDisabled(disabled) {
    const skipBtn = document.getElementById("continueToAxiBtn");

    if (skipBtn) {
      skipBtn.disabled = disabled;
    }
  },

  _renderShell() {
    document.getElementById("installModalTitle").textContent =
      "Installing Packages";
    document.getElementById("installModalSubtitle").textContent =
      "Installing selected packages";
    document.getElementById("installIcon").classList.remove("completed");
    document.getElementById("miniIcon").classList.remove("completed");
    document.getElementById("closeInstallBtn").classList.add("d-none");
    // document.getElementById("miniContinueBtn").classList.add("d-none");
  },

  _renderRows() {
    const total = this.packages.length;
    const done = this.packages.filter(
      (p) => PACKAGE_STATUS_META[p.status]?.terminal,
    ).length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    document.getElementById("installProgressLabel").textContent =
      `${done} of ${total} packages processed`;
    document.getElementById("installProgressPercentage").textContent =
      `${pct}%`;
    const bar = document.getElementById("installProgressBar");
    bar.style.width = `${pct}%`;
    bar.classList.toggle("completed", pct === 100);

    const container = document.getElementById("installPackageContainer");
    container.innerHTML = this.packages
      .map((p) => {
        const meta =
          PACKAGE_STATUS_META[p.status] || PACKAGE_STATUS_META.QUEUED;
        const icon =
          meta.cls === "status-installed"
            ? "✓"
            : meta.cls === "status-failed"
              ? "!"
              : "⚪";
        return `
          <div class="install-package-row">
            <div class="install-status-icon ${meta.cls}">${icon}</div>
            <div>
              <div class="install-package-name">${p.name}</div>
              <div class="install-package-status ${meta.cls}">${meta.label}</div>
            </div>
          </div>`;
      })
      .join("");

    document.getElementById("miniStatus").textContent =
      `${done} of ${total} packages processed`;
    document.getElementById("miniPercentage").textContent = `${pct}%`;
    document.getElementById("miniProgressBar").style.width = `${pct}%`;
    document
      .getElementById("miniProgressBar")
      .classList.toggle("completed", pct === 100);
  },
};

/* ═══════════════════════════════════════════════════════════
   FLOW HANDLERS
═══════════════════════════════════════════════════════════ */

/**
 * Signup/Login direct-select flow: a single package was chosen before
 * landing on this page (see axiStoragePackage). Shows the confirm popup;
 * "Skip to Axi" redirects, "Install" hands off to the progress modal.
 */
async function handleDirectPackageConfirmation(packageData) {
  try {
    const response = await checkAndHandlePkgProgress(packageData);

    if (response != "NEW") return;

    const proceed = await window.ui.confirmModal({
      title: "Confirm Package Setup",
      iconClass: "bi bi-box-seam text-primary",
      bodyHtml: `You have selected the <strong class="text-dark">${packageData.name}</strong> package for your account.<br><br>We are ready to proceed with the setup. Would you like to continue?`,
      confirmText: "Install",
      confirmClass: "btn-primary",
      cancelText: "Skip to Axi",
    });

    if (proceed) {
      await window.axiInstallProgress.start([packageData]);
    } else {
      await redirectToAxi();
    }
  } catch (err) {
    window.ui.toast(
      err?.message || "Failed to initiate package installation.",
      "error",
    );
  } finally {
    window.ui.pageLoader.hide();
    window.axiStoragePackage.clear();
  }
}

async function checkAndHandlePkgProgress(packageData) {
  try {
    window.ui.pageLoader.show("Checking package status…");
    const { axiaccid } = getConnectionAndUsername();
    const result = await window.api.checkPackageStatus({
      schemaName: axiaccid?.toUpperCase(),
      packageName: packageData.name,
    });

    window.ui.pageLoader.hide();

    if (result?.status !== "NEW") {
      const proceed = await window.ui.infoModal({
        title:
          result?.status === "ALREADY_INSTALLED"
            ? "Package Already Installed"
            : "Installation In Progress",
        iconClass: "bi bi-exclamation-triangle-fill text-warning",
        bodyHtml: result?.message,
      });
    }
    return result?.status;
  } catch (err) {
    window.ui.toast(err?.message || "Failed to check package status.", "error");
  }
}

async function loadPackageConfirmation() {
  const packageData = window.axiStoragePackage.get();
  if (!packageData) return;

  await handleDirectPackageConfirmation(packageData);
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPackageConfirmation();

  // Toggle selection on the packages grid (multi-select flow)
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".feature-box.package-select");
    if (
      !card ||
      card.classList.contains("installed") ||
      card.classList.contains("inprogress")
    )
      return;
    window.axiPackageSelection.toggle(card);
  });

  document
    .getElementById("installSelectedBtn")
    .addEventListener("click", async () => {
      try {
        const selected = window.axiPackageSelection.list();
        if (selected.length === 0) return;

        const names = selected
          .map((p) => `<strong class="text-dark">${p.name}</strong>`)
          .join(", ");
        const proceed = await window.ui.confirmModal({
          title: "Confirm Package Setup",
          iconClass: "bi bi-box-seam text-primary",
          bodyHtml: `You have selected ${names} for your account.<br><br>We are ready to proceed with the setup. Would you like to continue?`,
          confirmText: "Install",
          confirmClass: "btn-primary",
          cancelText: "Cancel",
        });
        if (proceed) await window.axiInstallProgress.start(selected);
      } catch (err) {
        console.error("installSelectedBtn flow failed:", err);
        window.ui.toast(
          err?.message || "Something went wrong starting the install.",
          "error",
        );
      }
    });

  document
    .getElementById("minimizeInstallBtn")
    .addEventListener("click", () => {
      document.getElementById("installOverlay").classList.add("d-none");
      document.getElementById("installMini").classList.remove("d-none");
    });

  document.getElementById("installMini").addEventListener("click", () => {
    document.getElementById("installOverlay").classList.remove("d-none");
    document.getElementById("installMini").classList.add("d-none");
  });

  // document
  //   .getElementById("miniContinueBtn")
  //   .addEventListener("click", async (e) => {
  //     e.stopPropagation(); // don't also trigger installMini's restore-on-click
  //     if (window.axiInstallProgress.running) return;
  //     await redirectToAxi();
  //   });

  document
    .getElementById("continueToAxiBtn")
    .addEventListener("click", async () => {
      if (window.axiInstallProgress.running) return; // guarded via disabled attr too
      await redirectToAxi();
    });
});
