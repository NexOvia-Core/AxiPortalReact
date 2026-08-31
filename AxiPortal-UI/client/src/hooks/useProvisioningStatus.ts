import { useQuery } from "@tanstack/react-query";
import { bff } from "@/lib/bff";

const defaultPollIntervalMs = 5_000;

function provisioningPollIntervalMs() {
  const configured = Number(import.meta.env.VITE_PROVISION_POLL_INTERVAL_MS);
  return Number.isFinite(configured) && configured >= 1_000
    ? configured
    : defaultPollIntervalMs;
}

export function useProvisioningStatus(enabled: boolean) {
  return useQuery({
    queryKey: ["provisioning-status"],
    queryFn: () => bff.provisioningStatus(),
    enabled,
    retry: false,
    refetchInterval: query => {
      if (query.state.error) return false;

      const result = query.state.data;
      return result?.success || result?.error === "PROVISION_FAILED"
        ? false
        : provisioningPollIntervalMs();
    },
    refetchIntervalInBackground: true,
    staleTime: 0,
  });
}
