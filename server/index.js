import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 5000;
const connectionString = process.env.DATABASE_URL || null;

const pool = connectionString ? new Pool({ connectionString }) : null;

app.use(cors());
app.use(express.json());

const fallback = {
  leads: [
    { id: 1, company: 'Acme Corp', contact: 'John Doe', email: 'john@acme.com', phone: '+1 555 1001', status: 'Qualified', value: 55000, score: 82, notes: 'High potential enterprise buyer' },
    { id: 2, company: 'Nova Labs', contact: 'Jane Smith', email: 'jane@novalabs.io', phone: '+1 555 1002', status: 'Contacted', value: 32000, score: 64, notes: 'Awaiting follow-up' },
    { id: 3, company: 'Atlas Group', contact: 'Mark Lee', email: 'mark@atlasgroup.com', phone: '+1 555 1003', status: 'Proposal', value: 41000, score: 76, notes: 'Budget approved' },
  ],
  offers: [
    { id: 1, leadId: 1, amount: 55000, discount: 10, margin: 28, status: 'Accepted', expiry: '2026-10-18' },
    { id: 2, leadId: 2, amount: 32000, discount: 5, margin: 25, status: 'Pending', expiry: '2026-10-16' },
    { id: 3, leadId: 3, amount: 41000, discount: 8, margin: 30, status: 'Rejected', expiry: '2026-10-12' },
  ],
  orders: [
    { id: 1, leadId: 1, amount: 55000, status: 'Delivered', shippingStatus: 'Delivered', paymentStatus: 'Paid' },
    { id: 2, leadId: 2, amount: 32000, status: 'Processing', shippingStatus: 'In Transit', paymentStatus: 'Pending' },
  ],
  invoices: [
    { id: 1, orderId: 1, amount: 55000, status: 'Paid', dueDate: '2026-10-03', paidDate: '2026-10-02' },
    { id: 2, orderId: 2, amount: 32000, status: 'Pending', dueDate: '2026-10-20', paidDate: '' },
  ],
  stock: [
    { id: 1, sku: 'SKU-101', product: 'Starter Package', quantity: 140, reserved: 25, location: 'WH-A', status: 'In Stock' },
    { id: 2, sku: 'SKU-202', product: 'Growth Bundle', quantity: 64, reserved: 20, location: 'WH-B', status: 'Low Stock' },
    { id: 3, sku: 'SKU-303', product: 'Premium Suite', quantity: 12, reserved: 9, location: 'WH-C', status: 'Critical' },
  ],
  activity: [
    { id: 1, type: 'Order', description: 'Created order #1 for Acme Corp', createdAt: '2026-10-07T09:15:00Z' },
    { id: 2, type: 'Invoice', description: 'Invoice #1 sent to Acme Corp', createdAt: '2026-10-07T10:20:00Z' },
    { id: 3, type: 'Lead', description: 'Lead Atlas Group moved to proposal stage', createdAt: '2026-10-07T11:00:00Z' },
  ],
};

const ensureSchema = async () => {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      company VARCHAR(255) NOT NULL,
      contact VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50),
      status VARCHAR(50) DEFAULT 'New',
      value NUMERIC(12,2) DEFAULT 0,
      score INTEGER DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS offers (
      id SERIAL PRIMARY KEY,
      lead_id INTEGER,
      amount NUMERIC(12,2) DEFAULT 0,
      discount NUMERIC(5,2) DEFAULT 0,
      margin NUMERIC(5,2) DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Pending',
      expiry DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      lead_id INTEGER,
      amount NUMERIC(12,2) DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Approved',
      shipping_status VARCHAR(50) DEFAULT 'Ready',
      payment_status VARCHAR(50) DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      order_id INTEGER,
      amount NUMERIC(12,2) DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Pending',
      due_date DATE,
      paid_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS stock (
      id SERIAL PRIMARY KEY,
      sku VARCHAR(100) UNIQUE,
      product VARCHAR(255),
      quantity INTEGER DEFAULT 0,
      reserved INTEGER DEFAULT 0,
      location VARCHAR(100),
      status VARCHAR(50) DEFAULT 'In Stock',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS activity (
      id SERIAL PRIMARY KEY,
      type VARCHAR(50),
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

const safeJson = (value) => value ?? [];

const db = {
  async getLeads() {
    if (!pool) return fallback.leads;
    const { rows } = await pool.query('SELECT * FROM leads ORDER BY id DESC');
    return rows;
  },
  async createLead(payload) {
    if (!pool) {
      const item = { id: Date.now(), ...payload, value: Number(payload.value || 0), score: Number(payload.score || 0) };
      fallback.leads.unshift(item);
      return item;
    }
    const { rows } = await pool.query(
      `INSERT INTO leads (company, contact, email, phone, status, value, score, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [payload.company, payload.contact || '', payload.email || '', payload.phone || '', payload.status || 'New', Number(payload.value || 0), Number(payload.score || 0), payload.notes || '']
    );
    return rows[0];
  },
  async updateLead(id, payload) {
    if (!pool) {
      const item = fallback.leads.find((lead) => lead.id === Number(id));
      Object.assign(item, { ...payload, value: Number(payload.value || 0), score: Number(payload.score || 0) });
      return item;
    }
    const { rows } = await pool.query(
      `UPDATE leads SET company=$1, contact=$2, email=$3, phone=$4, status=$5, value=$6, score=$7, notes=$8, updated_at=NOW() WHERE id=$9 RETURNING *`,
      [payload.company, payload.contact || '', payload.email || '', payload.phone || '', payload.status || 'New', Number(payload.value || 0), Number(payload.score || 0), payload.notes || '', id]
    );
    return rows[0];
  },
  async deleteLead(id) {
    if (!pool) {
      fallback.leads = fallback.leads.filter((lead) => lead.id !== Number(id));
      return true;
    }
    await pool.query('DELETE FROM leads WHERE id = $1', [id]);
    return true;
  },
  async getOffers() {
    if (!pool) return fallback.offers;
    const { rows } = await pool.query('SELECT * FROM offers ORDER BY id DESC');
    return rows;
  },
  async createOffer(payload) {
    if (!pool) {
      const item = { id: Date.now(), ...payload, amount: Number(payload.amount || 0), discount: Number(payload.discount || 0), margin: Number(payload.margin || 0) };
      fallback.offers.unshift(item);
      return item;
    }
    const { rows } = await pool.query(
      `INSERT INTO offers (lead_id, amount, discount, margin, status, expiry)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [Number(payload.leadId), Number(payload.amount || 0), Number(payload.discount || 0), Number(payload.margin || 0), payload.status || 'Pending', payload.expiry || null]
    );
    return rows[0];
  },
  async getOrders() {
    if (!pool) return fallback.orders;
    const { rows } = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    return rows;
  },
  async createOrder(payload) {
    if (!pool) {
      const item = { id: Date.now(), ...payload, amount: Number(payload.amount || 0) };
      fallback.orders.unshift(item);
      return item;
    }
    const { rows } = await pool.query(
      `INSERT INTO orders (lead_id, amount, status, shipping_status, payment_status)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [Number(payload.leadId), Number(payload.amount || 0), payload.status || 'Approved', payload.shippingStatus || 'Ready', payload.paymentStatus || 'Pending']
    );
    return rows[0];
  },
  async getInvoices() {
    if (!pool) return fallback.invoices;
    const { rows } = await pool.query('SELECT * FROM invoices ORDER BY id DESC');
    return rows;
  },
  async createInvoice(payload) {
    if (!pool) {
      const item = { id: Date.now(), ...payload, amount: Number(payload.amount || 0) };
      fallback.invoices.unshift(item);
      return item;
    }
    const { rows } = await pool.query(
      `INSERT INTO invoices (order_id, amount, status, due_date, paid_date)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [Number(payload.orderId), Number(payload.amount || 0), payload.status || 'Pending', payload.dueDate || null, payload.paidDate || null]
    );
    return rows[0];
  },
  async getStock() {
    if (!pool) return fallback.stock;
    const { rows } = await pool.query('SELECT * FROM stock ORDER BY id DESC');
    return rows;
  },
  async createStock(payload) {
    if (!pool) {
      const item = { id: Date.now(), ...payload, quantity: Number(payload.quantity || 0), reserved: Number(payload.reserved || 0) };
      fallback.stock.unshift(item);
      return item;
    }
    const { rows } = await pool.query(
      `INSERT INTO stock (sku, product, quantity, reserved, location, status)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [payload.sku, payload.product, Number(payload.quantity || 0), Number(payload.reserved || 0), payload.location || '', payload.status || 'In Stock']
    );
    return rows[0];
  },
  async getActivity() {
    if (!pool) return fallback.activity;
    const { rows } = await pool.query('SELECT * FROM activity ORDER BY id DESC LIMIT 20');
    return rows;
  },
  async addActivity(type, description) {
    if (!pool) {
      fallback.activity.unshift({ id: Date.now(), type, description, createdAt: new Date().toISOString() });
      return fallback.activity[0];
    }
    const { rows } = await pool.query('INSERT INTO activity (type, description) VALUES ($1,$2) RETURNING *', [type, description]);
    return rows[0];
  }
};

const buildOverview = (leadsList, ordersList, invoiceList) => {
  const totalLeads = leadsList.length;
  const pipelineValue = leadsList.reduce((sum, lead) => sum + Number(lead.value || 0), 0);
  const totalOrders = ordersList.length;
  const grossProfit = ordersList.reduce((sum, order) => sum + Number(order.amount || 0) * 0.31, 0);
  const margin = pipelineValue ? ((grossProfit / pipelineValue) * 100).toFixed(1) : 0;
  const conversionRate = totalLeads ? ((ordersList.filter((order) => order.status === 'Delivered').length / totalLeads) * 100).toFixed(1) : 0;
  const totalCollected = invoiceList.filter((item) => item.status === 'Paid').reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return {
    totalLeads,
    pipelineValue,
    totalOrders,
    grossProfit,
    margin,
    conversionRate,
    retention: 92,
    churn: 8,
    collected: totalCollected,
  };
};

app.get('/api/overview', async (_req, res) => {
  const leadsList = await db.getLeads();
  const ordersList = await db.getOrders();
  const invoiceList = await db.getInvoices();
  res.json(buildOverview(leadsList, ordersList, invoiceList));
});

app.get('/api/leads', async (_req, res) => {
  const data = await db.getLeads();
  res.json(safeJson(data));
});

app.post('/api/leads', async (req, res) => {
  const created = await db.createLead(req.body);
  await db.addActivity('Lead', `Lead created for ${created.company || 'new customer'}`);
  res.json(created);
});

app.put('/api/leads/:id', async (req, res) => {
  const updated = await db.updateLead(req.params.id, req.body);
  await db.addActivity('Lead', `Lead updated for ${updated.company || 'customer'}`);
  res.json(updated);
});

app.delete('/api/leads/:id', async (req, res) => {
  await db.deleteLead(req.params.id);
  await db.addActivity('Lead', `Lead deleted #${req.params.id}`);
  res.json({ success: true });
});

app.get('/api/offers', async (_req, res) => {
  res.json(safeJson(await db.getOffers()));
});

app.post('/api/offers', async (req, res) => {
  const created = await db.createOffer(req.body);
  await db.addActivity('Offer', `Offer created for lead #${created.leadId || 'unknown'}`);
  res.json(created);
});

app.get('/api/orders', async (_req, res) => {
  res.json(safeJson(await db.getOrders()));
});

app.post('/api/orders', async (req, res) => {
  const created = await db.createOrder(req.body);
  await db.addActivity('Order', `Order created for lead #${created.leadId || 'unknown'}`);
  res.json(created);
});

app.get('/api/invoices', async (_req, res) => {
  res.json(safeJson(await db.getInvoices()));
});

app.post('/api/invoices', async (req, res) => {
  const created = await db.createInvoice(req.body);
  await db.addActivity('Invoice', `Invoice created for order #${created.orderId || 'unknown'}`);
  res.json(created);
});

app.get('/api/stock', async (_req, res) => {
  res.json(safeJson(await db.getStock()));
});

app.post('/api/stock', async (req, res) => {
  const created = await db.createStock(req.body);
  await db.addActivity('Stock', `Stock updated for ${created.product || 'product'}`);
  res.json(created);
});

app.get('/api/activity', async (_req, res) => {
  res.json(safeJson(await db.getActivity()));
});

const start = async () => {
  if (pool) {
    await ensureSchema();
    console.log('PostgreSQL connected.');
  } else {
    console.log('No DATABASE_URL provided. Running in memory mode.');
  }

  app.listen(port, () => {
    console.log(`CRM API running on http://localhost:${port}`);
  });
};

start();
