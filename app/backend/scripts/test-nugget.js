import http from 'node:http';

const topic = process.env.npm_config_topic;

if (!topic) {
  console.error('Fehler: Bitte gib ein Thema an. Beispiel: npm run test:nugget --topic="Dein Thema"');
  process.exit(1);
}

const data = JSON.stringify({ topic });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/learning/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

console.log(`Sende Request für Thema: "${topic}"...`);

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(responseData);
      console.log('Antwort vom Server:');
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Antwort (Raw):', responseData);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem mit dem Request: ${e.message}`);
});

req.write(data);
req.end();

