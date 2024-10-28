import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);

    // Memoize fetchProducts to prevent recreation on each render
    const fetchProducts = useCallback(async (page) => {
        try {
            const response = await axios.get(`/api/products/?page=${page}&page_size=${pageSize}`);
            setProducts(response.data.results);
            setTotalPages(Math.ceil(response.data.count / pageSize));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, [pageSize]);

    // Fetch products when the component mounts or currentPage changes
    useEffect(() => {
        fetchProducts(currentPage);
    }, [fetchProducts, currentPage]);

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`/api/products/delete/${productId}/`);
            fetchProducts(currentPage);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <h2>Product List</h2>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        {product.image && <img src={product.image} alt={product.name} width="100" />}
                        <p>Brand: {product.brand}</p>
                        <p>Category: {product.category}</p>
                        <p>Color: {product.color}</p>
                        <p>Size: {product.size}</p>
                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <div>
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span> Page {currentPage} of {totalPages} </span>
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductList;
