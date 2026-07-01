# Cagette API

Express + Prisma + PostgreSQL backend for the Cagette app.

## Setup

```
cp .env.example .env   # set DATABASE_URL (and OCR_PROVIDER/OCR_API_KEY if you have one)
npm install
npm run prisma:migrate
npm run seed
npm run dev
```

## Endpoints

- `GET /api/inventory` — all items (with computed expiry status), plus `summary`/`expiring`/`low`.
- `POST /api/inventory` — add an item manually.
- `DELETE /api/inventory/:id` — "Consommé" (remove from stock).
- `POST /api/inventory/:id/add-to-list` — "+ Liste" for a low-stock item.
- `GET /api/promos` — promo deals, `linked` computed against current stock.
- `POST /api/receipts/scan` (multipart `photo`) — run OCR on a receipt photo, returns a pending receipt with editable items.
- `POST /api/receipts/:id/items` — add a missing item to a pending receipt.
- `PATCH /api/receipts/:id/items/:itemId` — edit a scanned item's `qty`/`included`.
- `POST /api/receipts/:id/confirm` — turn the included scanned items into inventory items.

## Receipt OCR

`src/services/ocrService.js` calls a real provider when `OCR_PROVIDER` and `OCR_API_KEY` are set
(a Mindee Receipt OCR integration is wired in as an example). Without a key configured, it returns
a fixed demo parse so the rest of the scan flow can be built/tested end-to-end.
