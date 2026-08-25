import { useEffect, useState } from "react";
import { KeyRound, Loader2, X } from "lucide-react";

export default function PasswordModal({
  applicationName,
  error: externalError,
  loading,
  onClose,
  onSubmit,
}: {
  applicationName: string;
  error?: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setPassword("");
    setError("");
  }, [applicationName]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password) {
      setError("Enter your password.");
      return;
    }
    try {
      await onSubmit(password);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to continue with this password."
      );
    }
  };

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
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 bg-white/80 border border-white/80 transition hover:bg-white hover:text-slate-700 shadow-2xs disabled:opacity-50"
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
          Continue to <strong className="font-bold text-[#1E1B4B]">{applicationName}</strong>.
        </p>

        {(error || externalError) && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50/90 px-3.5 py-2.5 text-center text-sm font-medium text-red-700"
          >
            {error || externalError}
          </p>
        )}

        <input
          autoComplete="current-password"
          autoFocus
          className="mt-6 w-full rounded-2xl border border-[#e8d7c3] bg-white/90 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-2 focus:border-[#5c1380] focus:bg-white focus:ring-4 focus:ring-[#5c1380]/15 shadow-2xs"
          onChange={event => {
            setPassword(event.target.value);
            setError("");
          }}
          placeholder="Enter your password"
          type="password"
          value={password}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] px-5 py-4 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-[#210062]/20 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Continue
        </button>
      </form>
    </div>
  );
}
