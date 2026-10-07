import React from 'react';
import './ModuleStyles.css';

const KPIModule = () => {
  const kpiData = [
    {
      category: 'Sales Performance',
      metrics: [
        { name: 'Total Revenue', value: '€2,450,000', target: '€2,500,000', variance: '-1.8%' },
        { name: 'Pipeline', value: '€1,850,000', target: '€1,800,000', variance: '+2.8%' },
        { name: 'Conversion Rate', value: '18.5%', target: '20%', variance: '-7.5%' },
        { name: 'Average Deal Value', value: '€45,000', target: '€50,000', variance: '-10%' }
      ]
    },
    {
      category: 'Customer Metrics',
      metrics: [
        { name: 'Active Leads', value: '342', target: '350', variance: '-2.3%' },
        { name: 'New Customers', value: '48', target: '50', variance: '-4%' },
        { name: 'Customer Retention', value: '92%', target: '95%', variance: '-3%' },
        { name: 'Churn Rate', value: '8%', target: '<5%', variance: '+60%' }
      ]
    },
    {
      category: 'Financial Metrics',
      metrics: [
        { name: 'Gross Profit', value: '€765,000', target: '€750,000', variance: '+2%' },
        { name: 'Net Profit', value: '€485,000', target: '€500,000', variance: '-3%' },
        { name: 'Profit Margin', value: '31.2%', target: '32%', variance: '-2.5%' },
        { name: 'Cash Flow', value: '€615,000', target: '€600,000', variance: '+2.5%' }
      ]
    },
    {
      category: 'Operational Metrics',
      metrics: [
        { name: 'Orders Processed', value: '127', target: '120', variance: '+5.8%' },
        { name: 'Avg Processing Time', value: '2.4h', target: '<2h', variance: '+20%' },
        { name: 'Delivery On Time', value: '94%', target: '95%', variance: '-1%' },
        { name: 'Invoice Paid On Time', value: '86%', target: '90%', variance: '-4.4%' }
      ]
    }
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>KPI & Reports</h2>
        <button className="btn-primary">📥 Export Report</button>
      </div>

      {kpiData.map((section, idx) => (
        <div key={idx} style={{ marginTop: idx === 0 ? '0' : '32px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.1rem' }}>{
            section.category
          }</h3>
          <div className="kpi-grid">
            {section.metrics.map((metric, midx) => (
              <div key={midx} className="kpi-card">
                <p className="kpi-name">{metric.name}</p>
                <p className="kpi-value">{metric.value}</p>
                <div className="kpi-footer">
                  <span className="kpi-target">Target: {metric.target}</span>
                  <span className={`kpi-variance ${metric.variance.includes('+') ? 'positive' : 'negative'}`}>
                    {metric.variance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIModule;
