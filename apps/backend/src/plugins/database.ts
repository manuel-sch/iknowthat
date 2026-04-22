import { drizzle } from "drizzle-orm/node-postgres";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import pg from "pg";
import { Logger } from "drizzle-orm/logger";
import * as learningSchema from "../modules/learning/learning.schema.js";

declare module "fastify" {
  interface FastifyInstance {
    db: ReturnType<typeof drizzle<typeof schema>>;
  }
}

const schema = {
  ...learningSchema,
};

class CompactLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    const compactQuery = query.replace(/\s+/g, " ").trim();

    console.log(`\x1b[36m[DB]\x1b[0m ${compactQuery}`);

    if (params && params.length > 0) {
      // Heuristik zur Extraktion von Spaltennamen aus Drizzle SQL
      const paramNames = Array.from(
        { length: params.length },
        (_, i) => `$${i + 1}`,
      );

      // 1. Check for INSERT INTO (...) VALUES (...)
      // Exakte Zuordnung durch Abgleichen der Columns mit den Values (default vs $1)
      const insertMatch = query.match(
        /insert\s+into\s+(?:"[^"]+"|[\w_]+)\s*\(([^)]+)\)\s*values\s*\(([^)]+)\)/i,
      );
      if (insertMatch) {
        const cols = insertMatch[1]
          .split(",")
          .map((c) => c.trim().replace(/"/g, ""));
        const vals = insertMatch[2].split(",").map((v) => v.trim());

        vals.forEach((valStr, idx) => {
          if (valStr.startsWith("$")) {
            const paramIdx = parseInt(valStr.substring(1), 10) - 1;
            if (
              !isNaN(paramIdx) &&
              paramIdx >= 0 &&
              paramIdx < paramNames.length &&
              cols[idx]
            ) {
              paramNames[paramIdx] = cols[idx];
            }
          }
        });
      }

      // 2. Check for WHERE col = $1 or SET col = $2
      const paramRegex =
        /"([^"]+)"\s*(?:=|<|>|<=|>=|<>|!=|in|like|ilike)\s*\$(\d+)/gi;
      let match;
      while ((match = paramRegex.exec(query)) !== null) {
        const colName = match[1];
        const paramIndex = parseInt(match[2], 10) - 1;
        // Nur überschreiben, wenn es noch ein "$..." Platzhalter ist
        if (
          paramIndex >= 0 &&
          paramIndex < params.length &&
          paramNames[paramIndex].startsWith("$")
        ) {
          paramNames[paramIndex] = colName;
        }
      }

      console.log(`\x1b[90m  ↳ Params:\x1b[0m`);
      params.forEach((p, i) => {
        let val = p;
        if (typeof p === "string" && p.length > 100) {
          val = p.slice(0, 100) + "... [truncated]";
        } else if (typeof p === "object" && p !== null) {
          const str = JSON.stringify(p);
          val = str.length > 100 ? str.slice(0, 100) + "... [truncated]" : p;
        }
        console.log(
          `\x1b[90m    ${paramNames[i]}: ${JSON.stringify(val)}\x1b[0m`,
        );
      });
      // Leerzeile nach den Parametern für visuelle Trennung
      console.log("");
    }
  }
}

const databasePlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const pool = new pg.Pool({
    connectionString: fastify.config.DATABASE_URL,
  });

  const db = drizzle(pool, {
    schema,
    logger: process.env.NODE_ENV !== "production" ? new CompactLogger() : false,
  });

  fastify.decorate("db", db);

  fastify.addHook("onClose", async () => {
    await pool.end();
  });
};

export default fp(databasePlugin);
