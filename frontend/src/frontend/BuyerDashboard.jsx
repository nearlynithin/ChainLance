<<<<<<< HEAD
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
=======
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "tailwindcss/tailwind.css";
>>>>>>> 6d24353 (stuff)

const BuyerDashboard = () => {
  const { username } = useParams();
  const location = useLocation();
<<<<<<< HEAD
  const accountId = location.state?.accountId || 'Unknown Account';
  const canvasRef = useRef(null);
=======
  const accountId = location.state?.accountId || "Unknown Account";
>>>>>>> 6d24353 (stuff)

  const [shops, setShops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [fundStatus, setFundStatus] = useState(null);
<<<<<<< HEAD
  const [price, setPrice] = useState('');
=======
  const [price, setPrice] = useState("");
>>>>>>> 6d24353 (stuff)

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/shops");
        if (!response.ok) throw new Error("Failed to fetch shops");
        const data = await response.json();
        setShops(data.shops);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

<<<<<<< HEAD
=======
    fetchShops();
  }, []);

  useEffect(() => {
>>>>>>> 6d24353 (stuff)
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/buyer/${accountId}/orders`
        );
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchShops();
    fetchOrders();
  }, [accountId]);

<<<<<<< HEAD
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;
    const connectionDistance = 100;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;

        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = 'rgba(147, 51, 234, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
=======
  const createJob = async (sellerAddress, shopId) => {
    if (!price) {
      setJobStatus({ message: "Please enter a price." });
      return;
>>>>>>> 6d24353 (stuff)
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.strokeStyle = `rgba(147, 51, 234, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const createJob = async (sellerAddress, shopId) => {
    if (!price) {
      setJobStatus({ message: 'Please enter a price.', type: 'error' });
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:8000/api/createjob?seller_address=${sellerAddress}&buyer_address=${accountId}&price=${price}&shop_id=${shopId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        setJobStatus({
          message: data.message,
          transactionHash: data.transaction_hash,
          orderId: data.order_id,
          type: 'success',
        });
      } else {
        setJobStatus({ message: `Error: ${data.detail}`, type: 'error' });
      }
    } catch (error) {
      setJobStatus({ message: `Error: ${error.message}`, type: 'error' });
    }
  };
  const fundJob = async (order_id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/fundjob/${order_id}?buyer_address=${accountId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
  
      if (response.ok) {
        setFundStatus({
          message: data.message,
          transactionHash: data.transaction_hash,
          type: 'success',
        });
  
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === order_id ? { ...order, status: 'funded' } : order
          )
        );
      } else {
        setFundStatus({ message: `Error: ${data.detail}`, type: 'error' });
      }
    } catch (error) {
      setFundStatus({ message: `Error: ${error.message}`, type: 'error' });
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
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === order_id ? { ...order, status: 'completed' } : order
          )
        );
  
        setFundStatus({
          message: data.message,
          transactionHash: data.transaction_hash,
          type: 'success',
        });
      } else {
        setFundStatus({ message: `Error: ${data.detail}`, type: 'error' });
      }
    } catch (error) {
      setFundStatus({ message: `Error: ${error.message}`, type: 'error' });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 text-white overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Welcome, {username}
          </h1>
          <p className="text-xl text-purple-200">
            MetaMask Account ID: <span className="font-mono">{accountId}</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-3xl font-semibold mb-6 flex items-center">
              <ShopIcon className="w-8 h-8 mr-2" />
              Available Shops
            </h2>
            <ul className="space-y-4">
              {shops.map((shop) => (
                <li key={shop.shop_id} className="bg-purple-800 bg-opacity-50 rounded-lg p-4 transition-all duration-300 hover:bg-opacity-70">
                  <h3 className="text-xl font-semibold mb-2">{shop.shop_name}</h3>
                  <p className="text-sm mb-3">Seller ID: <span className="font-mono">{shop.seller_id}</span></p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter price"
                      className="flex-grow px-3 py-2 bg-purple-900 bg-opacity-50 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                    />
                    <button
                      onClick={() => createJob(shop.seller_id, shop.shop_id)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md transition-all duration-300 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      Create Job
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-3xl font-semibold mb-6 flex items-center">
              <OrderIcon className="w-8 h-8 mr-2" />
              Your Orders
            </h2>
            {orders.length > 0 ? (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li key={order.order_id} className="bg-purple-800 bg-opacity-50 rounded-lg p-4 transition-all duration-300 hover:bg-opacity-70">
                    <h3 className="text-xl font-semibold mb-2">Order ID: {order.order_id}</h3>
                    <p className="text-sm">Shop: {order.shop_name}</p>
                    <p className="text-sm">Price: {order.price}</p>
                    <p className="text-sm mb-3">Status: <span className="font-semibold">{order.status}</span></p>
                    {order.status === 'completed' ? (
                      <button disabled className="px-4 py-2 bg-gray-500 rounded-md cursor-not-allowed opacity-50">
                        Completed
                      </button>
                    ) : order.status === 'funded' ? (
                      <button
                        onClick={() => completeOrder(order.order_id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-md transition-all duration-300 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        Complete
                      </button>
                    ) : (
                      <button
                        onClick={() => fundJob(order.order_id)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md transition-all duration-300 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Fund Job
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-purple-200">No orders found.</p>
            )}
          </motion.div>
        </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow"
              >
                <h3 className="text-xl font-semibold">
                  Order ID: {order.order_id}
                </h3>
                <p className="text-gray-600">Shop: {order.shop_name}</p>
                <p className="text-gray-600">Price: {order.price}</p>
                <p className="text-gray-600">Status: {order.status}</p>
                {order.status === "completed" ? (
                  <button
                    disabled
                    className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    Completed
                  </button>
                ) : order.status === "funded" ? (
                  <button
                    onClick={() => completeOrder(order.order_id)}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Complete
                  </button>
                ) : (
                  <button
                    onClick={() => fundJob(order.order_id)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Fund Job
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No orders found.</p>
          )}
        </div>
      </div>

      {fundStatus && (
        <div className="mt-8 bg-blue-100 text-blue-800 p-4 rounded-lg">
          <p>{fundStatus.message}</p>
          {fundStatus.transactionHash && (
            <p>Transaction Hash: {fundStatus.transactionHash}</p>
          )}
        </div>
      )}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800">
    <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800">
    <div className="bg-red-600 bg-opacity-80 rounded-lg p-6 text-white max-w-md text-center">
      <ErrorIcon className="w-16 h-16 mx-auto mb-4" />
      <p className="text-xl font-semibold">{message}</p>
    </div>
  </div>
);

const StatusMessage = ({ status }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className={`fixed bottom-4 right-4 p-4 rounded-lg ${
      status.type === 'success' ? 'bg-green-600' : 'bg-red-600'
    } bg-opacity-80 text-white max-w-md`}
  >
    <p className="font-semibold">{status.message}</p>
    {status.transactionHash && (
      <p className="text-sm mt-2">Transaction Hash: {status.transactionHash}</p>
    )}
    {status.orderId && <p className="text-sm mt-2">Order ID: {status.orderId}</p>}
  </motion.div>
);

const ShopIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 11V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 7H21V11H3V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 7L5 3H19L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const OrderIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ErrorIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 6V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="18" r="1" fill="currentColor" />
  </svg>
);

export default BuyerDashboard;

