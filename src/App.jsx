import { useEffect, useMemo, useState } from 'react';

const API = '/api';
const navItems = [
  { key: 'overview', label: 'Overview', icon: '📊' },
  { key: 'leads', label: 'Leads', icon: '👥' },
  { key: 'offers', label: 'Offers', icon: '📄' },
  { key: 'orders', label: 'Orders', icon: '📦' },
  { key: 'invoices', label: 'Invoices', icon: '💰' },
  { key: 'stock', label: 'Stock', icon: '🚚' },
  { key: 'activity', label: 'Activity', icon: '🧾' },
  { key: 'kpi', label: 'KPI', icon: '📈' },
];

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function App() {
  const [activeView, setActiveView] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [leads, setLeads] = useState([]);
  const [offers, setOffers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [stock, setStock] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [ov, ls, os, ors, inv, st, act] = await Promise.all([
        fetch(`${API}/overview`).then((r) => r.json()),
        fetch(`${API}/leads`).then((r) => r.json()),
        fetch(`${API}/offers`).then((r) => r.json()),
        fetch(`${API}/orders`).then((r) => r.json()),
        fetch(`${API}/invoices`).then((r) => r.json()),
        fetch(`${API}/stock`).then((r) => r.json()),
        fetch(`${API}/activity`).then((r) => r.json()),
      ]);

      setOverview(ov);
      setLeads(ls);
      setOffers(os);
      setOrders(ors);
      setInvoices(inv);
      setStock(st);
      setActivity(act);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);
    const totalInvoices = invoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
    const collected = invoices
      .filter((invoice) => invoice.status === 'Paid')
      .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
    const openValue = orders
      .filter((order) => order.status !== 'Delivered')
      .reduce((sum, order) => sum + Number(order.amount || 0), 0);

    return { totalRevenue, totalInvoices, collected, openValue };
  }, [orders, invoices]);

  const renderModule = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewPanel overview={overview} stats={stats} />;
      case 'leads':
        return <LeadsPanel leads={leads} refreshData={refreshData} />;
      case 'offers':
        return <OffersPanel offers={offers} leads={leads} refreshData={refreshData} />;
      case 'orders':
        return <OrdersPanel orders={orders} leads={leads} refreshData={refreshData} />;
      case 'invoices':
        return <InvoicesPanel invoices={invoices} orders={orders} refreshData={refreshData} />;
      case 'stock':
        return <StockPanel stock={stock} refreshData={refreshData} />;
      case 'activity':
        return <ActivityPanel activity={activity} />;
      case 'kpi':
        return <KpiPanel overview={overview} stats={stats} />;
      default:
        return <OverviewPanel overview={overview} stats={stats} />;
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-mark">CRM</div>
          <div>
            <h1>CRM Pro</h1>
            <p>Performance Suite</p>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={activeView === item.key ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveView(item.key)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h2>{navItems.find((item) => item.key === activeView)?.label || 'Overview'}</h2>
          </div>
          <div className="toolbar">
            <button className="chip">Month</button>
            <button className="chip">Quarter</button>
            <button className="chip">Export</button>
          </div>
        </header>

        {loading ? <div className="status">Loading data...</div> : renderModule()}
      </main>
    </div>
  );
}

