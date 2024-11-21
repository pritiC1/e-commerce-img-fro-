// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/logo.png';
import profile from '../Assets/profile.jpg';

const Navbar = () => {
  const navigate = useNavigate(); // Initialize navigate
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="nav-links">
        <Link to="/men">Men</Link>
        <Link to="/women">Women</Link>
        <Link to="/kids">Kids</Link>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="auth-buttons">
      <Link to="/login">
          <button className="login-button">Login</button>
        </Link>
        <Link to="/register">
          <button className="register-button">Register</button>
        </Link>
        <img src={profile} alt="profile" className="profile-image" />
        <div className="icon" onClick={() => navigate('/cart')}>
    🛒
  </div>
      </div>
    </nav>
  );
};

export default Navbar;
