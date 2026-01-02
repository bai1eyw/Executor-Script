import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import ScriptsList from "@/pages/scripts-list";
import CreateScript from "@/pages/create-script";
import EditScript from "@/pages/edit-script";
import ExecutionDetails from "@/pages/execution-details";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/scripts" component={ScriptsList} />
        <Route path="/scripts/new" component={CreateScript} />
        <Route path="/scripts/:id/edit" component={EditScript} />
        <Route path="/executions/:id" component={ExecutionDetails} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
