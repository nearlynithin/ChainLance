import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/header1';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accountId, setAccountId] = useState('');
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccountId(accounts[0]);
        alert(`Connected with account: ${accounts[0]}`);
      } catch (error) {
        alert('Error connecting to MetaMask');
      }
    } else {
      alert('MetaMask not detected. Please install MetaMask!');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!accountId) {
      alert('Please connect MetaMask first!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password, accountId });
      localStorage.setItem('token', response.data.token);

      const userRole = response.data.role;
      const userUsername = response.data.username;

      if (userRole === 'buyer') {
        navigate(`/buyer-dashboard/${userUsername}`, { state: { accountId } });
      } else if (userRole === 'seller') {
        navigate(`/seller-dashboard/${userUsername}`, { state: { accountId } });
      }
    } catch (error) {
      alert('Invalid credentials');
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 flex flex-col relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      />
      <Header />
      <div className="flex-grow flex justify-center items-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 pt-8 pb-6">
              <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
              <p className="text-purple-200 text-center mb-6">Access your Chainlance account</p>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-purple-200 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-purple-800 bg-opacity-50 border border-purple-500 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-purple-800 bg-opacity-50 border border-purple-500 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={connectMetaMask}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="mr-2">
                    <g fill="none" stroke="#fff" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h4"/>
                      <path d="M20.833 9h-2.602C16.446 9 15 10.343 15 12s1.447 3 3.23 3h2.603c.084 0 .125 0 .16-.002c.54-.033.97-.432 1.005-.933c.002-.032.002-.071.002-.148v-3.834c0-.077 0-.116-.002-.148c-.036-.501-.465-.9-1.005-.933C20.959 9 20.918 9 20.834 9Z"/>
                      <path d="M20.965 9c-.078-1.872-.328-3.02-1.137-3.828C18.657 4 16.771 4 13 4h-3C6.229 4 4.343 4 3.172 5.172S2 8.229 2 12s0 5.657 1.172 6.828S6.229 20 10 20h3c3.771 0 5.657 0 6.828-1.172c.809-.808 1.06-1.956 1.137-3.828"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.991 12h.01"/>
                    </g>
                  </svg>
                  Connect MetaMask
                </motion.button>
                {accountId && (
                  <p className="text-purple-200 text-center break-all">
                    Connected: {accountId}
                  </p>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
                >
                  Login
                </motion.button>
              </form>
            </div>
            <div className="px-8 py-4 bg-purple-800 bg-opacity-50 flex justify-center">
              <p className="text-purple-200">
                Don't have an account?{' '}
                <a href="/signup" className="font-medium text-white hover:text-purple-300 transition duration-300 ease-in-out">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

