import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LikedProducts.css';

const LikedProducts = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedProducts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/api/liked-products/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ensure the data is from 'liked_products' as per your API response
        setLikedProducts(response.data.liked_products || []); // Use the correct key from the response
      } catch (err) {
        setError('Failed to fetch liked products. Please try again later.');
        console.error('Error fetching liked products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProducts();
  }, [message]); // Run effect when message changes

  

  // Handle product click to navigate to product details page
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  
  const handleAddToCart = (productId) => {
    console.log(`Product with ID: ${productId} added to cart.`);
    setMessage('Product added to cart.');
    // Add your add to cart logic here
  };


  return (
    <div>
      <h1>Liked Products</h1>

      {/* Display error or success messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p>{message}</p>}

      {/* Show loading spinner while data is being fetched */}
      {loading ? (
        <p>Loading liked products...</p>
      ) : Array.isArray(likedProducts) && likedProducts.length > 0 ? (
        <div className="product-list">
          {likedProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product.id)}
              style={{ cursor: 'pointer' }} // Ensures a pointer cursor
            >
              {/* Display Image */}
              <img
                src={`http://127.0.0.1:8000${product.image_url}`} // Prepend base URL for the image
                alt={product.name}
                className="product-image"
                onError={(e) => (e.target.src = '/default-image.png')} // Fallback image on error
              />
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>

              {/* Add to Cart Button */}
              <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id); }} className="add-to-cart-btn">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No liked products yet.</p>
      )}
    </div>
  );
};

export default LikedProducts;