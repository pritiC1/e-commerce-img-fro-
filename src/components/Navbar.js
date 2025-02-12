// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/AURA/2.jpg';


const Navbar = () => {
  const navigate = useNavigate(); // Initialize navigate
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
        
      <div className="auth-buttons">
      <Link to="/menpage">Men</Link>
        <Link to="/women">Women</Link>
        <Link to="/kids">Kids</Link>
    
      
      <Link to="/login">
          <button className="login-button">Login</button>
        </Link>
        <Link to="/register">
          <button className="register-button">Register</button>
        </Link>
        
      </div>
    </nav>
  );
};

export default Navbar;
