import { type Script } from "@shared/schema";
import { Link } from "wouter";
import { Play, Edit2, Trash2, Clock, Terminal } from "lucide-react";
import { format } from "date-fns";
import { useRunScript, useDeleteScript } from "@/hooks/use-scripts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ScriptCardProps {
  script: Script;
}

export function ScriptCard({ script }: ScriptCardProps) {
  const { mutate: runScript, isPending: isRunning } = useRunScript();
  const { mutate: deleteScript, isPending: isDeleting } = useDeleteScript();

  const languageColors: Record<string, string> = {
    bash: "text-green-400 bg-green-400/10 border-green-400/20",
    python: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    nodejs: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    luau: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  };

  const badgeClass = languageColors[script.language] || "text-gray-400 bg-gray-400/10 border-gray-400/20";

  return (
    <div className="group relative bg-card hover:bg-card/80 border border-border/50 hover:border-primary/50 transition-all duration-300 rounded-xl p-6 shadow-lg shadow-black/20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
        <Terminal className="w-24 h-24" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge variant="outline" className={`mb-2 font-mono text-xs uppercase ${badgeClass}`}>
              {script.language}
            </Badge>
            <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {script.name}
            </h3>
          </div>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full hover:bg-primary/20 hover:text-primary text-muted-foreground"
            onClick={() => runScript(script.id)}
            disabled={isRunning}
          >
            <Play className={`w-5 h-5 ${isRunning ? 'animate-pulse' : ''} fill-current`} />
          </Button>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
          {script.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Clock className="w-3.5 h-3.5" />
            {script.createdAt ? format(new Date(script.createdAt), 'MMM d, yyyy') : 'Unknown'}
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
            <Link href={`/scripts/${script.id}/edit`}>
              <Button size="icon" variant="secondary" className="h-8 w-8">
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="destructive" className="h-8 w-8">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Script?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the script "{script.name}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteScript(script.id)} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
