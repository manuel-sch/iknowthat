import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { LanguageModel } from "ai";

declare module "fastify" {
  interface FastifyInstance {
    ai: {
      provider: ReturnType<typeof createGoogleGenerativeAI>;
      chatModel: LanguageModel;
      modelId: string;
    };
  }
}

const aiPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const apiKey = fastify.config.AI_API_KEY;

  if (!apiKey) {
    fastify.log.warn(
      "GOOGLE_GENERATIVE_AI_API_KEY ist nicht gesetzt. AI Features werden nicht funktionieren.",
    );
  }

  const google = createGoogleGenerativeAI({
    apiKey: apiKey || "dummy-key",
  });

  // Default model for dev: gemini-2.5-flash-lite
  const model = google("gemini-2.5-flash-lite");

  fastify.decorate("ai", {
    provider: google,
    chatModel: model,
    modelId: model.modelId,
  });
};

export default fp(aiPlugin);
