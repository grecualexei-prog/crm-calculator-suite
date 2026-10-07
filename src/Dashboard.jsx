import React, { useState, useMemo } from 'react';
import './Dashboard.css';
import HeaderBar from './components/HeaderBar';
import Sidebar from './components/Sidebar';
import LeadsModule from './modules/LeadsModule';
import OffersModule from './modules/OffersModule';
import OrdersModule from './modules/OrdersModule';
import FinanceModule from './modules/FinanceModule';
import StockModule from './modules/StockModule';
import KPIModule from './modules/KPIModule';
import ActivityLog from './components/ActivityLog';

const Dashboard = () => {
  const [activeModule, setActiveModule] = useState('overview');
  const [userRole, setUserRole] = useState('director');
  const [filterPeriod, setFilterPeriod] = useState('month');

  const modules = {
    overview: {
      name: 'Overview',
      component: () => <OverviewModule />,
      icon: '📊'
    },
    leads: {
      name: 'Leads & Prospecting',
      component: () => <LeadsModule />,
      icon: '👥'
    },
    offers: {
      name: 'Offers',
      component: () => <OffersModule />,
      icon: '📋'
    },
    orders: {
      name: 'Orders',
      component: () => <OrdersModule />,
      icon: '📦'
    },
    finance: {
      name: 'Finance & Invoicing',
      component: () => <FinanceModule />,
      icon: '💰'
    },
    stock: {
      name: 'Stock & Logistics',
      component: () => <StockModule />,
      icon: '🚚'
    },
    kpi: {
      name: 'KPI & Reports',
      component: () => <KPIModule />,
      icon: '📈'
    },
    activity: {
      name: 'Activity Log',
      component: () => <ActivityLog />,
      icon: '📝'
    }
  };

  const currentModule = modules[activeModule];

  return (
    <div className="dashboard-shell">
      <Sidebar
        modules={modules}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
      />
      <main className="dashboard-main">
        <HeaderBar
          userRole={userRole}
          onRoleChange={setUserRole}
          filterPeriod={filterPeriod}
          onFilterChange={setFilterPeriod}
          moduleName={currentModule?.name}
        />
        <div className="module-container">
          {currentModule?.component()}
        </div>
      </main>
    </div>
  );
};

const OverviewModule = () => (
  <div className="panel">
    <h2>CRM Dashboard - Overview</h2>
    <div className="metric-grid">
      <MetricCard label="Total Revenue" value="€2,450,000" trend="+12.5%" />
      <MetricCard label="Pipeline" value="€1,850,000" trend="+8.2%" />
      <MetricCard label="Conversion Rate" value="18.5%" trend="+2.1%" />
      <MetricCard label="Active Leads" value="342" trend="+15" />
      <MetricCard label="Open Orders" value="127" trend="+8" />
      <MetricCard label="Pending Invoices" value="€458,000" trend="-5.3%" />
    </div>
  </div>
);

const MetricCard = ({ label, value, trend }) => (
  <div className="metric-card">
    <span className="metric-label">{label}</span>
    <strong className="metric-value">{value}</strong>
    <span className={`metric-trend ${trend.includes('+') ? 'positive' : 'negative'}`}>
      {trend}
    </span>
  </div>
);

export default Dashboard;
