// Wir definieren ein Interface für unsere Config-Map
interface LoggerConfig {
  [key: string]: any;
}

export const loggerConfig: LoggerConfig = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
        colorize: true,
      },
    },
    level: "debug", // In Dev wollen wir alles sehen
  },
  production: {
    level: "info", // In Prod sparen wir Speicherplatz/CPU
    formatters: {
      level: (label: string) => ({ level: label }), // Standardkonforme Level-Ausgabe
    },
  },
  test: false, // Stille während der Tests
};

/**
 * Hilfsfunktion, um die richtige Config basierend auf ENV zu ziehen
 */
export const getLoggerOptions = (env: string = "development") => {
  return loggerConfig[env] ?? true;
};
