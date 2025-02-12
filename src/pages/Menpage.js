import React from 'react';
import { Link } from 'react-router-dom';
import './Menpage.css';
import Navbar from '../components/Navbar';

const MenPage = () => {
  return (
    <div>
       <Navbar />
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-text">Welcome to Aura - Men's Collection</h1>
        <p className="hero-subtext">Explore the latest trends in men's fashion</p>
      </div>

      {/* Categories Section */}
      <div className="categories-container">
        <h2 className="section-title">Categories</h2>
        <div className="category-list">
          <Link to="/products/men/shirts" className="category-item">
            <div className="category-box">Shirts</div>
          </Link>
          <Link to="/products/men/pants" className="category-item">
            <div className="category-box">Pants</div>
          </Link>
          <Link to="/products/men/jackets" className="category-item">
            <div className="category-box">Jackets</div>
          </Link>
          <Link to="/products/men/accessories" className="category-item">
            <div className="category-box">Accessories</div>
          </Link>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="featured-container">
        <h2 className="section-title">Featured Products</h2>
        <div className="products-grid">
          {/* Example Product 1 */}
          

          

          
        </div>
      </div>
    </div>
  );
};

export default MenPage;
