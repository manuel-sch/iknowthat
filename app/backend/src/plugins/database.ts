import { drizzle } from "drizzle-orm/node-postgres";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import pg from "pg";
import * as learningSchema from "../modules/learning/learning.schema.js";

declare module "fastify" {
  interface FastifyInstance {
    db: ReturnType<typeof drizzle<typeof schema>>;
  }
}

const schema = {
  ...learningSchema,
};

const databasePlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const pool = new pg.Pool({
    connectionString: fastify.config.DATABASE_URL,
  });

  const db = drizzle(pool, {
    schema,
    logger: process.env.NODE_ENV !== "production",
  });

  fastify.decorate("db", db);

  fastify.addHook("onClose", async () => {
    await pool.end();
  });
};

export default fp(databasePlugin);
