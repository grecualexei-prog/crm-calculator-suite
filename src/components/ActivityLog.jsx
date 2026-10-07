import React from 'react';
import './ModuleStyles.css';

const ActivityLog = () => {
  const activities = [
    {
      id: 1,
      type: 'order',
      user: 'John Sales',
      action: 'Created new order ORD-004',
      target: 'TechCorp Ltd',
      amount: '€52,000',
      timestamp: '2026-10-07 14:32',
      status: 'success'
    },
    {
      id: 2,
      type: 'invoice',
      user: 'Jane Finance',
      action: 'Sent invoice INV-003',
      target: 'Global Solutions',
      amount: '€32,000',
      timestamp: '2026-10-07 13:15',
      status: 'success'
    },
    {
      id: 3,
      type: 'lead',
      user: 'Mike Manager',
      action: 'Qualified lead',
      target: 'NewTech Inc',
      amount: '€68,000',
      timestamp: '2026-10-07 11:42',
      status: 'success'
    },
    {
      id: 4,
      type: 'delivery',
      user: 'Logistics Team',
      action: 'Marked delivery as completed',
      target: 'ORD-001 / TechCorp',
      amount: '€45,000',
      timestamp: '2026-10-07 10:05',
      status: 'success'
    },
    {
      id: 5,
      type: 'alert',
      user: 'System',
      action: 'Payment overdue',
      target: 'INV-003 / InnovateLabs',
      amount: '€28,000',
      timestamp: '2026-10-07 09:30',
      status: 'warning'
    }
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Activity Log</h2>
        <div>
          <input
            type="text"
            placeholder="Search activities..."
            className="search-input"
          />
        </div>
      </div>

      <div className="activity-timeline">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className={`activity-icon activity-${activity.type}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="activity-content">
              <div className="activity-header">
                <strong>{activity.action}</strong>
                <span className="activity-time">{activity.timestamp}</span>
              </div>
              <div className="activity-details">
                <p>
                  <span className="detail-label">User:</span> {activity.user}
                </p>
                <p>
                  <span className="detail-label">Target:</span> {activity.target}
                </p>
                <p>
                  <span className="detail-label">Amount:</span>
                  <strong>{activity.amount}</strong>
                </p>
              </div>
            </div>
            <span className={`badge badge-${activity.status}`}>
              {activity.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const getActivityIcon = (type) => {
  const icons = {
    order: '📦',
    invoice: '💰',
    lead: '👥',
    delivery: '🚚',
    alert: '⚠️'
  };
  return icons[type] || '📌';
};

export default ActivityLog;
