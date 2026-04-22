import { FastifyInstance } from "fastify";
import { generateObject } from "ai";
import { nuggetResultSchema, nuggetsSchema } from "./learning.schema.js";
import { buildNuggetPrompt } from "./learning.prompt.js";

export class LearningService {
  constructor(private fastify: FastifyInstance) {}

  async generateAndSaveNugget(topic: string) {
    this.fastify.log.info(
      { topic },
      "Generating high-quality general knowledge nugget via AI...",
    );

    const { object } = await generateObject({
      model: this.fastify.ai.chatModel,
      schema: nuggetResultSchema,
      prompt: buildNuggetPrompt(topic),
    });

    this.fastify.log.info(
      "Nugget generated successfully, saving to database...",
    );

    const [savedNugget] = await this.fastify.db
      .insert(nuggetsSchema)
      .values({
        title: object.title,
        content: object.content,
        topic: object.topic,
        metadata: {
          quiz: object.quiz,
          generatedBy: this.fastify.ai.modelId,
        },
      })
      .returning();

    return savedNugget;
  }

  async getAllNuggets() {
    return await this.fastify.db.select().from(nuggetsSchema);
  }
}
