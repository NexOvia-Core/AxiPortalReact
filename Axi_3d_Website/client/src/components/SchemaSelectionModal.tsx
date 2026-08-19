import { useState } from "react";
import { bff, type Schema } from "@/lib/bff";
import {
  clearSelectedPackages,
  readSelectedPackages,
} from "@/lib/package-selection";
import { getSchemaValidationError } from "@/lib/schema-validation";
import RedirectingModal from "./RedirectingModal";
import { savePackageSetupFlow } from "@/lib/package-setup-flow";
import { useLocation } from "wouter";

export default function SchemaSelectionModal({
  schemas,
  keepMeSignIn,
  onClose,
  secondaryAuth,
  requirePassword = false,
  browserId,
}: {
  schemas: Schema[];
  keepMeSignIn: boolean;
  onClose: () => void;
  secondaryAuth?: { email: string; ssoKey: string; ssoProvider: string };
  requirePassword?: boolean;
  browserId?: string;
}) {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState(schemas[0]?.axiaccid || "");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState<{
    url: string;
    message: string;
  }>();
  const continueToApp = async () => {
    const schema = schemas.find(item => item.axiaccid === selected);
    if (!schema) return;
    const schemaError = getSchemaValidationError(schema);
    if (schemaError) {
      setError(schemaError);
      return;
    }
    if (requirePassword && !password) {
      setError("Enter your password to continue.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (secondaryAuth)
        await bff.authUpdate(
          secondaryAuth.email,
          schema.axiaccid,
          secondaryAuth.ssoKey,
          secondaryAuth.ssoProvider
        );
      const packages = readSelectedPackages();
      if (schema.isprimary === "T" && packages.length > 0) {
        savePackageSetupFlow({ schema });
        onClose();
        setLocation("/packages/setup");
        return;
      }
      const result = await bff.signinInfo(
        schema,
        keepMeSignIn,
        password,
        browserId
      );
      if (!result.redirectUrl)
        throw new Error("The BFF did not return a redirect URL.");
      setRedirecting({
        url: result.redirectUrl,
        message: `Loading ${schema.axiaccid}...`,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to continue.");
      setLoading(false);
    }
  };
  const schema = schemas.find(item => item.axiaccid === selected);
  return (
    <>
      {redirecting && (
        <RedirectingModal
          redirectUrl={redirecting.url}
          message={redirecting.message}
        />
      )}
      <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/70">
        <div className="w-full max-w-md rounded-2xl bg-white p-7 space-y-4">
          <h2 className="text-xl font-bold text-[#1E1B4B]">
            Choose your application
          </h2>
          <select
            value={selected}
            onChange={e => {
              setSelected(e.target.value);
              setError(
                getSchemaValidationError(
                  schemas.find(schema => schema.axiaccid === e.target.value)
                ) || ""
              );
            }}
            className="w-full rounded-xl border p-3"
          >
            {schemas.map(schema => (
              <option key={schema.axiaccid} value={schema.axiaccid}>
                {schema.axiaccid}
              </option>
            ))}
          </select>
          {requirePassword && (
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full rounded-xl border p-3"
            />
          )}
          {error && (
            <p
              role="alert"
              className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <button
            onClick={continueToApp}
            disabled={loading}
            className="w-full rounded-xl bg-[#210062] py-3 font-bold text-white"
          >
            {loading ? "Opening..." : "Continue"}
          </button>
          <button
            onClick={() => {
              clearSelectedPackages();
              onClose();
            }}
            className="w-full text-sm text-slate-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
