export const schema = {
  type: "object",
  required: ["PORT", "NODE_ENV", "HOST", "DATABASE_URL"],
  properties: {
    PORT: {
      type: "integer",
      default: 3000,
    },
    NODE_ENV: {
      type: "string",
      enum: ["development", "testing", "production"],
      default: "development",
    },
    HOST: {
      type: "string",
      default: "0.0.0.0",
    },
    DATABASE_URL: {
      type: "string",
      default: "postgresql://user:password@localhost:5432/mydb",
    },
    AI_API_KEY: {
      type: "string",
    },
  },
};

export const configOptions = {
  confKey: "config",
  schema: schema,
  dotenv: true,
};

interface config {
  PORT: number;
  NODE_ENV: string;
  HOST: string;
  DATABASE_URL: string;
  AI_API_KEY?: string;
}

declare module "fastify" {
  interface FastifyInstance {
    config: config;
  }
}
