import Fastify, { FastifyInstance } from "fastify";
import { fastifyEnv } from "@fastify/env";
import { configOptions } from "../config.js";
import { learningRoutes } from "./modules/learning/learning.route.js";
import { getLoggerOptions } from "./config/logger.js";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import errorHandler from "./plugins/error-handler.js";
import databasePlugin from "./plugins/database.js";
import aiService from "./plugins/ai-service.js";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

export async function buildApp(): Promise<FastifyInstance> {
  dotenv.config();
  const environment = process.env.NODE_ENV || "development";
  const app = Fastify({
    logger: getLoggerOptions(environment),
    disableRequestLogging: environment === "production",
  });

  // Zod Type Provider Setup
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifyEnv, configOptions);

  // 2. Plugins
  await app.register(cors);
  await app.register(errorHandler);
  await app.register(databasePlugin);
  await app.register(aiService);

  // 3. Health Check
  app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // 4. Routes (Hier später Autoload statt manuell)
  await app.register(learningRoutes, { prefix: "/api/learning" });

  return app;
}
