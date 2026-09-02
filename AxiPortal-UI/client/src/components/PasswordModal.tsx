import { useEffect, useState } from "react";
import { AlertCircle, KeyRound, Loader2, X } from "lucide-react";

export default function PasswordModal({
  applicationName,
  // error: externalError,
  loading,
  onClose,
  onSubmit,
  onForgotPassword,
}: {
  applicationName: string;
  // error?: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  onForgotPassword?: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setPassword("");
    setError("");
  }, [applicationName]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password.trim()) {
      setError("Enter your password.");
      return;
    }
    try {
      await onSubmit(password);
    } catch (requestError) {
      const msg = requestError instanceof Error ? requestError.message : "";
      if (
        !msg ||
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("password") ||
        msg.toLowerCase().includes("credential") ||
        msg.toLowerCase().includes("failed")
      ) {
        setError("Wrong Password, Please Try Again");
      } else {
        setError(msg);
      }
    }
  };

  // const displayError = error || externalError;
  const isContinueDisabled = loading || !password.trim();

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-[#fff8ee]/55 backdrop-blur-lg p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-title"
    >
      <form
        onSubmit={submit}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#f3e2cc] bg-[#fff8ee] bg-[radial-gradient(circle_at_85%_85%,rgba(254,180,140,0.35)_0%,transparent_55%)] p-7 text-slate-800 shadow-[0_25px_60px_-15px_rgba(33,0,98,0.15),inset_0_1px_1px_rgba(255,255,255,0.9)] sm:p-8"
        aria-labelledby="password-title"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 bg-white/80 border border-white/80 transition hover:bg-white hover:text-slate-700 shadow-2xs disabled:opacity-50 cursor-pointer"
          aria-label="Close password verification"
        >
          <X size={18} />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#210062] to-[#5c1380] text-white shadow-lg shadow-[#210062]/25 ring-4 ring-white/80 mb-2">
          <KeyRound size={26} />
        </div>

        <p className="mt-4 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#d6573c]">
          Security check
        </p>

        <h2
          id="password-title"
          className="mt-1 text-center text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text"
        >
          Enter your password
        </h2>

        <p className="mt-2 text-center text-sm leading-6 font-medium text-slate-600">
          Continue to{" "}
          <strong className="font-bold text-[#1E1B4B]">
            {applicationName}
          </strong>
          .
        </p>

        <div className="mt-6">
          <input
            autoComplete="current-password"
            autoFocus
            className={`w-full rounded-2xl border ${
              error
                ? "border-red-400 bg-red-50/30 focus:ring-red-400/20 focus:border-red-500"
                : "border-[#e8d7c3] bg-white/90 focus:border-[#5c1380] focus:ring-[#5c1380]/15"
            } px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 shadow-2xs`}
            onChange={event => {
              setPassword(event.target.value);
              setError("");
              // onClearError?.();
            }}
            onBlur={() => {
              if (!password.trim()) {
                setError("Enter your password.");
              }
            }}
            placeholder="Enter your password"
            type="password"
            value={password}
          />

          <div className="mt-2 flex items-center justify-between gap-2 min-h-5">
            {error ? (
              <div
                role="alert"
                className="flex items-center gap-1.5 text-xs font-normal text-red-600"
              >
                <AlertCircle size={14} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            ) : (
              <div />
            )}

            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs font-bold text-[#5c1380] hover:text-[#210062] underline underline-offset-2 transition-colors ml-auto shrink-0 cursor-pointer"
              >
                Forgot Password?
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isContinueDisabled}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-extrabold uppercase tracking-wider text-white transition-all ${
            isContinueDisabled
              ? "bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] cursor-not-allowed shadow-none opacity-60"
              : "bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] shadow-lg shadow-[#210062]/20 hover:opacity-95 active:scale-[0.99] cursor-pointer"
          }`}
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Continuing..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
