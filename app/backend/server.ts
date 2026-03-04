import { buildApp } from "./app";
import {FastifyInstance} from "fastify";

// Nur Startlogik
const start = async () => {
    let app: FastifyInstance | undefined;

    try {
        app = await buildApp();
        await app?.listen({ port: 3000 });
    } catch (err) {
        if (app) {
            app.log.error(err);
        } else {
            console.error(err); // Fallback falls buildApp selbst crasht
        }

        process.exit(1);
    }
};

start()