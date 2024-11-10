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
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import './App.css';

function App() {
  return (
    <Router>
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
          <Route path="/products" element={<ProductList />} /> {/* Route to list products */}
          <Route path="/productupdate/:productId" element={<ProductEditForm />} /> {/* Route to update product */}
          <Route path="/productDelete/:productId" element={<ProductDelete />} /> {/* Route to delete product */}

          {/* User profile and dashboard */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
