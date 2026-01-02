import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertScriptSchema, type InsertScript, type Script } from "@shared/schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCreateScript, useUpdateScript } from "@/hooks/use-scripts";
import { useLocation } from "wouter";
import { Loader2, Save } from "lucide-react";

interface ScriptFormProps {
  script?: Script; // If provided, we are in Edit mode
}

export function ScriptForm({ script }: ScriptFormProps) {
  const [, setLocation] = useLocation();
  const createScript = useCreateScript();
  const updateScript = useUpdateScript();

  const isEditing = !!script;

  const form = useForm<InsertScript>({
    resolver: zodResolver(insertScriptSchema),
    defaultValues: {
      name: script?.name || "",
      description: script?.description || "",
      language: script?.language || "bash",
      content: script?.content || "# Write your script here\n",
    },
  });

  async function onSubmit(data: InsertScript) {
    if (isEditing && script) {
      await updateScript.mutateAsync({ id: script.id, ...data });
    } else {
      await createScript.mutateAsync(data);
    }
    setLocation("/scripts");
  }

  const isPending = createScript.isPending || updateScript.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Script Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Daily Database Backup" className="bg-card" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bash">Bash / Shell</SelectItem>
                    <SelectItem value="python">Python 3</SelectItem>
                    <SelectItem value="nodejs">Node.js</SelectItem>
                    <SelectItem value="luau">Roblox Luau</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe what this script does..." 
                  className="bg-card resize-none h-20" 
                  {...field} 
                  value={field.value || ""} // handle null description
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Script Content</FormLabel>
              <FormControl>
                <div className="relative rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:border-primary">
                  <Textarea
                    placeholder="# Write your code here"
                    className="font-mono min-h-[400px] bg-[#0d1117] text-gray-300 p-4 border-0 focus-visible:ring-0 resize-y leading-relaxed"
                    spellCheck={false}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Write the code that will be executed on the server.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setLocation("/scripts")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update Script" : "Create Script"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
