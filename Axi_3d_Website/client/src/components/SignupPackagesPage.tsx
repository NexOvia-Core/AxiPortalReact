import { useEffect, useState } from "react";
import { Check, Loader2, PackageCheck } from "lucide-react";
import { bff, type Schema } from "@/lib/bff";
import { packageCatalog } from "@/lib/package-catalog";
import {
  clearSelectedPackages,
  readSelectedPackages,
  type SelectedPackage,
} from "@/lib/package-selection";
import PackageInstallModal from "./PackageInstallModal";
import RedirectingModal from "./RedirectingModal";

export default function SignupPackagesPage({
  schema,
  redirectUrl,
  onContinue,
}: {
  schema: Schema;
  redirectUrl: string;
  onContinue: () => void;
}) {
  const [landingPackage] = useState(() => readSelectedPackages()[0]);
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackage[]>(
    landingPackage ? [landingPackage] : []
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [initialized, setInitialized] = useState(!landingPackage);
  const [pendingLandingConfirmation, setPendingLandingConfirmation] =
    useState(false);
  const [installationInProgress, setInstallationInProgress] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [checkingPackage, setCheckingPackage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!landingPackage) return;

    let active = true;
    void bff
      .packageStatus(schema.axiaccid, landingPackage.packageName)
      .then(result => {
        if (!active) return;
        if (result.status === "NEW") setPendingLandingConfirmation(true);
        else
          setError(
            result.message ||
              `${landingPackage.packageName} is already installed or being installed.`
          );
      })
      .catch(requestError => {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to check the selected package."
        );
      })
      .finally(() => {
        if (active) setInitialized(true);
      });

    return () => {
      active = false;
    };
  }, [landingPackage, schema.axiaccid]);

  useEffect(() => {
    if (!initialized || !pendingLandingConfirmation) return;

    // The legacy page opens confirmation after its page-load work completes.
    // Wait for the initialized page to commit before showing the modal.
    const frame = requestAnimationFrame(() => setShowConfirmation(true));
    return () => cancelAnimationFrame(frame);
  }, [initialized, pendingLandingConfirmation]);

  const continueToAxi = () => {
    clearSelectedPackages();
    onContinue();
    setRedirecting(true);
  };

  const togglePackage = async (packageData: SelectedPackage) => {
    if (installationInProgress) return;
    const isSelected = selectedPackages.some(
      item => item.packageName === packageData.packageName
    );
    if (isSelected) {
      setSelectedPackages(current =>
        current.filter(item => item.packageName !== packageData.packageName)
      );
      return;
    }

    setCheckingPackage(packageData.packageName);
    setError("");
    try {
      const result = await bff.packageStatus(
        schema.axiaccid,
        packageData.packageName
      );
      if (result.status && result.status !== "NEW") {
        setError(
          result.message ||
            `${packageData.packageName} is already installed or being installed.`
        );
        return;
      }
      setSelectedPackages(current => [...current, packageData]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to check the selected package."
      );
    } finally {
      setCheckingPackage("");
    }
  };

  return (
    <>
      {redirecting && (
        <RedirectingModal
          redirectUrl={redirectUrl}
          message={`Loading ${schema.axiaccid}...`}
        />
      )}
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
        <main className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-wide text-[#d6573c]">
            Package setup
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#1E1B4B]">
            Select packages for your AXI account
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Select one or more packages to install, or continue to AXI without
            installing a package now.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {!initialized && (
            <p className="mt-5 flex items-center gap-2 text-sm text-slate-600">
              <Loader2 size={16} className="animate-spin" /> Preparing package
              setup...
            </p>
          )}

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {packageCatalog.map(packageData => {
              const selected = selectedPackages.some(
                item => item.packageName === packageData.packageName
              );
              const checking = checkingPackage === packageData.packageName;
              return (
                <button
                  key={packageData.packageName}
                  type="button"
                  aria-pressed={selected}
                  disabled={
                    Boolean(checkingPackage) ||
                    !initialized ||
                    installationInProgress
                  }
                  onClick={() => void togglePackage(packageData)}
                  className={`flex min-h-32 items-start gap-3 rounded-lg border p-4 text-left transition disabled:opacity-60 ${
                    selected
                      ? "border-[#210062] bg-[#210062]/5"
                      : "border-slate-200 bg-white hover:border-[#5c1380]/50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      selected
                        ? "border-[#210062] bg-[#210062] text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {checking ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : selected ? (
                      <Check size={13} strokeWidth={3} />
                    ) : null}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-[#1E1B4B]">
                      {packageData.packageName}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-600">
                      {packageData.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {selectedPackages.length > 0 && (
              <button
                type="button"
                disabled={!initialized || installationInProgress}
                onClick={() => setShowConfirmation(true)}
                className="inline-flex items-center gap-2 rounded bg-[#210062] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white"
              >
                <PackageCheck size={17} /> Install selected (
                {selectedPackages.length})
              </button>
            )}
            <button
              type="button"
              disabled={installationInProgress}
              onClick={continueToAxi}
              className="rounded bg-[#d6573c] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white"
            >
              Continue to AXI
            </button>
          </div>
        </main>
      </div>

      {showConfirmation && selectedPackages.length > 0 && (
        <PackageInstallModal
          schema={schema}
          packages={selectedPackages}
          onComplete={continueToAxi}
          onClose={() => setShowConfirmation(false)}
          onInstallationStateChange={setInstallationInProgress}
        />
      )}
    </>
  );
}
