# Cagette (mobile app)

React Native / Expo app implementing the Cagette design: Accueil, Stock, Alertes, Promos, and the
receipt scan flow (camera → OCR → confirm quantities → done).

## Setup

```
cp .env.example .env   # set EXPO_PUBLIC_API_URL to your Cagette API address
npm install
npm start
```

`localhost` works for the iOS Simulator and `web`. On a physical device or the Android emulator,
set `EXPO_PUBLIC_API_URL` to your machine's LAN IP instead (e.g. `http://192.168.1.23:4000`).

## Structure

- `src/theme.js` — colors/fonts ported from the design (Bricolage Grotesque + Nunito).
- `src/context/` — `InventoryContext` / `PromosContext`, fetch from the API and expose actions
  (`consume`, `addToList`, refresh).
- `src/navigation/` — bottom tabs (Accueil/Stock/Alertes/Promos) with a custom tab bar and a raised
  scan button that opens the scan flow as a full-screen modal.
- `src/screens/` — one file per tab, plus `screens/scan/ScanFlowScreen.js` for the camera →
  processing → confirm → done flow (uses `expo-camera` and `expo-image-picker`).
- `src/api/client.js` — thin fetch wrapper over the backend REST API.

## Notes

- Camera and photo library permissions are configured via the `expo-camera` / `expo-image-picker`
  config plugins in `app.json`.
- Requires a running instance of `../server` (see its README) for data — there's no local mock data.
