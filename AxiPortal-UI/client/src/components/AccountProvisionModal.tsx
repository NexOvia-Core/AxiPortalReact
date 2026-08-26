import { type ReactNode, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Building2, ChevronDown, Loader2, ShieldCheck, X } from "lucide-react";
import { bff, type Schema } from "@/lib/bff";

const countryCodes = [
  { code: "+1", country: "US/CA", iso: "us" },
  { code: "+91", country: "IN", iso: "in" },
  { code: "+44", country: "UK", iso: "gb" },
  { code: "+61", country: "AU", iso: "au" },
  { code: "+971", country: "AE", iso: "ae" },
  { code: "+65", country: "SG", iso: "sg" },
  { code: "+49", country: "DE", iso: "de" },
  { code: "+33", country: "FR", iso: "fr" },
  { code: "+81", country: "JP", iso: "jp" },
  { code: "+86", country: "CN", iso: "cn" },
  { code: "+966", country: "SA", iso: "sa" },
  { code: "+60", country: "MY", iso: "my" },
  { code: "+64", country: "NZ", iso: "nz" },
  { code: "+27", country: "ZA", iso: "za" },
  { code: "+55", country: "BR", iso: "br" },
  { code: "+52", country: "MX", iso: "mx" },
  { code: "+39", country: "IT", iso: "it" },
  { code: "+34", country: "ES", iso: "es" },
  { code: "+31", country: "NL", iso: "nl" },
  { code: "+46", country: "SE", iso: "se" },
  { code: "+41", country: "CH", iso: "ch" },
  { code: "+353", country: "IE", iso: "ie" },
  { code: "+82", country: "KR", iso: "kr" },
  { code: "+63", country: "PH", iso: "ph" },
  { code: "+62", country: "ID", iso: "id" },
  { code: "+84", country: "VN", iso: "vn" },
  { code: "+90", country: "TR", iso: "tr" },
];

const countryPhoneRules: Record<string, { digits: number[]; name: string }> = {
  "+1": { digits: [10], name: "US/Canada" },
  "+91": { digits: [10], name: "India" },
  "+44": { digits: [10, 11], name: "UK" },
  "+61": { digits: [9], name: "Australia" },
  "+971": { digits: [9], name: "UAE" },
  "+65": { digits: [8], name: "Singapore" },
  "+49": { digits: [10, 11], name: "Germany" },
  "+33": { digits: [9], name: "France" },
  "+81": { digits: [10], name: "Japan" },
  "+86": { digits: [11], name: "China" },
  "+966": { digits: [9], name: "Saudi Arabia" },
  "+60": { digits: [9, 10], name: "Malaysia" },
  "+64": { digits: [8, 9, 10], name: "New Zealand" },
  "+27": { digits: [9], name: "South Africa" },
  "+55": { digits: [10, 11], name: "Brazil" },
  "+52": { digits: [10], name: "Mexico" },
  "+39": { digits: [10], name: "Italy" },
  "+34": { digits: [9], name: "Spain" },
  "+31": { digits: [9], name: "Netherlands" },
  "+46": { digits: [7, 8, 9], name: "Sweden" },
  "+41": { digits: [9], name: "Switzerland" },
  "+353": { digits: [9], name: "Ireland" },
  "+82": { digits: [9, 10], name: "South Korea" },
  "+63": { digits: [10], name: "Philippines" },
  "+62": { digits: [9, 10, 11, 12], name: "Indonesia" },
  "+84": { digits: [9, 10], name: "Vietnam" },
  "+90": { digits: [10], name: "Turkey" },
};

