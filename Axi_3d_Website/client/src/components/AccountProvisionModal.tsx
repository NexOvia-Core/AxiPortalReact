import { useState } from "react";
import { bff } from "@/lib/bff";
import { toast } from "sonner";

export default function AccountProvisionModal({
  email,
  onClose,
  sso,
}: {
  email: string;
  onClose: () => void;
  sso?: { provider: string; id: string; isEmailVerified: boolean };
}) {
  const [orgName, setOrgName] = useState("");
  const [axiAccId, setAxiAccId] = useState("");
  const [userName, setUserName] = useState(email.split("@")[0] || "");
  const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const accountId = axiAccId.trim().toUpperCase();
    if (!orgName.trim() || !accountId || !userName.trim())
      return toast.error("Complete all Account details.");
    setLoading(true);
    try {
      const availability = await bff.checkAccount(accountId);
      if (availability.success)
        throw new Error("This AXI Account ID is already in use.");
      await bff.setupAccount({
        orgName: orgName.trim(),
        email,
        axiAccId: accountId,
        userName: userName.trim(),
        nickName: userName.trim(),
        authProvider: sso?.provider || "credential",
        ssoId: sso?.id || "",
        isVerified: sso?.isEmailVerified ? "T" : "F",
      });
      const directLogin = await bff.directLogin();
      if (directLogin.redirectUrl) {
        window.location.assign(directLogin.redirectUrl);
        return;
      }
      if (directLogin.error && directLogin.error !== "UNDER_PROVISION") {
        throw new Error(
          directLogin.error === "PROVISION_FAILED"
            ? "Account provisioning failed. Please contact support."
            : directLogin.error
        );
      }
      toast.success(
        "Account provisioning has started. Check your email for account access details."
      );
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to start Account provisioning."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/70">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-7 shadow-2xl rounded-2xl space-y-4"
      >
        <h2 className="text-xl font-bold text-[#1E1B4B]">
          Complete Account Setup
        </h2>
        <input
          value={orgName}
          onChange={e => setOrgName(e.target.value)}
          placeholder="Organization name"
          className="w-full border rounded-xl p-3"
        />
        <input
          value={axiAccId}
          onChange={e => setAxiAccId(e.target.value)}
          placeholder="AXI Account ID"
          className="w-full border rounded-xl p-3"
        />
        <input
          value={userName}
          onChange={e => setUserName(e.target.value)}
          placeholder="Username"
          className="w-full border rounded-xl p-3"
        />
        <button
          disabled={loading}
          className="w-full rounded-xl bg-[#210062] py-3 text-white font-bold"
        >
          {loading ? "Starting..." : "Start Provisioning"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full text-sm text-slate-500"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
