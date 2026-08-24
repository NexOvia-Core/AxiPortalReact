import { type ClipboardEvent, useEffect, useRef, useState } from "react";
import { Loader2, MailCheck, X } from "lucide-react";
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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-title"
    >
      <form
        onSubmit={verify}
        className="relative w-full max-w-[550px] overflow-hidden rounded-3xl border border-[#f3e2cc] bg-[#fff8ee] bg-[radial-gradient(circle_at_85%_85%,rgba(254,180,140,0.35)_0%,transparent_55%)] px-6 py-7 text-slate-800 shadow-2xl sm:px-10 sm:py-9"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close verification"
        >
          <X size={18} />
        </button>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#210062] text-white shadow-sm">
          <MailCheck size={23} />
        </div>
        <p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.16em] text-[#5c1380]">
          Security check
        </p>
        <h2
          id="otp-title"
          className="mt-1 text-center text-2xl font-bold tracking-tight text-[#210062]"
        >
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm leading-6 text-slate-600">
          Enter the code sent to {email}.
        </p>
        <p className="mx-auto mt-5 w-fit rounded-full bg-[#FAF8F5] px-4 py-2 text-xs font-medium text-slate-600">
          Code expires in{" "}
          <strong className="text-[#210062]">{formatTime(expiry)}</strong>
        </p>
        {error && (
          <div
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {error}
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
              className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-[#FAF8F5] text-center text-xl font-bold text-[#210062] outline-none transition focus:border-[#5c1380] focus:bg-white focus:ring-2 focus:ring-[#5c1380]/20"
            />
          ))}
        </div>
        <p className="mt-5 text-center text-sm text-slate-600">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={resend}
            disabled={loading || resendWait > 0}
            className="font-semibold text-[#5c1380] underline decoration-[#5c1380]/40 underline-offset-2 transition hover:text-[#210062] disabled:no-underline disabled:opacity-50"
          >
            {resendWait > 0 ? `Resend (${resendWait}s)` : "Resend"}
          </button>
        </p>
        <button
          type="submit"
          disabled={loading || expiry === 0}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#210062] px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-[#210062]/20 transition hover:bg-[#3a087d] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />} Verify
        </button>
      </form>
    </div>
  );
}
