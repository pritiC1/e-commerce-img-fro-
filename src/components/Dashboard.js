import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { useCart } from '../cartContext'; // Importing Cart context
import { Link } from 'react-router-dom'; 
import HeroSection from './Hero'; // HeroSection on the left
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode
import './Dashboard.css'; // Create a CSS file for styling
import logo from '../Assets/logo.png';


const Dashboard = () => {

  const [isSuperuser, setIsSuperuser] = useState(false); // Track if user is superuser
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state for API requests
  const { addToCart, cart } = useCart(); // Destructure addToCart and cart
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    category: '',
    color: '',
    size: '',
    image: null, 
  });

  
  

  const handleImageChange = (e) => {
    setNewProduct((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };




  // Function to fetch products from the backend
  const fetchProducts = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get('http://localhost:8000/api/products/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setProducts(response.data); // Store the fetched products in state
    } catch (error) {
      setError('Error in product uploading . Please login again .');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); // Set loading to false after the fetch is complete
    }
  };

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
    checkIfSuperuser();
  }, []);


  
  // Handle input changes for new product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for uploading new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price  || !newProduct.description || !newProduct.image) {
      setError('Please fill in all required fields.');
      return;
    }
    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      formData.append(key, newProduct[key]); // Append each field to formData
    });

    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/products/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data',  // Indicating it's form data
        },
      });

      setNewProduct({
        name: '',
        description: '',
        price: '',
        image: null,
      }); // Reset form
      fetchProducts(); // Fetch updated products after uploading
    } catch (error) {
      setError('Error uploading product. Please try again.');
      console.error('Error uploading product:', error);
    } finally {
      setLoading(false); // Set loading to false after the form submission
    }
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/products/${productId}/`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
     });



      // Update the state to remove the deleted product
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    } catch (error) {
      setError('Error deleting product. Please try again.');
      console.error('Error deleting product:', error);
    }
  };

  const handleLike = async (productId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `http://localhost:8000/api/products/${productId}/like/`, 
        {}, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      // Update the product list with the new like count and liked status
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, like_count: response.data.like_count, liked: response.data.liked }
            : product
        )
      );
    } catch (error) {
      setError('Failed to like product.');
      console.error('Error liking product:', error);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = (product) => {
    addToCart(product); // Adds product to cart
    console.log(cart); // Check that cart updates when adding product
  };




  if (checkIfSuperuser) {
    console.log("User is a superuser");
  }


  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
        <div className="navbar-container">
          
        <div style={{ display: 'flex', gap: '10px' }}>
        <Link to="/">
          <button className="navbar-button">Home</button>
        </Link>
          <Link to="/cart">
          <button className="navbar-button">Cart ({cart.length})</button> 
          </Link>
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
          
        </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="hero-section">
          <HeroSection />
        </div>
        <div className="main-content">
          {isSuperuser && (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Product Name"
                required
              />
              <input
                type="text"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Product Description"
              />
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                placeholder="Product Price"
                required
              />
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                required
              />
              <button type="submit">{loading ? 'Uploading...' : 'Upload Product'}</button>
            </form>

            )}

          {error && <p className="error">{error}</p>}


          <h3>Uploaded Products</h3>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="product-list">
              {products.map((product) => (
                <div className="product-item" key={product.id}>
                  {product.image_url && (
                    <img
                    src={`http://localhost:8000${product.image_url}`} // Correct URL path
                    alt={product.name}
                    className="product-image"
                  />
                  )}
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <p>Price: ${product.price}</p>
                  
                  <div className="like-container">
                  <FontAwesomeIcon
                    icon={product.liked ? solidHeart : regularHeart} // Toggle between filled and outline heart
                    style={{
                      color: product.liked ? 'red' : 'grey', // Change color based on liked status
                      cursor: 'pointer',
                      fontSize: '24px', // Optional: Adjust size for better visibility
                    }}
                    onClick={() => handleLike(product.id)} // Toggle like on click
                  />
                  <p>Likes: {product.like_count}</p> {/* Display the updated like count */}
                </div>

                  <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                  {isSuperuser && (
                    <button onClick={() => handleDelete(product.id)}>Delete Product</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
