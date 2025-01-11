import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

function SellerDashboard() {
  const { username } = useParams();
  const location = useLocation();
  const accountId = location.state?.accountId || 'Unknown Account';

  return (
    <div>
      <h1>Welcome, {username} (Seller Dashboard)</h1>
      <p>MetaMask Account ID: {accountId}</p>
    </div>
  );
}

export default SellerDashboard;
