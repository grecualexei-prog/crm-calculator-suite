import React, { useState } from 'react';
import './ModuleStyles.css';

const OffersModule = () => {
  const [offers, setOffers] = useState([
    {
      id: 1,
      client: 'TechCorp Ltd',
      amount: '€45,000',
      discount: '10%',
      status: 'Accepted',
      expiry: '2026-10-15',
      margin: '28%'
    },
    {
      id: 2,
      client: 'Global Solutions',
      amount: '€32,000',
      discount: '5%',
      status: 'Pending',
      expiry: '2026-10-12',
      margin: '32%'
    },
    {
      id: 3,
      client: 'InnovateLabs',
      amount: '€28,000',
      discount: '0%',
      status: 'Rejected',
      expiry: '2026-10-08',
      margin: '35%'
    }
  ]);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Commercial Offers</h2>
        <button className="btn-primary">+ Create Offer</button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Amount</th>
              <th>Discount</th>
              <th>Margin</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id}>
                <td className="bold">{offer.client}</td>
                <td className="bold">{offer.amount}</td>
                <td>{offer.discount}</td>
                <td>
                  <span className="margin-good">{offer.margin}</span>
                </td>
                <td>
                  <span className={`badge badge-${offer.status.toLowerCase()}`}>
                    {offer.status}
                  </span>
                </td>
                <td>{offer.expiry}</td>
                <td className="actions">
                  <button className="btn-small">Edit</button>
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

export default OffersModule;
