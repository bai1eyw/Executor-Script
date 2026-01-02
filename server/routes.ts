import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Scripts CRUD
  app.get(api.scripts.list.path, async (req, res) => {
    const scripts = await storage.getScripts();
    res.json(scripts);
  });

  app.get(api.scripts.get.path, async (req, res) => {
    const script = await storage.getScript(Number(req.params.id));
    if (!script) {
      return res.status(404).json({ message: 'Script not found' });
    }
    res.json(script);
  });

  app.post(api.scripts.create.path, async (req, res) => {
    try {
      const input = api.scripts.create.input.parse(req.body);
      const script = await storage.createScript(input);
      res.status(201).json(script);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.scripts.update.path, async (req, res) => {
    try {
      const input = api.scripts.update.input.parse(req.body);
      const script = await storage.updateScript(Number(req.params.id), input);
      if (!script) return res.status(404).json({ message: 'Script not found' });
      res.json(script);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.scripts.delete.path, async (req, res) => {
    await storage.deleteScript(Number(req.params.id));
    res.status(204).send();
  });

  // Executions
  app.get(api.executions.list.path, async (req, res) => {
    const executions = await storage.getExecutions(Number(req.params.id));
    res.json(executions);
  });

  app.get(api.executions.get.path, async (req, res) => {
    const execution = await storage.getExecution(Number(req.params.id));
    if (!execution) return res.status(404).json({ message: 'Execution not found' });
    res.json(execution);
  });

  // Run Script
  app.post(api.scripts.run.path, async (req, res) => {
    const scriptId = Number(req.params.id);
    const script = await storage.getScript(scriptId);
    
    if (!script) {
      return res.status(404).json({ message: 'Script not found' });
    }

    const execution = await storage.createExecution({
      scriptId,
      status: 'running',
    });

    // Simulate async execution
    // In a real app, this would queue a job
    (async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate 3s delay
        
        let mockOutput = `[${new Date().toISOString()}] Starting ${script.language} script...\n`;
        mockOutput += `> Running: ${script.name}\n\n`;
        
        // Mock execution output based on content
        if (script.language === 'luau') {
          mockOutput += `[Roblox/Luau Environment] Initializing state...\n`;
          mockOutput += `[Roblox/Luau Environment] Security Level: Elevated\n`;
          mockOutput += `[Roblox/Luau Environment] Verification: Success\n`;
          mockOutput += `[Roblox/Luau Environment] Simulating execution...\n\n`;
          mockOutput += script.content + "\n\n";
          mockOutput += `[Roblox/Luau Environment] Finished execution.\n`;
        } else if (script.content.includes('echo')) {
             mockOutput += script.content.replace('echo', '') + "\n";
        } else {
             mockOutput += `[Mock Output] Executed content:\n${script.content}\n`;
        }

        mockOutput += `\n[${new Date().toISOString()}] Finished successfully.`;

        await storage.updateExecution(execution.id, {
          status: 'completed',
          output: mockOutput,
          completedAt: new Date(),
        });
      } catch (error) {
        await storage.updateExecution(execution.id, {
          status: 'failed',
          output: `Execution failed: ${error}`,
          completedAt: new Date(),
        });
      }
    })();

    res.status(201).json(execution);
  });

  return httpServer;
}

// Seed function
async function seed() {
  const existing = await storage.getScripts();
  if (existing.length === 0) {
    await storage.createScript({
      name: "Hello World",
      content: 'echo "Hello, World!"',
      language: "bash",
      description: "A simple hello world script"
    });
    await storage.createScript({
      name: "System Check",
      content: 'echo "Checking system status..."\necho "All systems go!"',
      language: "bash",
      description: "Mock system check"
    });
    await storage.createScript({
      name: "Roblox Spawn Part",
      content: 'local part = Instance.new("Part")\npart.Parent = game.Workspace\npart.Position = Vector3.new(0, 10, 0)\nprint("Spawned a part via Luau!")',
      language: "luau",
      description: "Roblox Luau script example"
    });
    await storage.createScript({
      name: "Fly Script (Cheats)",
      content: 'local LocalPlayer = game:GetService("Players").LocalPlayer\nlocal Character = LocalPlayer.Character\nlocal Humanoid = Character:WaitForChild("Humanoid")\n\nprint("Activating fly cheat...")\n-- Simulated flying logic here\nprint("Fly cheat active!")',
      language: "luau",
      description: "Example cheat script for testing purposes"
    });
  }
}

// Call seed (in a real app, maybe conditional or separate script)
// For now, we'll just let it run on import if we want, or call it from index.ts?
// Actually index.ts doesn't call seed. I'll make registerRoutes call it or just leave it.
// I'll add it to registerRoutes for convenience here.
setTimeout(seed, 1000); 
