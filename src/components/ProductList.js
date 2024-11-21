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
  const [nextPageUrl, setNextPageUrl] = useState(null);  // To track the next page URL for pagination
  const { addToCart } = useCart(); // Get addToCart from context



  const fetchProducts = async (url) => {
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setProducts((prevProducts) => [...prevProducts, ...response.data.products]);
      setNextPageUrl(response.data.next);  // Set the next page URL
    } catch (err) {
      console.error('Error fetching products:', err);
      if (err.response && err.response.status === 401) {
        refreshToken(); // Call the refresh token function
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async (url) => {
      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        console.log('API Response:', response.data); // Log the response
      setProducts((prevProducts) => [...prevProducts, ...response.data.products]);
      setNextPageUrl(response.data.next);  // Set the next page URL
    } catch (err) {
      console.error('Error fetching products:', err);
      if (err.response && err.response.status === 401) {
        refreshToken(); // Call the refresh token function
      }
    }
  };

    fetchProducts('http://127.0.0.1:8000/api/products/');
  }, []);  // Empty dependency array means this runs only once on component mount
  
  const handleLoadMore = () => {
    if (nextPageUrl) {
      fetchProducts(nextPageUrl);  // Fetch next page of products
    }
  };


  const handleAddToCart = (product) => {
    addToCart(product); // Pass the entire product object to the cart
  };

  
    const refreshToken = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/refresh/', {
        refresh: localStorage.getItem('refresh_Token'),
      });
      localStorage.setItem('access_token', response.data.access);
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

  const handleLike = async (productId, isLiked) => {
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

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                like_count: response.data.like_count,
                liked: response.data.liked,
              }
            : product
        )
      );
    } catch (err) {
      console.error('Error liking the product:', err);
    }
  };



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
            <img src={product.image_url} alt={product.name} />
          ) : (
            <p>No Image Available</p>
          )}
          <h3>{product.name}</h3>
          <p>{product.description}</p>
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
       {/* Add a "Load More" button if there is a next page */}
       {nextPageUrl && (
        <button className="load-more" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
};
export default ProductList;
