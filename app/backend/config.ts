export const schema = {
  type: "object",
  required: ["PORT", "NODE_ENV"],
  properties: {
    PORT: {
      type: "integer",
    },
    NODE_ENV: {
      type: "string",
    },
    DATABASE_URL: {
      type: "string",
    },
  },
};

export const configOptions = {
  confKey: "config",
  schema: schema,
  dotenv: true,
};

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: number;
      NODE_ENV: string;
      DATABASE_URL: string;
    };
  }
}
