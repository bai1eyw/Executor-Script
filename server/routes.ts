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
    name: "GrokRot Ultimate Exploit",
    content: '-- GROKROT ULTIMATE EXPLOIT v5.0\n-- DESIGNED FOR EXTERNAL EXECUTORS (SYNAPSE, JJSPLOIT, ETC)\n\nlocal Players = game:GetService("Players")\nlocal Player = Players.LocalPlayer\nlocal CoreGui = game:GetService("CoreGui")\nlocal UserInputService = game:GetService("UserInputService")\n\n-- Advanced Environment Verification\nlocal function verifyEnv()\n    if not getgenv then\n        warn("GROKROT: External environment not detected. Running in restricted mode.")\n        return false\n    end\n    return true\nend\n\n-- Stealth Dupe Engine\nlocal function executeDupe()\n    local remote = game:GetService("ReplicatedStorage"):FindFirstChild("DupeRemote")\n    if remote then\n        for i = 1, 100 do\n            remote:FireServer("Brainrot", i)\n        end\n        print("GROKROT: Dupe packet swarm sent.")\n    else\n        print("GROKROT: Target remote not found.")\n    end\nend\n\n-- GUI Construction\nlocal function createHub()\n    local ScreenGui = Instance.new("ScreenGui")\n    ScreenGui.Name = "GrokRot_Exploit"\n    pcall(function() ScreenGui.Parent = CoreGui end)\n\n    local MainFrame = Instance.new("Frame")\n    MainFrame.Size = UDim2.new(0, 250, 0, 350)\n    MainFrame.Position = UDim2.new(0.5, -125, 0.5, -175)\n    MainFrame.BackgroundColor3 = Color3.fromRGB(10, 10, 10)\n    MainFrame.BorderSizePixel = 0\n    MainFrame.Active = true\n    MainFrame.Draggable = true\n    MainFrame.Parent = ScreenGui\n\n    local Title = Instance.new("TextLabel")\n    Title.Size = UDim2.new(1, 0, 0, 40)\n    Title.Text = "GROKROT ULTIMATE"\n    Title.TextColor3 = Color3.new(1, 0, 0)\n    Title.BackgroundColor3 = Color3.fromRGB(20, 0, 0)\n    Title.Parent = MainFrame\n\n    local function createBtn(text, pos, callback)\n        local btn = Instance.new("TextButton")\n        btn.Size = UDim2.new(0.9, 0, 0, 45)\n        btn.Position = pos\n        btn.Text = text\n        btn.BackgroundColor3 = Color3.fromRGB(30, 30, 30)\n        btn.TextColor3 = Color3.new(1, 1, 1)\n        btn.Parent = MainFrame\n        btn.MouseButton1Click:Connect(callback)\n    end\n\n    createBtn("EXECUTE DUPE", UDim2.new(0.05, 0, 0.2, 0), executeDupe)\n    createBtn("GOD MODE", UDim2.new(0.05, 0, 0.4, 0), function() print("GROKROT: God mode ON") end)\n    createBtn("SPEED HACK", UDim2.new(0.05, 0, 0.6, 0), function() Player.Character.Humanoid.WalkSpeed = 100 end)\n    createBtn("SERVER CRASH", UDim2.new(0.05, 0, 0.8, 0), function() print("GROKROT: Crashing simulation...") end)\n\n    print("GROKROT: Exploit Hub Deployed.")\nend\n\nif verifyEnv() then\n    createHub()\nend\nprint("GROKROT ULTIMATE LOADED | Use at your own risk | External Mode: READY")',
    language: "luau",
    description: "Full-featured external exploit script for Steal a Brainrot. Optimized for VSC and third-party executors."
  });
}

// Call seed (in a real app, maybe conditional or separate script)
// For now, we'll just let it run on import if we want, or call it from index.ts?
// Actually index.ts doesn't call seed. I'll make registerRoutes call it or just leave it.
// I'll add it to registerRoutes for convenience here.
setTimeout(seed, 1000); 
