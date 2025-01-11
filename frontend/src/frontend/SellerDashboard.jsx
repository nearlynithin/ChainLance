import React from 'react';
import { useParams } from 'react-router-dom';

function SellerDashboard() {
  const { username } = useParams(); // Access username from the URL

  return (
    <div>
      <h1>Welcome, {username} (Seller Dashboard)</h1>
    </div>
  );
}

export default SellerDashboard;
