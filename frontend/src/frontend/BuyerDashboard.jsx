import React from 'react';
import { useParams } from 'react-router-dom';

function BuyerDashboard() {
  const { username } = useParams(); // Access username from the URL

  return (
    <div>
      <h1>Welcome, {username} (Buyer Dashboard)</h1>
    </div>
  );
}

export default BuyerDashboard;
