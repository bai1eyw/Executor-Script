import { useExecution } from "@/hooks/use-executions";
import { useScript } from "@/hooks/use-scripts";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Loader2, Play, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExecutionTerminal } from "@/components/execution-terminal";
import NotFound from "@/pages/not-found";
import { useRunScript } from "@/hooks/use-scripts";

export default function ExecutionDetails() {
  const [, params] = useRoute("/executions/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: execution, isLoading } = useExecution(id);
  const { data: script } = useScript(execution?.scriptId || 0);
  const { mutate: runScript, isPending: isRerunning } = useRunScript();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!execution) return <NotFound />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/scripts">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Execution Details
              <span className="text-muted-foreground text-lg font-mono font-normal">#{execution.id}</span>
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Code2 className="w-4 h-4" />
              <span>{script?.name || "Unknown Script"}</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => runScript(execution.scriptId)} 
          disabled={isRerunning}
          className="shadow-lg shadow-primary/20"
        >
          <Play className="mr-2 w-4 h-4" />
          Rerun Script
        </Button>
      </div>

      <ExecutionTerminal execution={execution} />
      
      {script && (
        <div className="flex justify-end">
           <Link href={`/scripts/${script.id}/edit`}>
             <Button variant="link" className="text-muted-foreground">View Source Code</Button>
           </Link>
        </div>
      )}
    </div>
  );
}
