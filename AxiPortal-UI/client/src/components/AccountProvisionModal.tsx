import { type ReactNode, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Building2, Loader2, ShieldCheck, X } from "lucide-react";
import { bff, type Schema } from "@/lib/bff";

const companySchema = z.object({
  userName: z
    .string()
    .trim()
    .min(1, "Username is required.")
    .min(3, "Username must be at least 3 characters.")
    .max(32, "Username cannot exceed 32 characters.")
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Username can only contain letters, numbers, '_' and '-'."
    ),
  orgName: z
    .string()
    .trim()
    .min(1, "Organization name is required.")
    .min(2, "Organization name must be at least 2 characters.")
    .max(100, "Organization name cannot exceed 100 characters.")
    .regex(
      /^[A-Za-z0-9][A-Za-z0-9 .,'&()/-]{1,99}$/,
      "Organization name contains invalid characters."
    ),
  axiAccId: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, "Axi Account ID is required.")
    .min(5, "Axi Account ID must be at least 5 characters.")
    .max(16, "Axi Account ID cannot exceed 16 characters.")
    .regex(/^[A-Z]{5}/, "The first 5 characters must be letters.")
    .regex(/^[A-Z0-9]+$/, "Only letters and numbers are allowed."),
  country: z.string().trim().max(60),
  state: z.string().trim().max(50),
  address: z.string().trim().max(500),
  contactPersonName: z.string().trim().max(50),
  taxNo: z.string().trim().max(30),
  mobileNo: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,20}$|^$/, "Please enter a valid mobile number."),
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
      className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-950/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="company-details-title"
    >
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close company details"
        >
          <X size={18} />
        </button>
        <form onSubmit={submit} noValidate>
          <div className="pr-9">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#210062] text-white shadow-sm">
              <Building2 size={21} />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5c1380]">
              Account setup
            </p>
            <h2
              id="company-details-title"
              className="mt-1 text-2xl font-bold tracking-tight text-[#210062]"
            >
              Company details
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Enter the details for your AXI organization. Your account will be
              prepared after you continue.
            </p>
          </div>
          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <div className="mt-7 border-t border-slate-100 pt-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ShieldCheck size={16} className="text-[#5c1380]" />
              Organization profile
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
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
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#210062] px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-[#210062]/20 transition hover:bg-[#3a087d] disabled:cursor-not-allowed disabled:opacity-50"
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
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label}
      </span>
      <div className="[&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-slate-200 [&_input]:bg-[#FAF8F5] [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-sm [&_input]:text-slate-800 [&_input]:outline-none [&_input]:transition [&_input]:placeholder:text-slate-400 [&_input]:focus:border-[#5c1380] [&_input]:focus:bg-white [&_input]:focus:ring-2 [&_input]:focus:ring-[#5c1380]/20">
        {children}
      </div>
      <span className="mt-1.5 block min-h-4 text-xs text-red-600">{error}</span>
    </label>
  );
}
