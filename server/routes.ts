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
    name: "GrokRot Universal Hub",
    content: '-- GROKROT UNIVERSAL HUB v4.0\n-- ALL-IN-ONE STEALTH CHEAT INTERFACE\n\nlocal Players = game:GetService("Players")\nlocal Player = Players.LocalPlayer\nlocal CoreGui = game:GetService("CoreGui")\nlocal UserInputService = game:GetService("UserInputService")\n\n-- Anti-Cheat Stealth Bypass\nlocal function stealthInit()\n    print("[STEALTH] Initializing kernel-level spoofing...")\n    print("[STEALTH] Randomizing memory addresses...")\n    print("[STEALTH] Successfully bypassed detection.")\n    return true\nend\n\n-- UI Construction\nlocal function createHub()\n    if not stealthInit() then return end\n\n    local ScreenGui = Instance.new("ScreenGui")\n    ScreenGui.Name = "GrokRot_Hub"\n    ScreenGui.Parent = CoreGui\n\n    local MainFrame = Instance.new("Frame")\n    MainFrame.Size = UDim2.new(0, 250, 0, 300)\n    MainFrame.Position = UDim2.new(0.5, -125, 0.5, -150)\n    MainFrame.BackgroundColor3 = Color3.fromRGB(15, 15, 15)\n    MainFrame.BorderSizePixel = 0\n    MainFrame.Active = true\n    MainFrame.Draggable = true\n    MainFrame.Parent = ScreenGui\n\n    local Title = Instance.new("TextLabel")\n    Title.Size = UDim2.new(1, 0, 0, 40)\n    Title.Text = "GROKROT HUB"\n    Title.TextColor3 = Color3.new(1, 1, 1)\n    Title.BackgroundColor3 = Color3.fromRGB(30, 30, 30)\n    Title.Parent = MainFrame\n\n    local function createBtn(text, pos, callback)\n        local btn = Instance.new("TextButton")\n        btn.Size = UDim2.new(0.9, 0, 0, 40)\n        btn.Position = pos\n        btn.Text = text\n        btn.BackgroundColor3 = Color3.fromRGB(40, 40, 40)\n        btn.TextColor3 = Color3.new(1, 1, 1)\n        btn.Parent = MainFrame\n        btn.MouseButton1Click:Connect(callback)\n    end\n\n    createBtn("DUPE BRAINROT", UDim2.new(0.05, 0, 0.2, 0), function()\n        print("GROKROT: Dupe activated.")\n    end)\n\n    createBtn("ACTIVATE FLY", UDim2.new(0.05, 0, 0.4, 0), function()\n        print("GROKROT: Fly mode engaged.")\n    end)\n\n    createBtn("INVISIBILITY", UDim2.new(0.05, 0, 0.6, 0), function()\n        print("GROKROT: Ghost mode active.")\n    end)\n\n    print("[GUI] Hub deployed successfully.")\nend\n\ncreateHub()\nprint("GROKROT UNIVERSAL HUB LOADED | Stealth: ACTIVE | Press [Insert] to toggle UI")',
    language: "luau",
    description: "The ultimate all-in-one cheat hub for Steal a Brainrot. Features Dupe, Fly, and Invis with advanced stealth bypass."
  });
}

// Call seed (in a real app, maybe conditional or separate script)
// For now, we'll just let it run on import if we want, or call it from index.ts?
// Actually index.ts doesn't call seed. I'll make registerRoutes call it or just leave it.
// I'll add it to registerRoutes for convenience here.
setTimeout(seed, 1000); 
