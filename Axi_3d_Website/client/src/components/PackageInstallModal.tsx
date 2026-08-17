import { useEffect, useState } from "react";
import { bff, type Schema } from "@/lib/bff";
import {
  clearSelectedPackages,
  type SelectedPackage,
} from "@/lib/package-selection";
import { toast } from "sonner";

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
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!started) return;
    const timer = window.setInterval(async () => {
      try {
        const progress = await bff.packageProgress(
          schema.axiaccid,
          schema.username,
          packages.map(item => item.packageName)
        );
        const next = Object.fromEntries(
          progress.map(item => [item.packageName, item.status])
        );
        setStatuses(next);
        if (
          Object.values(next).length === packages.length &&
          Object.values(next).every(
            status => status === "INSTALLED" || status === "FAILED"
          )
        ) {
          window.clearInterval(timer);
          const failed = Object.values(next).some(
            status => status === "FAILED"
          );
          if (failed) {
            toast.error(
              "One or more Packages failed to install. Main-app access remains blocked."
            );
            return;
          }
          clearSelectedPackages();
          onComplete();
        }
      } catch {
        toast.error("Unable to retrieve Package progress.");
      }
    }, 10000);
    return () => window.clearInterval(timer);
  }, [onComplete, packages, schema.axiaccid, schema.username, started]);
  const start = async () => {
    setLoading(true);
    try {
      await bff.installPackages(schema.axiaccid, schema.username, packages);
      setStarted(true);
    } catch (error) {
      toast.error(
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
