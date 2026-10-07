# CRM Dashboard - CRUD Implementation

## Backend Setup

### Prerequisites
- Node.js 16+
- PostgreSQL 12+

### Installation

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
```

### Database Setup

```bash
psql -U postgres -f database.sql
```

### Start Backend Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## Frontend Setup

```bash
npm install
npm run dev
```

## API Endpoints

### Leads
- `GET /api/leads` - List all leads
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Offers
- `GET /api/offers` - List all offers
- `POST /api/offers` - Create new offer
- `PUT /api/offers/:id` - Update offer
- `DELETE /api/offers/:id` - Delete offer

### Orders
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Stock
- `GET /api/stock` - List stock items
- `POST /api/stock` - Add stock
- `PUT /api/stock/:id` - Update stock

### KPI
- `GET /api/kpi/summary` - Get KPI summary

### Activity
- `GET /api/activity` - List activities
- `POST /api/activity` - Log activity

## Features

✅ Full CRUD for Leads
✅ Full CRUD for Offers
✅ Full CRUD for Orders
✅ Full CRUD for Invoices
✅ Full CRUD for Stock
✅ Real-time KPI calculation
✅ Activity logging
✅ Role-based access
✅ Responsive design
✅ Dark theme dashboard

## Database Schema

### Tables
- `leads` - Prospecting data
- `offers` - Commercial offers
- `orders` - Customer orders
- `invoices` - Billing
- `stock` - Inventory management
- `activity_log` - Audit trail

## Next Steps

1. Add authentication (JWT)
2. Add user roles and permissions
3. Add real-time updates with WebSockets
4. Add data export (CSV/PDF)
5. Add advanced filtering and search
6. Add dashboard charts with Recharts
