import SignupPackagesPage from "@/components/SignupPackagesPage";
import {
  clearPackageSetupFlow,
  readPackageSetupFlow,
} from "@/lib/package-setup-flow";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function PackageSetup() {
  const flow = readPackageSetupFlow();
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  if (!flow) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 text-sm text-slate-600 shadow-sm sm:p-10">
          Your package setup session has expired. Return to the portal and sign
          in again.
          <Button
            onClick={handleGoHome}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ml-4"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
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
