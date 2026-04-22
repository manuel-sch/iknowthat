import { FastifyInstance } from "fastify";
import { learningController } from "./learning.controller.js";
import { createNuggetSchema } from "./learning.schema.js";
import { LearningService } from "./learning.service.js";

declare module "fastify" {
  interface FastifyInstance {
    learningService: LearningService;
  }
}

export async function learningRoutes(app: FastifyInstance): Promise<void> {
  const service = new LearningService(app);
  app.decorate("learningService", service);

  // Liste alle Nuggets
  app.get("/", learningController.listNuggets);

  // Generiere ein neues Nugget via AI
  app.post(
    "/generate",
    {
      schema: {
        body: createNuggetSchema,
      },
    },
    learningController.createNugget,
  );
}
