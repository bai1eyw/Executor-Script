import { ScriptForm } from "@/components/script-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { useScript } from "@/hooks/use-scripts";
import NotFound from "@/pages/not-found";

export default function EditScript() {
  const [, params] = useRoute("/scripts/:id/edit");
  const id = params?.id ? parseInt(params.id) : 0;
  const { data: script, isLoading, error } = useScript(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading script...</p>
      </div>
    );
  }

  if (error || !script) {
    return <NotFound />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/scripts">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Script</h1>
          <p className="text-muted-foreground">Modifying <span className="font-mono text-primary">{script.name}</span></p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
        <ScriptForm script={script} />
      </div>
    </div>
  );
}
