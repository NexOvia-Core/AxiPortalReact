declare global {
  interface Window {
    FingerprintJS?: {
      load: () => Promise<{ get: () => Promise<{ visitorId: string }> }>;
    };
  }
}

let fingerprintLoader: Promise<void> | undefined;

function loadFingerprintScript() {
  if (window.FingerprintJS) return Promise.resolve();
  if (fingerprintLoader) return fingerprintLoader;

  fingerprintLoader = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${import.meta.env.BASE_URL}assets/js/fingerprintjs/FingerprintJS.min.js`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Browser identification is unavailable."));
    document.head.append(script);
  });
  return fingerprintLoader;
}

function fallbackBrowserId() {
  const storageKey = "axi_browser_id_v1";
  const existing = localStorage.getItem(storageKey);
  if (existing) return existing;

  const value = crypto.randomUUID();
  localStorage.setItem(storageKey, value);
  return value;
}

export async function getBrowserId(): Promise<string> {
  try {
    await loadFingerprintScript();
    const visitor = await window.FingerprintJS!.load().then(agent => agent.get());
    const userAgent = navigator.userAgent;
    const browser = userAgent.includes("Edg/")
      ? "msedge"
      : userAgent.includes("Chrome")
        ? "chrome"
        : userAgent.includes("Firefox")
          ? "mozilla"
          : userAgent.includes("Safari")
            ? "safari"
            : "unknown";
    return `${visitor.visitorId}-${browser}`;
  } catch {
    // A stable ID keeps the BFF keep-me-signed-in contract usable when the legacy library is unavailable.
    return fallbackBrowserId();
  }
}
