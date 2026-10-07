CREATE DATABASE crm_db;
\c crm_db;

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
