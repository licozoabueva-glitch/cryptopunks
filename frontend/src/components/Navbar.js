import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🦾 CryptoPunks Admin
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/bids">Bids</Link></li>
          <li><Link to="/wallets">Wallets</Link></li>
          <li><Link to="/listings">Listings</Link></li>
          <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
