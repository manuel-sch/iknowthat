import Fastify from "fastify";
// import userRoutes from "./modules/user/user.route";

// Serverregistrierung und -konfiguration
export async function buildApp() {
  const app = Fastify({ logger: true });
  app.get("/", async () => {
    return { hello: "world" };
  });
  // await app.register(userRoutes, { prefix: "/users" });

  return app;
}
