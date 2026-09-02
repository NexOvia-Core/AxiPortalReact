import { useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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
      className="fixed inset-0 z-[300] flex items-center justify-center  bg-[#fff8ee]/55 backdrop-blur-lg p-4"
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label="Opening AXI application"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[#f3e2cc] bg-[#fff8ee] bg-[radial-gradient(circle_at_85%_85%,rgba(254,180,140,0.35)_0%,transparent_55%)] p-6 sm:p-8 text-center text-slate-800 shadow-2xl shadow-indigo-950/20"
      >
        {/* Icon Badge Container */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#210062] via-[#5c1380] to-[#210062] text-white shadow-lg shadow-[#210062]/20 ring-4 ring-white/80">
          <CheckCircle2 size={32} className="text-emerald-400" />
        </div>

        {/* Header Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1B4B]">
          Success
        </h2>

        {/* Subtitle Message */}
        <p className="mt-2 text-sm font-semibold text-slate-600">{message}</p>

        {/* Loading Indicator Pill */}
        <div className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-[#e8d7c3] bg-white/80 px-4 py-2 text-xs font-semibold text-[#5c1380] shadow-2xs">
          <Loader2 size={14} className="animate-spin text-[#d6573c]" />
          <span>Preparing your AXI application. Please wait...</span>
        </div>
      </motion.div>
    </div>
  );
}
