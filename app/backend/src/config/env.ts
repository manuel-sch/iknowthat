import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "testing", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z.string().url(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

declare module "fastify" {
  interface FastifyInstance {
    config: Env;
  }
}

