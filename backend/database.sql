-- Create database
CREATE DATABASE crm_db;

-- Connect to database
\c crm_db;

-- Create leads table
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  contact VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'New',
  value DECIMAL(12, 2) DEFAULT 0,
  score INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create offers table
CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  lead_id INT REFERENCES leads(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2),
  discount DECIMAL(5, 2) DEFAULT 0,
  margin DECIMAL(5, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Pending',
  expiry DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  lead_id INT REFERENCES leads(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'Approved',
  shipping_status VARCHAR(50) DEFAULT 'Ready',
  payment_status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create invoices table
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'Pending',
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create stock table
CREATE TABLE stock (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(100) UNIQUE,
  product_name VARCHAR(255),
  quantity INT DEFAULT 0,
  reserved INT DEFAULT 0,
  location VARCHAR(100),
  status VARCHAR(50) DEFAULT 'In Stock',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_log table
CREATE TABLE activity_log (
  id SERIAL PRIMARY KEY,
  user_id INT,
  type VARCHAR(50),
  description TEXT,
  target VARCHAR(255),
  amount DECIMAL(12, 2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_activity_timestamp ON activity_log(timestamp);
