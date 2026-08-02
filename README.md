# Asset Tracker Assignment

Full-stack asset tracking app with:

- `apps/api`: Express + TypeScript backend
- `apps/web`: React + TypeScript frontend
- `docker-compose.yml`: local PostgreSQL + PostGIS database

## Requirements

Before starting, make sure you have:

- Node.js installed
- npm installed
- Docker installed and running on your machine

This project was developed with:

- Node `v23.10.0`
- npm `11.2.0`

## Project Structure

```text
apps/
  api/    Express API
  web/    React frontend
docker-compose.yml
```

## First-Time Setup

Open a terminal in the project root and install dependencies:

```bash
npm install
```

## Start the Database

This project expects a local Postgres database with PostGIS enabled.

Start it with Docker Compose:

```bash
docker compose up -d
```

After that, check that the container is running:

```bash
docker compose ps
```

You should see the `postgres` service up and bound to port `5432`.

If you want to stop it later:

```bash
docker compose down
```

## Start the Backend

In a new terminal, run:

```bash
npm run dev:api
```

What to expect:

- the API connects to the database
- it initializes the database schema
- it seeds the assets table if it is empty
- it starts on `http://localhost:3001`

When it is ready, you should see:

```text
API listening on http://localhost:3001
```

You can verify the backend is working by opening:

- [http://localhost:3001/health](http://localhost:3001/health)

You should get:

```json
{ "ok": true }
```

## Start the Frontend

In another terminal, run:

```bash
npm run dev:web
```

Vite runs on:

- [http://localhost:5174](http://localhost:5174)

Open that URL in your browser to use the app.

## Recommended Startup Order

If you are opening the project for the first time, use this order:

1. `npm install`
2. `docker compose up -d`
3. `docker compose ps`
4. `npm run dev:api`
5. wait until you see `API listening on http://localhost:3001`
6. open [http://localhost:3001/health](http://localhost:3001/health) and confirm `{ "ok": true }`
7. `npm run dev:web`
8. open [http://localhost:5174](http://localhost:5174)

## Useful Commands

### Root

```bash
npm run lint
npm run format:check
npm run build:api
npm run build:web
```

### Backend

```bash
npm run lint --workspace @asset-tracker/api
npm run test --workspace @asset-tracker/api
npm run build --workspace @asset-tracker/api
```

### Frontend

```bash
npm run lint --workspace @asset-tracker/web
npm run test --workspace @asset-tracker/web
npm run build --workspace @asset-tracker/web
```

## Notes

- The backend uses the default local database settings from the app config.
- The frontend talks to the API at `http://localhost:3001` unless `VITE_API_BASE_URL` is set.
- The frontend production build currently shows a Vite chunk-size warning, but the build still succeeds.
