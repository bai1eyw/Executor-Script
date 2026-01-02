import { scripts, executions, type Script, type InsertScript, type Execution, type InsertExecution } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getScripts(): Promise<Script[]>;
  getScript(id: number): Promise<Script | undefined>;
  createScript(script: InsertScript): Promise<Script>;
  updateScript(id: number, script: Partial<InsertScript>): Promise<Script>;
  deleteScript(id: number): Promise<void>;

  getExecutions(scriptId: number): Promise<Execution[]>;
  getExecution(id: number): Promise<Execution | undefined>;
  createExecution(execution: InsertExecution): Promise<Execution>;
  updateExecution(id: number, updates: Partial<Execution>): Promise<Execution>;
}

export class DatabaseStorage implements IStorage {
  async getScripts(): Promise<Script[]> {
    return await db.select().from(scripts).orderBy(desc(scripts.createdAt));
  }

  async getScript(id: number): Promise<Script | undefined> {
    const [script] = await db.select().from(scripts).where(eq(scripts.id, id));
    return script;
  }

  async createScript(insertScript: InsertScript): Promise<Script> {
    const [script] = await db.insert(scripts).values(insertScript).returning();
    return script;
  }

  async updateScript(id: number, updates: Partial<InsertScript>): Promise<Script> {
    const [script] = await db.update(scripts).set(updates).where(eq(scripts.id, id)).returning();
    return script;
  }

  async deleteScript(id: number): Promise<void> {
    await db.delete(scripts).where(eq(scripts.id, id));
  }

  async getExecutions(scriptId: number): Promise<Execution[]> {
    return await db.select()
      .from(executions)
      .where(eq(executions.scriptId, scriptId))
      .orderBy(desc(executions.startedAt));
  }

  async getExecution(id: number): Promise<Execution | undefined> {
    const [execution] = await db.select().from(executions).where(eq(executions.id, id));
    return execution;
  }

  async createExecution(insertExecution: InsertExecution): Promise<Execution> {
    const [execution] = await db.insert(executions).values(insertExecution).returning();
    return execution;
  }

  async updateExecution(id: number, updates: Partial<Execution>): Promise<Execution> {
    const [execution] = await db.update(executions).set(updates).where(eq(executions.id, id)).returning();
    return execution;
  }
}

export const storage = new DatabaseStorage();
