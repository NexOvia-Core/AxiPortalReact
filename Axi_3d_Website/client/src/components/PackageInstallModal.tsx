import { useEffect, useMemo, useState } from "react";
import { ChevronUp, Minus, X } from "lucide-react";
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
  const packageNames = useMemo(
    () => packages.map(item => item.packageName),
    [packages]
  );
  const packageSignature = packageNames.join("|");
  const progress = usePackageProgress(
    schema.axiaccid,
    schema.username,
    packageNames,
    started
  );
  const progressItems = Array.isArray(progress.data) ? progress.data : [];
  const statuses = Object.fromEntries(
    progressItems.map(item => [item.packageName, item.status])
  );
  Object.keys(startFailures).forEach(packageName => {
    statuses[packageName] = "FAILED";
  });
  const packageStates = packages.map(item => ({
    packageName: item.packageName,
    status: statuses[item.packageName] || "QUEUED",
  }));
  const completedCount = packageStates.filter(item =>
    isTerminalPackageStatus(item.status)
  ).length;
  const progressPercentage = packages.length
    ? Math.round((completedCount / packages.length) * 100)
    : 0;
  const currentPackage = packageStates.find(
    item => !isTerminalPackageStatus(item.status)
  );
  const allPackagesTerminal =
    packageStates.length === packages.length &&
    packageStates.every(item => isTerminalPackageStatus(item.status));
  const installationRunning = started && !allPackagesTerminal;
  const installationActive = loading || installationRunning;
  const installedCount = packageStates.filter(
    item => item.status === "INSTALLED"
  ).length;
  const failedCount = packageStates.filter(
    item => item.status === "FAILED"
  ).length;
  const completionMessage =
    failedCount === 0
      ? `All ${packages.length} selected package${
          packages.length === 1 ? " was" : "s were"
        } installed successfully.`
      : installedCount === 0
        ? `All ${packages.length} selected package${
            packages.length === 1 ? " failed" : "s failed"
          } to install.`
        : `${installedCount} of ${packages.length} packages were installed successfully. ${failedCount} failed.`;
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
    if (started) clearSelectedPackages();
    onClose();
  };

  const continueToAxi = () => {
    if (installationActive || (started && !allPackagesTerminal)) return;
    clearSelectedPackages();
    onComplete();
  };

  return (
    <>
      {minimized && installationRunning && (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="fixed bottom-5 right-5 z-[220] flex min-w-60 items-center justify-between gap-4 rounded-lg bg-[#210062] px-4 py-3 text-left text-sm text-white shadow-lg"
          aria-label="Restore package installation progress"
        >
          <span>
            {currentPackage
              ? `${currentPackage.packageName}: ${
                  packageStatusLabels[currentPackage.status] ||
                  currentPackage.status
                }`
              : "Installation is running in the background"}
          </span>
          <span className="flex items-center gap-2 font-bold">
            {progressPercentage}% <ChevronUp size={17} />
          </span>
        </button>
      )}
      {!minimized && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold text-[#1E1B4B]">
                {started ? "Installing packages" : "Confirm package setup"}
              </h2>
              {!started && (
                <button
                  type="button"
                  onClick={close}
                  className="rounded p-1 text-slate-500 hover:bg-slate-100"
                  aria-label="Close package confirmation"
                  title="Close"
                >
                  <X size={20} />
                </button>
              )}
              {installationRunning && (
                <button
                  type="button"
                  onClick={() => setMinimized(true)}
                  className="rounded p-1 text-slate-500 hover:bg-slate-100"
                  aria-label="Minimize installation progress"
                  title="Minimize"
                >
                  <Minus size={20} />
                </button>
              )}
            </div>
            {!started && (
              <p className="text-sm text-slate-600">
                Your selected package is ready to be installed for this account.
              </p>
            )}
            {started && !allPackagesTerminal && (
              <section aria-live="polite" className="space-y-3">
                <div className="flex items-baseline justify-between text-sm text-slate-600">
                  <span>
                    {completedCount} of {packages.length} packages processed
                  </span>
                  <span className="font-bold text-[#1E1B4B]">
                    {progressPercentage}%
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-slate-200"
                  role="progressbar"
                  aria-label="Package installation progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progressPercentage}
                >
                  <div
                    className={`h-full rounded-full transition-[width] duration-300 ${
                      progressPercentage === 100
                        ? "bg-emerald-600"
                        : "bg-[#210062]"
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600">
                  {currentPackage
                    ? `Current package: ${currentPackage.packageName} - ${
                        packageStatusLabels[currentPackage.status] ||
                        currentPackage.status
                      }`
                    : "All packages have reached a final status."}
                </p>
              </section>
            )}
            <div className="max-h-52 space-y-2 overflow-y-auto">
              {packageStates.map(item => (
                <div
                  key={item.packageName}
                  className="flex justify-between gap-4 border-b pb-2 text-sm"
                >
                  <span className="font-medium text-slate-800">
                    {item.packageName}
                  </span>
                  <span
                    className={
                      item.status === "FAILED"
                        ? "text-red-700"
                        : item.status === "INSTALLED"
                          ? "text-emerald-700"
                          : "text-slate-600"
                    }
                  >
                    {packageStatusLabels[item.status] || item.status}
                  </span>
                </div>
              ))}
            </div>
            {started && allPackagesTerminal && (
              <p
                role="status"
                className={`rounded border px-3 py-2 text-sm font-medium ${
                  failedCount === 0
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
              >
                {completionMessage}
              </p>
            )}
            {(error || progress.error || existingStatus) &&
              !allPackagesTerminal && (
                <p
                  role="alert"
                  className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
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
                className="w-full rounded-xl bg-[#210062] py-3 font-bold text-white"
              >
                {loading ? "Starting..." : "Confirm installation"}
              </button>
            ) : installationRunning ? (
              <p className="text-sm text-slate-600">
                Installation is in progress. Progress updates automatically.
              </p>
            ) : null}
            {!started && (
              <button
                type="button"
                disabled={loading}
                onClick={continueToAxi}
                className="w-full text-sm text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to AXI
              </button>
            )}
            {started && allPackagesTerminal && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={close}
                  className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-bold text-slate-700"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={continueToAxi}
                  className="flex-1 rounded-xl bg-[#210062] py-3 text-sm font-bold text-white"
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
