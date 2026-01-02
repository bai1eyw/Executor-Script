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
    name: "GrokRot Injector-Optimized Exploit",
    content: '-- GROKROT INJECTOR-OPTIMIZED EXPLOIT v7.0\n-- DESIGNED FOR SYNAPSE, WAVE, SOLARA, AND THIRD-PARTY INJECTORS\n\nlocal Players = game:GetService("Players")\nlocal Player = Players.LocalPlayer\nlocal CoreGui = game:GetService("CoreGui")\nlocal ReplicatedStorage = game:GetService("ReplicatedStorage")\n\n-- Third-Party Injector Environment Detection\nlocal function getExecutorName()\n    return identifyexecutor and identifyexecutor() or (getgenv().executor or "Unknown Injector")\nend\n\nprint("GROKROT: Initializing on " .. getExecutorName())\n\n-- Stealth Remote Communication\nlocal function fireRemote(name, ...)\n    local remote = ReplicatedStorage:FindFirstChild(name)\n    if remote and remote:IsA("RemoteEvent") then\n        remote:FireServer(...)\n        return true\n    end\n    return false\nend\n\n-- Production Exploit UI\nlocal function setupUI()\n    local ScreenGui = Instance.new("ScreenGui")\n    ScreenGui.Name = "GrokRot_Injector"\n    -- Protect GUI from detection using get_hidden_gui if available\n    local parent = (get_hidden_gui or gethui) and (get_hidden_gui() or gethui()) or CoreGui\n    pcall(function() ScreenGui.Parent = parent end)\n\n    local Main = Instance.new("Frame")\n    Main.Size = UDim2.new(0, 220, 0, 250)\n    Main.Position = UDim2.new(0.5, -110, 0.5, -125)\n    Main.BackgroundColor3 = Color3.fromRGB(10, 10, 10)\n    Main.BorderSizePixel = 0\n    Main.Parent = ScreenGui\n\n    local Title = Instance.new("TextLabel")\n    Title.Size = UDim2.new(1, 0, 0, 40)\n    Title.Text = "GROKROT X " .. getExecutorName()\n    Title.TextColor3 = Color3.new(0, 1, 0)\n    Title.BackgroundColor3 = Color3.fromRGB(20, 20, 20)\n    Title.Parent = Main\n\n    local function addBtn(text, pos, callback)\n        local btn = Instance.new("TextButton")\n        btn.Size = UDim2.new(0.9, 0, 0, 45)\n        btn.Position = pos\n        btn.Text = text\n        btn.BackgroundColor3 = Color3.fromRGB(30, 30, 30)\n        btn.TextColor3 = Color3.new(1, 1, 1)\n        btn.Parent = Main\n        btn.MouseButton1Click:Connect(callback)\n    end\n\n    addBtn("INJECT DUPE", UDim2.new(0.05, 0, 0.25, 0), function()\n        if fireRemote("DupeRemote", "Brainrot") then\n            print("GROKROT: Remote dupe packet injected.")\n        end\n    end)\n\n    addBtn("SPEED BYPASS", UDim2.new(0.05, 0, 0.5, 0), function()\n        Player.Character.Humanoid.WalkSpeed = 150\n    end)\n\n    addBtn("UNLOAD HUB", UDim2.new(0.05, 0, 0.75, 0), function()\n        ScreenGui:Destroy()\n    end)\nend\n\nsetupUI()\nprint("GROKROT INJECTOR HUB LOADED | Stealth Mode: ENABLED")',
    language: "luau",
    description: "Advanced third-party injector script. Optimized for Synapse, Wave, and other external execution environments."
  });
}

// Call seed (in a real app, maybe conditional or separate script)
// For now, we'll just let it run on import if we want, or call it from index.ts?
// Actually index.ts doesn't call seed. I'll make registerRoutes call it or just leave it.
// I'll add it to registerRoutes for convenience here.
setTimeout(seed, 1000); 
