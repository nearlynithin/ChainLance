import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accountId, setAccountId] = useState('');
  const navigate = useNavigate();

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccountId(accounts[0]); // Set the account ID from MetaMask
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

  return (
    <>
      <div className="bg-light-purple min-h-screen flex justify-center items-center bg-login">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-600">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Please login to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <button
                type="button"
                onClick={connectMetaMask}
                className="w-full p-3 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition"
              >
                Connect MetaMask
              </button>
            </div>
            <div className="text-center mb-4">
              {accountId && <p className="text-gray-700">Account ID: {accountId}</p>}
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="w-full p-3 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
  