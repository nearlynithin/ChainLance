import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './components/header' // Use useNavigate instead of useHistory

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
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
    <>
    <Header/>
      <div className="bg-light-purple min-h-screen flex justify-center items-center bg-login">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-600">Hello There!</h1>
            <p className="text-gray-500 mt-2">Please signup to continue</p>
          </div>
    <form onSubmit={handleSignup}>
    <div className="mb-4">
    <p className="font-Mont font-medium m-1">
              Username:
              </p>
      <input
        type="text"
        placeholder="Username"
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
        placeholder="Password"
        className="w-full p-3 rounded-md border border-gray-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      </div>
      <div className="mb-4">
      <p className="font-Mont font-medium m-1">
              Account Type:
              </p>
      <select placeholder="Select Type" className="w-full p-3 rounded-md border border-gray-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"value={role} onChange={(e) => setRole(e.target.value)}>
      <option value="" disabled hidden>Select Type</option>
        <option className="m-2 hover:bg-purple-600 font-Mont bg-white "  value="buyer">Buyer</option>
        <option className="m-2 hover:bg-purple-600 font-Mont bg-white" value="seller">Seller</option>
      </select>
      </div>
      <div>
      <button type="submit"
       className="w-full p-3 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition">Signup</button>
      </div> 
    </form>
    </div>
    </div>
    </>
  );
}

export default Signup;
