// src/components/HeroSection.js
import React from 'react';
import './Hero.css';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <h2>Your Orders</h2>
      <div className="order-summary">
        {/* Example order items */}
        <div className="order-item">
          <p>Order #1234</p>
          <p>Status: Shipped</p>
        </div>
        <div className="order-item">
          <p>Order #1235</p>
          <p>Status: Pending</p>
        </div>
        <div className="order-item">
          <p>Order #1236</p>
          <p>Status: Delivered</p>
        </div>
      </div>
      <button className="view-all-button">View All Orders</button>
    </div>
  );
};

export default HeroSection;
