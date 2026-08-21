import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { bff } from "@/lib/bff";
import type { PackageProgress } from "@/lib/bff";

const terminalStatuses = new Set(["INSTALLED", "FAILED"]);
const pollInterval = Math.max(
  1_000,
  Number(import.meta.env.VITE_PACKAGE_POLL_INTERVAL_MS) || 10_000
);

export function usePackageProgress(
  schemaName: string,
  username: string,
  packageNames: string[],
  enabled: boolean,
  attempt: string
) {
  const packageSignature = packageNames.join("|");
  const uniquePackageNames = useMemo(
    () => Array.from(new Set(packageNames)),
    [packageSignature]
  );
  const [progressByPackage, setProgressByPackage] = useState<
    Record<string, PackageProgress>
  >({});

  useEffect(() => {
    setProgressByPackage({});
  }, [schemaName, username, packageSignature, attempt]);

  const pendingPackageNames = uniquePackageNames.filter(
    packageName =>
      !isTerminalPackageStatus(progressByPackage[packageName]?.status)
  );
  const pendingPackageSignature = pendingPackageNames.join("|");

  const query = useQuery({
    queryKey: [
      "package-progress",
      schemaName,
      username,
      pendingPackageSignature,
      attempt,
    ],
    queryFn: () =>
      bff.packageProgress(schemaName, username, pendingPackageNames),
    enabled: enabled && pendingPackageNames.length > 0,
    refetchInterval:
      enabled && pendingPackageNames.length > 0 ? pollInterval : false,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (!query.data?.length) return;
    setProgressByPackage(current => {
      const next = { ...current };
      query.data.forEach(item => {
        if (uniquePackageNames.includes(item.packageName))
          next[item.packageName] = item;
      });
      return next;
    });
  }, [query.data, uniquePackageNames]);

  return {
    ...query,
    data: uniquePackageNames
      .map(packageName => progressByPackage[packageName])
      .filter((item): item is PackageProgress => Boolean(item)),
  };
}

export function isTerminalPackageStatus(status?: string) {
  return status ? terminalStatuses.has(status) : false;
}
