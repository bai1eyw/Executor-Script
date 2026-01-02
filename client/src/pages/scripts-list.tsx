import { useScripts } from "@/hooks/use-scripts";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { ScriptCard } from "@/components/script-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function ScriptsList() {
  const { data: scripts, isLoading } = useScripts();
  const [search, setSearch] = useState("");

  const filteredScripts = scripts?.filter(script => 
    script.name.toLowerCase().includes(search.toLowerCase()) || 
    (script.description && script.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Scripts Library</h1>
        <Link href="/scripts/new">
          <Button className="shadow-lg shadow-primary/20">
            <Plus className="mr-2 w-4 h-4" />
            Create New
          </Button>
        </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="flex gap-4 p-4 bg-card/50 border border-border/50 rounded-lg backdrop-blur-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search scripts..." 
            className="pl-10 bg-background border-border" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Grid */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex justify-between">
                   <Skeleton className="h-6 w-24" />
                   <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <div className="flex justify-between pt-4">
                   <Skeleton className="h-4 w-20" />
                   <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredScripts && filteredScripts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScripts.map((script) => (
              <ScriptCard key={script.id} script={script} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="p-4 rounded-full bg-secondary mb-4">
               <Search className="w-8 h-8 text-muted-foreground" />
             </div>
             <h3 className="text-lg font-medium">No scripts found</h3>
             <p className="text-muted-foreground mt-2">
               {search ? "Try adjusting your search terms." : "Get started by creating your first script."}
             </p>
             {search && (
               <Button variant="link" onClick={() => setSearch("")} className="mt-2">
                 Clear filters
               </Button>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
