import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const errorHandler: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.setErrorHandler((error, request, reply) => {
    const err = error as any;

    // Nur der Log im Terminal bleibt "groß" für das Debugging
    request.log.error(error);

    // Zod validation errors
    if (err.name === "ZodError") {
      return reply.status(400).send({
        error: "Validation Error",
        details: err.issues,
      });
    }

    // AI SDK / API Errors (Verschlankung der Antwort an den User)
    if (err.name === "AI_APICallError" || err.type === "APICallError") {
      return reply.status(err.statusCode || 400).send({
        error: "AI_Service_Error",
        message: err.message || "An error occurred with the AI provider",
      });
    }

    // Default error handling
    const statusCode = err.statusCode || 500;
    const isInternal = statusCode >= 500;

    reply.status(statusCode).send({
      error: isInternal ? "InternalServerError" : err.name || "Error",
      message: isInternal
        ? "Etwas ist schiefgelaufen. Bitte versuche es später erneut."
        : err.message,
    });
  });
};

export default fp(errorHandler);
