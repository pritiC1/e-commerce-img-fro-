import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Homepage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';
import bannerImage from '../Assets/AURA.jpg';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    '',
    '',
    'Bags',
    'Watches',
    
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/public-products/');
      if (Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        console.error('Products data is not an array:', response.data.products);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };
  const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    return token && token !== 'undefined' && token !== 'null';
  };
  
  const handleAddToCart = (productId) => {
    // Check if the user is authenticated
    if (!isAuthenticated()) {
      alert('You need to log in to add items to your cart.');
      navigate('/login');  // Redirect to the login page
      return;  // Do not proceed further if not authenticated
    }
  
    // Now, proceed with adding the item to the cart
    // If you have any actual cart logic, place it here
    console.log(`Item with ID ${productId} added to cart!`);
    alert('Item added to cart!');
  };
  

  const handleLike = async (productId, liked) => {
    if (!isAuthenticated()) {
      alert('You need to log in to like products.');
      navigate('/login');
      return;
    }
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
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
    } catch (error) {
      console.error('Error updating like:', error);
      const revertedProducts = products.map((product) =>
        product.id === productId
          ? {
              ...product,
              liked: liked,
              like_count: liked ? product.like_count + 1 : product.like_count - 1,
            }
          : product
      );
      setProducts(revertedProducts);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="homepage">
      <Navbar />
      <div className="banner">
        <img src={bannerImage} alt="Banner" className="banner-image" />
      </div>

      {/* Category Scrolling Section */}
      <div className="category-container">
        <div className="category-scroller">
          {categories.map((category, index) => (
            <div
              className="category-circle"
              key={index}
              style={{
               
              }}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      
      <div className="product-list">
        {products.map((product) => (
          <div className="product-item" key={product.id}>
            {product.image_url && <img src={product.image_url} alt={product.name} className="product-image" />}
            <div className="product-details">
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <p>
                <strong>Price:</strong> ₹{product.price}
              </p>
            </div>
            <div className="product-actions">
            <button className="add-to-cart" onClick={() => handleAddToCart(product.id)}>
              Add to Cart
            </button>

              <div className="like-container">
                <FontAwesomeIcon
                  icon={product.liked ? solidHeart : regularHeart}
                  style={{
                    color: product.liked ? 'red' : 'grey',
                    cursor: 'pointer',
                    fontSize: '24px',
                  }}
                  onClick={() => handleLike(product.id, product.liked)}
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
