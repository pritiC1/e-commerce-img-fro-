import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './productDetail.css';
import { useCart } from '../cartContext';



// Helper function to refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error('No refresh token found.');

    const response = await axios.post('http://localhost:8000/api/auth/refresh', { refresh_token: refreshToken });
    const { access_token } = response.data;

    localStorage.setItem("access_token", access_token); // Store new access token
    return access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    toast.error("Session expired. Please log in again.");
    // Redirect user to login if refresh fails
    window.location.href = '/login'; // Adjust with the path to your login page
  }
};

// Axios request wrapper with automatic token refresh
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token is expired, refresh token
      const newToken = await refreshAccessToken();
      // Retry the original request with new token
      error.config.headers['Authorization'] = `Bearer ${newToken}`;
      return axiosInstance(error.config);
    }
    return Promise.reject(error);
  }
);

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const navigate = useNavigate();
  const { updateCart } = useCart();
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:8000/api/products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);


  
  const handleAddToCart = async () => {
    // Step 1: Ensure size is selected
    if (!selectedSize) {
      toast.error('Please select a size before adding to the cart.');
      return;
    }
  
    // Step 2: Clear any active toasts from previous actions
    toast.dismiss();
  
    try {
      // Step 3: Make the API request to add product to cart
      const response = await axios.post(
        "http://localhost:8000/api/cart/add/",
        {
          product_id: product.id,
          quantity: 1,  // Default quantity
          size: selectedSize, // Size included in the request
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
  
      // Step 4: Handle success response
      if (response.status === 201 && response.data && response.data.cart) {
        toast.success('Product added to cart successfully!');
        updateCart(response.data.cart);  // Update frontend cart display
      } else {
        // If an unexpected response occurs, show an error message
        toast.error('Unexpected response from server');
      }
    } catch (error) {
      // Step 5: Handle error (if any)
      console.error("Error adding product to cart:", error.response?.data || error.message);
      toast.error('Failed to add product to cart.');
    }
  };
  
  
  
  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a size before proceeding.');
      return;
    }
    navigate('/CheckOutPage');
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    toast.success(`Size ${size} selected!`);
  };

  return (
    <div className="product-detail-page">
      {product ? (
        <div className="product-detail-container">
          {/* Left Section: Image & Buttons */}
          <div className="left-section">
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image"
            />
            <div className="product-buttons">
              {/* Styled Add to Cart Button */}
              <button onClick={handleAddToCart} className="add-to-cart-btn">
                <span>Add to Cart</span>
                <svg
                  fill="#fff"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g id="cart">
                    <circle r="1.91" cy="20.59" cx="10.07" />
                    <circle r="1.91" cy="20.59" cx="18.66" />
                    <path
                      d="M.52,1.5H3.18a2.87,2.87,0,0,1,2.74,2L9.11,13.91H8.64A2.39,2.39,0,0,0,6.25,16.3h0a2.39,2.39,0,0,0,2.39,2.38h10"
                    />
                    <polyline points="7.21 5.32 22.48 5.32 22.48 7.23 20.57 13.91 9.11 13.91" />
                  </g>
                </svg>
              </button>
  
              {/* Buy Now Button */}
              <button onClick={handleBuyNow} className="buy-now-btn">
                Buy Now
              </button>
            </div>
          </div>
  
          {/* Right Section: Product Info */}
          <div className="right-section">
            <h1 className="product-name">{product.name}</h1>
            <p className="product-description">{product.description}</p>
            <table className="price-table">
              <tbody>
                <tr>
                  <td>Price:</td>
                  <td>${product.price}</td>
                </tr>
              </tbody>
            </table>
  
            {/* Size Selection and Reviews */}
            <div className="additional-info">
              <div className="size-selection">
                <span>Select Size:</span>
                <div className="size-btns">
                  {["S", "M", "XL", "XXL"].map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${
                        selectedSize === size ? "selected" : ""
                      }`}
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
  
              <div className="reviews">
                <h3>Ratings & Reviews</h3>
                <p>Rating Graph Placeholder</p>
              </div>
            </div>
  
            {/* User Uploaded Images */}
            <div className="user-images">
              <h3>Customer Images</h3>
              <div className="user-images-gallery">
                {product.user_images?.map((image, index) => (
                  <img key={index} src={image} alt={`User Upload ${index}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
  
      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
  
};

export default ProductDetail;
