import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/cart/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setCart(response.data.cart || []);
    } catch (err) {
      setError('Failed to fetch cart data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleRemoveFromCart = async (productId, size) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/remove/`, {
        data: { product_id: productId, size },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      toast.success('Product removed from cart');
      fetchCartData();
    } catch (err) {
      toast.error('Failed to remove product from cart');
    }
  };

  // const handleQuantityChange = async (productId, size, newQuantity) => {
  //   if (newQuantity < 1) return; // Prevent zero or negative quantities
  //   try {
  //     await axios.put(
  //       'http://localhost:8000/api/cart/update/',
  //       { product_id: productId, size, quantity: newQuantity },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  //         },
  //       }
  //     );
  //     toast.success('Cart updated successfully');
  //     fetchCartData();
  //   } catch (err) {
  //     toast.error('Failed to update quantity');
  //   }
  // };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.total_price, 0);
  };

  return (
    <div className="cart-container">
      <div className="cart-left">
        <h2>Product Details</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cart.map((item) => (
            <div key={`${item.product_id}-${item.size}`} className="cart-item">
              <img
                src={`http://localhost:8000${item.image_url}`}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <p>Size: {item.size}</p>
                <p>Qty: {item.quantity}</p>
                <div className="cart-item-actions">
                  <button onClick={() => handleRemoveFromCart(item.product_id, item.size)}>Remove</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-right">
        <h3>Price Details</h3>
        <div className="price-details">
          <p>Total Products: {cart.length}</p>
          <p>Total Product Price: ₹{calculateTotal()}</p>
          <p>Discount: ₹19</p>
          <p><strong>Order Total: ₹{calculateTotal() - 19}</strong></p>
        </div>
        <button className="checkout-btn">Continue</button>
      </div>
    </div>
  );
};

export default Cart;
