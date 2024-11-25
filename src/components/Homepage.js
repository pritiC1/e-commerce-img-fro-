import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Homepage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/public-products/');
      
      // Ensure response data contains products as an array
      if (Array.isArray(response.data.products)) {
        setProducts(response.data.products);  // Set products only if it's an array
      } else {
        console.error('Products data is not an array:', response.data.products);
        setProducts([]);  // Set an empty array as a fallback
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);  // Set an empty array in case of error
    }
  };
  
  // Function to handle Add to Cart button click
  const handleAddToCart = () => {
    if (!localStorage.getItem("access_token")) {
      // If not logged in, ask user to log in or register
      alert('Please log in or register to add items to the cart.');
      navigate('/login');  // Redirect to login page
    } else {
      // Handle the Add to Cart logic here
      alert('Item added to cart!');
    }
  };

 

  // Function to handle Heart button click (like functionality)
  const handleLike = async (productId, liked) => {
    const token = localStorage.getItem("access_token");
  
    if (!token) {
      alert('Please log in or register to like products.');
      navigate('/Login');
      return;  // Exit the function if no token
    }
  
    // Optimistic UI update
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? {
            ...product,
            liked: !liked,
            like_count: liked ? product.like_count - 1 : product.like_count + 1,
          }
        : product
    );
    setProducts(updatedProducts);
  
    try {
      await axios.post(
        `http://localhost:8000/api/products/${productId}/like/`, // Correct API endpoint
        {},  // Empty body since we are just liking
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Make sure token is passed correctly
          },
        }
      );
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert optimistic UI changes on error
      const revertProducts = products.map((product) =>
        product.id === productId
          ? { ...product, liked: liked, like_count: liked ? product.like_count + 1 : product.like_count - 1 }
          : product
      );
      setProducts(revertProducts);
    }
  };
  
  

  
  useEffect(() => {
    fetchProducts(); // Fetch products on mount
  }, []);

  return (
    <div className="homepage">
      
      <Navbar />

       {/* Banner Section */}
      <div className="banner">
        <img src="banner1.jpg" alt="Banner" className="banner-image" />
        <div className="banner-content">
          <button onClick={() => navigate('/shop')} className="shop-now-button">Shop Now</button>
        </div>
      </div>



      
      <h2>Our Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div className="product-item" key={product.id}>
                {/* Image on top */}
              {product.image_url && <img src={product.image_url} alt={product.name} className="product-image" />}

              {/* Product details below image */}
              <div className="product-details">
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
          </div>
          <div className="product-actions">
            {/* Add to Cart button */}
            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>

            {/* Heart button for liking */}
            <div className="like-container">
              <FontAwesomeIcon
                icon={product.liked ? solidHeart : regularHeart}
                style={{
                  color: product.liked ? 'red' : 'grey',
                  cursor: 'pointer',
                  fontSize: '24px',
                }}
                onClick={() => handleLike(product.id, product.liked)} // Toggle like on click
              />
              
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default HomePage;