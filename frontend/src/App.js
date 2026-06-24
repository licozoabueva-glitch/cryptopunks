import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bids from './pages/Bids';
import Wallets from './pages/Wallets';
import Listings from './pages/Listings';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      // Connect to Socket.IO
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);
    }
  }, []);

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Dashboard socket={socket} />} />
              <Route path="/bids" element={<Bids socket={socket} />} />
              <Route path="/wallets" element={<Wallets />} />
              <Route path="/listings" element={<Listings />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
