import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import HeroSection from './Hero'; // HeroSection on the left
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode
import './Dashboard.css'; // Create a CSS file for styling
import ProductUploadForm from './ProductUploadForm';


const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    category: '',
    color: '',
    size: '',
  });
  const [isSuperuser, setIsSuperuser] = useState(false); // Track if user is superuser
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state for API requests

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
      setError('Error fetching products. Please try again.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); // Set loading to false after the fetch is complete
    }
  };

  // Function to check if user is superuser
  const checkIfSuperuser = () => {
    const token = localStorage.getItem('token');
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
    checkIfSuperuser(); // Check if the user is a superuser
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
    if (!newProduct.name || !newProduct.price || !newProduct.brand || !newProduct.description || !newProduct.category || !newProduct.color || !newProduct.size) {
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
        brand: '',
        category: '',
        color: '',
        size: '',
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
      await axios.delete(`http://localhost:8000/api/products/${productId}/`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });



      // Update the state to remove the deleted product
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    } catch (error) {
      setError('Error deleting product. Please try again.');
      console.error('Error deleting product:', error);
    }
  };


  const handleNewProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);  // Add the new product to the state
  };


  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <div className="hero-section">
          <HeroSection />
        </div>
        <div className="main-content">
          {/* Conditionally render product upload form if user is a superuser */}
          {isSuperuser && (
                <ProductUploadForm onProductUploaded={handleNewProduct} />
            )}
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
                type="text"
                name="brand"
                value={newProduct.brand}
                onChange={handleInputChange}
                placeholder="Product Brand"
                required
              />
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                placeholder="Product Category"
              />
              <input
                type="text"
                name="color"
                value={newProduct.color}
                onChange={handleInputChange}
                placeholder="Product Color"
              />
              <input
                type="text"
                name="size"
                value={newProduct.size}
                onChange={handleInputChange}
                placeholder="Product Size (e.g., S, M, L, XL)"
              />
              <button type="submit">{loading ? 'Uploading...' : 'Upload Product'}</button>
            </form> 
          

          {error && <p className="error">{error}</p>}

          <h3>Uploaded Products</h3>
          {loading ? (
            <p>Loading products...</p>
          ) : (
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
