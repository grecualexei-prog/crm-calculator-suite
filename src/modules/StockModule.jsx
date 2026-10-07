import React, { useState } from 'react';
import './ModuleStyles.css';

const StockModule = () => {
  const [stock, setStock] = useState([
    {
      id: 'SKU-001',
      product: 'Premium Package A',
      quantity: 145,
      status: 'In Stock',
      location: 'Warehouse A',
      reserved: 32,
      available: 113
    },
    {
      id: 'SKU-002',
      product: 'Standard Bundle B',
      quantity: 58,
      status: 'Low Stock',
      location: 'Warehouse A',
      reserved: 22,
      available: 36
    },
    {
      id: 'SKU-003',
      product: 'Economy Solution C',
      quantity: 8,
      status: 'Critical',
      location: 'Warehouse B',
      reserved: 5,
      available: 3
    }
  ]);

  const shipments = [
    {
      id: 'SHIP-001',
      order: 'ORD-002',
      status: 'In Transit',
      eta: '2026-10-10',
      carrier: 'DHL Express'
    },
    {
      id: 'SHIP-002',
      order: 'ORD-003',
      status: 'Ready',
      eta: '2026-10-08',
      carrier: 'FedEx'
    }
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Stock & Logistics</h2>
        <button className="btn-primary">+ Add Stock</button>
      </div>

      <h3 style={{ marginTop: '20px', marginBottom: '12px' }}>Stock Levels</h3>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Reserved</th>
              <th>Available</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((item) => (
              <tr key={item.id}>
                <td className="bold">{item.id}</td>
                <td>{item.product}</td>
                <td>{item.quantity}</td>
                <td>{item.reserved}</td>
                <td className="bold">{item.available}</td>
                <td>
                  <span className={`badge badge-${item.status.toLowerCase().replace(' ', '')}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Shipments</h3>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Shipment ID</th>
              <th>Order</th>
              <th>Status</th>
              <th>ETA</th>
              <th>Carrier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((ship) => (
              <tr key={ship.id}>
                <td className="bold">{ship.id}</td>
                <td>{ship.order}</td>
                <td>
                  <span className={`badge badge-${ship.status.toLowerCase().replace(' ', '')}`}>
                    {ship.status}
                  </span>
                </td>
                <td>{ship.eta}</td>
                <td>{ship.carrier}</td>
                <td className="actions">
                  <button className="btn-small">Track</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockModule;
