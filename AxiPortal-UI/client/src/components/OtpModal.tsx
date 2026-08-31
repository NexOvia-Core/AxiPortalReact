import { type ClipboardEvent, useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, MailCheck, X } from "lucide-react";
import { bff, type Schema } from "@/lib/bff";

type Challenge = {
  challengeId: string;
  expiresInSeconds: number;
  resendInSeconds: number;
};

export default function OtpModal({
  isOpen,
  onClose,
  onSuccess,
  actionType,
  email,
  challengeId,
  expiresInSeconds,
  resendInSeconds = 30,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: { schemas?: Schema[] }) => void;
  actionType: "login" | "signup";
  email: string;
  challengeId?: string;
  expiresInSeconds?: number;
  resendInSeconds?: number;
}) {
  const [challenge, setChallenge] = useState<Challenge | undefined>();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [expiry, setExpiry] = useState(0);
  const [resendWait, setResendWait] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen || !challengeId) return;
    setChallenge({
      challengeId,
      expiresInSeconds: expiresInSeconds ?? 300,
      resendInSeconds,
    });
    setDigits(["", "", "", "", "", ""]);
    setExpiry(expiresInSeconds ?? 300);
    setResendWait(resendInSeconds);
    setError("");
    window.setTimeout(() => inputs.current[0]?.focus(), 0);
  }, [challengeId, expiresInSeconds, isOpen, resendInSeconds]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = window.setInterval(() => {
      setExpiry(value => Math.max(0, value - 1));
      setResendWait(value => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isOpen]);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits(current =>
      current.map((item, itemIndex) => (itemIndex === index ? digit : item))
    );
    setError("");
    if (digit) inputs.current[index + 1]?.focus();
  };

  const pasteOtp = (event: ClipboardEvent) => {
    event.preventDefault();
    const values = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");
    if (values.length === 6) {
      setDigits(values);
      inputs.current[5]?.focus();
    }
  };

  const resend = async () => {
    setLoading(true);
    setError("");
    try {
      const next = await bff.checkAndSendOtp(email, actionType);
      setChallenge(next);
      setExpiry(next.expiresInSeconds);
      setResendWait(next.resendInSeconds);
      setDigits(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to resend the verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  const isOtpComplete =
    digits.every(d => d !== "") && digits.join("").length === 6;
  const isVerifyDisabled = loading || expiry === 0 || !isOtpComplete;

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!challenge || expiry === 0) {
      setError("This verification code has expired. Request a new code.");
      return;
    }
    const otp = digits.join("");
    if (otp.length !== 6) {
      setError("Enter the six-digit verification code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      onSuccess(
        await bff.verifyUser(email, actionType, otp, challenge.challengeId)
      );
    } catch (requestError) {
      setDigits(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The verification code could not be confirmed."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#fff8ee]/55 backdrop-blur-lg p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-title"
    >
      <form
        onSubmit={verify}
        className="relative w-full max-w-[500px] overflow-hidden rounded-3xl border border-[#f3e2cc] bg-[#fff8ee] bg-[radial-gradient(circle_at_85%_85%,rgba(254,180,140,0.35)_0%,transparent_55%)] px-6 py-8 text-slate-800 shadow-[0_25px_60px_-15px_rgba(33,0,98,0.15),inset_0_1px_1px_rgba(255,255,255,0.9)] sm:px-10 sm:py-9"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 bg-white/80 border border-white/80 transition hover:bg-white hover:text-slate-700 shadow-2xs cursor-pointer"
          aria-label="Close verification"
        >
          <X size={18} />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#210062] to-[#5c1380] text-white shadow-lg shadow-[#210062]/25 ring-4 ring-white/80 mb-2">
          <MailCheck size={26} />
        </div>

        <p className="mt-4 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#d6573c]">
          Security check
        </p>

        <h2
          id="otp-title"
          className="mt-1 text-center text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text"
        >
          Verify your email
        </h2>

        <p className="mt-2 text-center text-sm leading-6 font-medium text-slate-600">
          Enter the code sent to{" "}
          <strong className="font-bold text-[#1E1B4B]">{email}</strong>.
        </p>

        <p className="mx-auto mt-4 w-fit rounded-full bg-[#FAF8F5] border border-[#e8d7c3] px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs">
          Code expires in{" "}
          <strong className="font-extrabold text-[#5c1380]">
            {formatTime(expiry)}
          </strong>
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50/90 px-3.5 py-2.5 text-xs font-normal text-red-700"
          >
            <AlertCircle size={14} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <div
          className="mt-7 flex justify-between gap-2 sm:gap-3"
          onPaste={pasteOtp}
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={element => {
                inputs.current[index] = element;
              }}
              value={digit}
              onChange={event => updateDigit(index, event.target.value)}
              onKeyDown={event => {
                if (event.key === "Backspace" && !digits[index])
                  inputs.current[index - 1]?.focus();
              }}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              className="h-14 min-w-0 flex-1 rounded-2xl border border-[#e8d7c3] bg-white/90 text-center text-2xl font-extrabold text-[#210062] outline-none transition-all focus:border-2 focus:border-[#5c1380] focus:bg-white focus:ring-4 focus:ring-[#5c1380]/15 shadow-2xs"
            />
          ))}
        </div>

        <p className="mt-6 text-center text-sm font-medium text-slate-600">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={resend}
            disabled={loading || resendWait > 0}
            className="font-bold text-[#5c1380] underline decoration-[#5c1380]/40 underline-offset-2 transition hover:text-[#210062] disabled:no-underline disabled:opacity-50 cursor-pointer"
          >
            {resendWait > 0 ? `Resend (${resendWait}s)` : "Resend"}
          </button>
        </p>

        <button
          type="submit"
          disabled={isVerifyDisabled}
          className={`mt-7 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-extrabold uppercase tracking-wider text-white transition-all ${
            isVerifyDisabled
              ? "bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] cursor-not-allowed shadow-none opacity-60"
              : "bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] shadow-lg shadow-[#210062]/20 hover:opacity-95 active:scale-[0.99] cursor-pointer"
          }`}
        >
          {loading && <Loader2 size={16} className="animate-spin" />} Verify
        </button>
      </form>
    </div>
  );
}
