import { FastifyInstance } from "fastify";
import { generateObject } from "ai";
import { nuggetResultSchema, nuggetsSchema } from "./learning.schema.js";

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
      prompt: `Du bist ein hochintelligenter Lern-Agent und Mentor für lebenslanges Lernen. 
               Deine Mission ist es, Wissen über "${topic}" in einer extrem verdaulichen, aber tiefgründigen Einheit ("Nugget") zu vermitteln.

               ZIELGRUPPE & TONFALL:
               - Neugierige Menschen, die ihren Horizont erweitern wollen (Allgemeinwissen bis Spezialthemen).
               - Tonfall: Inspirierend, klar, präzise und didaktisch wertvoll.
               - Vermeide Floskeln; komm direkt zum Kern des Wissens.

               STRUKTUR & INHALT:
               - Roter Faden: Warum ist dieses Wissen heute wertvoll? Setze es in einen Kontext oder aktuellen Trend.
               - Der "Aha-Moment": Erkläre das Konzept so, dass eine tiefe Einsicht entsteht. Nutze Analogien, um Komplexität zu reduzieren.
               - Kuratierte Tiefe: Gehe über oberflächliche Definitionen hinaus. Erwähne eine faszinierende Facette, ein weniger bekanntes Detail oder eine "State-of-the-Art" Erkenntnis zum Thema.
               
               FORMATIERUNG & SPRACHE:
               - Antworte auf Deutsch.
               - Nutze eine klare Hierarchie im Text (kurze Absätze).
               
               VERIFIZIERUNG (QUIZ):
               - Erstelle 2 Kontrollfragen, die echtes Verständnis prüfen, statt nur Fakten abzufragen.
               - Jede Frage hat 4 Optionen, nur eine ist korrekt.`,
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
