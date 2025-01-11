import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import Login from './frontend/Login.jsx';
import Signup from './frontend/Signup.jsx';
import BuyerDashboard from './frontend/BuyerDashboard.jsx';
import SellerDashboard from './frontend/SellerDashboard.jsx';
import Main from './main.jsx';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decode token to get user info
      setUser(decoded);
    }
  }, []);

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/buyer-dashboard/:username" // Capture the username in the URL
          element={user && user.role === 'buyer' ? <BuyerDashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/seller-dashboard/:username" // Capture the username in the URL
          element={user && user.role === 'seller' ? <SellerDashboard user={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
