import { FastifyReply, FastifyRequest } from "fastify";
import { CreateNuggetInput } from "./learning.schema.js";

export const learningController = {
  async listNuggets(request: FastifyRequest, reply: FastifyReply) {
    const nuggets = await request.server.learningService.getAllNuggets();
    return reply.send(nuggets);
  },

  async createNugget(
    request: FastifyRequest<{ Body: CreateNuggetInput }>,
    reply: FastifyReply,
  ) {
    const { topic } = request.body;

    const nugget =
      await request.server.learningService.generateAndSaveNugget(topic);
    return reply.status(201).send(nugget);
  },
};
