# AI Coding Agent Guide - iknowthat
Antworte auf deutsch.

This guide helps AI agents understand the architecture and conventions of the `iknowthat` project to be immediately productive.

## 🚀 Mission & MVP Vision
`iknowthat` ist ein KI-gestützter Lern-Agent, der personalisiertes Wissen in kleinen, verdaulichen Einheiten ("Nuggets") vermittelt.
- **Nutzerfokus**: Lernen von Allgemeinwissen und spezifischen Themen, angepasst an den Wissensstand des Nutzers.
- **Aktualität**: Integration von News und Trends (Search-First-Ansatz), um immer "State of the Art" zu bleiben.
- **Adaptivität**: Dynamische Anpassung von Tiefengrad und Kontext basierend auf dem Nutzerprofil.

## 🏗️ Architecture "Big Picture"
The project is a monorepo (though currently loose) containing a Fastify backend and an Expo (React Native) frontend.

- **Backend (`/app/backend`)**: Fastify-based Node.js server.
    - Uses `buildApp()` pattern in `src/app.ts` for testability.
    - Environment config via `@fastify/env` with Zod like validation in `config.ts`.
    - **Module-based routing**: Logic is organized in `src/modules/` (e.g., `learning/`).
    - **AI Engine**: Powered by `ai` (Vercel AI SDK) and `@ai-sdk/google` (Gemini Flash). Centralized in `src/plugins/ai-service.ts`.
    - **Database**: Drizzle ORM with PostgreSQL (Postgres.js/pg). Managed in `src/plugins/database.ts`.
    - **Error Handling**: Global error handler with Zod support in `src/plugins/error-handler.ts`.
- **Frontend (`/app/frontend`)**: Expo SDK 54 with Expo Router.
    - File-based routing in `app/`.
    - Uses `@/` path alias for `src` (or similar root) imports.
    - Theme-aware components using `useColorScheme`.

## 🚦 Operational Rules
- **Plan-First (Halluzinations-Schutz)**: Vor großen Änderungen [PLAN] erstellen. Bei Unklarheiten erst Interview-Fragen stellen (Edge Cases, Tradeoffs), um Annahmen zu externalisieren. Execution erst nach Review/Bestätigung.
- **Search-First**: MCP-Check (Tavily/Context7) vor internem Wissen für State-of-the-Art.
- **Clean Code**: SOLID, DRY, Typsicherheit. "DONE" = `get_errors` frei & build-fähig.
- **Self-Correction**: Max. 3 Iterationen bei Fehlern, dann Rücksprache.

## 🤝 Human-in-the-Loop
`[WAIT_FOR_CONFIRMATION]` erforderlich bei:
- Destruktiven DB-Migrationen.
- Refactorings zentraler Plugins (`src/plugins`) oder Projektstruktur.
- Breaking Changes (API, `config.ts`).
- Neuen Architekturen oder großen Libraries.

## 🧠 Core MVP Features & Logic
- **Personalized Learning**: Der Agent des Softwareprojekts fungiert als Tutor. Er identifiziert Wissenslücken und schlägt proaktiv neue Themen vor.
- **AI Memory Layer**: 
    - Speichert Nutzerfortschritt und validiertes Wissen ("Nuggets").
    - Verwendet Vektordatenbank (geplant: Pinecone oder Supabase Vector) für semantische Suche nach Wissenslücken.
- **Dynamic Research**: 
    - Tool-Calling via Vercel AI SDK.
    - Integration von Tavily/Perplexity API für Echtzeit-Websuche.
    - News-Aggregator für Trend-Themen.
- **Nugget Engine**: Generierung von kurzen Lerneinheiten (Mini-Cards) inkl. Check-Fragen zur Verifizierung.

## 🏗️ Backend Module Architecture (Planned)
Jedes Modul folgt dem Muster: `Controller -> Service -> Schema/Routes`.
- `auth/`: JWT-Handling & User-Profile.
- `learning/`: Kernlogik für Learning & Kurse.
- `ai/`: Zentrale Schnittstelle zum LLM & Prompt-Management.
- `memory/`: Management des Nutzerwissens & Vector-Sync.
- `research/`: Web-Search & News-Sourcing.

