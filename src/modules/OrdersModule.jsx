import React, { useState } from 'react';
import './ModuleStyles.css';

const OrdersModule = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      client: 'TechCorp Ltd',
      amount: '€45,000',
      status: 'Delivered',
      date: '2026-10-01',
      shipping: 'Completed',
      payment: 'Paid'
    },
    {
      id: 'ORD-002',
      client: 'Global Solutions',
      amount: '€32,000',
      status: 'Processing',
      date: '2026-10-05',
      shipping: 'In Transit',
      payment: 'Pending'
    },
    {
      id: 'ORD-003',
      client: 'InnovateLabs',
      amount: '€28,000',
      status: 'Approved',
      date: '2026-10-06',
      shipping: 'Ready',
      payment: 'Authorized'
    }
  ]);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Orders Management</h2>
        <button className="btn-primary">+ New Order</button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Shipping</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="bold">{order.id}</td>
                <td>{order.client}</td>
                <td className="bold">{order.amount}</td>
                <td>
                  <span className={`badge badge-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${order.shipping.toLowerCase().replace(' ', '')}`}>
                    {order.shipping}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${order.payment.toLowerCase()}`}>
                    {order.payment}
                  </span>
                </td>
                <td>{order.date}</td>
                <td className="actions">
                  <button className="btn-small">Details</button>
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

export default OrdersModule;
