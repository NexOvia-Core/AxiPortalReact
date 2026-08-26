import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronUp, Download, Loader2, Minus, X } from "lucide-react";
import { bff, type Schema } from "@/lib/bff";
import {
  clearSelectedPackages,
  type SelectedPackage,
} from "@/lib/package-selection";
import {
  isTerminalPackageStatus,
  usePackageProgress,
} from "@/hooks/usePackageProgress";

const packageStatusLabels: Record<string, string> = {
  PREPARED: "Prepared",
  QUEUED: "Queued",
  PREPARING: "Preparing...",
  DOWNLOADING: "Downloading...",
  EXTRACTING: "Extracting...",
  INSTALLING: "Installing...",
  INSTALLED: "Installed",
  FAILED: "Installation failed",
};

export default function PackageInstallModal({
  schema,
  packages,
  onComplete,
  onClose,
  onInstallationStateChange,
}: {
  schema: Schema;
  packages: SelectedPackage[];
  onComplete: () => void;
  onClose: () => void;
  onInstallationStateChange?: (running: boolean) => void;
}) {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingStatus, setExistingStatus] = useState("");
  const [startFailures, setStartFailures] = useState<Record<string, string>>(
    {}
  );
  const [minimized, setMinimized] = useState(false);
  const attemptSeed = useRef(
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  const [installationAttempt, setInstallationAttempt] = useState("");

  const packageNames = useMemo(
    () => packages.map(item => item.packageName),
    [packages]
  );
  const packageSignature = packageNames.join("|");
  const progress = usePackageProgress(
    schema.axiaccid,
    schema.username,
    packageNames,
    started,
    installationAttempt
  );
  const progressItems = Array.isArray(progress.data) ? progress.data : [];
  const progressItemsByPackage = Object.fromEntries(
    progressItems.map(item => [item.packageName, item])
  );

  const packageLogUrl = (logUrl: string) =>
    new URL(
      logUrl,
      new URL(import.meta.env.BASE_URL, window.location.origin)
    ).toString();

  const realStatuses = Object.fromEntries(
    progressItems.map(item => [item.packageName, item.status])
  );
  Object.keys(startFailures).forEach(packageName => {
    realStatuses[packageName] = "FAILED";
  });

  const packageStates = packages.map(item => {
    const rawStatus =
      realStatuses[item.packageName] || (started ? "QUEUED" : "PREPARED");
    const isTerminal = isTerminalPackageStatus(rawStatus);

    return {
      packageName: item.packageName,
      status: rawStatus,
      rawStatus,
      isFinal: isTerminal,
      logUrl: progressItemsByPackage[item.packageName]?.logUrl,
    };
  });

  const completedCount = packageStates.filter(item => item.isFinal).length;

  const currentPackage = packageStates.find(item => !item.isFinal);

  const progressPercentage = !started
    ? 0
    : packages.length === 0
      ? 0
      : completedCount === packages.length
        ? 100
        : Math.round((completedCount / packages.length) * 100);

  const allPackagesTerminal =
    started &&
    packageStates.length === packages.length &&
    packageStates.every(item => item.isFinal);

  const installationRunning = started && !allPackagesTerminal;
  const installationActive = loading || installationRunning;

  const installedCount = packageStates.filter(
    item => item.isFinal && item.rawStatus === "INSTALLED"
  ).length;
  const failedCount = packageStates.filter(
    item => item.isFinal && item.rawStatus === "FAILED"
  ).length;

  const completionMessage = (() => {
    if (failedCount === 0) {
      return packages.length > 1
        ? `All ${packages.length} selected Packages installed successfully`
        : "Installation Successful";
    }
    if (installedCount === 0) {
      return packages.length > 1
        ? `All ${packages.length} selected Packages Failed to install`
        : "Installation Failed";
    }
    return `${installedCount} Package${installedCount === 1 ? "" : "s"} Installed, ${failedCount} Failed to install`;
  })();

  useEffect(() => {
    setStarted(false);
    setLoading(false);
    setError("");
    setExistingStatus("");
    setStartFailures({});
    setMinimized(false);
  }, [packageSignature]);

  useEffect(() => {
    if (packages.length !== 1) return;
    let active = true;
    void bff
      .packageStatus(schema.axiaccid, packages[0].packageName)
      .then(result => {
        if (!active || !result.status || result.status === "NEW") return;
        setExistingStatus(result.message || result.status);
      })
      .catch(() => {
        // A failed status check must not prevent the BFF from handling install.
      });
    return () => {
      active = false;
    };
  }, [packageSignature, schema.axiaccid]);

  useEffect(() => {
    onInstallationStateChange?.(installationActive);
    return () => onInstallationStateChange?.(false);
  }, [installationActive, onInstallationStateChange]);

  useEffect(() => {
    if (allPackagesTerminal) setMinimized(false);
  }, [allPackagesTerminal]);

  const start = async () => {
    setLoading(true);
    setError("");
    setMinimized(false);
    setStartFailures({});
    setInstallationAttempt(
      `${attemptSeed.current}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`
    );
    try {
      const result = await bff.installPackages(
        schema.axiaccid,
        schema.username,
        packages
      );
      const failures = Object.fromEntries(
        (result.results ?? [])
          .filter(item => item.success === false)
          .map(item => [
            item.packageName,
            item.message || "Installation could not be queued.",
          ])
      );
      setStartFailures(failures);
      setStarted(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to start installation."
      );
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    if (installationActive) return;
    clearSelectedPackages();
    onClose();
  };

  const continueToAxi = () => {
    if (installationActive || (started && !allPackagesTerminal)) return;
    clearSelectedPackages();
    onClose();
    onComplete();
  };

  return (
    <>
      {minimized && (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="fixed bottom-5 right-5 z-[220] flex min-w-64 items-center justify-between gap-4 rounded-2xl border border-[#f3e2cc] bg-[#fff8ee] bg-[radial-gradient(circle_at_85%_85%,rgba(254,180,140,0.35)_0%,transparent_55%)] px-5 py-3.5 text-left text-sm text-slate-800 shadow-xl backdrop-blur-xl transition hover:scale-105 cursor-pointer"
          aria-label="Restore package installation progress"
        >
          <span className="font-semibold text-slate-700">
            {currentPackage
              ? `${currentPackage.packageName}: ${packageStatusLabels[currentPackage.status] ||
              currentPackage.status
              }`
              : "Package installation progress"}
          </span>
          <span className="flex items-center gap-2 font-extrabold text-[#5c1380]">
            {progressPercentage}% <ChevronUp size={17} />
          </span>
        </button>
      )}
      {!minimized && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-[#fff8ee]/60 backdrop-blur-xl p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#f3e2cc] bg-[#fff8ee] bg-[radial-gradient(circle_at_85%_85%,rgba(254,180,140,0.35)_0%,transparent_55%)] p-6 space-y-4 text-slate-800 shadow-[0_25px_60px_-15px_rgba(33,0,98,0.15),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight gradient-text">
                {started ? "Installing packages" : "Confirm package setup"}
              </h2>
              {!started ? (
                <button
                  type="button"
                  onClick={close}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 border border-slate-200/80 text-slate-600 hover:bg-white hover:text-slate-900 shadow-2xs transition active:scale-95 cursor-pointer shrink-0"
                  aria-label="Close package confirmation"
                  title="Close"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              ) : !allPackagesTerminal ? (
                <button
                  type="button"
                  onClick={() => setMinimized(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 border border-slate-200/80 text-slate-600 hover:bg-white hover:text-slate-900 shadow-2xs transition active:scale-95 cursor-pointer shrink-0"
                  aria-label="Minimize installation progress"
                  title="Minimize"
                >
                  <Minus size={18} strokeWidth={2.5} />
                </button>
              ) : null}
            </div>
            {!started && (
              <p className="text-sm font-medium text-slate-600">
                Your selected package is ready to be installed for this account.
              </p>
            )}
            {started && !allPackagesTerminal && (
              <section aria-live="polite" className="space-y-3">
                <div className="flex items-baseline justify-between text-sm text-slate-600 font-medium">
                  <span>
                    {completedCount} of {packages.length} packages processed
                  </span>
                  <span className="font-extrabold text-[#210062]">
                    {progressPercentage}%
                  </span>
                </div>
                <div
                  className="h-2.5 overflow-hidden rounded-full bg-slate-200/80"
                  role="progressbar"
                  aria-label="Package installation progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progressPercentage}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progressPercentage === 100
                        ? "bg-emerald-600"
                        : "bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c]"
                      }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-sm font-normal text-[#5c1380] flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-[#d6573c]" />
                  {currentPackage
                    ? `${currentPackage.packageName}: ${packageStatusLabels[currentPackage.status] ||
                    currentPackage.status
                    }`
                    : "All packages have reached a final status."}
                </p>
              </section>
            )}
            <div className="max-h-52 space-y-2.5 overflow-y-auto pr-1">
              {packageStates.map(item => (
                <div
                  key={item.packageName}
                  className="border-b border-[#e8d7c3]/60 pb-2.5 text-sm"
                >
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-bold text-[#1E1B4B]">
                      {item.packageName}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${item.status === "QUEUED"
                          ? "bg-[#5c1380]/10 text-[#5c1380] border border-[#5c1380]/20"
                          : item.status === "PROCESSING"
                            ? "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse"
                            : item.status === "ALMOST_DONE"
                              ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                              : item.status === "FAILED"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                    >
                      {packageStatusLabels[item.status] || item.status}
                    </span>
                  </div>
                  {item.isFinal && item.rawStatus === "FAILED" && item.logUrl && (
                    <a
                      href={packageLogUrl(item.logUrl)}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#5c1380] hover:text-[#210062] underline underline-offset-2 cursor-pointer pointer-events-auto"
                    >
                      <Download size={14} />
                      Download installation log
                    </a>
                  )}
                </div>
              ))}
            </div>

            {started && allPackagesTerminal && (
              <p
                role="status"
                className={`rounded-2xl border px-4 py-3.5 text-center text-sm sm:text-base font-normal shadow-2xs ${
                  failedCount === 0
                    ? "border-emerald-200 bg-emerald-50/90 text-emerald-800"
                    : installedCount === 0
                      ? "border-[#d6573c]/30 bg-[#d6573c]/10 text-[#7a2a1b]"
                      : "border-amber-200 bg-amber-50/90 text-amber-900"
                }`}
              >
                {completionMessage}
              </p>
            )}

            {(error || progress.error || existingStatus) &&
              !allPackagesTerminal && (
                <p
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm font-normal text-red-700 text-center"
                >
                  {error ||
                    existingStatus ||
                    "Unable to retrieve package progress."}
                </p>
              )}

            {!started ? (
              <button
                disabled={loading || Boolean(existingStatus)}
                onClick={start}
                className="w-full rounded-xl bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-[#210062]/20 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Starting..." : "Confirm installation"}
              </button>
            ) : installationRunning ? (
              <p className="text-xs font-medium text-slate-500 text-center">
                Installation in progress. Please wait...
              </p>
            ) : null}

            {!started && (
              <button
                type="button"
                disabled={loading}
                onClick={continueToAxi}
                className="w-full py-2.5 text-center text-sm font-bold text-[#5c1380] hover:text-[#210062] underline underline-offset-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to AXI
              </button>
            )}

            {started && allPackagesTerminal && (
              <div className="flex flex-col gap-3 sm:flex-row pt-1">
                <button
                  type="button"
                  onClick={close}
                  className="flex-1 rounded-xl border border-[#e8d7c3] bg-white/80 py-3.5 text-sm font-extrabold text-slate-700 transition hover:bg-white shadow-2xs active:scale-[0.99]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={continueToAxi}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-[#210062]/20 transition hover:opacity-95 active:scale-[0.99]"
                >
                  Continue to AXI
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
