// ProductUploadForm.js (or inside your Dashboard component)
import React, { useState } from "react";
import axios from "axios";

const ProductUploadForm = ({ isSuperuser }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    category: '',
    color: '',
    size: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check
    if (!newProduct.name || !newProduct.price || !newProduct.brand || !newProduct.description || !newProduct.category || !newProduct.color || !newProduct.size) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // Make POST request to backend to create a new product
      await axios.post('http://localhost:8000/api/products/', newProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Authorization using JWT token
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
      });
      setError('');
    } catch (error) {
      setError('Error uploading product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isSuperuser) return null; // Only show form to superusers

  return (
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
        placeholder="Product Size"
      />
      <button type="submit">{loading ? 'Uploading...' : 'Upload Product'}</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default ProductUploadForm;
