# The Intelligent Bistro

React Native Expo frontend plus a Node.js Express backend for a polished restaurant ordering MVP with conversational cart updates.

## Repository Structure

```text
the-intelligent-bistro/
  backend/   # Express + TypeScript AI ordering API
  mobile/    # Expo + React Native frontend
```

## Frontend

- Expo + React Native + TypeScript
- NativeWind styling
- Zustand cart state
- Axios API client
- Premium mobile UI for menu browsing, cart management, and AI chat

## Backend

- Node.js + Express + TypeScript
- Zod validation for requests and AI output
- OpenAI integration with deterministic fallback parsing
- CORS + dotenv

## Setup

Install dependencies in each app:

```bash
cd backend && npm install
cd ../mobile && npm install
```

Create local env files from the examples:

```bash
cp backend/.env.example backend/.env.local
cp mobile/.env.example mobile/.env.local
```

If `OPENAI_API_KEY` is empty, the backend uses the built-in fallback parser.

## Run

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd mobile
npm start
```

Or run from the repo root:

```bash
npm run dev:backend
npm run dev:frontend
```
