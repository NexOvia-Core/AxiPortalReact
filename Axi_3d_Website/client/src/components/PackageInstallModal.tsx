import { useEffect, useState } from "react";
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
  const progress = usePackageProgress(
    schema.axiaccid,
    schema.username,
    packages.map(item => item.packageName),
    started
  );
  const statuses = Object.fromEntries(
    (progress.data ?? []).map(item => [item.packageName, item.status])
  );
  useEffect(() => {
    if (!started || !progress.data || progress.data.length !== packages.length)
      return;
    if (!progress.data.every(item => isTerminalPackageStatus(item.status)))
      return;
    if (progress.data.some(item => item.status === "FAILED")) {
      setError(
        "One or more packages failed to install. Main-app access remains blocked."
      );
      return;
    }
    clearSelectedPackages();
    onComplete();
  }, [onComplete, packages.length, progress.data, started]);
  const start = async () => {
    setLoading(true);
    setError("");
    try {
      await bff.installPackages(schema.axiaccid, schema.username, packages);
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
          Install selected Packages
        </h2>
        {packages.map(item => (
          <div
            key={item.packageName}
            className="flex justify-between border-b pb-2 text-sm"
          >
            <span>{item.packageName}</span>
            <span>{statuses[item.packageName] || "Ready"}</span>
          </div>
        ))}
        {(error || progress.error) && (
          <p
            role="alert"
            className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error || "Unable to retrieve package progress."}
          </p>
        )}
        {!started ? (
          <button
            disabled={loading}
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
        <button onClick={onClose} className="w-full text-sm text-slate-500">
          Cancel
        </button>
      </div>
    </div>
  );
}
