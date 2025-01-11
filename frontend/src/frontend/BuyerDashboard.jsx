import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

function BuyerDashboard() {
  const { username } = useParams();
  const location = useLocation();
  const accountId = location.state?.accountId || 'Unknown Account';

  const [shops, setShops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [price, setPrice] = useState('');
  const [completionStatus, setCompletionStatus] = useState(null); // Completion status

  useEffect(() => {
    // Fetch shops
    const fetchShops = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/shops');
        if (!response.ok) throw new Error('Failed to fetch shops');
        const data = await response.json();
        setShops(data.shops);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  useEffect(() => {
    // Fetch buyer orders
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/buyer/${accountId}/orders`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOrders();
  }, [accountId]);

  const createJob = async (sellerAddress, shopId) => {
    if (!price) {
      setJobStatus({ message: 'Please enter a price.' });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/createjob?seller_address=${sellerAddress}&buyer_address=${accountId}&price=${price}&shop_id=${shopId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

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

  const completeOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/order/${orderId}/complete?buyer_address=${accountId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        setCompletionStatus({
          message: `Order ${orderId} completed successfully!`,
          transactionHash: data.transaction_hash,
        });
        // Refresh orders to show the updated status
        const updatedOrders = orders.map((order) =>
          order.order_id === orderId ? { ...order, status: 'completed' } : order
        );
        setOrders(updatedOrders);
      } else {
        setCompletionStatus({ message: `Error: ${data.detail}` });
      }
    } catch (error) {
      setCompletionStatus({ message: `Error: ${error.message}` });
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
            <button onClick={() => createJob(shop.seller_id, shop.shop_id)}>Create Job</button>
          </li>
        ))}
      </ul>

      {jobStatus && (
        <div>
          <p>{jobStatus.message}</p>
          {jobStatus.transactionHash && <p>Transaction Hash: {jobStatus.transactionHash}</p>}
          {jobStatus.orderId && <p>Order ID: {jobStatus.orderId}</p>}
        </div>
      )}

      <h2>Your Orders</h2>
      <ul>
        {orders.length > 0 ? (
          orders.map((order) => (
            <li key={order.order_id}>
              <h3>Order ID: {order.order_id}</h3>
              <p>Shop: {order.shop_name}</p>
              <p>Price: {order.price}</p>
              <p>Status: {order.status}</p>
              {order.status !== 'completed' && (
                <button onClick={() => completeOrder(order.order_id)}>Complete</button>
              )}
            </li>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </ul>

      {completionStatus && (
        <div>
          <p>{completionStatus.message}</p>
          {completionStatus.transactionHash && <p>Transaction Hash: {completionStatus.transactionHash}</p>}
        </div>
      )}
    </div>
  );
}

export default BuyerDashboard;
