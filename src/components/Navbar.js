// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/logo.png';
import profile from '../Assets/profile.jpg';

const Navbar = () => {
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
        <button className="login-button">Login</button>
        {/* Add a class to the profile image for styling */}
        <img src={profile} alt="profile" className="profile-image" />
        <button className="cart-button">Cart</button>
      </div>
    </nav>
  );
};

export default Navbar;
