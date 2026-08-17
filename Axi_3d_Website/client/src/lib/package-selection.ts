const storageKey = "axi_selected_package";

export type SelectedPackage = { packageName: string; packageVersion: string };

export function saveSelectedPackage(
  packageName: string,
  packageVersion = "latest"
) {
  sessionStorage.setItem(
    storageKey,
    JSON.stringify({ packageName, packageVersion })
  );
}

export function readSelectedPackages(): SelectedPackage[] {
  try {
    const value = JSON.parse(sessionStorage.getItem(storageKey) || "null") as
      | SelectedPackage
      | SelectedPackage[]
      | null;
    if (Array.isArray(value)) return value.slice(-1);
    return value?.packageName ? [value] : [];
  } catch {
    return [];
  }
}

export function clearSelectedPackages() {
  sessionStorage.removeItem(storageKey);
}
