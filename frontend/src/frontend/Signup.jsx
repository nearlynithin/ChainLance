import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const navigate = useNavigate(); // Replace history with navigate

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { username, password, role });
      navigate('/login'); // Use navigate instead of history.push
    } catch (error) {
      alert('Error creating account');
    }
  };

  return (
    <form onSubmit={handleSignup}>
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
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </select>
      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;
