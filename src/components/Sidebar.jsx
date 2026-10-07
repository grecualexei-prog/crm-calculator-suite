import React from 'react';
import './Sidebar.css';

const Sidebar = ({ modules, activeModule, onModuleChange }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">CRM</div>
        <div className="brand-text">
          <h1>CRM Pro</h1>
          <p>v1.0</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {Object.entries(modules).map(([key, module]) => (
          <button
            key={key}
            className={`nav-item ${activeModule === key ? 'active' : ''}`}
            onClick={() => onModuleChange(key)}
            title={module.name}
          >
            <span className="nav-icon">{module.icon}</span>
            <span className="nav-label">{module.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">A</div>
          <div>
            <p className="user-name">Admin User</p>
            <p className="user-role">Director</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
