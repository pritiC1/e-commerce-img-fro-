import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';
import VerifyOTP from './components/VerifyOTP';
import ProductUploadForm from './components/ProductUploadForm';
import ProductList from './components/ProductList'; 
import ProductEditForm from './components/ProductEditForm';
import ProductDelete from './components/ProductDelete';
import Homepage from './components/Homepage';
import UserDashboard from './components/UserDashboard';
import ProductManagement from './components/ProductManagement';
import { CartProvider } from './cartContext'; 
import Cart from './components/Cart';
import LikedProducts from './components/LikedProducts';
import './App.css';
import Superuserdashboard from './components/Superuserdashboard';

function App() {
  return (
    <Router>
      <CartProvider> 
      <div className="App">
        <Routes>
          {/* Default route for the homepage */}
          <Route path="/" element={<Homepage />} />

          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verifyotp" element={<VerifyOTP />} />

          {/* Product management routes */}
          <Route path="/manage-products" element={<ProductManagement />} />
          <Route path="/productupload" element={<ProductUploadForm />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/productupdate/:productId" element={<ProductEditForm />} /> {/* Route to update product */}
          <Route path="/productDelete/:productId" element={<ProductDelete />} /> {/* Route to delete product */}

          {/* User profile and dashboard */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/Superuserdashboard" element={<Superuserdashboard />} />
          <Route path="/likedproducts" element={<LikedProducts likedProducts={LikedProducts} />} />
          <Route path="/cart" element={<Cart />} /> {/* Route to view and manage cart */}
        </Routes>
      </div>
      </CartProvider>
    </Router>
  );
}

export default App;
