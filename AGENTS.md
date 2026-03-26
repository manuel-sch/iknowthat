# AI Coding Agent Guide - iknowthat

This guide helps AI agents understand the architecture and conventions of the `iknowthat` project to be immediately productive.

## 🏗️ Architecture "Big Picture"
The project is a monorepo (though currently loose) containing a Fastify backend and an Expo (React Native) frontend.

- **Backend (`/app/backend`)**: Fastify-based Node.js server.
    - Uses `buildApp()` pattern in `src/app.ts` for testability.
    - Environment config via `@fastify/env` with Zod-like schema in `config.ts`.
    - Future-proofing: Architecture suggests module-based routing in `src/modules/` (e.g., `user/user.route.ts`).
    - AI Integration: Prepared for OpenAI/AI SDK via `@ai-sdk/openai` and `ai` packages.
- **Frontend (`/app/frontend`)**: Expo SDK 54 with Expo Router.
    - File-based routing in `app/`.
    - Uses `@/` path alias for `src` (or similar root) imports.
    - Theme-aware components using `useColorScheme`.

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
- **Cross-Component**: Frontend communicates with the backend via the `PORT` defined in backend config (default 3000).
- **External**: Ready for OpenAI integration. Ensure `OPENAI_API_KEY` is considered in future config expansions.

## 📂 Key Files
- `app/backend/src/app.ts`: Core server logic and plugin registration.
- `app/backend/config.ts`: Central configuration and Fastify type augmentation.
- `app/frontend/app/_layout.tsx`: Root layout and theme provider.
- `app/frontend/constants/theme.ts`: Brand colors and UI tokens.

