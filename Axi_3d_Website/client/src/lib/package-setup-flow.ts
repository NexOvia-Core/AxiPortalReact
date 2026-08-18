import type { Schema } from "@/lib/bff";

const storageKey = "axi_package_setup_flow";

export type PackageSetupFlow = {
  schema: Schema;
  redirectUrl: string;
};

export function savePackageSetupFlow(flow: PackageSetupFlow) {
  sessionStorage.setItem(storageKey, JSON.stringify(flow));
}

export function readPackageSetupFlow(): PackageSetupFlow | undefined {
  try {
    const flow = JSON.parse(
      sessionStorage.getItem(storageKey) || "null"
    ) as PackageSetupFlow | null;
    if (!flow?.schema?.axiaccid || !flow.redirectUrl) return undefined;
    return flow;
  } catch {
    return undefined;
  }
}

export function clearPackageSetupFlow() {
  sessionStorage.removeItem(storageKey);
}
