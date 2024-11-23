import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderStatus, setOrderStatus] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    // Fetch cart items from local storage or API
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);

    const amount = cart.reduce((sum, item) => sum + item.price, 0);
    setTotalAmount(amount);
  }, []);

  const onSubmit = async (data) => {
    try {
      const productIds = cartItems.map(item => item.id);
      const orderData = {
        product_ids: productIds,
        shipping_details: data,
      };

      const response = await axios.post('http://yourapi.com/checkout', orderData);

      if (response.status === 201) {
        setOrderStatus('Order placed successfully!');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderStatus('Error placing order.');
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      
      <div>
        <h2>Review Your Cart</h2>
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
        <p>Total Amount: ${totalAmount}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Shipping Details</h2>
        <div>
          <label htmlFor="name">Name</label>
          <input 
            id="name" 
            type="text" 
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="address">Address</label>
          <input 
            id="address" 
            type="text" 
            {...register('address', { required: 'Address is required' })}
          />
          {errors.address && <p>{errors.address.message}</p>}
        </div>

        <div>
          <label htmlFor="phone">Phone</label>
          <input 
            id="phone" 
            type="text" 
            {...register('phone', { required: 'Phone number is required' })}
          />
          {errors.phone && <p>{errors.phone.message}</p>}
        </div>

        <button type="submit">Place Order</button>
      </form>

      {orderStatus && <p>{orderStatus}</p>}
    </div>
  );
};

export default CheckoutPage;
