import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

function BuyerDashboard() {
  const { username } = useParams();
  const location = useLocation();
  const accountId = location.state?.accountId || 'Unknown Account';

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [price, setPrice] = useState('');  // State to store price

  useEffect(() => {
    // Fetch the shops data
    const fetchShops = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/shops');
        if (!response.ok) {
          throw new Error('Failed to fetch shops');
        }
        const data = await response.json();
        setShops(data.shops);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const createJob = async (sellerAddress, shopId) => {
    if (!price) {
      setJobStatus({ message: 'Please enter a price.' });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/createjob?seller_address=${sellerAddress}&buyer_address=${accountId}&price=${price}&shop_id=${shopId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setJobStatus({
          message: data.message,
          transactionHash: data.transaction_hash,
          orderId: data.order_id,
        });
      } else {
        setJobStatus({ message: `Error: ${data.detail}` });
      }
    } catch (error) {
      setJobStatus({ message: `Error: ${error.message}` });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Welcome, {username} (Buyer Dashboard)</h1>
      <p>MetaMask Account ID: {accountId}</p>
      
      <h2>Shops</h2>
      <ul>
        {shops.map((shop) => (
          <li key={shop.shop_id}>
            <p>{shop.shop_id}</p>
            <h3>{shop.shop_name}</h3>
            <p>Seller ID: {shop.seller_id}</p>
            <label>
              Enter Price:
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="Enter price"
              />
            </label>
            <button onClick={() => createJob(shop.seller_id, shop.shop_id)}>
              Create Job
            </button>
          </li>
        ))}
      </ul>

      {jobStatus && (
        <div>
          <p>{jobStatus.message}</p>
          {jobStatus.transactionHash && (
            <p>Transaction Hash: {jobStatus.transactionHash}</p>
          )}
          {jobStatus.orderId && <p>Order ID: {jobStatus.orderId}</p>}
        </div>
      )}
    </div>
  );
}

export default BuyerDashboard;
