import React, { useState } from 'react';

function CreateShopForm({ accountId }) {
  const [shopName, setShopName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8000/api/seller/shop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seller_id: "222",
          shop_name: "dffff",
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create shop');
      }

      const data = await response.json();
      setSuccess(`Shop "${data.shop_name}" created successfully.`);
      setShopName('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Create New Shop</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="shop_name">Shop Name:</label>
          <input
            type="text"
            id="shop_name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Shop</button>
      </form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default CreateShopForm;
