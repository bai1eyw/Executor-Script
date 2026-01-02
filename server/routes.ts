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
  await storage.createScript({
    name: "Steal A Brainrot Dupe (Advanced GUI)",
    content: '-- GROKROT ADVANCED CHEAT GUI v3.0\n-- FOR EDUCATIONAL PURPOSES ONLY\n\nlocal Players = game:GetService("Players")\nlocal Player = Players.LocalPlayer\nlocal CoreGui = game:GetService("CoreGui")\n\n-- Simulated GUI Construction\nlocal function createGui()\n    print("[GUI] Constructing stealth interface...")\n    print("[GUI] Rendering dupe buttons...")\n    print("[GUI] Attaching anti-cheat listeners...")\n    \n    local ScreenGui = Instance.new("ScreenGui")\n    ScreenGui.Name = "GrokRot_Menu"\n    ScreenGui.Parent = CoreGui -- Simulated\n    \n    local Frame = Instance.new("Frame")\n    Frame.Size = UDim2.new(0, 200, 0, 150)\n    Frame.Position = UDim2.new(0.5, -100, 0.5, -75)\n    Frame.BackgroundColor3 = Color3.fromRGB(20, 20, 20)\n    Frame.Parent = ScreenGui\n    \n    local Title = Instance.new("TextLabel")\n    Title.Text = "GROKROT CHEATS"\n    Title.Size = UDim2.new(1, 0, 0, 30)\n    Title.TextColor3 = Color3.new(1, 1, 1)\n    Title.Parent = Frame\n    \n    local DupeButton = Instance.new("TextButton")\n    DupeButton.Text = "DUPE BRAINROT"\n    DupeButton.Size = UDim2.new(0.8, 0, 0, 40)\n    DupeButton.Position = UDim2.new(0.1, 0, 0.4, 0)\n    DupeButton.Parent = Frame\n    \n    DupeButton.MouseButton1Click:Connect(function()\n        print("GROKROT: Duplication triggered via GUI button.")\n        -- Dupe logic here\n    end)\n    \n    print("GROKROT: GUI Initialized. Interface active on screen.")\nend\n\ncreateGui()\nprint("GROKROT CHEATS LOADED | UI Visible | Press Menu to toggle")',
    language: "luau",
    description: "Advanced duplication script for Steal a Brainrot with a simulated Roblox GUI interface."
  });
}

// Call seed (in a real app, maybe conditional or separate script)
// For now, we'll just let it run on import if we want, or call it from index.ts?
// Actually index.ts doesn't call seed. I'll make registerRoutes call it or just leave it.
// I'll add it to registerRoutes for convenience here.
setTimeout(seed, 1000); 
