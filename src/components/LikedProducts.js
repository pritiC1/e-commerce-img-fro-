import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LikedProducts = () => {
  const [likedProducts, setLikedProducts] = useState([]);  // Store the liked products
  const [error, setError] = useState(null);  // error state
  const [loading, setLoading] = useState(true);  // loading state to handle async data fetch
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    const fetchLikedProducts = async () => {
      setLoading(true); // Set loading to true while fetching
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/products/like/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLikedProducts(response.data); // Store fetched liked products
      } catch (err) {
        setError('Failed to fetch liked products. Please try again later.');
        console.error('Error fetching liked products:', err);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };
      fetchLikedProducts();
    }, []);
    
    
    const toggleLike = async (productId) => {
      try {
          const token = localStorage.getItem('access_token');
          const response = await axios.post(
              `http://localhost:8000/api/products/${productId}/like/`,  // Include productId in the URL
              {},
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
          );
          setMessage(response.data.message);
      } catch (err) {
          setError('Failed to like product. Please try again later.');
          console.error('Error liking product:', err);
      }
  };

  
    return (
      <div>
        <h1>Liked Products</h1>
        {loading && <p>Loading liked products...</p>} {/* Show loading message while fetching */}
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if an error exists */}
        {message && <p>{message}</p>}
        {likedProducts.length === 0 ? (
          <p>No liked products yet.</p>
        ) : (
          likedProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image_url} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <button onClick={() => toggleLike(product.id)}>
              {product.is_liked ? 'Unlike' : 'Like'} {/* Toggle text based on liked status */}
            </button>
            </div>
          ))
        )}
      </div>
    );
  };
  
  export default LikedProducts;