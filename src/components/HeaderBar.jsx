import React from 'react';
import './HeaderBar.css';

const HeaderBar = ({ userRole, onRoleChange, filterPeriod, onFilterChange, moduleName }) => {
  return (
    <header className="header-bar">
      <div className="header-left">
        <div className="header-info">
          <p className="header-eyebrow">Dashboard</p>
          <h2 className="header-title">{moduleName || 'Dashboard'}</h2>
        </div>
      </div>

      <div className="header-controls">
        <select
          className="control-select"
          value={filterPeriod}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>

        <select
          className="control-select"
          value={userRole}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="director">Director</option>
          <option value="sales_manager">Sales Manager</option>
          <option value="b2b_manager">B2B Manager</option>
          <option value="sales_agent">Sales Agent</option>
          <option value="backoffice">Back-office</option>
          <option value="finance">Finance</option>
          <option value="logistics">Logistics</option>
          <option value="service">Customer Service</option>
        </select>

        <button className="header-button">⚙️ Settings</button>
        <button className="header-button">📥 Export</button>
        <button className="header-button">🔔 Alerts</button>
      </div>
    </header>
  );
};

export default HeaderBar;
