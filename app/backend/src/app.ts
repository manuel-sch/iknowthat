import Fastify from "fastify";
import { fastifyEnv } from "@fastify/env";
import { configOptions } from "../config.js";
// import userRoutes from "./modules/user/user.route";

// Serverregistrierung und -konfiguration
export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(fastifyEnv, configOptions);

  app.get("/", async () => {
    return { hello: "world" };
  });
  // await app.register(userRoutes, { prefix: "/users" });

  return app;
}
