import SignupPackagesPage from "@/components/SignupPackagesPage";
import {
  clearPackageSetupFlow,
  readPackageSetupFlow,
} from "@/lib/package-setup-flow";

export default function PackageSetup() {
  const flow = readPackageSetupFlow();

  if (!flow) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 text-sm text-slate-600 shadow-sm sm:p-10">
          Your package setup session has expired. Return to the portal and sign
          in again.
        </div>
      </main>
    );
  }

  return (
    <SignupPackagesPage
      schema={flow.schema}
      redirectUrl={flow.redirectUrl}
      onContinue={() => {
        clearPackageSetupFlow();
      }}
    />
  );
}
