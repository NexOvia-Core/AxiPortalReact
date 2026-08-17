import { type ReactNode, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, X } from "lucide-react";
import { bff } from "@/lib/bff";

const companySchema = z.object({
  userName: z
    .string()
    .trim()
    .min(3, "Username must contain at least 3 characters.")
    .max(32)
    .regex(
      /^[A-Za-z0-9_.-]+$/,
      "Use letters, numbers, periods, underscores, or hyphens."
    ),
  orgName: z.string().trim().min(2, "Organisation name is required.").max(100),
  axiAccId: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[A-Z]{5}[A-Z0-9]{0,11}$/,
      "Use 5-16 characters, beginning with five letters."
    ),
  country: z.string().trim().max(60),
  state: z.string().trim().max(50),
  address: z.string().trim().max(500),
  contactPersonName: z.string().trim().max(50),
  taxNo: z.string().trim().max(30),
  mobileNo: z.string().trim().max(20),
});

type CompanyForm = z.infer<typeof companySchema>;

export default function AccountProvisionModal({
  email,
  onClose,
  sso,
}: {
  email: string;
  onClose: () => void;
  sso?: { provider: string; id: string; isEmailVerified: boolean };
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [provisioned, setProvisioned] = useState(false);
  const form = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      userName: email.split("@")[0] || "",
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
      await bff.setupAccount({
        ...values,
        axiAccId: accountId,
        email,
        nickName: values.userName,
        authProvider: sso?.provider || "credential",
        ssoId: sso?.id || "",
        isVerified: sso?.isEmailVerified ? "T" : "F",
      });
      form.reset();
      setProvisioned(true);
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

  const directLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await bff.directLogin();
      if (result.redirectUrl) {
        window.location.assign(result.redirectUrl);
        return;
      }
      if (result.error === "UNDER_PROVISION") {
        setError(
          "Your account is still being provisioned. Use the secure link from your account email once it is ready."
        );
        return;
      }
      throw new Error(
        result.error === "PROVISION_FAILED"
          ? "Account provisioning failed. Please contact support."
          : "A direct login link is not available yet."
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to start direct login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-950/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="company-details-title"
    >
      <div className="relative max-h-[92vh] w-full max-w-[550px] overflow-y-auto rounded-lg bg-[#210062] p-6 text-white shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-white/70 hover:text-white"
          aria-label="Close company details"
        >
          <X size={18} />
        </button>
        <img
          src="/AXI_LOGO_AXPERT.png"
          alt="Axi"
          className="mx-auto mb-5 h-9 object-contain brightness-0 invert"
        />
        {provisioned ? (
          <div className="text-center">
            <h2 id="company-details-title" className="text-2xl font-bold">
              Your account is being prepared
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/80">
              We have started provisioning your AXI account. Account details and
              a secure login link will be sent to {email}.
            </p>
            {error && (
              <p
                role="alert"
                className="mt-5 rounded border border-red-300/60 bg-red-950/30 px-3 py-2 text-sm text-red-100"
              >
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={directLogin}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#d6573c] px-5 py-3 font-bold uppercase tracking-wide disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />} Login
              to AXI
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 text-sm text-white/75 underline hover:text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2
              id="company-details-title"
              className="text-center text-2xl font-bold"
            >
              Company details
            </h2>
            <p className="mt-2 text-center text-sm text-white/75">
              Complete your account setup.
            </p>
            {error && (
              <p
                role="alert"
                className="mt-5 rounded border border-red-300/60 bg-red-950/30 px-3 py-2 text-sm text-red-100"
              >
                {error}
              </p>
            )}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label="Username"
                error={form.formState.errors.userName?.message}
              >
                <input {...form.register("userName")} autoComplete="username" />
              </Field>
              <Field
                label="Organisation name"
                error={form.formState.errors.orgName?.message}
              >
                <input {...form.register("orgName")} />
              </Field>
              <Field
                label="AXI Account ID"
                error={form.formState.errors.axiAccId?.message}
              >
                <input
                  {...form.register("axiAccId", {
                    onChange: event => {
                      event.target.value = event.target.value.toUpperCase();
                    },
                  })}
                  maxLength={16}
                />
              </Field>
              <Field
                label="Country"
                error={form.formState.errors.country?.message}
              >
                <input {...form.register("country")} />
              </Field>
              <Field
                label="State / Province"
                error={form.formState.errors.state?.message}
              >
                <input {...form.register("state")} />
              </Field>
              <Field
                label="Contact person"
                error={form.formState.errors.contactPersonName?.message}
              >
                <input {...form.register("contactPersonName")} />
              </Field>
              <Field
                label="Tax No. (GST / VAT)"
                error={form.formState.errors.taxNo?.message}
              >
                <input {...form.register("taxNo")} />
              </Field>
              <Field
                label="Mobile number"
                error={form.formState.errors.mobileNo?.message}
              >
                <input {...form.register("mobileNo")} inputMode="tel" />
              </Field>
              <Field
                label="Address"
                error={form.formState.errors.address?.message}
                className="sm:col-span-2"
              >
                <input {...form.register("address")} />
              </Field>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#d6573c] px-5 py-3 font-bold uppercase tracking-wide disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}{" "}
              Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-white/80">
        {label}
      </span>
      {children}
      <span className="mt-1 block min-h-4 text-xs text-red-200">{error}</span>
    </label>
  );
}
