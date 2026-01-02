import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useScriptExecutions(scriptId: number) {
  return useQuery({
    queryKey: [api.executions.list.path.replace(':id', String(scriptId)), scriptId],
    queryFn: async () => {
      const url = buildUrl(api.executions.list.path, { id: scriptId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch executions");
      return api.executions.list.responses[200].parse(await res.json());
    },
    enabled: !!scriptId,
    refetchInterval: 5000, // Poll list occasionally for updates
  });
}

export function useExecution(id: number) {
  return useQuery({
    queryKey: [api.executions.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.executions.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch execution details");
      return api.executions.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === 'pending' || data.status === 'running')) {
        return 2000; // Poll frequently while running
      }
      return false; // Stop polling when complete
    },
  });
}
