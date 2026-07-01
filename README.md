# Cagette

Anti-gaspillage app for households: recognizes grocery receipts, tracks stock, and alerts on
low/expiring items with promos linked to what you actually buy. Built from the Cagette design
prototype (see `project/Cagette.dc.html` and `chats/chat1.md` for the original design brief).

## Structure

- `server/` — Node.js + Express + PostgreSQL (Prisma) API: inventory, alerts, receipt OCR, promos.
- `app/` — React Native (Expo) mobile app: Accueil, Stock, Alertes, Promos, and the receipt scan flow.
- `project/`, `chats/` — original design bundle exported from Claude Design (kept for reference).

## Running locally

1. **Database**: have a Postgres instance available (local install or Docker).
2. **Server**:
   ```
   cd server
   cp .env.example .env   # set DATABASE_URL
   npm install
   npm run prisma:migrate
   npm run seed
   npm run dev
   ```
3. **App**:
   ```
   cd app
   cp .env.example .env   # set EXPO_PUBLIC_API_URL to the server's address
   npm install
   npm start
   ```
   Then open in the iOS Simulator, Android emulator, Expo Go, or `npm run web`.

See `server/README.md` and `app/README.md` for more detail (including the receipt OCR provider
setup, which falls back to a fixed demo parse until an API key is configured).
