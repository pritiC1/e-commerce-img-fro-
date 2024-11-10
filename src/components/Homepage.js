import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Homepage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  useEffect(() => {
    fetchProducts(); // Fetch products on mount
  }, []);

  return (
    <div className="homepage">
      <Navbar />
      <h2>Products</h2>
      <div className="product-list">
              {products.map((product) => (
                <div className="product-item" key={product.id}>
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <p>Brand: {product.brand}</p>
                  <p>Category: {product.category}</p>
                  <p>Color: {product.color}</p>
                  <p>Size: {product.size}</p>
                  <p>Price: ${product.price}</p>
                 </div> 
              ))}
      </div>
    </div>
  );
};

export default HomePage;
