import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Loader2,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { bff } from "@/lib/bff";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: { schemas?: import("@/lib/bff").Schema[] }) => void;
  actionType?: "login" | "signup";
  email?: string;
  challengeId?: string;
  expiresInSeconds?: number;
}

type Step = "phone" | "otp";

// Country codes list
const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", label: "India (+91)" },
  { code: "+1", flag: "🇺🇸", label: "USA/Canada (+1)" },
  { code: "+44", flag: "🇬🇧", label: "UK (+44)" },
  { code: "+971", flag: "🇦🇪", label: "UAE (+971)" },
  { code: "+65", flag: "🇸🇬", label: "Singapore (+65)" },
  { code: "+61", flag: "🇦🇺", label: "Australia (+61)" },
  { code: "+49", flag: "🇩🇪", label: "Germany (+49)" },
  { code: "+33", flag: "🇫🇷", label: "France (+33)" },
  { code: "+81", flag: "🇯🇵", label: "Japan (+81)" },
  { code: "+966", flag: "🇸🇦", label: "Saudi Arabia (+966)" },
  { code: "+974", flag: "🇶🇦", label: "Qatar (+974)" },
  { code: "+62", flag: "🇮🇩", label: "Indonesia (+62)" },
  { code: "+60", flag: "🇲🇾", label: "Malaysia (+60)" },
  { code: "+27", flag: "🇿🇦", label: "South Africa (+27)" },
  { code: "+55", flag: "🇧🇷", label: "Brazil (+55)" },
];

export default function OtpModal({
  isOpen,
  onClose,
  onSuccess,
  actionType = "login",
  email,
  challengeId,
  expiresInSeconds,
}: OtpModalProps) {
  const [step, setStep] = useState<Step>("phone");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Full formatted international phone number
  const fullPhone = `${countryCode} ${phoneNumber.trim()}`;

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep(email && challengeId ? "otp" : "phone");
      setPhoneNumber("");
      setOtpDigits(["", "", "", "", "", ""]);
      setCountdown(expiresInSeconds ?? 0);
    }
  }, [challengeId, email, expiresInSeconds, isOpen]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Auto-focus first OTP box when step switches
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  function startCountdown(seconds = 300) {
    setCountdown(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function formatCountdown(secs: number) {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // ── Step 1: Send OTP ──────────────────────────────────────────
  const handleSendOtp = async () => {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    if (cleanNumber.length < 5) {
      toast.error("Please enter a valid mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`OTP sent successfully via SMS to ${fullPhone}.`);
        setStep("otp");
        startCountdown(300);
      } else {
        toast.error(data.error || "Failed to send OTP.");
      }
    } catch {
      toast.error(
        "Server unreachable. Please ensure the dev server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── OTP digit input handler ───────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────
  const handleVerify = async () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      toast.error("Please enter all 6 digits of your OTP.");
      return;
    }
    setLoading(true);
    try {
      if (!email || !challengeId)
        throw new Error("Request a new email verification code.");
      const result = await bff.verifyUser(email, actionType, otp, challengeId);
      toast.success("OTP verified successfully.");
      onClose();
      setTimeout(() => onSuccess(result), 600);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0a0c1a]/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 w-full max-w-[420px] bg-white rounded-3xl shadow-2xl shadow-indigo-950/30 border border-slate-100 p-7"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label="Close OTP modal"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#210062] to-[#5c1380] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-950/30">
              {step === "phone" ? (
                <Phone size={24} className="text-white" />
              ) : (
                <ShieldCheck size={24} className="text-white" />
              )}
            </div>
            <h3 className="text-xl font-extrabold text-[#1E1B4B] tracking-tight">
              {step === "phone"
                ? "OTP Authentication"
                : "Enter Verification Code"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {step === "phone"
                ? "Select country code and enter your mobile number"
                : `We sent a 6-digit OTP via SMS to ${fullPhone}`}
            </p>
          </div>

          {/* ── STEP 1: Country Code & Phone Input ── */}
          {step === "phone" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <div className="relative w-36 shrink-0">
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    className="w-full h-full py-3.5 pl-3 pr-6 rounded-xl border border-slate-200 bg-[#FAF8F5] text-slate-800 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c1380] transition-all appearance-none cursor-pointer"
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>

                {/* Mobile Number Input */}
                <div className="relative flex-1">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                    placeholder="Mobile number"
                    autoFocus
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-[#FAF8F5] text-slate-800 text-sm font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c1380] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading || phoneNumber.trim().length < 5}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-sm tracking-wider uppercase bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] shadow-lg hover:shadow-xl hover:opacity-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> SENDING
                    SMS...
                  </>
                ) : (
                  <>
                    SEND OTP <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── STEP 2: OTP Input (Clean, No On-Screen OTP Display) ── */}
          {step === "otp" && (
            <div className="space-y-5">
              {/* 6-digit boxes */}
              <div
                className="flex gap-2 justify-center"
                onPaste={handleOtpPaste}
              >
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className={`w-11 h-12 text-center text-lg font-bold rounded-xl border-2 transition-all outline-none ${
                      digit
                        ? "border-[#5c1380] bg-[#5c1380]/5 text-[#1E1B4B]"
                        : "border-slate-200 bg-[#FAF8F5] text-slate-400"
                    } focus:border-[#5c1380] focus:bg-white focus:ring-2 focus:ring-[#5c1380]/20`}
                  />
                ))}
              </div>

              {/* Countdown */}
              {countdown > 0 ? (
                <p className="text-center text-xs text-slate-500 font-medium">
                  OTP expires in{" "}
                  <span className="font-bold text-[#5c1380]">
                    {formatCountdown(countdown)}
                  </span>
                </p>
              ) : (
                <p className="text-center text-xs text-slate-500 font-medium">
                  OTP expired.{" "}
                  <button
                    onClick={() => {
                      setStep("phone");
                      setOtpDigits(["", "", "", "", "", ""]);
                    }}
                    className="text-[#5c1380] font-bold underline hover:text-[#210062] transition-colors"
                  >
                    Request new OTP
                  </button>
                </p>
              )}

              {/* Verify button */}
              <button
                onClick={handleVerify}
                disabled={loading || otpDigits.join("").length !== 6}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-sm tracking-wider uppercase bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] shadow-lg hover:shadow-xl hover:opacity-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> VERIFYING...
                  </>
                ) : (
                  <>
                    VERIFY & CONTINUE <ShieldCheck size={16} />
                  </>
                )}
              </button>

              {/* Resend */}
              <div className="text-center">
                <button
                  onClick={handleSendOtp}
                  disabled={loading || countdown > 240}
                  className="text-xs text-slate-500 font-medium hover:text-[#5c1380] transition-colors disabled:opacity-40 flex items-center gap-1 mx-auto"
                >
                  <RefreshCw size={12} />
                  Resend OTP{" "}
                  {countdown > 240
                    ? `(wait ${formatCountdown(countdown - 240)})`
                    : ""}
                </button>
              </div>
            </div>
          )}

          {/* Back link */}
          {step === "otp" && (
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setStep("phone");
                  setOtpDigits(["", "", "", "", "", ""]);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                ← Change number
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
