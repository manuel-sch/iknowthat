# AI Coding Agent Guide - iknowthat

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

## 🧠 Core MVP Features & Logic
- **Personalized Learning**: Der Agent fungiert als Tutor. Er identifiziert Wissenslücken und schlägt proaktiv neue Themen vor.
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
