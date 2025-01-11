import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

function BuyerDashboard() {
  const { username } = useParams();
  const location = useLocation();
  const accountId = location.state?.accountId || 'Unknown Account';

  return (
    <div>
      <h1>Welcome, {username} (Buyer Dashboard)</h1>
      <p>MetaMask Account ID: {accountId}</p>
    </div>
  );
}

export default BuyerDashboard;
