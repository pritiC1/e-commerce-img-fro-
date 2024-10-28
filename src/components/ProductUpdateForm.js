// src/components/ProductUpdateForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductUpdateForm = () => {
    const { productId } = useParams(); // Get the product ID from the URL
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        image: null,
        // Add other fields as necessary
    });

    // Fetch product data for editing
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/products/${productId}/`); // Adjust the endpoint as necessary
                setProductData(response.data);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: name === 'image' ? e.target.files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in productData) {
            formData.append(key, productData[key]);
        }
        try {
            await axios.put(`/api/products/update/${productId}/`, formData); // Adjust the endpoint as necessary
            // Optionally redirect or give feedback
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={productData.name} onChange={handleChange} required />
            <textarea name="description" value={productData.description} onChange={handleChange} required />
            <input type="number" name="price" value={productData.price} onChange={handleChange} required />
            <input type="file" name="image" onChange={handleChange} />
            <button type="submit">Update Product</button>
        </form>
    );
};

export default ProductUpdateForm;
