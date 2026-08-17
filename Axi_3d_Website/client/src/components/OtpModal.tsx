import { type ClipboardEvent, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw, X } from "lucide-react";
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
        className="relative w-full max-w-[550px] overflow-hidden rounded-lg bg-[#210062] px-6 py-9 text-white shadow-2xl sm:px-10"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-white/70 hover:text-white"
          aria-label="Close verification"
        >
          <X size={18} />
        </button>
        <img
          src="/AXI_LOGO_AXPERT.png"
          alt="Axi"
          className="mx-auto mb-5 h-9 object-contain brightness-0 invert"
        />
        <h2 id="otp-title" className="text-center text-2xl font-bold">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-white/75">
          Enter the code sent to {email}.
        </p>
        <p className="mt-5 text-center text-sm text-white/75">
          Code expires in{" "}
          <strong className="text-white">{formatTime(expiry)}</strong>
        </p>
        {error && (
          <div
            role="alert"
            className="mt-4 rounded border border-red-300/70 bg-red-950/40 px-3 py-2 text-sm text-red-100"
          >
            {error}
          </div>
        )}
        <div className="mt-6 flex justify-between gap-2" onPaste={pasteOtp}>
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
              className="h-12 min-w-0 flex-1 rounded border border-white/40 bg-white/10 text-center text-xl font-bold outline-none focus:border-white focus:bg-white/20"
            />
          ))}
        </div>
        <p className="mt-5 text-center text-sm text-white/75">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={resend}
            disabled={loading || resendWait > 0}
            className="font-semibold text-white underline disabled:no-underline disabled:opacity-50"
          >
            {resendWait > 0 ? `Resend (${resendWait}s)` : "Resend"}
          </button>
        </p>
        <button
          type="submit"
          disabled={loading || expiry === 0}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#d6573c] px-5 py-3 font-bold uppercase tracking-wide transition hover:bg-[#e66a51] disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />} Verify
        </button>
      </form>
    </div>
  );
}
