import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Homepage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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
    if (!localStorage.getItem("access_token")) {
      alert('Please log in or register to like products.');
      navigate('/login');
    } else {
      // Optimistic UI update: update the like state locally first
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
      `http://localhost:8000/api/products/${productId}/like/`, 
      {}, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
  } catch (error) {
    console.error('Error updating like:', error);
    // If API call fails, revert the like state
    const revertProducts = products.map((product) =>
      product.id === productId
        ? { ...product, liked: liked, like_count: liked ? product.like_count + 1 : product.like_count - 1 }
        : product
    );
    setProducts(revertProducts);
  }
}
};

  
  useEffect(() => {
    fetchProducts(); // Fetch products on mount
  }, []);

  return (
    <div className="homepage">
      <Navbar />
      <h2>Our Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div className="product-item" key={product.id}>
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Color:</strong> {product.color}</p>
            <p><strong>Size:</strong> {product.size}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            {product.image_url && <img src={product.image_url} alt={product.name} />}
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
                <p>Likes: {product.like_count}</p>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
