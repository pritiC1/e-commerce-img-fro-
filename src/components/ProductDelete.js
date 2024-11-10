// src/components/ProductDelete.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductDelete = ({ id }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDelete = async () => {
    setError('');
    setSuccess('');

    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccess('Product deleted successfully!');
      navigate('/products');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        await refreshToken();
        handleDelete();
      } else {
        setError('Error deleting product!');
      }
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
        refresh: localStorage.getItem('refreshToken'),
      });
      localStorage.setItem('token', response.data.access);
    } catch (err) {
      setError('Session expired. Please log in again.');
    }
  };

  return (
    <div className="product-delete">
      <button onClick={handleDelete}>Delete Product</button>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default ProductDelete;
