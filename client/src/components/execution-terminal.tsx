import { useEffect, useRef } from "react";
import { Loader2, CheckCircle2, XCircle, Terminal } from "lucide-react";
import { type Execution } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ExecutionTerminalProps {
  execution: Execution;
}

export function ExecutionTerminal({ execution }: ExecutionTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [execution.output]);

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    running: "bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    failed: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const StatusIcon = {
    pending: Loader2,
    running: Loader2,
    completed: CheckCircle2,
    failed: XCircle,
  }[execution.status] || Loader2;

  return (
    <div className="w-full flex flex-col h-[600px] rounded-xl overflow-hidden border border-border bg-[#0d1117] shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-border">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-mono text-muted-foreground">Execution #{execution.id}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground font-mono">
             Started: {execution.startedAt ? format(new Date(execution.startedAt), "HH:mm:ss") : "--:--:--"}
          </span>
          <Badge variant="outline" className={`gap-1.5 ${statusColors[execution.status as keyof typeof statusColors]}`}>
            <StatusIcon className={`w-3.5 h-3.5 ${execution.status === 'running' || execution.status === 'pending' ? 'animate-spin' : ''}`} />
            <span className="uppercase text-[10px] tracking-wider font-bold">{execution.status}</span>
          </Badge>
        </div>
      </div>

      {/* Terminal Content */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 font-mono text-sm leading-6 relative">
        {execution.output ? (
          <pre className="whitespace-pre-wrap break-words text-gray-300">
            {execution.output}
          </pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30 gap-2">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span>Waiting for output stream...</span>
          </div>
        )}
        
        {/* Blinking cursor effect at end of logs if running */}
        {execution.status === 'running' && (
           <span className="inline-block w-2.5 h-5 bg-gray-500 ml-1 animate-pulse align-middle"></span>
        )}
      </div>
    </div>
  );
}
