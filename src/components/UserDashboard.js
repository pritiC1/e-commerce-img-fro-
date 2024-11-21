import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart, faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode
import './UserDashboard.css'; // Create a CSS file for styling
import logo from '../Assets/logo.png';
import profile from '../Assets/profile.jpg';


const Dashboard = ( user) => {
  const [isHovered, setIsHovered] = useState(false);
  const profileRef = useRef(null); // Ref to track the profile button
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const [likedProducts, setLikedProducts] = useState([]);
  const [ setIsSuperuser] = useState(false); // Track if user is superuser
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state for API request
  const isAuthenticated = localStorage.getItem('access_token');
  const [products, setProducts] = useState([]);
  const [showProfilePopup, setShowProfilePopup] = useState(false);






  // Function to fetch products from the backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/products/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,  // Assuming JWT is needed
        }
      });
      if (Array.isArray(response.data)) {
        setProducts(response.data);
        // Initialize likedProducts state based on product data (assuming each product has liked_by_user)
        const liked = {};
        response.data.forEach(product => {
          liked[product.id] = product.liked_by_user;  // Track liked status
        });
        setLikedProducts(liked);
      } else {
        console.error('Error: Response data is not an array', response.data);
        setProducts([]);  // Handle error
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  // Function to check if user is superuser
  const checkIfSuperuser = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Correctly use jwtDecode
        console.log('Decoded Token:', decodedToken); // Log the decoded token to check its structure
        setIsSuperuser(decodedToken.is_superuser); // Set isSuperuser based on decoded token
      } catch (error) {
        setError('Error decoding token. Please log in again.');
        console.error('Error decoding token:', error);
      }
    }
  };

  
  // Fetch products and check if user is superuser when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/Login");
  };


  

  

  const handleLike = async (productId) => {
    try {
      // Send a POST request to toggle the like status
      const response = await axios.post(
        `http://localhost:8000/api/products/${productId}/like/`, {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,  // Authorization header
          }
        }
      );

      const updatedProduct = response.data;

      setLikedProducts(prevLikedProducts => {
        const updatedLikedProducts = {
          ...prevLikedProducts,
          [productId]: true, // Mark this product as liked
        };

        // Persist the updated liked products in localStorage
        localStorage.setItem('likedProducts', JSON.stringify(updatedLikedProducts));

        return updatedLikedProducts;
      });

      // Update the like count in the products state
      setProducts(prevProducts => {
        return prevProducts.map(product => 
          product.id === productId 
            ? { ...product, like_count: updatedProduct.like_count }  // Update the like count
            : product
        );
      });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (checkIfSuperuser) {
    console.log("User is a superuser");
  }

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem('likedProducts')) || {};
    setLikedProducts(storedLikes); // Set initial liked state from localStorage
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowProfilePopup(true); // Show popup when mouse enters
  };

  // Handle mouse leave
  const handleMouseLeave = (event) => {
    // Ensure refs are defined and check if mouse leaves both profile button and popup
    if (
      profileRef.current &&
      popupRef.current &&
      !profileRef.current.contains(event.relatedTarget) &&
      !popupRef.current.contains(event.relatedTarget)
    ) {
      setIsHovered(false);
      setShowProfilePopup(false); // Hide popup when mouse leaves both
    }
  };


  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="navbar-container">
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="like-button"
              onClick={() => navigate("/Likedproducts")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "24px",
              }}
            >
              ❤️
            </button>
            <Link to="/">
              <button className="navbar-button">Home</button>
            </Link>

            <Link to="/cart">
              <button className="navbar-button">Cart</button>
            </Link>


            {isAuthenticated ? (
        <>
          {/* Profile Button */}
          <div
           className={`profile-button ${isHovered ? 'hovered' : ''}`} // Add hovered class conditionally
            ref={profileRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={profile}
              alt="Profile"
              className="profile-image"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Profile Popup */}
          {showProfilePopup && (
            <div
              className="profile-popup"
              ref={popupRef}
              onMouseEnter={handleMouseEnter} // Prevent closing when hovering over the popup
              onMouseLeave={handleMouseLeave} // Close popup when mouse leaves popup
            >
              <div className="popup-content">
                <h4>Profile</h4>
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone_number}
                </p>

                {/* Order History */}
                <div>
                  <h5>Order History</h5>
                  {user.orders && user.orders.length > 0 ? (
                    <ul>
                      {user.orders.map((order, index) => (
                        <li key={index}>
                          <span>
                            Order #{order.id} - {order.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No orders yet.</p>
                  )}
                </div>

                {/* Logout Button */}
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        // Login Button for unauthenticated users
        <Link to="/login">
          <button className="login-button">Login</button>
        </Link>
      )}
          </div>
        </div>
      </nav>
    

      <div className="dashboard-content">
        <div className="hero-section">
         
        </div>
          {error && <p className="error">{error}</p>}
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="product-list">
              {products.map((product) => (
                <div
                className="product-item"
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)} // Navigate to ProductDetail page
                style={{ cursor: 'pointer' }} // Make the product card clickable
              >
                  <img
                    src={product.image_url} // Ensure this URL is correct
                    alt={product.name}
                    className="product-image"
                  />
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <p>Price: ${product.price}</p>

                  <div className="like-container">
                  <FontAwesomeIcon
                    icon={likedProducts[product.id] ? solidHeart : regularHeart}
                    style={{
                      color: likedProducts[product.id] ? 'red' : 'grey',
                      cursor: 'pointer',
                      fontSize: '24px',
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigating to the product detail page
                      handleLike(product.id);
                    }}
                  />
                  <span>{product.like_count} likes</span>
                </div>
                  </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
};

export default Dashboard;