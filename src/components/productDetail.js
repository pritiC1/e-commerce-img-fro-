// ProductDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './productDetail.css'; // You can add custom styles here

const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        "/cart/add/",
        { product_id: product.id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT token
          },
        }
      );
       console.log(response.data);
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  const handleBuyNow = () => {
    // Handle the buy now functionality (perhaps direct to checkout page)
    navigate('/checkout');
  };

  return (
    <div className="product-detail-page">
      {product ? (
        <div className="product-detail-container">
          <div className="product-image">
            <img src={product.image_url} alt={product.name} />
          </div>
          <div className="product-info">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <div className="product-buttons">
            <button onClick={handleAddToCart}>Add to Cart</button>
              <button onClick={handleBuyNow}>Buy Now</button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetail;
