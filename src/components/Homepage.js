import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/');
      setProducts(response.data); // Set products in state
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on mount
  }, []);

  return (
    <div className="homepage">
      <h2>Featured Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div className="product-item" key={product.id}>
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            {product.image && <img src={product.image} alt={product.name} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
