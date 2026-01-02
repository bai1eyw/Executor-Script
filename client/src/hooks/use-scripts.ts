import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ScriptInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useScripts() {
  return useQuery({
    queryKey: [api.scripts.list.path],
    queryFn: async () => {
      const res = await fetch(api.scripts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch scripts");
      return api.scripts.list.responses[200].parse(await res.json());
    },
  });
}

export function useScript(id: number) {
  return useQuery({
    queryKey: [api.scripts.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.scripts.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch script");
      return api.scripts.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateScript() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: ScriptInput) => {
      const res = await fetch(api.scripts.create.path, {
        method: api.scripts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.scripts.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create script");
      }
      return api.scripts.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scripts.list.path] });
      toast({ title: "Script Created", description: "Your script is ready to run." });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  });
}

export function useUpdateScript() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<ScriptInput>) => {
      const url = buildUrl(api.scripts.update.path, { id });
      const res = await fetch(url, {
        method: api.scripts.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Script not found");
        throw new Error("Failed to update script");
      }
      return api.scripts.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.scripts.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.scripts.get.path, data.id] });
      toast({ title: "Script Updated", description: "Changes saved successfully." });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  });
}

export function useDeleteScript() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.scripts.delete.path, { id });
      const res = await fetch(url, { method: api.scripts.delete.method, credentials: "include" });
      if (res.status === 404) throw new Error("Script not found");
      if (!res.ok) throw new Error("Failed to delete script");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scripts.list.path] });
      toast({ title: "Script Deleted", description: "The script has been removed." });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  });
}

export function useRunScript() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.scripts.run.path, { id });
      const res = await fetch(url, { method: api.scripts.run.method, credentials: "include" });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Script not found");
        throw new Error("Failed to start execution");
      }
      return api.scripts.run.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate executions list for this script
      queryClient.invalidateQueries({ queryKey: [api.executions.list.path.replace(':id', String(variables))] });
      toast({ title: "Execution Started", description: "Script is running in the background." });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  });
}
