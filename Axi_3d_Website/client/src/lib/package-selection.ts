const storageKey = "axi_selected_packages";

export type SelectedPackage = { packageName: string; packageVersion: string };

export function saveSelectedPackage(
  packageName: string,
  packageVersion = "latest"
) {
  const current = readSelectedPackages().filter(
    item => item.packageName !== packageName
  );
  sessionStorage.setItem(
    storageKey,
    JSON.stringify([...current, { packageName, packageVersion }])
  );
}

export function readSelectedPackages(): SelectedPackage[] {
  try {
    const value = JSON.parse(
      sessionStorage.getItem(storageKey) || "[]"
    ) as SelectedPackage[];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function clearSelectedPackages() {
  sessionStorage.removeItem(storageKey);
}
