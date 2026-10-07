import React, { useState } from 'react';
import './ModuleStyles.css';

const FinanceModule = () => {
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-001',
      client: 'TechCorp Ltd',
      amount: '€45,000',
      status: 'Paid',
      dueDate: '2026-09-30',
      paidDate: '2026-09-28',
      days: '-2'
    },
    {
      id: 'INV-002',
      client: 'Global Solutions',
      amount: '€32,000',
      status: 'Pending',
      dueDate: '2026-10-15',
      paidDate: '-',
      days: '8'
    },
    {
      id: 'INV-003',
      client: 'InnovateLabs',
      amount: '€28,000',
      status: 'Overdue',
      dueDate: '2026-10-01',
      paidDate: '-',
      days: '6'
    }
  ]);

  const stats = [
    { label: 'Total Invoiced', value: '€105,000' },
    { label: 'Total Collected', value: '€77,000' },
    { label: 'Pending', value: '€32,000' },
    { label: 'Overdue', value: '€28,000' }
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Finance & Invoicing</h2>
        <button className="btn-primary">+ Create Invoice</button>
      </div>

      <div className="stats-row">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-box">
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Paid Date</th>
              <th>Days</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="bold">{inv.id}</td>
                <td>{inv.client}</td>
                <td className="bold">{inv.amount}</td>
                <td>
                  <span className={`badge badge-${inv.status.toLowerCase()}`}>
                    {inv.status}
                  </span>
                </td>
                <td>{inv.dueDate}</td>
                <td>{inv.paidDate}</td>
                <td className={inv.days.includes('-') ? 'negative' : 'positive'}>
                  {inv.days}
                </td>
                <td className="actions">
                  <button className="btn-small">View</button>
                  <button className="btn-small">Send</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceModule;
