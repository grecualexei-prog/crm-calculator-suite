# CRM Dashboard Full Stack

A complete CRM dashboard project with:
- React + Vite frontend
- Express API backend
- PostgreSQL support
- Memory fallback for quick startup
- CRUD for leads, offers, orders, invoices and stock
- Overview and KPI panel

## Quick start

1. Install dependencies

```bash
npm install
```

2. Create PostgreSQL database

```bash
createdb crm_db
psql -d crm_db -f db/init.sql
```

3. Create environment file

```bash
cp .env.example .env
```

4. Run project

```bash
npm run dev
```

Open:
- Frontend: http://localhost:5173
- API: http://localhost:5000

## PostgreSQL connection

The app supports PostgreSQL via `DATABASE_URL` in `.env`.
If no `DATABASE_URL` is present, the project runs in in-memory mode.

## Main scripts

- `npm run dev` — run backend + frontend together
- `npm run server` — run backend only
- `npm run client` — run frontend only
- `npm run build` — build frontend

## Included modules

- Overview
- Leads
- Offers
- Orders
- Invoices
- Stock
- KPI
- Activity log

## Notes

This is a clean, ready-to-run foundation for a real CRM system. You can extend it with auth, roles, charts, export and database persistence.
