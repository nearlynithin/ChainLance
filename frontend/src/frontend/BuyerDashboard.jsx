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
  const [fundStatus, setFundStatus] = useState(null);
  const [price, setPrice] = useState('');

  useEffect(() => {
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

  const fundJob = async (order_id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/fundjob/${order_id}?buyer_address=${accountId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFundStatus({
          message: data.message,
          transactionHash: data.transaction_hash,
        });

        // Update the order status locally
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === order_id ? { ...order, status: 'funded' } : order
          )
        );
      } else {
        setFundStatus({ message: `Error: ${data.detail}` });
      }
    } catch (error) {
      setFundStatus({ message: `Error: ${error.message}` });
    }
  };

  const completeOrder = async (order_id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/order/${order_id}/complete?buyer_address=${accountId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update the order status locally
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === order_id ? { ...order, status: 'completed' } : order
          )
        );

        setFundStatus({
          message: data.message,
          transactionHash: data.transaction_hash,
        });
      } else {
        setFundStatus({ message: `Error: ${data.detail}` });
      }
    } catch (error) {
      setFundStatus({ message: `Error: ${error.message}` });
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
              {order.status === 'completed' ? (
                <button disabled>Completed</button>
              ) : order.status === 'funded' ? (
                <button onClick={() => completeOrder(order.order_id)}>Complete</button>
              ) : (
                <button onClick={() => fundJob(order.order_id)}>Fund Job</button>
              )}
            </li>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </ul>

      {fundStatus && (
        <div>
          <p>{fundStatus.message}</p>
          {fundStatus.transactionHash && <p>Transaction Hash: {fundStatus.transactionHash}</p>}
        </div>
      )}
    </div>
  );
}

export default BuyerDashboard;
