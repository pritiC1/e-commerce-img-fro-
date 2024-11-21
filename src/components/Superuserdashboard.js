import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons'; // For the solid heart
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; // For the regular heart
import { Link } from 'react-router-dom';
import './Superuserdashboard.css';
import { ToastContainer,toast } from 'react-toastify';// Import Toastify
import 'react-toastify/dist/ReactToastify.css';

const SuperUserDashboard = () => {
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [ setSuccessMessage] = useState(null);
  const [productNotifications, setProductNotifications] = useState({});

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  const notify = (message, type = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };
  
  const handleNewProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('image', newProduct.image);

    try {
      await axios.post('http://localhost:8000/api/products/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Product uploaded successfully!');
      setError(null); 
    } catch (error) {
        setError('Failed to upload product. Please try again.');  // Set the error message
    } finally {
      setLoading(false);
    }
  };

  

  // Fetch the products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        setIsSuperuser(response.data.is_superuser);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    

    fetchProducts();
    fetchUserData();
  }, [isSuperuser]);

  // Handle like/unlike of products
  const handleLike = (productId) => {
    // Toggle the like status
    setLikedProducts((prevLikes) => ({
      ...prevLikes,
      [productId]: !prevLikes[productId],
    }));

    // Display the notification
    setProductNotifications((prevNotifications) => ({
      ...prevNotifications,
      [productId]: 'Product Liked',
    }));

    notify('Product Liked', 'success');

    // Hide the notification after 3 seconds
    setTimeout(() => {
      setProductNotifications((prevNotifications) => {
        const newNotifications = { ...prevNotifications };
        delete newNotifications[productId]; // Remove the notification for the liked product
        return newNotifications;
      });
    }, 3000); // 3 seconds timeout
  };
  


  // Handle product delete
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/products/${productId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handle product selection for editing
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: null,
    });
    setShowUploadForm(true);
  };

  // Handle product update (submit the form)
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { name, description, price, image } = formData;

    if (!name || !description || !price) {
      alert('Please fill in all fields');
      return;
    }

    const updatedProductData = new FormData();
    updatedProductData.append('name', name);
    updatedProductData.append('description', description);
    updatedProductData.append('price', price);
    if (image) updatedProductData.append('image', image);

    try {
      await axios.put(`http://localhost:8000/api/products/${selectedProduct.id}/`, updatedProductData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the product list with the new data
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id ? { ...product, ...formData } : product
        )
      );
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: null,
      });
      setShowUploadForm(false); // Hide the form after update
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
    }
  };

  return (
    <div>
      <ToastContainer />
      <nav className="superuser-navbar">
        <div className="navbar-content">
          <h2>Superuser Dashboard</h2>
          <div className="navbar-buttons">
            <Link to="/">
              <button className="navbar-button">Home</button>
            </Link>

            <Link to="/orders">
              <button className="navbar-button">Orders</button>
            </Link>

            <button
              className="navbar-button"
              onClick={() => setShowUploadForm(!showUploadForm)}
            >
              {showUploadForm ? 'Close Form' : 'Upload Product'}
            </button>

            <Link to="/">
              <button className="login-button">Logout</button>
            </Link>
            
          </div>
        </div>
      </nav>
      <div className="dashboard-content">

        <div className="main-content">
          {showUploadForm && (
            <form onSubmit={handleNewProductSubmit}>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Product Name"
                required
              />
              <input
                type="text"
                name="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Product Description"
              />
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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

          <h3>Uploaded Products</h3>
          {error && <div className="error-message">{error}</div>} {/* Display error message */}
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="product-list">
              {products.map((product) => (
                <div className="product-item" key={product.id}>
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
                    onClick={() => handleLike(product.id)}
                    />
                </div>

                {/* Display notification for liked product */}
                {/* Display notification for the liked product */}
                {productNotifications[product.id] && (
                        <div className="liked-notification">{productNotifications[product.id]}</div>
                    )}
                    
                        <>
                          <button onClick={() => handleEdit(product)}>Edit Product</button>
                          <button onClick={() => handleDelete(product.id)}>Delete Product</button>
                        </>
                    
                        
                        </div>
                    ))}
            </div>
          )}

          {/* Product Edit Form */}
          {selectedProduct && (
            <div className="product-edit-form">
              <h3>Edit Product</h3>
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Product Name"
                  required
                />
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Product Description"
                  required
                />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Product Price"
                  required
                />
                <input type="file" onChange={handleImageChange} />
                <button type="submit">Update Product</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperUserDashboard;