import { useQuery } from "@tanstack/react-query";
import { bff } from "@/lib/bff";

const terminalStatuses = new Set(["INSTALLED", "FAILED"]);

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
      const statuses = query.state.data?.map(item => item.status) ?? [];
      return statuses.length === packageNames.length &&
        statuses.every(status => terminalStatuses.has(status))
        ? false
        : 10_000;
    },
    refetchIntervalInBackground: true,
  });
}

export function isTerminalPackageStatus(status?: string) {
  return status ? terminalStatuses.has(status) : false;
}