function OverviewPanel({ overview, stats }) {
  const cards = [
    { label: 'Revenue', value: formatMoney(stats.totalRevenue), delta: '+12.5%' },
    { label: 'Invoices', value: formatMoney(stats.totalInvoices), delta: '+8.1%' },
    { label: 'Collected', value: formatMoney(stats.collected), delta: '+6.3%' },
    { label: 'Open value', value: formatMoney(stats.openValue), delta: '-4.2%' },
  ];

  return (
    <section className="panel">
      <div className="metric-grid">
        {cards.map((card) => (
          <div className="metric-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small className={card.delta.startsWith('-') ? 'negative' : 'positive'}>{card.delta}</small>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="card-box">
          <h3>Sales performance</h3>
          <div className="mini-grid">
            <div><label>Leads total</label><strong>{overview?.totalLeads ?? 0}</strong></div>
            <div><label>Pipeline</label><strong>{formatMoney(overview?.pipelineValue ?? 0)}</strong></div>
            <div><label>Orders</label><strong>{overview?.totalOrders ?? 0}</strong></div>
            <div><label>Conversion</label><strong>{overview?.conversionRate ?? 0}%</strong></div>
          </div>
        </div>

        <div className="card-box">
          <h3>Finance summary</h3>
          <div className="mini-grid">
            <div><label>Gross profit</label><strong>{formatMoney(overview?.grossProfit ?? 0)}</strong></div>
            <div><label>Margin</label><strong>{overview?.margin ?? 0}%</strong></div>
            <div><label>Retention</label><strong>{overview?.retention ?? 0}%</strong></div>
            <div><label>Churn</label><strong>{overview?.churn ?? 0}%</strong></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadsPanel({ leads, refreshData }) {
  const [form, setForm] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    status: 'New',
    value: 0,
    score: 0,
    notes: '',
  });
  const [editingId, setEditingId] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, value: Number(form.value || 0), score: Number(form.score || 0) };
    const url = editingId ? `${API}/leads/${editingId}` : `${API}/leads`;
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setForm({ company: '', contact: '', email: '', phone: '', status: 'New', value: 0, score: 0, notes: '' });
    setEditingId(null);
    refreshData();
  };

  const edit = (lead) => {
    setForm({ ...lead, value: Number(lead.value || 0), score: Number(lead.score || 0) });
    setEditingId(lead.id);
  };

  const remove = async (id) => {
    await fetch(`${API}/leads/${id}`, { method: 'DELETE' });
    refreshData();
  };

  return (
    <section className="panel">
      <div className="panel-header"><h3>Leads</h3></div>

      <form className="crud-form" onSubmit={submit}>
        <div className="field-grid">
          <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
          <input placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Proposal</option>
            <option>Closed</option>
          </select>
          <input type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <input type="number" placeholder="Score" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} />
        </div>
        <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <div className="form-actions">
          <button className="primary" type="submit">{editingId ? 'Update' : 'Create'} Lead</button>
          {editingId && (
            <button className="secondary" type="button" onClick={() => setEditingId(null)}>Cancel</button>
          )}
        </div>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Value</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.company}</td>
              <td>{lead.contact}</td>
              <td><span className="badge normal">{lead.status}</span></td>
              <td>{formatMoney(lead.value)}</td>
              <td>{lead.score}</td>
              <td className="row-actions">
                <button onClick={() => edit(lead)}>Edit</button>
                <button className="danger" onClick={() => remove(lead.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function OffersPanel({ offers, leads, refreshData }) {
  const [form, setForm] = useState({ leadId: '', amount: '', discount: '', margin: '', status: 'Pending', expiry: '' });

  const submit = async (event) => {
    event.preventDefault();
    await fetch(`${API}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: Number(form.leadId),
        amount: Number(form.amount),
        discount: Number(form.discount),
        margin: Number(form.margin),
        status: form.status,
        expiry: form.expiry,
      }),
    });

    setForm({ leadId: '', amount: '', discount: '', margin: '', status: 'Pending', expiry: '' });
    refreshData();
  };

  return (
    <section className="panel">
      <h3>Offers</h3>
      <form className="crud-form" onSubmit={submit}>
        <div className="field-grid">
          <select value={form.leadId} onChange={(e) => setForm({ ...form, leadId: e.target.value })} required>
            <option value="">Select lead</option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>{lead.company}</option>
            ))}
          </select>
          <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <input type="number" placeholder="Discount %" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
          <input type="number" placeholder="Margin %" value={form.margin} onChange={(e) => setForm({ ...form, margin: e.target.value })} />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>Pending</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
          <input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
        </div>
        <div className="form-actions"><button className="primary" type="submit">Create Offer</button></div>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Lead</th>
            <th>Amount</th>
            <th>Discount</th>
            <th>Margin</th>
            <th>Status</th>
            <th>Expiry</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id}>
              <td>{leads.find((l) => l.id === offer.leadId)?.company || '-'}</td>
              <td>{formatMoney(offer.amount)}</td>
              <td>{offer.discount}%</td>
              <td>{offer.margin}%</td>
              <td><span className="badge normal">{offer.status}</span></td>
              <td>{offer.expiry || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function OrdersPanel({ orders, leads, refreshData }) {
  const [form, setForm] = useState({ leadId: '', amount: '', status: 'Approved', shippingStatus: 'Ready', paymentStatus: 'Pending' });

  const submit = async (event) => {
    event.preventDefault();
    await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: Number(form.leadId),
        amount: Number(form.amount),
        status: form.status,
        shippingStatus: form.shippingStatus,
        paymentStatus: form.paymentStatus,
      }),
    });

    setForm({ leadId: '', amount: '', status: 'Approved', shippingStatus: 'Ready', paymentStatus: 'Pending' });
    refreshData();
  };

  return (
    <section className="panel">
      <h3>Orders</h3>
      <form className="crud-form" onSubmit={submit}>
        <div className="field-grid">
          <select value={form.leadId} onChange={(e) => setForm({ ...form, leadId: e.target.value })} required>
            <option value="">Select client</option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>{lead.company}</option>
            ))}
          </select>
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" required />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>Approved</option>
            <option>Processing</option>
            <option>Delivered</option>
          </select>
          <select value={form.shippingStatus} onChange={(e) => setForm({ ...form, shippingStatus: e.target.value })}>
            <option>Ready</option>
            <option>In Transit</option>
            <option>Delivered</option>
          </select>
          <select value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}>
            <option>Pending</option>
            <option>Authorized</option>
            <option>Paid</option>
          </select>
        </div>
        <div className="form-actions"><button className="primary" type="submit">Create Order</button></div>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Shipping</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{leads.find((l) => l.id === order.leadId)?.company || '-'}</td>
              <td>{formatMoney(order.amount)}</td>
              <td><span className="badge normal">{order.status}</span></td>
              <td><span className="badge normal">{order.shippingStatus}</span></td>
              <td><span className="badge normal">{order.paymentStatus}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function InvoicesPanel({ invoices, orders, refreshData }) {
  const [form, setForm] = useState({ orderId: '', amount: '', status: 'Pending', dueDate: '', paidDate: '' });

  const submit = async (event) => {
    event.preventDefault();
    await fetch(`${API}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: Number(form.orderId),
        amount: Number(form.amount),
        status: form.status,
        dueDate: form.dueDate,
        paidDate: form.paidDate,
      }),
    });

    setForm({ orderId: '', amount: '', status: 'Pending', dueDate: '', paidDate: '' });
    refreshData();
  };

  return (
    <section className="panel">
      <h3>Invoices</h3>
      <form className="crud-form" onSubmit={submit}>
        <div className="field-grid">
          <select value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })} required>
            <option value="">Select order</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>#{order.id}</option>
            ))}
          </select>
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" required />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>Pending</option>
            <option>Paid</option>
            <option>Overdue</option>
          </select>
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <input type="date" value={form.paidDate} onChange={(e) => setForm({ ...form, paidDate: e.target.value })} />
        </div>
        <div className="form-actions"><button className="primary" type="submit">Create Invoice</button></div>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Order</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Due date</th>
            <th>Paid date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((item) => (
            <tr key={item.id}>
              <td>#{item.id}</td>
              <td>#{item.orderId}</td>
              <td>{formatMoney(item.amount)}</td>
              <td><span className="badge normal">{item.status}</span></td>
              <td>{item.dueDate || '-'}</td>
              <td>{item.paidDate || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function StockPanel({ stock, refreshData }) {
  const [form, setForm] = useState({ sku: '', product: '', quantity: '', reserved: '', location: '', status: 'In Stock' });

  const submit = async (event) => {
    event.preventDefault();
    await fetch(`${API}/stock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sku: form.sku,
        product: form.product,
        quantity: Number(form.quantity),
        reserved: Number(form.reserved),
        location: form.location,
        status: form.status,
      }),
    });

    setForm({ sku: '', product: '', quantity: '', reserved: '', location: '', status: 'In Stock' });
    refreshData();
  };

  return (
    <section className="panel">
      <h3>Stock</h3>
      <form className="crud-form" onSubmit={submit}>
        <div className="field-grid">
          <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
          <input placeholder="Product" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} required />
          <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          <input type="number" placeholder="Reserved" value={form.reserved} onChange={(e) => setForm({ ...form, reserved: e.target.value })} />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Critical</option>
          </select>
        </div>
        <div className="form-actions"><button className="primary" type="submit">Add Stock</button></div>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Reserved</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item) => (
            <tr key={item.id}>
              <td>{item.sku}</td>
              <td>{item.product}</td>
              <td>{item.quantity}</td>
              <td>{item.reserved}</td>
              <td>{item.location}</td>
              <td><span className="badge normal">{item.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function ActivityPanel({ activity }) {
  return (
    <section className="panel">
      <h3>Activity log</h3>
      <div className="activity-list">
        {activity.map((item) => (
          <div key={item.id} className="activity-item">
            <div className="activity-icon">•</div>
            <div>
              <strong>{item.type}</strong>
              <p>{item.description}</p>
              <small>{item.createdAt}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function KpiPanel({ overview, stats }) {
  const items = [
    { label: 'Revenue', value: formatMoney(stats.totalRevenue) },
    { label: 'Conversion', value: `${overview?.conversionRate ?? 0}%` },
    { label: 'Margin', value: `${overview?.margin ?? 0}%` },
    { label: 'Retention', value: `${overview?.retention ?? 0}%` },
    { label: 'Churn', value: `${overview?.churn ?? 0}%` },
    { label: 'Pipeline', value: formatMoney(overview?.pipelineValue ?? 0) },
  ];

  return (
    <section className="panel">
      <h3>KPI</h3>
      <div className="kpi-grid">
        {items.map((item) => (
          <div className="metric-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
