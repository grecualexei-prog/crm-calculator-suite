import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const FinanceModuleReal = () => {
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    total_invoiced: 0,
    total_collected: 0,
    pending: 0,
    overdue: 0
  });
  const [formData, setFormData] = useState({
    order_id: '',
    amount: 0,
    status: 'Pending',
    due_date: '',
    paid_date: ''
  });

  useEffect(() => {
    fetchInvoices();
    fetchOrders();
    fetchStats();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/invoices`);
      const data = await res.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/kpi/summary`);
      const data = await res.json();
      setStats({
        total_invoiced: data.revenue || 0,
        total_collected: data.collected || 0,
        pending: (data.revenue || 0) - (data.collected || 0),
        overdue: 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order_id' || name === 'amount' ? (name === 'order_id' ? parseInt(value) : parseFloat(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${API_URL}/invoices/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(`${API_URL}/invoices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      fetchInvoices();
      fetchStats();
      resetForm();
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const handleEdit = (invoice) => {
    setFormData(invoice);
    setEditingId(invoice.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await fetch(`${API_URL}/invoices/${id}`, { method: 'DELETE' });
        fetchInvoices();
        fetchStats();
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      order_id: '',
      amount: 0,
      status: 'Pending',
      due_date: '',
      paid_date: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Finance & Invoicing (CRUD)</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Create Invoice'}
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <p className="stat-label">Total Invoiced</p>
          <p className="stat-value">€{stats.total_invoiced.toLocaleString()}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Collected</p>
          <p className="stat-value">€{stats.total_collected.toLocaleString()}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Pending</p>
          <p className="stat-value">€{stats.pending.toLocaleString()}</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-row">
            <select name="order_id" value={formData.order_id} onChange={handleInputChange} required>
              <option value="">Select Order...</option>
              {orders.map(order => (
                <option key={order.id} value={order.id}>
                  ORD-{order.id} (€{order.amount})
                </option>
              ))}
            </select>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option>Pending</option>
              <option>Paid</option>
              <option>Overdue</option>
            </select>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="paid_date"
              value={formData.paid_date}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Create'} Invoice
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Clear
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Order</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Paid Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td className="bold">INV-{inv.id}</td>
                  <td>ORD-{inv.order_id}</td>
                  <td className="bold">€{inv.amount.toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${inv.status.toLowerCase()}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td>{inv.due_date || '-'}</td>
                  <td>{inv.paid_date || '-'}</td>
                  <td className="actions">
                    <button className="btn-small" onClick={() => handleEdit(inv)}>
                      Edit
                    </button>
                    <button className="btn-small btn-danger" onClick={() => handleDelete(inv.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FinanceModuleReal;
