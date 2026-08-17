declare global {
  interface Window {
    FingerprintJS?: {
      load: () => Promise<{ get: () => Promise<{ visitorId: string }> }>;
    };
  }
}

export async function getBrowserId(): Promise<string> {
  if (!window.FingerprintJS) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${import.meta.env.BASE_URL}assets/js/fingerprintjs/FingerprintJS.min.js`;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Browser identification is unavailable."));
      document.head.append(script);
    });
  }
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
}
