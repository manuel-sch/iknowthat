import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const nuggetsSchema = pgTable("nuggets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  topic: text("topic").notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod Schemas für API Validation
export const createNuggetSchema = z.object({
  topic: z.string().min(2),
});

// Schema für die AI-generierten Nuggets inklusive Quiz
export const nuggetResultSchema = z.object({
  title: z.string(),
  content: z.string(),
  topic: z.string(),
  quiz: z
    .array(
      z.object({
        question: z.string(),
        options: z.array(z.string()),
        correctAnswer: z.string(),
      }),
    )
    .optional(),
});

export const nuggetApiSchema = createInsertSchema(nuggetsSchema);

export type Nugget = typeof nuggetsSchema.$inferSelect;
export type NewNugget = typeof nuggetsSchema.$inferInsert;
export type CreateNuggetInput = z.infer<typeof createNuggetSchema>;
export type NuggetGenerated = z.infer<typeof nuggetResultSchema>;
