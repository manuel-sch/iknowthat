import http from "node:http";

const topic = process.env.npm_config_topic;

if (!topic) {
  console.error(
    'Fehler: Bitte gib ein Thema an. Beispiel: npm run test:nugget --topic="Dein Thema"',
  );
  process.exit(1);
}

const data = JSON.stringify({ topic });

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/learning/generate",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(data),
  },
};

console.log(`Trigger Nugget-Generierung für Topic: "${topic}"...`);

const req = http.request(options);
req.on("error", (e) => console.error(`Fehler: ${e.message}`));
req.write(data);
req.end();
