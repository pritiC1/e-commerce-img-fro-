// src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProducts(response.data.products);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Token expired, attempt to refresh it
          await refreshToken();
          fetchProducts();  // Retry after refreshing the token
        } else {
          setError('Error fetching products!');
        }
      }
    };
    fetchProducts();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/refresh/', {
        refresh: localStorage.getItem('refreshToken'),
      });
      localStorage.setItem('token', response.data.access);
    } catch (err) {
      setError('Session expired. Please log in again.');
    }
  };

  return (
    <div className="product-list">
      <h2>Product List</h2>
      {error && <p className="error">{error}</p>}
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>{product.price}</p>
            <button>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
