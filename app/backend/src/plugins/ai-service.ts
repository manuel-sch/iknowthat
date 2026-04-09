import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { google } from "@ai-sdk/google";

declare module "fastify" {
  interface FastifyInstance {
    ai: {
      model: ReturnType<typeof google>;
      chatModel: any;
    };
  }
}

const aiPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const apiKey = fastify.config.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    fastify.log.warn("GOOGLE_GENERATIVE_AI_API_KEY ist nicht gesetzt. AI Features werden nicht funktionieren.");
  }

  const googleProvider = google({
    apiKey: apiKey || "dummy-key",
  });

  // Default model for dev: Gemini 2.0 Flash (latest stable-ish)
  const model = googleProvider("gemini-1.5-flash");

  fastify.decorate("ai", {
    model: googleProvider,
    chatModel: model,
  });
};

export default fp(aiPlugin);

