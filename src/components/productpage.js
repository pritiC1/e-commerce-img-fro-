import React, { useState } from 'react';
import ProductUploadForm from './ProductUploadForm';
import axios from 'axios';

const ProductPage = () => {
  const [products, setProducts] = useState([]);

  const handleProductUploaded = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleAddToCart = async (productId) => {
    try {
      const userToken = localStorage.getItem('access_token');
      await axios.post('http://127.0.0.1:8000/api/cart/', { product_id: productId }, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  return (
    <div>
      <h1>Product Page</h1>
      <ProductUploadForm onProductUploaded={handleProductUploaded} />
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
