import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LikedProducts = () => {
    const [likedProducts, setLikedProducts] = useState([]);
    const [error, setError] = useState(null); // error state defined
  
    useEffect(() => {
      const fetchLikedProducts = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.get('http://localhost:8000/api/products/liked/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setLikedProducts(response.data);
        } catch (err) {
          setError('Failed to fetch liked products. Please try again later.');
          console.error('Error fetching liked products:', err);
        }
      };
      fetchLikedProducts();
    }, []);
  
    return (
      <div>
        <h1>Liked Products</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if an error exists */}
        {likedProducts.length === 0 ? (
          <p>No liked products yet.</p>
        ) : (
          likedProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image_url} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
            </div>
          ))
        )}
      </div>
    );
  };
  
  export default LikedProducts;