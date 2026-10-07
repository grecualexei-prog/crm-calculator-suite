import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const OrdersModuleReal = () => {
  const [orders, setOrders] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    lead_id: '',
    amount: 0,
    status: 'Approved',
    shipping_status: 'Ready',
    payment_status: 'Pending'
  });

  useEffect(() => {
    fetchOrders();
    fetchLeads();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API_URL}/leads`);
      const data = await res.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'lead_id' || name === 'amount' ? (name === 'lead_id' ? parseInt(value) : parseFloat(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${API_URL}/orders/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      fetchOrders();
      resetForm();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleEdit = (order) => {
    setFormData(order);
    setEditingId(order.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      lead_id: '',
      amount: 0,
      status: 'Approved',
      shipping_status: 'Ready',
      payment_status: 'Pending'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getLeadCompany = (leadId) => {
    return leads.find(l => l.id === leadId)?.company || '-';
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Orders Management (CRUD)</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Order'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-row">
            <select name="lead_id" value={formData.lead_id} onChange={handleInputChange} required>
              <option value="">Select Client...</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.company}
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
              <option>Approved</option>
              <option>Processing</option>
              <option>Delivered</option>
            </select>
            <select name="shipping_status" value={formData.shipping_status} onChange={handleInputChange}>
              <option>Ready</option>
              <option>In Transit</option>
              <option>Delivered</option>
            </select>
            <select name="payment_status" value={formData.payment_status} onChange={handleInputChange}>
              <option>Pending</option>
              <option>Authorized</option>
              <option>Paid</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Create'} Order
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
                <th>ID</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Shipping</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="bold">ORD-{order.id}</td>
                  <td>{getLeadCompany(order.lead_id)}</td>
                  <td>€{order.amount.toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${order.shipping_status.toLowerCase().replace(' ', '')}`}>
                      {order.shipping_status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${order.payment_status.toLowerCase()}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="btn-small" onClick={() => handleEdit(order)}>
                      Edit
                    </button>
                    <button className="btn-small btn-danger" onClick={() => handleDelete(order.id)}>
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

export default OrdersModuleReal;
