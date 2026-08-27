import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  DollarSign,
  Layers,
  Loader2,
  Package,
  PackageCheck,
  PieChart,
  Receipt,
  ShoppingCart,
  Sparkles,
  Users,
  Wallet,
  X,
} from "lucide-react";
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

const packageThemeStyles: Record<
  string,
  {
    bg: string;
    borderUnselected: string;
    borderSelected: string;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
    icon: typeof Package;
  }
> = {
  "Procure to Pay": {
    bg: "bg-gradient-to-br from-[#FFF9F5] via-[#FFF3EC] to-[#FFE7D9]",
    borderUnselected:
      "border-[#FDBA74]/60 shadow-[0_4px_16px_rgba(251,146,60,0.12)]",
    borderSelected:
      "border-2 border-[#EA580C] ring-4 ring-[#EA580C]/20 shadow-[0_10px_25px_rgba(234,88,12,0.25)]",
    iconBg: "bg-gradient-to-br from-[#FFEDD5] to-[#FED7AA]",
    iconColor: "text-[#EA580C]",
    badgeBg: "bg-[#FFEDD5]",
    badgeText: "text-[#EA580C]",
    icon: ShoppingCart,
  },
  "Order to Cash": {
    bg: "bg-gradient-to-br from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]",
    borderUnselected:
      "border-[#86EFAC]/60 shadow-[0_4px_16px_rgba(34,197,94,0.12)]",
    borderSelected:
      "border-2 border-[#16A34A] ring-4 ring-[#16A34A]/20 shadow-[0_10px_25px_rgba(22,163,74,0.25)]",
    iconBg: "bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0]",
    iconColor: "text-[#16A34A]",
    badgeBg: "bg-[#DCFCE7]",
    badgeText: "text-[#16A34A]",
    icon: DollarSign,
  },
  "Inventory Control": {
    bg: "bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#E9D5FF]",
    borderUnselected:
      "border-[#D8B4FE]/60 shadow-[0_4px_16px_rgba(168,85,247,0.12)]",
    borderSelected:
      "border-2 border-[#9333EA] ring-4 ring-[#9333EA]/20 shadow-[0_10px_25px_rgba(147,51,234,0.25)]",
    iconBg: "bg-gradient-to-br from-[#F3E8FF] to-[#E9D5FF]",
    iconColor: "text-[#9333EA]",
    badgeBg: "bg-[#F3E8FF]",
    badgeText: "text-[#9333EA]",
    icon: Package,
  },
  "Financial accounting": {
    bg: "bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD]",
    borderUnselected:
      "border-[#7DD3FC]/60 shadow-[0_4px_16px_rgba(14,165,233,0.12)]",
    borderSelected:
      "border-2 border-[#0284C7] ring-4 ring-[#0284C7]/20 shadow-[0_10px_25px_rgba(2,132,199,0.25)]",
    iconBg: "bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD]",
    iconColor: "text-[#0284C7]",
    badgeBg: "bg-[#E0F2FE]",
    badgeText: "text-[#0284C7]",
    icon: PieChart,
  },
  "Account Payable": {
    bg: "bg-gradient-to-br from-[#FFF1F2] via-[#FFE4E6] to-[#FECDD3]",
    borderUnselected:
      "border-[#FDA4AF]/60 shadow-[0_4px_16px_rgba(244,63,94,0.12)]",
    borderSelected:
      "border-2 border-[#E11D48] ring-4 ring-[#E11D48]/20 shadow-[0_10px_25px_rgba(225,29,72,0.25)]",
    iconBg: "bg-gradient-to-br from-[#FFE4E6] to-[#FECDD3]",
    iconColor: "text-[#E11D48]",
    badgeBg: "bg-[#FFE4E6]",
    badgeText: "text-[#E11D48]",
    icon: Wallet,
  },
  "Account Receivable": {
    bg: "bg-gradient-to-br from-[#F0FDFA] via-[#CCFBF1] to-[#99F6E4]",
    borderUnselected:
      "border-[#5EEAD4]/60 shadow-[0_4px_16px_rgba(20,184,166,0.12)]",
    borderSelected:
      "border-2 border-[#0D9488] ring-4 ring-[#0D9488]/20 shadow-[0_10px_25px_rgba(13,148,136,0.25)]",
    iconBg: "bg-gradient-to-br from-[#CCFBF1] to-[#99F6E4]",
    iconColor: "text-[#0D9488]",
    badgeBg: "bg-[#CCFBF1]",
    badgeText: "text-[#0D9488]",
    icon: Receipt,
  },
  AxiPayroll: {
    bg: "bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#C7D2FE]",
    borderUnselected:
      "border-[#A5B4FC]/60 shadow-[0_4px_16px_rgba(99,102,241,0.12)]",
    borderSelected:
      "border-2 border-[#4338CA] ring-4 ring-[#4338CA]/20 shadow-[0_10px_25px_rgba(67,56,202,0.25)]",
    iconBg: "bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE]",
    iconColor: "text-[#4338CA]",
    badgeBg: "bg-[#E0E7FF]",
    badgeText: "text-[#4338CA]",
    icon: Users,
  },
  ERP: {
    bg: "bg-gradient-to-br from-[#FFF5F3] via-[#FFE8E2] to-[#FFD5C8]",
    borderUnselected:
      "border-[#FFB29D]/60 shadow-[0_4px_16px_rgba(214,87,60,0.12)]",
    borderSelected:
      "border-2 border-[#D6573C] ring-4 ring-[#D6573C]/20 shadow-[0_10px_25px_rgba(214,87,60,0.25)]",
    iconBg: "bg-gradient-to-br from-[#FFE8E2] to-[#FFD5C8]",
    iconColor: "text-[#D6573C]",
    badgeBg: "bg-[#FFE8E2]",
    badgeText: "text-[#D6573C]",
    icon: Layers,
  },
};

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
      setShowConfirmation(false);
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
      <div className="min-h-screen bg-[#fff8ee] bg-[radial-gradient(circle_at_85%_85%,rgba(254,180,140,0.4)_0%,rgba(255,248,238,0)_55%),radial-gradient(circle_at_15%_15%,rgba(33,0,98,0.05)_0%,transparent_45%)] bg-fixed px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <main className="mx-auto w-full max-w-7xl rounded-3xl border border-[#f3e2cc] bg-[#fff8ee]/90 bg-[radial-gradient(circle_at_85%_85%,rgba(254,180,140,0.25)_0%,transparent_55%)] p-4 shadow-[0_20px_50px_-15px_rgba(33,0,98,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-2xl sm:p-6 lg:p-7">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d6573c]">
                PACKAGE SETUP
              </p>
              <h1 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight gradient-text">
                Select packages for your AXI account
              </h1>
              <p className="mt-1.5 max-w-xl text-xs sm:text-sm leading-5 font-medium text-slate-600">
                Select one or more packages to install, or continue to AXI without
                installing a package now.
              </p>
            </div>

            {schema?.axiaccid && (
              <div className="inline-flex items-center gap-2.5 self-start sm:self-auto rounded-2xl border border-[#e8d7c3] bg-white/90 px-3.5 py-2 shadow-2xs backdrop-blur-md shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#210062] via-[#5c1380] to-[#210062] text-white shadow-xs">
                  <Sparkles size={15} className="text-amber-300" />
                </div>
                <div className="leading-tight">
                  <span className="block text-[10px] font-extrabold tracking-wider uppercase text-[#d6573c]">
                    WELCOME TO AXI
                  </span>
                  <span className="block text-xs sm:text-sm font-extrabold text-[#1E1B4B]">
                    {schema.axiaccid}
                  </span>
                </div>
              </div>
            )}
          </div>

          {pageError && (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-red-200 bg-red-50/90 px-3 py-2 text-xs font-normal text-red-700"
            >
              {pageError}
            </p>
          )}

          {!initialized && (
            <p className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600">
              <Loader2 size={14} className="animate-spin text-[#5c1380]" /> Preparing package
              setup...
            </p>
          )}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {packageCatalog.map(packageData => {
              const selected = selectedPackages.some(
                item => item.packageName === packageData.packageName
              );
              const checking = checkingPackage === packageData.packageName;
              const style = packageThemeStyles[packageData.packageName] || {
                bg: "bg-gradient-to-br from-white via-slate-50 to-slate-100",
                borderUnselected: "border-slate-200/80 shadow-xs",
                borderSelected:
                  "border-2 border-[#5c1380] ring-4 ring-[#5c1380]/20 shadow-md",
                iconBg: "bg-gradient-to-br from-purple-100 to-purple-200",
                iconColor: "text-[#5c1380]",
                badgeBg: "bg-purple-100",
                badgeText: "text-[#5c1380]",
                icon: Package,
              };
              const IconComponent = style.icon;

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
                  className={`relative flex min-h-[105px] flex-col justify-between rounded-2xl ${style.bg} p-3.5 text-left transition-all duration-300 backdrop-blur-md disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none disabled:select-none ${
                    selected
                      ? `${style.borderSelected} scale-[1.02]`
                      : `${style.borderUnselected} hover:scale-[1.01] hover:shadow-lg`
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* 3D Colored Icon Circle */}
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${style.iconBg} ${style.iconColor} shadow-xs`}
                    >
                      {checking ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <IconComponent size={18} />
                      )}
                    </div>

                    {/* Top Right Status Badge / Selection Check */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase transition-all ${
                        selected
                          ? "bg-[#210062] text-white shadow-xs"
                          : `${style.badgeBg} ${style.badgeText}`
                      }`}
                    >
                      {selected ? (
                        <>
                          <Check size={11} strokeWidth={3} /> SELECTED
                        </>
                      ) : (
                        <>
                          <Sparkles size={10} /> READY
                        </>
                      )}
                    </span>
                  </div>

                  <div className="mt-2 min-w-0">
                    <span className="block text-sm font-extrabold text-[#1E1B4B]">
                      {packageData.packageName}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-4 font-semibold text-slate-600 line-clamp-2">
                      {packageData.description}
                    </span>
                    {packageMessages[packageData.packageName] && (
                      <span
                        role="status"
                        className="mt-1 block text-[10px] font-normal text-amber-700 bg-amber-50/90 px-1.5 py-0.5 rounded border border-amber-200/80"
                      >
                        {packageMessages[packageData.packageName]}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
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
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] px-5 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-[#210062]/20 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:opacity-50 disabled:pointer-events-none disabled:select-none disabled:shadow-none"
              >
                <PackageCheck size={16} /> INSTALL SELECTED (
                {selectedPackages.length})
              </button>
            )}
            <button
              type="button"
              disabled={installationInProgress || redirectLoading}
              onClick={continueToAxi}
              className="inline-flex items-center gap-2 rounded-xl border border-[#e8d7c3] bg-white/80 hover:bg-white px-5 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#210062] shadow-xs transition-all hover:border-[#d6c2ab] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none disabled:select-none"
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
          onClose={() => {
            setShowConfirmation(false);
            setSelectedPackages([]);
            clearSelectedPackages();
          }}
          onInstallationStateChange={setInstallationInProgress}
        />
      )}
    </>
  );
}
