import React, { useState } from 'react';
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        setProductData({ ...productData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in productData) {
            formData.append(key, productData[key]);
        }
        try {
            const response = await axios.post('/api/products/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Product uploaded:', response.data);
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
        } catch (error) {
            console.error('Error uploading product:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Product Name" onChange={handleChange} required />
            <textarea name="description" placeholder="Product Description" onChange={handleChange} required />
            <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
            <input type="file" name="image" onChange={handleImageChange} required />
            <input type="text" name="brand" placeholder="Brand" onChange={handleChange} required />
            <input type="text" name="category" placeholder="Category" onChange={handleChange} required />
            <input type="text" name="color" placeholder="Color" onChange={handleChange} required />
            <input type="text" name="size" placeholder="Size" onChange={handleChange} required />
            <button type="submit">Upload Product</button>
        </form>
    );
};

export default ProductUploadForm;
