import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

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

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
    />
  );
};

const SellerDashboard = () => {
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
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800">
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center text-white p-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.h1 
            className="mb-4 text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl"
            whileHover={{ scale: 1.05 }}
          >
            Welcome, <span className="text-purple-300">{username}</span>
          </motion.h1>
          <p className="text-xl sm:text-2xl md:text-3xl">
            MetaMask Account ID: {accountId}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white bg-opacity-10 backdrop-blur-lg shadow-lg rounded-lg p-8 w-full max-w-md"
        >
          <h2 className="text-3xl font-semibold mb-6 text-center">Create New Shop</h2>
          <form onSubmit={createShop} className="space-y-6">
            <div>
              <label
                htmlFor="shopName"
                className="block text-sm font-medium text-purple-200 mb-2"
              >
                Shop Name
              </label>
              <input
                type="text"
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-purple-800 bg-opacity-50 border border-purple-500 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-purple-300"
                placeholder="Enter shop name"
              />
            </div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgb(167 139 250)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-purple-500 text-white py-3 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-800 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Creating..." : "Create Shop"}
            </motion.button>
          </form>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`mt-4 p-3 rounded ${
                message.includes("Error")
                  ? "bg-red-500 bg-opacity-50 text-white"
                  : "bg-green-500 bg-opacity-50 text-white"
              }`}
            >
              {message}
            </motion.p>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 text-sm text-purple-200"
        >
          Powered by Blockchain Technology
        </motion.p>
      </div>
    </div>
  );
};

export default SellerDashboard;

