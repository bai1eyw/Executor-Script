import { useScripts } from "@/hooks/use-scripts";
import { useScriptExecutions } from "@/hooks/use-executions";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Terminal, Activity, Code2, ArrowRight } from "lucide-react";
import { ScriptCard } from "@/components/script-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: scripts, isLoading } = useScripts();
  
  // This is a simplified dashboard - normally we'd have an endpoint for 'recent executions across all scripts'
  // For now, we'll focus on the scripts overview.

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Control Center
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Manage, deploy, and monitor your automation scripts from a central command dashboard.
          </p>
        </div>
        <Link href="/scripts/new">
          <Button size="lg" className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
            <Plus className="mr-2 w-5 h-5" />
            New Script
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Scripts</CardTitle>
            <Code2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scripts?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for execution</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Operational</div>
            <p className="text-xs text-muted-foreground mt-1">All services running</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Environment</CardTitle>
            <Terminal className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Node / Py / Bash</div>
            <p className="text-xs text-muted-foreground mt-1">Multi-runtime support</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scripts Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold tracking-tight">Your Scripts</h2>
          <Link href="/scripts">
            <Button variant="link" className="text-primary group px-0">
              View All 
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-xl border border-border bg-card p-6 space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : scripts && scripts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.slice(0, 3).map((script) => (
              <ScriptCard key={script.id} script={script} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border/50 rounded-xl bg-card/30">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No scripts yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first script to start automating tasks.
            </p>
            <Link href="/scripts/new">
              <Button>Create Script</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
