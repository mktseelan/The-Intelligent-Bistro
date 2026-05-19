
## Project Structure

intelligent-bistro/
  backend/
  mobile/

## Frontend

- React Native with Expo
- TypeScript
- NativeWind for styling
- Zustand for cart state
- Axios for API calls
- Single-screen premium mobile UI for menu, cart, and AI chat

## Backend

- Node.js + Express
- TypeScript
- Zod for request and AI JSON validation
- OpenAI API integration with deterministic fallback parsing
- CORS + dotenv

## Run The Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

If `OPENAI_API_KEY` is left empty, the server will use the built-in fallback parser.

## Run The Mobile App

```bash
cd mobile
cp .env.example .env
npm install
npm start
```

Set `EXPO_PUBLIC_API_BASE_URL` in `mobile/.env` to the backend URL you want the app to call.
