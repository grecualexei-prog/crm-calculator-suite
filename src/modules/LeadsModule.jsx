import React, { useState } from 'react';
import './ModuleStyles.css';

const LeadsModule = () => {
  const [leads, setLeads] = useState([
    {
      id: 1,
      company: 'TechCorp Ltd',
      contact: 'John Doe',
      status: 'Qualified',
      value: '€45,000',
      date: '2026-10-07',
      score: 85
    },
    {
      id: 2,
      company: 'Global Solutions',
      contact: 'Jane Smith',
      status: 'Contacted',
      value: '€32,000',
      date: '2026-10-06',
      score: 62
    },
    {
      id: 3,
      company: 'InnovateLabs',
      contact: 'Mike Johnson',
      status: 'New',
      value: '€28,000',
      date: '2026-10-05',
      score: 48
    }
  ]);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Leads & Prospecting</h2>
        <button className="btn-primary">+ New Lead</button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Value</th>
              <th>Score</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="bold">{lead.company}</td>
                <td>{lead.contact}</td>
                <td>
                  <span className={`badge badge-${lead.status.toLowerCase()}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="bold">{lead.value}</td>
                <td>
                  <span className="score">{lead.score}</span>
                </td>
                <td>{lead.date}</td>
                <td className="actions">
                  <button className="btn-small">Edit</button>
                  <button className="btn-small">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsModule;