## 🔧 Technischer Stack (Update)
- **Framework**: Fastify (Node.js/TypeScript)
- **AI SDK**: Vercel AI SDK (`ai`), OpenAI (GPT-4o), Deepseek.
- **Validation**: Zod + Fastify-Schema.
- **Database**: PostgreSQL (Prisma) + Vector Extension.

## 📂 Key Files
- `app/backend/src/app.ts`: Core server logic and plugin registration.
- `app/backend/src/config/env.ts`: Central configuration and Zod validation.
- `app/backend/src/plugins/ai-service.ts`: Shared AI SDK instance.
- `app/backend/src/plugins/database.ts`: Drizzle ORM initialization.

## 🛠️ Critical Workflows
- **Backend Dev**: `cd app/backend && npm run dev` (uses `tsx watch`).
- **Frontend Dev**: `cd app/frontend && npx expo start`.
- **Environment**: Backend expects a `.env` file; see `app/backend/config.ts` for required keys (`PORT`, `NODE_ENV`).

## 📏 Project Conventions
- **Type Safety**: Strict TypeScript everywhere.
- **Backend Routing**: Register routes as Fastify plugins in `app.ts` using `app.register`.
- **Frontend Components**:
    - Reusable UI in `components/ui/`.
    - Use `ThemedText` and `ThemedView` from `components/` for automatic dark mode support.
    - Icons: Use `IconSymbol` (SF Pro on iOS, Material Icons on others).

## 🔌 Integration Points
- **LLM**: Gemini Flash (Google) für die Entwicklung (Developer Experience & Kosten), später Deepseek (via Vercel AI SDK) für Production.
- **Search**: Geplante Integration von Tools wie Tavily oder Perplexity API für Web-Research.
- **Cross-Component**: Frontend kommuniziert mit Port 3000 (Backend).

## 🛠️ Status & Experimente
- **Nugget Engine**: Aktuell in der Testphase („Rumprobieren“). Ziel ist eine stabile Generierung basierend auf Nutzerinteressen.

## 🔌 MCP Integrations & Research Tools
Um den "Search-First"-Ansatz und die "State of the Art"-Anforderung zu erfüllen, stehen folgende MCP (Model Context Protocol) Server zur Verfügung:

- **Tavily**: Primäres Tool für Echtzeit-Websuche (News, aktuelle Trends, Dokumentationssuche).
- **Playwright**: Browser-Automatisierung für Frontend-Validierung, Debugging (Network/Console), Viewport-Tests und visuelle Snapshots.
- **Context7**: Spezialisiert auf die Abfrage aktueller Dokumentationen und Code-Beispiele für Frameworks/Libraries.

  - **GitHub**: Zugriff auf Repositories für Issue-Tracking, Code-Search und Pull Requests.

### 🧠 Research-Strategie & MCP-Orchestrierung
1.  **Search-First & State of the Art**: Nutze MCP-Tools *bevor* du dich auf internes Trainingswissen verlässt.
    -   Verwende **Tavily** für News, Trends und allgemeine Web-Recherche.
    -   Verwende **Context7** (`resolve-library-id` -> `query-docs`) für präzise API-Details und Framework-Dokumentationen.
2.  **Frontend-Validation & Debugging (Playwright)**:
    -   Prüfe UI-Modelle und Styles via Snapshots/Screenshots.
    -   Analysiere Network-Requests oder fange Console-Errors ab, wenn das Frontend lokal oder in Staging läuft.
    -   Teste reaktives Verhalten in verschiedenen Viewports.
3.  **Repo-Context via GitHub**: Nutze das GitHub MCP, um Issues zu verwalten oder nach ähnlichen Implementierungsmustern in anderen (deinen) Repositories zu suchen, falls die lokale Suche (`grep_search`) nicht ausreicht.
4.  **Double-Check & Validation**:
    -   Vergleiche interne Agenten-Daten mit MCP-Ergebnissen. Bei Diskrepanzen haben die aktuellsten stabilen Docs (Context7/Tavily) Vorrang.
    -   Prüfe bei Libraries immer auf Breaking Changes in den neuesten Stable-Releases.
5.  **Effizienz**: Wähle das Tool primär nach der Informationsquelle (Web vs. Strukturierte Doku vs. Repository-Daten).
