// src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { useCart } from '../cartContext';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
 
  const { addToCart } = useCart(); // Get addToCart from context

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log(response.data.products); // Check the data structure
        setProducts(
          response.data.products.map((product) => ({
            ...product,
            liked: false, // Add a `liked` field for each product
          }))
        );
      } catch (err) {
        console.error("Error fetching products:", err);
        if (err.response && err.response.status === 401) { 
          refreshToken(); // Call the refresh token function
        }
      }
    };
    fetchProducts();
  }, []);

    const handleAddToCart = (product) => {
      addToCart(product); // Pass the entire product object to the cart
    };

  
    const refreshToken = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/refresh/', {
        refresh: localStorage.getItem('refreshToken'),
      });
      localStorage.setItem('token', response.data.access);
    } catch (err) {
      // Log the error details for debugging
      console.log(err.response); // Logs the error details
  
      // Handle token expiration or missing token
      if (err.response && err.response.status === 400) {
        console.error('Session expired. Please log in again.');
        // Optionally redirect user to login page or clear the local storage
        window.location.href = '/login'; // Redirect to login
      } else {
        console.error('Error refreshing token.');
      }
    }
  };

  const handleLike = async (productId ,isLiked) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/like/${productId}/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Update the product's like count
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { 
              ...product, 
              like_count: response.data.like_count, 
              liked: response.data.liked // Toggle the like status
            }
          : product
        )
      );
    } catch (err) {
      console.error('Error liking the product:', err);
    }
  };
  console.log('Products State:', products);
  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          
            <div
              className="heart-icon"
              onClick={() => handleLike(product.id, product.liked)}
            >
              <FontAwesomeIcon
                icon={product.liked ? solidHeart : regularHeart}
                className={product.liked ? 'liked' : ''}
              />
            </div>
             
            {product.image_url ? (
            <img
              src={product.image_url.startsWith('http') ? product.image_url : `http://127.0.0.1:8000${product.image_url}`}
              alt={product.name}
              className="product-image"
              onError={(e) => { e.target.onerror = null; e.target.src = '/default-image.jpg'; }} // Fallback image
            />
          ) : (
            <img
              src="/default-image.jpg" // Replace with your actual default image path
              alt="Default"
              className="product-image"
            />
          )}
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Brand: {product.brand}</p>
          <p>Category: {product.category}</p>
          <p>Color: {product.color}</p>
          <p>Size: {product.size}</p>
          <p className="price">${product.price}</p>
          <div className="like-section">
          <button
            className="like-button"
            onClick={() => handleLike(product.id, product.liked)}
          >
            {product.liked ? "❤️" : "🤍"} {/* Like button icon */}
          </button>
          <span>{product.like_count} Likes</span>
        </div>
          <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};
export default ProductList;
