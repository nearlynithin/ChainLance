import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";

function SellerDashboard() {
  const { username } = useParams();
  const location = useLocation();
  const accountId = location.state?.accountId || "Unknown Account";
  const [shopName, setShopName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createShop = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/seller/shop?seller_id=${accountId}&shop_name=${shopName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Shop created successfully!");
        setShopName(""); // Clear the input
      } else {
        setMessage("Error creating shop: " + data.detail);
      }
    } catch (error) {
      setMessage("Error creating shop: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {username}</h1>
      <p className="text-gray-600 mb-8">MetaMask Account ID: {accountId}</p>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Create New Shop</h2>
        <form onSubmit={createShop} className="space-y-4">
          <div>
            <label
              htmlFor="shopName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Shop Name
            </label>
            <input
              type="text"
              id="shopName"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter shop name"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Shop"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 p-3 rounded ${
              message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default SellerDashboard;
