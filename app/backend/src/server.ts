import { buildApp } from "./app.js";
import { FastifyInstance } from "fastify";
import "../config.js"; // Wichtig für Module Augmentation (app.config)

// Nur Startlogik
const start = async () => {
  let app: FastifyInstance | undefined;

  try {
    app = await buildApp();
    const port = app.config.PORT;
    const host = app.config.HOST;
    await app.listen({ port, host });
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
