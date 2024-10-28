// ProductUploadForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductUploadForm = () => {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        image: null,
        brand: '',
        category: '',
        color: '',
        size: ''
    });

    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Function to handle changes in form fields
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setProductData({
            ...productData,
            [name]: files ? files[0] : value,
        });
    };

    // Function to handle form submission for uploading a product
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in productData) {
            formData.append(key, productData[key]);
        }

        try {
            const token = localStorage.getItem('access_token'); // Make sure you're using the correct token key
            await axios.post('http://localhost:8000/api/products/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            setSuccessMessage('Product uploaded successfully!');
            setError(null);

            // Reset form fields after successful submission
            setProductData({
                name: '',
                description: '',
                price: '',
                image: null,
                brand: '',
                category: '',
                color: '',
                size: ''
            });

            // Refresh the product list
            fetchProducts();
        } catch (error) {
            console.error('Error uploading product:', error);
            setError('Failed to upload product. Please try again.');
        }
    };

    // Fetch products when the component mounts
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/products/'); // Update this URL if necessary
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch products. Please try again.');
        }
    };

    useEffect(() => {
        fetchProducts();  // Fetch products on component mount
    }, []);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

                <input type="text" name="name" placeholder="Product Name" value={productData.name} onChange={handleChange} required />
                <textarea name="description" placeholder="Product Description" value={productData.description} onChange={handleChange} required />
                <input type="number" name="price" placeholder="Price" value={productData.price} onChange={handleChange} required />
                <input type="file" name="image" onChange={handleChange} required />
                <input type="text" name="brand" placeholder="Brand" value={productData.brand} onChange={handleChange} required />
                <input type="text" name="category" placeholder="Category" value={productData.category} onChange={handleChange} required />
                <input type="text" name="color" placeholder="Color" value={productData.color} onChange={handleChange} required />
                <input type="text" name="size" placeholder="Size" value={productData.size} onChange={handleChange} required />
                <button type="submit">Upload Product</button>
            </form>

            <div>
                <h2>Uploaded Products</h2>
                {products.length > 0 ? (
                    <ul>
                        {products.map((product) => (
                            <li key={product.id}>
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                                <p>Brand: {product.brand}</p>
                                <p>Category: {product.category}</p>
                                <p>Color: {product.color}</p>
                                <p>Size: {product.size}</p>
                                {product.image && (
                                    <img src={`http://localhost:8000${product.image}`} alt={product.name} width="100" />
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No products uploaded yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProductUploadForm;
