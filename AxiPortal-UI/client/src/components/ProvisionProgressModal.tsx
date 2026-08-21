import { useEffect, useRef } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useProvisioningStatus } from "@/hooks/useProvisioningStatus";

export default function ProvisionProgressModal({
  onReady,
  onDismiss,
}: {
  onReady: () => void;
  onDismiss: () => void;
}) {
  const status = useProvisioningStatus(true);
  const hasCompleted = useRef(false);
  const result = status.data;
  const failed =
    status.isError ||
    result?.error === "PROVISION_FAILED" ||
    result?.error === "UNAUTHORIZED";

  useEffect(() => {
    if (hasCompleted.current || !result?.success) return;
    hasCompleted.current = true;
    onReady();
  }, [onReady, result?.success]);

  const errorMessage = status.error
    ? status.error instanceof Error
      ? status.error.message
      : "Unable to check account provisioning."
    : result?.error === "PROVISION_FAILED"
      ? "Account provisioning failed. Please contact support."
      : result?.error === "UNAUTHORIZED"
        ? "Your secure provisioning session has expired. Please sign up again."
        : "";

  return (
    <div
      className="fixed inset-0 z-[230] flex items-center justify-center bg-slate-950/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="provision-progress-title"
      aria-describedby="provision-progress-description"
    >
      <div className="w-full max-w-md rounded-lg bg-[#210062] p-7 text-center text-white shadow-2xl">
        {failed ? (
          <AlertCircle className="mx-auto h-10 w-10 text-red-200" />
        ) : (
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-white" />
        )}
        <h2 id="provision-progress-title" className="mt-5 text-2xl font-bold">
          {failed
            ? "Provisioning could not continue"
            : "Preparing your AXI account"}
        </h2>
        <p
          id="provision-progress-description"
          className="mt-3 text-sm leading-6 text-white/80"
          aria-live="polite"
        >
          {failed
            ? errorMessage
            : "Your account is being provisioned. This window will continue automatically when it is ready."}
        </p>
        {failed && (
          <button
            type="button"
            onClick={onDismiss}
            className="mt-6 w-full rounded bg-[#d6573c] px-5 py-3 font-bold uppercase tracking-wide"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
