import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './LikedProducts.module.css';
import Navbar from './Navbar';

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



    
    <div className={styles.likedProductsWrapper}>
          <Navbar />
  {error && <p className={styles.errorMessage}>{error}</p>}
  {message && <p className={styles.successMessage}>{message}</p>}
  {loading ? (
    <p className={styles.loading}>Loading liked products...</p>
  ) : (
    <div className={styles.productList}>
      {likedProducts.map((product) => (
        <div
          key={product.id}
          className={styles.productCard}
          onClick={() => handleProductClick(product.id)}
        >
          <img
            src={`http://127.0.0.1:8000${product.image_url}`}
            alt={product.name}
            className={styles.productImage}
            onError={(e) => (e.target.src = '/default-image.png')}
          />
          <h4>{product.name}</h4>
          <p>{product.description}</p>
          <p>Price: {product.price}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product.id);
            }}
            className={styles.addToCartBtn}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  )}
</div>
  )};
export default LikedProducts;