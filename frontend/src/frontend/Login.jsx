import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './components/header'


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
    <Header/>
      <div className="bg-light-purple min-h-screen flex justify-center items-center bg-login">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-600">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Please login to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <p className="font-Mont font-medium m-1">
              Username:
              </p>
              <input
                type="text"
                placeholder="Enter your Username"
                className="w-full p-3 rounded-md border border-gray-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
            <p className="font-Mont font-medium m-1">
              Password:
              </p>
              <input
                type="password"
                placeholder="Enter your Password"
                className="w-full p-3 rounded-md border border-gray-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4 flex justify-center  items-center   bg-purple-600 rounded-md shadow-md hover:bg-purple-700 transition">
              <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#fff"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8h4"/><path stroke-width="1.5" d="M20.833 9h-2.602C16.446 9 15 10.343 15 12s1.447 3 3.23 3h2.603c.084 0 .125 0 .16-.002c.54-.033.97-.432 1.005-.933c.002-.032.002-.071.002-.148v-3.834c0-.077 0-.116-.002-.148c-.036-.501-.465-.9-1.005-.933C20.959 9 20.918 9 20.834 9Z"/><path stroke-width="1.5" d="M20.965 9c-.078-1.872-.328-3.02-1.137-3.828C18.657 4 16.771 4 13 4h-3C6.229 4 4.343 4 3.172 5.172S2 8.229 2 12s0 5.657 1.172 6.828S6.229 20 10 20h3c3.771 0 5.657 0 6.828-1.172c.809-.808 1.06-1.956 1.137-3.828"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.991 12h.01"/></g></svg>
              </div>
              <div>
              <button
                type="button"
                onClick={connectMetaMask}
                className="w-full p-3  text-white "
              >
               
                Connect MetaMask
              </button>
              </div>
            </div>
            <div className="text-center mb-4">
              {accountId && <p className="text-blue-700 font-Mont font-medium">Account ID: {accountId}</p>}
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
  