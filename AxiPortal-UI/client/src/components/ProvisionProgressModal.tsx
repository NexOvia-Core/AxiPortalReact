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
      ? "Account provisioning failed. Please check your email."
      : result?.error === "UNAUTHORIZED"
        ? "Your secure provisioning session has expired. Please sign up again."
        : "";

  return (
    <div
      className="fixed inset-0 z-[230] flex items-center justify-center bg-[#fff8ee]/60 backdrop-blur-xl p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="provision-progress-title"
      aria-describedby="provision-progress-description"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#f3e2cc] bg-[#fff8ee] bg-[radial-gradient(circle_at_85%_85%,rgba(254,180,140,0.4)_0%,transparent_60%),radial-gradient(circle_at_15%_15%,rgba(33,0,98,0.06)_0%,transparent_50%)] p-8 text-center text-slate-800 shadow-[0_25px_60px_-15px_rgba(33,0,98,0.15),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#210062] to-[#5c1380] text-white shadow-lg shadow-[#210062]/25 ring-4 ring-white/80">
          {failed ? (
            <AlertCircle className="h-8 w-8 text-red-200" />
          ) : (
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          )}
        </div>

        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d6573c]">
          Account Status
        </p>

        <h2
          id="provision-progress-title"
          className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text"
        >
          {failed
            ? "Provisioning could not continue"
            : "Preparing your AXI account"}
        </h2>

        <p
          id="provision-progress-description"
          className="mt-3 text-sm leading-6 font-medium text-slate-600"
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
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] px-5 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-[#210062]/20 transition hover:opacity-95 active:scale-[0.99]"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
