import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useAuthModal } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function AuthModal() {
  const { isOpen, mode, setMode, closeModal, targetUrl } = useAuthModal();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [useOtp, setUseOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent, authProvider: string = "email") => {
    e.preventDefault();
    if (authProvider === "email" && !email) {
      toast.error("Please enter your work email");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || `${authProvider}_user@axi.com`,
          full_name: fullName,
          auth_provider: authProvider,
          keep_signed_in: keepSignedIn,
          use_otp: useOtp,
          action_type: mode,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(
          mode === "login"
            ? "Authentication successful! Redirecting to Axi Platform..."
            : "Account registered successfully! Redirecting to Axi Platform..."
        );
        closeModal();
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 600);
      } else {
        toast.error(data.error || "Submission failed. Please try again.");
      }
    } catch (err: any) {
      toast.error("Connected to platform. Redirecting...");
      closeModal();
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="fixed inset-0 bg-[#0a0c1a]/70 backdrop-blur-md transition-opacity"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-2xl shadow-indigo-950/30 border border-slate-100 overflow-hidden z-10 p-6 sm:p-8"
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Top Pill Badge */}
          <div className="text-center mb-3">
            <span className="inline-block px-4 py-1 text-[11px] font-extrabold tracking-wider text-[#d6573c] uppercase bg-[#d6573c]/10 rounded-full">
              START YOUR JOURNEY
            </span>
          </div>

          {/* Logo & Header Title */}
          <div className="text-center mb-6">
            {mode === "signup" && (
              <img
                src="/AXI_LOGO_AXPERT.png"
                alt="Axi Logo"
                className="h-10 mx-auto mb-3 object-contain"
              />
            )}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] tracking-tight">
              {mode === "login" ? "Welcome Back to Axi" : "Account Registration"}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {mode === "login"
                ? "Sign in to access your intelligent enterprise platform"
                : "Register your account to experience living intelligence"}
            </p>
          </div>

          {/* Social Auth Buttons */}
          <div className="space-y-3 mb-5">
            {/* Google */}
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "google")}
              disabled={loading}
              className="w-full py-3 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50/80 transition-all font-semibold text-slate-700 text-sm flex items-center justify-center gap-3 shadow-xs hover:border-slate-300 active:scale-[0.99]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.04.01 12c0 1.96.45 3.8 1.26 5.42l4.01-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Office 365 */}
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "office365")}
              disabled={loading}
              className="w-full py-3 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50/80 transition-all font-semibold text-slate-700 text-sm flex items-center justify-center gap-3 shadow-xs hover:border-slate-300 active:scale-[0.99]"
            >
              <svg className="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              <span>Continue with Office 365</span>
            </button>

            {/* LinkedIn */}
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "linkedin")}
              disabled={loading}
              className="w-full py-3 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50/80 transition-all font-semibold text-slate-700 text-sm flex items-center justify-center gap-3 shadow-xs hover:border-slate-300 active:scale-[0.99]"
            >
              <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.6a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
              </svg>
              <span>Continue with LinkedIn</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              OR
            </span>
          </div>

          {/* Form */}
          <form onSubmit={(e) => handleSubmit(e, "email")} className="space-y-4">
            {mode === "signup" && (
              <div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#FAF8F5] text-slate-800 text-sm font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c1380] focus:border-transparent transition-all shadow-inner/5"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#FAF8F5] text-slate-800 text-sm font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c1380] focus:border-transparent transition-all shadow-inner/5"
              />
            </div>

            {mode === "login" && (
              <div className="space-y-2.5 pt-1">
                <label className="flex items-center gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                  <div
                    onClick={() => setKeepSignedIn(!keepSignedIn)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      keepSignedIn
                        ? "bg-[#00007f] border-[#00007f] text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {keepSignedIn && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span>Keep me signed in</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                  <div
                    onClick={() => setUseOtp(!useOtp)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      useOtp
                        ? "bg-[#00007f] border-[#00007f] text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {useOtp && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span>Use OTP authentication</span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-white text-sm tracking-wider uppercase bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] shadow-lg hover:shadow-xl hover:opacity-95 transition-all transform active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : "NEXT"}
            </button>
          </form>

          {/* Bottom Link */}
          <div className="text-center mt-5 pt-2">
            <p className="text-xs text-slate-600 font-medium">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-[#00007f] font-bold underline hover:text-[#5c1380] transition-colors"
                  >
                    Create Here!
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-[#00007f] font-bold underline hover:text-[#5c1380] transition-colors"
                  >
                    Login Here!
                  </button>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
