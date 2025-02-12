import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

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
      await axios.delete(`http://localhost:8000/api/cart/remove/${productId}/`, {
        data: { product_id: productId, size: size },  // Pass both productId and size
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      toast.success('Product removed from cart');
      fetchCartData();  // Refresh cart after removing the product
    } catch (err) {
      toast.error('Failed to remove product from cart');
    }
  };
  
  // Handle checkout redirect
  const handleCheckout = () => {
    const productIds = cart.map(item => item.product_id);
    if (productIds.length > 0) {
      navigate('/CheckOutPage', { state: { product_ids: productIds } });
    } else {
      toast.error('Your cart is empty. Add products before proceeding.');
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
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="cart-items">
            {cart.map((item) => (
              <div key={`${item.product_id}-${item.size}`} className="cart-item">
                {/* Image on the left */}
                <div className="cart-item-image-container">
                  <img
                    src={`http://localhost:8000${item.image_url}`}
                    alt={item.name}
                    className="cart-item-image"
                  />
                </div>
                {/* Product details on the right */}
                <div className="cart-item-details">
                  <h3>
                    <a href={`/product/${item.product_id}`} className="product-link">
                      {item.name}
                    </a>
                  </h3>
                  <p className="item-description">{item.description}</p>
                  <p className="item-price">{`₹${item.price}`}</p>
                  <p>Size: {item.size}</p>
                  <p>Qty: {item.quantity}</p>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(item.product_id, item.size)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Product details container */}
      <div className="cart-right">
        <h3>Price Details</h3>
        <div className="price-details">
          <p>Total Products: {cart.length}</p>
          <p>Total Product Price: ₹{calculateTotal()}</p>
          <p>Discount: ₹19</p>
          <p>
            <strong>Order Total: ₹{calculateTotal() - 19}</strong>
          </p>
        </div>
        <button className="checkout-btn" onClick={handleCheckout}>
          Continue
        </button>
      </div>
    </div>
  );
};
  export default Cart;
  