const companySchema = z.object({
  userName: z
    .string()
    .trim()
    .min(1, "Username is required.")
    .min(3, "Username must be at least 3 characters.")
    .max(32, "Username cannot exceed 32 characters.")
    .regex(
      /^[A-Za-z0-9]+$/,
      "Username cannot contain special characters. Only letters and numbers are allowed."
    ),
  orgName: z
    .string()
    .trim()
    .min(1, "Organisation name is required.")
    .min(2, "Organisation name must be at least 2 characters.")
    .max(100, "Organisation name cannot exceed 100 characters.")
    .regex(
      /^[A-Za-z0-9][A-Za-z0-9 .,'&()/-]{0,99}$/,
      "Organisation name contains invalid characters."
    ),
  axiAccId: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, "AXI Account ID is required.")
    .min(5, "AXI Account ID must be at least 5 characters.")
    .max(16, "AXI Account ID cannot exceed 16 characters.")
    .regex(/^[A-Z]{5}/, "The first 5 characters must be letters.")
    .regex(/^[A-Z0-9]+$/, "Only letters and numbers are allowed."),
  country: z
    .string()
    .trim()
    .max(60, "Country cannot exceed 60 characters.")
    .regex(/^[A-Za-z\s.-]*$/, "Country can only contain letters."),
  state: z
    .string()
    .trim()
    .max(50, "State / Province cannot exceed 50 characters.")
    .regex(/^[A-Za-z\s.-]*$/, "State / Province can only contain letters."),
  contactPersonName: z
    .string()
    .trim()
    .max(50, "Contact person cannot exceed 50 characters.")
    .regex(/^[A-Za-z\s.-]*$/, "Contact person can only contain letters."),
  taxNo: z
    .string()
    .trim()
    .max(30, "Tax No. cannot exceed 30 characters.")
    .regex(
      /^[A-Za-z0-9\s-]*$/,
      "Tax No. can only contain letters, numbers, and hyphens."
    ),
  mobileNo: z
    .string()
    .trim()
    .regex(/^[0-9]*$/, "Mobile number must contain digits only."),
  address: z
    .string()
    .trim()
    .max(500, "Address cannot exceed 500 characters.")
    .regex(
      /^[A-Za-z0-9 .,#/'-]*$/,
      "Special characters (*, $, %, ^, &, +, =, <, >) are not allowed in Address."
    ),
});

type CompanyForm = z.infer<typeof companySchema>;

export default function AccountProvisionModal({
  email,
  onClose,
  onProvisioningStarted,
  sso,
}: {
  email: string;
  onClose: () => void;
  onProvisioningStarted: (schema: Schema) => void;
  sso?: { provider: string; id: string; isEmailVerified: boolean };
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [selectedIso, setSelectedIso] = useState("us");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const form = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      userName: (email.split("@")[0] || "").replace(/[^A-Za-z0-9]/g, ""),
      orgName: "",
      axiAccId: "",
      country: "",
      state: "",
      address: "",
      contactPersonName: "",
      taxNo: "",
      mobileNo: "",
    },
  });

  const validateMobile = (mobile: string, code: string): string => {
    const trimmed = mobile.trim();
    if (!trimmed) return "";
    if (!/^[0-9]+$/.test(trimmed)) {
      return "Mobile number must contain digits only.";
    }
    const rule = countryPhoneRules[code];
    if (rule) {
      if (!rule.digits.includes(trimmed.length)) {
        const expected = rule.digits.join(" or ");
        return `Mobile number must be ${expected} digits for ${rule.name}.`;
      }
    } else if (trimmed.length < 7 || trimmed.length > 15) {
      return "Mobile number must be between 7 and 15 digits.";
    }
    return "";
  };

  const values = form.watch();
  const userNameVal = values.userName?.trim() || "";
  const orgNameVal = values.orgName?.trim() || "";
  const axiAccIdVal = values.axiAccId?.trim() || "";
  const currentMobileVal = values.mobileNo?.trim() || "";
  const mobileCustomError = validateMobile(currentMobileVal, countryCode);

  const hasFormErrors = Object.keys(form.formState.errors).length > 0;

  const isFormValid =
    userNameVal.length >= 3 &&
    /^[A-Za-z0-9]+$/.test(userNameVal) &&
    orgNameVal.length >= 2 &&
    /^[A-Za-z0-9][A-Za-z0-9 .,'&()/-]{0,99}$/.test(orgNameVal) &&
    axiAccIdVal.length >= 5 &&
    /^[A-Z]{5}/.test(axiAccIdVal) &&
    /^[A-Z0-9]+$/.test(axiAccIdVal) &&
    !mobileCustomError &&
    !hasFormErrors;

  const submit = form.handleSubmit(async values => {
    setLoading(true);
    setError("");
    try {
      const accountId = values.axiAccId.toUpperCase();
      const availability = await bff.checkAccount(accountId);
      if (availability.success || availability.Success)
        throw new Error(
          "This AXI Account ID is already in use. Please choose a different ID."
        );

      const fullMobileNo = values.mobileNo
        ? `${countryCode} ${values.mobileNo}`
        : "";

      await bff.setupAccount({
        ...values,
        mobileNo: fullMobileNo,
        axiAccId: accountId,
        email,
        nickName: values.userName,
        authProvider: sso?.provider || "credential",
        ssoId: sso?.id || "",
        isVerified: sso?.isEmailVerified ? "T" : "F",
      });
      form.reset();
      onProvisioningStarted({
        axiaccid: accountId,
        username: values.userName,
        email,
        isprimary: "T",
        isverified: "T",
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to start account provisioning."
      );
    } finally {
      setLoading(false);
    }
  });

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-[#fff8ee]/55 backdrop-blur-lg p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="company-details-title"
    >
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#f3e2cc] bg-[#fff8ee] bg-[radial-gradient(circle_at_85%_85%,rgba(254,180,140,0.35)_0%,transparent_55%)] p-5 text-slate-800 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 bg-white/80 border border-white/80 transition hover:bg-white hover:text-slate-700 shadow-2xs"
          aria-label="Close company details"
        >
          <X size={18} />
        </button>
        <form onSubmit={submit} noValidate>
          <div className="pr-9">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#210062] to-[#5c1380] text-white shadow-md shadow-[#210062]/20">
              <Building2 size={21} />
            </div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d6573c]">
              Account setup
            </p>
            <h2
              id="company-details-title"
              className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text"
            >
              Company details
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 font-medium">
              Enter the details for your AXI organization. Your account will be
              prepared after you continue.
            </p>
          </div>
          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50/90 px-3.5 py-2.5 text-sm text-red-700 font-medium"
            >
              {error}
            </p>
          )}
          <div className="mt-7 border-t border-[#e8d7c3] pt-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ShieldCheck size={16} className="text-[#5c1380]" />
              Organization profile
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              <Field
                label="Username"
                required
                error={form.formState.errors.userName?.message}
              >
                <input
                  {...form.register("userName")}
                  autoComplete="username"
                  placeholder="Enter username"
                />
              </Field>
              <Field
                label="Organisation name"
                required
                error={form.formState.errors.orgName?.message}
              >
                <input
                  {...form.register("orgName")}
                  placeholder="Enter organization name"
                />
              </Field>
              <Field
                label="AXI Account ID"
                required
                error={form.formState.errors.axiAccId?.message}
              >
                <input
                  {...form.register("axiAccId", {
                    onChange: e => {
                      const cleaned = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "");
                      form.setValue("axiAccId", cleaned, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    },
                  })}
                  maxLength={16}
                  placeholder="e.g. ACME01"
                />
              </Field>
              <Field
                label="Country"
                error={form.formState.errors.country?.message}
              >
                <input
                  {...form.register("country")}
                  placeholder="Enter country"
                />
              </Field>
              <Field
                label="State / Province"
                error={form.formState.errors.state?.message}
              >
                <input
                  {...form.register("state")}
                  placeholder="Enter state or province"
                />
              </Field>
              <Field
                label="Contact person"
                error={form.formState.errors.contactPersonName?.message}
              >
                <input
                  {...form.register("contactPersonName")}
                  placeholder="Enter contact person name"
                />
              </Field>
              <Field
                label="Tax No. (GST / VAT)"
                error={form.formState.errors.taxNo?.message}
              >
                <input
                  {...form.register("taxNo")}
                  placeholder="Enter Tax / GST No. (optional)"
                />
              </Field>

              {/* Mobile Number Section with Country Flag SVG Selector */}
              <Field
                label="Mobile number"
                error={
                  form.formState.errors.mobileNo?.message ||
                  (form.formState.touchedFields.mobileNo ? mobileCustomError : "")
                }
              >
                <div className="flex items-center gap-2">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(prev => !prev)}
                      className="flex h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-[#FAF8F5] px-2.5 text-xs font-bold text-slate-700 outline-none transition hover:border-[#5c1380]/60 focus:border-[#5c1380] focus:bg-white focus:ring-2 focus:ring-[#5c1380]/20 shrink-0 cursor-pointer"
                    >
                      <img
                        src={`/flags/${selectedIso}.svg`}
                        alt={selectedIso}
                        className="h-3.5 w-5 object-cover rounded-[2px] shadow-2xs"
                      />
                      <span>{countryCode}</span>
                      <ChevronDown size={14} className="text-slate-400" />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute left-0 top-full z-50 mt-1 max-h-52 w-48 overflow-y-auto rounded-xl border border-[#e8d7c3] bg-white p-1.5 shadow-xl space-y-0.5">
                        {countryCodes.map(c => (
                          <button
                            key={c.code + c.iso}
                            type="button"
                            onClick={() => {
                              setCountryCode(c.code);
                              setSelectedIso(c.iso);
                              setDropdownOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                              selectedIso === c.iso
                                ? "bg-[#5c1380]/10 text-[#5c1380] font-bold"
                                : "text-slate-700 hover:bg-[#fff8ee]"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={`/flags/${c.iso}.svg`}
                                alt={c.country}
                                className="h-3.5 w-5 object-cover rounded-[2px] shadow-2xs"
                              />
                              <span>{c.code}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {c.country}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    {...form.register("mobileNo", {
                      onChange: e => {
                        const cleaned = e.target.value.replace(/[^0-9]/g, "");
                        form.setValue("mobileNo", cleaned, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      },
                    })}
                    inputMode="tel"
                    placeholder="Enter mobile number"
                  />
                </div>
              </Field>

              <Field
                label="Address"
                error={form.formState.errors.address?.message}
                className="sm:col-span-2"
              >
                <input
                  {...form.register("address")}
                  placeholder="Enter address (optional)"
                />
              </Field>
            </div>
          </div>

          {/* Continue Button: Dim & Non-Clickable until Username, Organisation Name, and Axi Account ID are valid, then Bright & Clickable */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white transition-all ${
              isFormValid && !loading
                ? "bg-gradient-to-r from-[#210062] via-[#5c1380] to-[#d6573c] shadow-lg shadow-[#210062]/20 hover:opacity-95 active:scale-[0.99] cursor-pointer"
                : "bg-slate-300 opacity-60 cursor-not-allowed shadow-none text-slate-500"
            }`}
          >
            {loading && <Loader2 size={16} className="animate-spin" />} Continue
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  required = false,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500 font-bold">*</span>}
      </span>
      <div
        className={`[&_input]:w-full [&_input]:rounded-xl [&_input]:border ${
          error
            ? "[&_input]:border-red-400 [&_input]:bg-red-50/30 [&_input]:focus:ring-red-400/20 [&_input]:focus:border-red-500"
            : "[&_input]:border-slate-200 [&_input]:bg-[#FAF8F5] [&_input]:focus:border-[#5c1380] [&_input]:focus:ring-[#5c1380]/20"
        } [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-sm [&_input]:text-slate-800 [&_input]:outline-none [&_input]:transition [&_input]:placeholder:text-slate-400 [&_input]:focus:bg-white [&_input]:focus:ring-2`}
      >
        {children}
      </div>
      <span className="mt-1 block min-h-4 text-[11px] font-normal text-red-600">
        {error || ""}
      </span>
    </label>
  );
}
