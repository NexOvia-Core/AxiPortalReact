import { useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

const redirectDelayMs = 1_000;

export default function RedirectingModal({
  redirectUrl,
  message,
}: {
  redirectUrl: string;
  message: string;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.assign(redirectUrl);
    }, redirectDelayMs);
    return () => window.clearTimeout(timer);
  }, [redirectUrl]);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label="Opening AXI application"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl">
        <CheckCircle2 className="mx-auto text-emerald-600" size={42} />
        <h2 className="mt-4 text-xl font-bold text-[#1E1B4B]">Success</h2>
        <p className="mt-2 text-sm font-medium text-slate-600">{message}</p>
        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" />
          Preparing your AXI application. Please wait...
        </div>
      </div>
    </div>
  );
}
