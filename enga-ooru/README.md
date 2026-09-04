# Enga Ooru API

Local community marketplace API built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set `MONGO_URI`.
3. Start the API:

   ```bash
   npm run dev
   ```

The server runs on `http://localhost:5000` by default.

## Structure

```text
server.js
models/
  Listing.js
controllers/
  listingController.js
routes/
  listingRoutes.js
```

## Endpoints

- `GET /api/health` - Health check.
- `GET /api/listings` - Approved listings. Optional query parameters: `category`, `location`, and `keyword`.
- `GET /api/listings/:id` - Approved listing detail and view increment.
- `POST /api/listings/add` - Submit a listing. New listings always require approval.
- `GET /api/listings/admin/pending` - List unapproved listings.
- `PUT /api/listings/admin/approve/:id` - Approve a listing.
- `DELETE /api/listings/admin/:id` - Delete a listing.

Admin endpoints are intentionally unprotected here because authentication and authorization depend on the consuming application. Add admin middleware before exposing them beyond a trusted local environment.
