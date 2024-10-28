import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import HeroSection from './Hero'; // HeroSection on the left
import './Dashboard.css'; // Create a CSS file for styling

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
    image: null,
  });

  // Function to fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(response.data); // Store the fetched products in state
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input changes for new product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setNewProduct((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  // Handle form submission for uploading new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('brand', newProduct.brand);
    formData.append('category', newProduct.category);
    formData.append('color', newProduct.color);
    formData.append('size', newProduct.size);
    formData.append('image', newProduct.image);

    try {
      await axios.post('http://localhost:8000/api/products/upload/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setNewProduct({ name: '', description: '', price: '', brand: '', category: '', color: '', size: '', image: null }); // Reset form
      fetchProducts(); // Fetch updated products after uploading
    } catch (error) {
      console.error('Error uploading product:', error);
    }
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/products/delete/${productId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Update the state to remove the deleted product
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <div className="hero-section">
          <HeroSection />
        </div>
        <div className="main-content">
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
              required
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
              required
            />
            <input
              type="text"
              name="color"
              value={newProduct.color}
              onChange={handleInputChange}
              placeholder="Product Color"
              required
            />
            <input
              type="text"
              name="size"
              value={newProduct.size}
              onChange={handleInputChange}
              placeholder="Product Size (e.g., S, M, L, XL)"
              required
            />
            <input type="file" onChange={handleImageChange} required />
            <button type="submit">Upload Product</button>
          </form>

          <h3>Uploaded Products</h3>
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
                {product.image && <img src={product.image} alt={product.name} />}
                <button onClick={() => handleDelete(product.id)}>Delete Product</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
