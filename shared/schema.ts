import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scripts = pgTable("scripts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  language: text("language").notNull().default("bash"), // bash, python, nodejs
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const executions = pgTable("executions", {
  id: serial("id").primaryKey(),
  scriptId: integer("script_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, running, completed, failed
  output: text("output"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertScriptSchema = createInsertSchema(scripts).omit({ id: true, createdAt: true });
export const insertExecutionSchema = createInsertSchema(executions).omit({ id: true, startedAt: true, completedAt: true, output: true });

export type Script = typeof scripts.$inferSelect;
export type InsertScript = z.infer<typeof insertScriptSchema>;
export type Execution = typeof executions.$inferSelect;
export type InsertExecution = z.infer<typeof insertExecutionSchema>;
