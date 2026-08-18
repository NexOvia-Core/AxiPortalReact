import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

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
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-950/75 p-4">
      <form
        onSubmit={submit}
        className="relative w-full max-w-md rounded-lg bg-white p-7 shadow-2xl"
        aria-labelledby="password-title"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 p-2 text-slate-500 hover:text-slate-800 disabled:opacity-50"
          aria-label="Close password verification"
        >
          <X size={18} />
        </button>
        <h2 id="password-title" className="text-xl font-bold text-[#210062]">
          Enter your password
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Continue to {applicationName}.
        </p>
        {(error || externalError) && (
          <p
            role="alert"
            className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error || externalError}
          </p>
        )}
        <input
          autoComplete="current-password"
          autoFocus
          className="mt-5 w-full rounded-lg border border-slate-200 bg-[#FAF8F5] px-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#5c1380]"
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
          className="mt-5 flex w-full items-center justify-center gap-2 rounded bg-[#210062] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Continue
        </button>
      </form>
    </div>
  );
}
