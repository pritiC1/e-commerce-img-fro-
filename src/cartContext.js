// cartContext.js
import React, { createContext, useEffect,useContext, useState } from 'react';

// Create the CartContext
const CartContext = createContext();

// Create a custom hook to use the CartContext
export const useCart = () => {
  return useContext(CartContext);
};

// CartProvider component to wrap your app with the cart context
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);


  // Function to add product to the cart
  const addToCart = (product) => {
    const existingProduct = cart.find(item => item.productId === product.id);
    if (existingProduct) {
      // If product is already in the cart, update the quantity
      setCart(cart.map(item => 
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      // If it's a new product, add it to the cart with a quantity of 1
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        brand: product.brand,
        category: product.category,
        color: product.color,
        size: product.size,
        image: product.image, // Make sure your product object contains an image property
        quantity: 1,
      }]);
    }
  };
  // Function to remove product from the cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // Function to update the quantity of a product in the cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity > 0) {
      setCart(cart.map(item => 
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
