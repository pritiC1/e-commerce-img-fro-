import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductUploadForm.css';

const ProductUploadForm = ({ onProductUploaded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);

  useEffect(() => {
    const checkUserStatus = () => {
      const user = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage
      if (user) {
        setIsAuthenticated(true);  // User is authenticated
        setIsSuperUser(user.is_superuser);  // Check if user is a superuser
      }
    };
    checkUserStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF).');
        return;
      }

      if (file.size > maxSize) {
        setError('File size exceeds 5MB.');
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));  // Preview the selected image
      setError('');  // Clear error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const userToken = localStorage.getItem('acceess_token');  // Retrieve token from localStorage

    if (!userToken) {
      setError('No authentication token found.');
      return;
    }

    const formDataToSubmit = new FormData();
    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/products/',
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,  // Pass the token in the header
          },
        }
      );
      setSuccess('Product uploaded successfully!');
      onProductUploaded(response.data);  // Pass new product data back to parent
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Token expired, attempt to refresh it
        await refreshToken();
        handleSubmit(e);  // Retry after refreshing the token
      } else {
        setError('Error uploading product! Please check your input.');
      }
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/refresh/', {
        refresh: localStorage.getItem('refreshToken'),
      });
      localStorage.setItem('token', response.data.access);
    } catch (err) {
      setError('Session expired. Please log in again.');
      // Redirect to login or handle further as needed
    }
  };

 
  if (!isAuthenticated) {
    return <p>Please log in to upload products.</p>;
  }

  if (!isSuperUser) {
    return <p>You do not have permission to upload products.</p>;
  }

  return (
    <div className="product-upload-form">
      <h2>Upload Product</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />
        <label htmlFor="image" className="upload-label">Upload Product Image</label>
        <input
          type="file"
          name="image"
          id="image"
          onChange={handleImageChange}
        />
        
        <button type="submit">Upload Product</button>
      </form>
      <div className="product-card">
        {/* Mock display for uploaded product */}
        <h3>{formData.name}</h3>
        <p>{formData.description}</p>
        <p>Price: ${formData.price}</p>
        <p>Category: {formData.category}</p> {/* Added category */}
        <p>Color: {formData.color}</p> {/* Added color */}
        <p>Size: {formData.size}</p> {/* Added size */}
        {imagePreview && <img src={imagePreview} alt="Uploaded product preview" className="image-preview" />}
        
      </div>
    </div>
  );
};

export default ProductUploadForm;