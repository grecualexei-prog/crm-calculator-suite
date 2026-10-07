import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'crm_db'
});

app.use(cors());
app.use(express.json());

// ============= LEADS =============
app.get('/api/leads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/leads', async (req, res) => {
  const { company, contact, email, phone, status, value, score, notes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO leads (company, contact, email, phone, status, value, score, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [company, contact, email, phone, status || 'New', value || 0, score || 0, notes || '']
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  const { company, contact, email, phone, status, value, score, notes } = req.body;
  try {
    const result = await pool.query(
      'UPDATE leads SET company=$1, contact=$2, email=$3, phone=$4, status=$5, value=$6, score=$7, notes=$8 WHERE id=$9 RETURNING *',
      [company, contact, email, phone, status, value, score, notes, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM leads WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= OFFERS =============
app.get('/api/offers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM offers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/offers', async (req, res) => {
  const { lead_id, amount, discount, margin, status, expiry } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO offers (lead_id, amount, discount, margin, status, expiry) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [lead_id, amount, discount || 0, margin || 0, status || 'Pending', expiry]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/offers/:id', async (req, res) => {
  const { id } = req.params;
  const { lead_id, amount, discount, margin, status, expiry } = req.body;
  try {
    const result = await pool.query(
      'UPDATE offers SET lead_id=$1, amount=$2, discount=$3, margin=$4, status=$5, expiry=$6 WHERE id=$7 RETURNING *',
      [lead_id, amount, discount, margin, status, expiry, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/offers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM offers WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= ORDERS =============
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const { lead_id, amount, status, shipping_status, payment_status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (lead_id, amount, status, shipping_status, payment_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [lead_id, amount, status || 'Approved', shipping_status || 'Ready', payment_status || 'Pending']
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { lead_id, amount, status, shipping_status, payment_status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE orders SET lead_id=$1, amount=$2, status=$3, shipping_status=$4, payment_status=$5 WHERE id=$6 RETURNING *',
      [lead_id, amount, status, shipping_status, payment_status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM orders WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= INVOICES =============
app.get('/api/invoices', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invoices ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  const { order_id, amount, status, due_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO invoices (order_id, amount, status, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [order_id, amount, status || 'Pending', due_date]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;
  const { order_id, amount, status, due_date, paid_date } = req.body;
  try {
    const result = await pool.query(
      'UPDATE invoices SET order_id=$1, amount=$2, status=$3, due_date=$4, paid_date=$5 WHERE id=$6 RETURNING *',
      [order_id, amount, status, due_date, paid_date, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= STOCK =============
app.get('/api/stock', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stock ORDER BY product_name ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/stock', async (req, res) => {
  const { sku, product_name, quantity, reserved, location, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO stock (sku, product_name, quantity, reserved, location, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [sku, product_name, quantity, reserved || 0, location, status || 'In Stock']
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/stock/:id', async (req, res) => {
  const { id } = req.params;
  const { sku, product_name, quantity, reserved, location, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE stock SET sku=$1, product_name=$2, quantity=$3, reserved=$4, location=$5, status=$6 WHERE id=$7 RETURNING *',
      [sku, product_name, quantity, reserved, location, status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= KPI STATS =============
app.get('/api/kpi/summary', async (req, res) => {
  try {
    const leads = await pool.query('SELECT COUNT(*) FROM leads');
    const offers = await pool.query('SELECT SUM(amount) FROM offers WHERE status = \'Accepted\'');
    const orders = await pool.query('SELECT SUM(amount) FROM orders');
    const invoices = await pool.query('SELECT SUM(amount) FROM invoices WHERE status = \'Paid\'');
    const revenue = await pool.query('SELECT SUM(amount) FROM orders');
    const profit = await pool.query('SELECT SUM(amount * 0.31) FROM orders');

    res.json({
      total_leads: parseInt(leads.rows[0].count),
      pipeline_value: offers.rows[0].sum || 0,
      total_orders: parseInt(orders.rows[0].count),
      total_revenue: orders.rows[0].sum || 0,
      collected: invoices.rows[0].sum || 0,
      profit_estimate: profit.rows[0].sum || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= ACTIVITY LOG =============
app.get('/api/activity', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activity_log ORDER BY timestamp DESC LIMIT 50');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/activity', async (req, res) => {
  const { user_id, type, description, target, amount } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO activity_log (user_id, type, description, target, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, type, description, target, amount || 0]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ CRM Backend server running on http://localhost:${PORT}`);
});
