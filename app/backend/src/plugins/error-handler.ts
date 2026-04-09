import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const errorHandler: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.setErrorHandler((error, request, reply) => {
    // Log error
    request.log.error(error);

    // Zod validation errors
    if (error.hasVisibleStack || error.name === "ZodError") {
      return reply.status(400).send({
        error: "Validation Error",
        // @ts-ignore - ZodError structure
        details: error.issues || error.message,
      });
    }

    // Default error
    const statusCode = error.statusCode || 500;
    const message = statusCode >= 500 ? "Internal Server Error" : error.message;

    reply.status(statusCode).send({
      error: error.name || "Error",
      message: message,
    });
  });
};

export default fp(errorHandler);

