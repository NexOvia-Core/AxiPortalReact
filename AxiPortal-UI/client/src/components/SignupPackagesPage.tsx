import { useEffect, useState } from "react";
import { Check, Loader2, PackageCheck } from "lucide-react";
import { bff, type Schema } from "@/lib/bff";
import { getBrowserId } from "@/lib/browser-id";
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
  onContinue,
}: {
  schema: Schema;
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
  const [redirecting, setRedirecting] = useState<{
    url: string;
    message: string;
  }>();
  const [redirectLoading, setRedirectLoading] = useState(false);
  const [checkingPackage, setCheckingPackage] = useState("");
  const [pageError, setPageError] = useState("");
  const [packageMessages, setPackageMessages] = useState<
    Record<string, string>
  >({});
  const hasUnavailableSelection = selectedPackages.some(item =>
    Boolean(packageMessages[item.packageName])
  );

  useEffect(() => {
    if (!landingPackage) return;

    let active = true;
    void bff
      .packageStatus(schema.axiaccid, landingPackage.packageName)
      .then(result => {
        if (!active) return;
        if (result.status === "NEW") setPendingLandingConfirmation(true);
        else {
          setPackageMessages({
            [landingPackage.packageName]:
              result.message ||
              `${landingPackage.packageName} is already installed or being installed.`,
          });
        }
      })
      .catch(requestError => {
        if (!active) return;
        setPageError(
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

  const continueToAxi = async () => {
    if (redirectLoading || redirecting) return;
    setPageError("");
    setRedirectLoading(true);
    try {
      const browserId = await getBrowserId();
      const result = await bff.signinInfo(schema, false, undefined, browserId);
      if (!result.redirectUrl)
        throw new Error("The BFF did not return a redirect URL.");
      clearSelectedPackages();
      onContinue();
      setRedirecting({
        url: result.redirectUrl,
        message: `Loading ${schema.axiaccid}...`,
      });
    } catch (requestError) {
      setPageError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to continue to AXI."
      );
    } finally {
      setRedirectLoading(false);
    }
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
    setPageError("");
    setPackageMessages(current => {
      const next = { ...current };
      delete next[packageData.packageName];
      return next;
    });
    try {
      const result = await bff.packageStatus(
        schema.axiaccid,
        packageData.packageName
      );
      if (result.status && result.status !== "NEW") {
        setPackageMessages(current => ({
          ...current,
          [packageData.packageName]:
            result.message ||
            `${packageData.packageName} is already installed or being installed.`,
        }));
        return;
      }
      setSelectedPackages(current => [...current, packageData]);
    } catch (requestError) {
      setPageError(
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
          redirectUrl={redirecting.url}
          message={redirecting.message}
        />
      )}
      <div className="min-h-screen bg-[#fff8ee] bg-[radial-gradient(circle_at_85%_85%,rgba(254,180,140,0.4)_0%,rgba(255,248,238,0)_55%),radial-gradient(circle_at_15%_15%,rgba(33,0,98,0.05)_0%,transparent_45%)] bg-fixed px-4 py-8 sm:px-8 lg:px-12">
        <main className="mx-auto w-full max-w-7xl rounded-3xl border border-[#f3e2cc] bg-[#fff8ee]/90 bg-[radial-gradient(circle_at_85%_85%,rgba(254,180,140,0.3)_0%,transparent_55%)] p-6 shadow-[0_25px_60px_-15px_rgba(33,0,98,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d6573c]">
            PACKAGE SETUP
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">
            Select packages for your AXI account
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 font-medium text-slate-600">
            Select one or more packages to install, or continue to AXI without
            installing a package now.
          </p>

          {pageError && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50/90 px-3.5 py-2.5 text-sm font-medium text-red-700"
            >
              {pageError}
            </p>
          )}

          {!initialized && (
            <p className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-600">
              <Loader2 size={16} className="animate-spin text-[#5c1380]" /> Preparing package
              setup...
            </p>
          )}

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                    installationInProgress ||
                    redirectLoading
                  }
                  onClick={() => void togglePackage(packageData)}
                  className={`relative flex min-h-32 items-start gap-3.5 rounded-2xl border p-5 text-left transition-all backdrop-blur-md disabled:cursor-not-allowed disabled:border-slate-200/80 disabled:bg-slate-100/60 disabled:opacity-60 ${
                    selected
                      ? "border-2 border-[#5c1380] bg-white/95 shadow-[0_10px_30px_-5px_rgba(92,19,128,0.18)] ring-2 ring-[#5c1380]/20"
                      : "border border-[#e8d7c3]/80 bg-white/80 hover:border-[#5c1380]/60 hover:bg-white shadow-2xs hover:shadow-md"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      selected
                        ? "bg-gradient-to-br from-[#210062] to-[#5c1380] text-white shadow-sm"
                        : "border border-slate-300 bg-white/90 text-transparent"
                    }`}
                  >
                    {checking ? (
                      <Loader2 size={14} className="animate-spin text-[#5c1380]" />
                    ) : selected ? (
                      <Check size={14} strokeWidth={3} />
                    ) : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-[#1E1B4B]">
                      {packageData.packageName}
                    </span>
                    <span className="mt-1 block text-xs leading-5 font-medium text-slate-600">
                      {packageData.description}
                    </span>
                    {packageMessages[packageData.packageName] && (
                      <span
                        role="status"
                        className="mt-2 block text-xs font-semibold text-amber-700 bg-amber-50/80 px-2 py-1 rounded-md border border-amber-200/60"
                      >
                        {packageMessages[packageData.packageName]}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            {selectedPackages.length > 0 && (
              <button
                type="button"
                disabled={
                  !initialized ||
                  installationInProgress ||
                  hasUnavailableSelection ||
                  redirectLoading
                }
                onClick={() => setShowConfirmation(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-[#210062]/20 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:opacity-60 disabled:shadow-none"
              >
                <PackageCheck size={17} /> INSTALL SELECTED (
                {selectedPackages.length})
              </button>
            )}
            <button
              type="button"
              disabled={installationInProgress || redirectLoading}
              onClick={continueToAxi}
              className="inline-flex items-center gap-2 rounded-xl border border-[#e8d7c3] bg-white/80 hover:bg-white px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider text-[#210062] shadow-xs transition-all hover:border-[#d6c2ab] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {redirectLoading ? "Opening AXI..." : "CONTINUE TO AXI"}
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
