import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const LeadsModuleReal = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    status: 'New',
    value: 0,
    score: 0,
    notes: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/leads`);
      const data = await res.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'score' || name === 'value' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${API_URL}/leads/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(`${API_URL}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      fetchLeads();
      resetForm();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const handleEdit = (lead) => {
    setFormData(lead);
    setEditingId(lead.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await fetch(`${API_URL}/leads/${id}`, { method: 'DELETE' });
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      contact: '',
      email: '',
      phone: '',
      status: 'New',
      value: 0,
      score: 0,
      notes: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Leads & Prospecting (CRUD)</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Lead'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-row">
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact Person"
              value={formData.contact}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Proposal</option>
            </select>
            <input
              type="number"
              name="value"
              placeholder="Value"
              value={formData.value}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="score"
              placeholder="Score (0-100)"
              value={formData.score}
              onChange={handleInputChange}
            />
          </div>
          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Create'} Lead
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
                <th>Company</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Status</th>
                <th>Value</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id}>
                  <td className="bold">{lead.company}</td>
                  <td>{lead.contact}</td>
                  <td>{lead.email}</td>
                  <td>
                    <span className={`badge badge-${lead.status.toLowerCase()}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td>€{lead.value.toLocaleString()}</td>
                  <td><span className="score">{lead.score}</span></td>
                  <td className="actions">
                    <button className="btn-small" onClick={() => handleEdit(lead)}>
                      Edit
                    </button>
                    <button className="btn-small btn-danger" onClick={() => handleDelete(lead.id)}>
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

export default LeadsModuleReal;
