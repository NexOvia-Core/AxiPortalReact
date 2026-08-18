import { useEffect, useMemo, useRef, useState } from "react";
import { bff, type Schema } from "@/lib/bff";
import {
  clearSelectedPackages,
  type SelectedPackage,
} from "@/lib/package-selection";
import {
  isTerminalPackageStatus,
  usePackageProgress,
} from "@/hooks/usePackageProgress";

export default function PackageInstallModal({
  schema,
  packages,
  onComplete,
  onClose,
}: {
  schema: Schema;
  packages: SelectedPackage[];
  onComplete: () => void;
  onClose: () => void;
}) {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingStatus, setExistingStatus] = useState("");
  const [startFailures, setStartFailures] = useState<Record<string, string>>(
    {}
  );
  const completed = useRef(false);
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
    if (
      !started ||
      completed.current ||
      packageStates.length !== packages.length
    )
      return;
    if (!packageStates.every(item => isTerminalPackageStatus(item.status)))
      return;
    if (packageStates.some(item => item.status === "FAILED")) {
      setError(
        "One or more packages failed to install. Main-app access remains blocked."
      );
      return;
    }
    completed.current = true;
    clearSelectedPackages();
    onComplete();
  }, [onComplete, packageStates, packages.length, started]);
  const start = async () => {
    completed.current = false;
    setLoading(true);
    setError("");
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
      if (Object.keys(failures).length === packages.length) {
        setError("None of the selected packages could be queued for installation.");
        return;
      }
      setStarted(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to start installation."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/70">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 space-y-4">
        <h2 className="text-xl font-bold text-[#1E1B4B]">
          Confirm package setup
        </h2>
        {!started && (
          <p className="text-sm text-slate-600">
            Your selected package is ready to be installed for this account.
          </p>
        )}
        {packages.map(item => (
          <div
            key={item.packageName}
            className="flex justify-between border-b pb-2 text-sm"
          >
            <span>{item.packageName}</span>
            <span>{statuses[item.packageName] || "Ready"}</span>
          </div>
        ))}
        {(error || progress.error || existingStatus) && (
          <p
            role="alert"
            className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error || existingStatus || "Unable to retrieve package progress."}
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
        ) : (
          <p className="text-sm text-slate-600">
            Installation is in progress. Keep this window open.
          </p>
        )}
        {!started && (
          <button onClick={onClose} className="w-full text-sm text-slate-500">
            Continue to AXI
          </button>
        )}
      </div>
    </div>
  );
}
