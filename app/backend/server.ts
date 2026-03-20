import { buildApp } from "./app";
import { FastifyInstance } from "fastify";
import "./config"; // Wichtig für Module Augmentation (app.config)

// Nur Startlogik
const start = async () => {
  let app: FastifyInstance | undefined;

  try {
    app = await buildApp();
    const port = app.config.PORT || 3000;
    await app.listen({ port });
  } catch (err) {
    if (app) {
      app.log.error(err);
    } else {
      console.error("Fehler beim Starten der App:", err);
    }
    process.exit(1);
  }
};

start();
