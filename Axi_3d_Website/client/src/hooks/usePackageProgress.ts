import { useQuery } from "@tanstack/react-query";
import { bff } from "@/lib/bff";

const terminalStatuses = new Set(["INSTALLED", "FAILED"]);
const pollInterval = Math.max(
  1_000,
  Number(import.meta.env.VITE_PACKAGE_POLL_INTERVAL_MS) || 10_000
);

export function usePackageProgress(
  schemaName: string,
  username: string,
  packageNames: string[],
  enabled: boolean
) {
  return useQuery({
    queryKey: ["package-progress", schemaName, username, packageNames],
    queryFn: () => bff.packageProgress(schemaName, username, packageNames),
    enabled: enabled && packageNames.length > 0,
    refetchInterval: query => {
      const items = Array.isArray(query.state.data) ? query.state.data : [];
      const statuses = items.map(item => item.status);
      return statuses.length === packageNames.length &&
        statuses.every(status => terminalStatuses.has(status))
        ? false
        : pollInterval;
    },
    refetchIntervalInBackground: true,
  });
}

export function isTerminalPackageStatus(status?: string) {
  return status ? terminalStatuses.has(status) : false;
}
