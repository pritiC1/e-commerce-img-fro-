import React, { useState, useEffect } from 'react';
import { useCart } from '../cartContext'; // Import the CartContext
import './Cart.css';
import axios from 'axios'; // Axios for API requests

const Cart = () => {
  const { cart,  updateQuantity } = useCart(); // Destructure removeFromCart here and rename it to removeFromCartContext
  const [localCart, setLocalCart] = useState(cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = 'http://localhost:8000/api/cart/add'; // Replace with your API URL
  const updateCartItemUrl = 'http://localhost:8000/api/cart/update/';
  const removeFromCartUrl = 'http://localhost:8000/api/cart/remove/';


  const fetchCartData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiUrl); // Fetch cart data from API
      setLocalCart(response.data); // Update local state with cart data
    } catch (error) {
      setError('Failed to fetch cart data');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(apiUrl); // Fetch cart data from API
        setLocalCart(response.data); // Update local state with cart data
      } catch (error) {
        setError('Failed to fetch cart data');
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []); // Only fetch cart data on component mount


  useEffect(() => {
    fetchCartData();
  }, []); // Only fetch cart data on component mount


  // Persist cart data to API when it changes
  useEffect(() => {
    const fetchCartData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            setLocalCart(response.data); // Update local state with cart data
        } catch (error) {
            console.error("Failed to fetch cart data:", error);
            setError("Failed to fetch cart data");
        } finally {
            setLoading(false);
        }
    };

    fetchCartData();
}, []); // Fetch cart data only on component mount

const handleQuantityChange = (productId, quantity) => {
  if (!productId || quantity <= 0) {
      console.error("Invalid product ID or quantity");
      setError("Invalid quantity or product ID");
      return;
  }

  axios.put(`${updateCartItemUrl}${productId}/`, { quantity }, {
      headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
  })
  .then(response => {
      setLocalCart(response.data.cart); // Update the local cart with the updated data
      updateQuantity(productId, quantity); // Update the context state as well
  })
  .catch(error => {
      console.error("Failed to update cart item:", error);
      setError("Failed to update cart item");
  });
};

  const handleRemoveFromCart = async (productId) => {
    if (!productId) {
        console.error('Product ID is missing!');
        return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
        console.error('Access token not found!');
        return;
    }

    // Optimistically update the cart UI
    const previousCart = [...localCart];
    setLocalCart((prevCart) => prevCart.filter((item) => item.id !== productId));

    try {
        const response = await axios.delete(`${removeFromCartUrl}${productId}/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });

        if (response.status === 200) {
            console.log(response.data.message); // Success message
        } else {
            console.error('Unexpected response:', response);
            setLocalCart(previousCart); // Revert UI changes if unexpected response
        }
    } catch (error) {
        if (error.response) {
            console.error('Error status:', error.response.status);
            console.error('Error data:', error.response.data);
            if (error.response.status === 401) {
                console.error('Unauthorized - redirecting to login');
                // Optionally redirect to login or refresh token
            } else if (error.response.status === 404) {
                console.error('Item not found in cart.');
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up the request:', error.message);
        }
        setLocalCart(previousCart); // Revert UI changes on error
    }
};


  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {loading && <p>Loading...</p>} {/* Show a loading message */}
      {error && <p className="error-message">{error}</p>} {/* Display errors */}
      {localCart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <div className="cart-items">
            {localCart.map((item) => (
              <div key={item.productId} className="cart-item">
                <h3>Product: {item.name}</h3>
                <p><strong>Brand:</strong> {item.brand}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Color:</strong> {item.color}</p>
                <p><strong>Size:</strong> {item.size}</p>
                <p><strong>Description:</strong> {item.description}</p>
                <p>Price: ${item.price}</p>
                {item.image_url && (
                  <img
                    src={`http://localhost:8000${item.image_url}`} // Adjust this path to match your API endpoint
                    alt={item.name}
                    className="cart-product-image"
                  />
                )}
                <div>
                  <p>Quantity:</p>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity || 1}
                    onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value))}
                  />
                </div>
                <button
                                onClick={() => handleRemoveFromCart(item.id)}
                                style={{ marginLeft: '10px', color: 'red' }}
                            >
                                Remove
                            </button>
                
              </div>
            ))}
          </div>

          
        </div>
      )}
    </div>
  );
};

export default Cart;