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
    <form onSubmit={handleLogin}>
      <button type="button" onClick={connectMetaMask}>
        Connect MetaMask
      </button>
      {accountId && <p>Account ID: {accountId}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
