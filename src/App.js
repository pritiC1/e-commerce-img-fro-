import React from 'react';
import ReactDOM from 'react-dom'; // Make sure to import ReactDOM
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';
import VerifyOTP from './components/VerifyOTP';
import ProductUploadForm from './components/ProductUploadForm';
import ProductList from './components/ProductList'; // Import ProductList
import ProductUpdateForm from './components/ProductUpdateForm'; 
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import './App.css';
import { ProductProvider } from './components/productcontext'; // Ensure you import your context provider

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
          <Route path="/manage-products" component={ProductManagement} />

          {/* User profile and dashboard */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Product management routes */}
          <Route path="/productupload" element={<ProductUploadForm />} />
          <Route path="/products" element={<ProductList />} /> {/* Route to list products */}
          <Route path="/productupdate/:productId" element={<ProductUpdateForm />} /> {/* Add this route */}
        </Routes>
      </div>
    </Router>
  );
}

// Render the App component with the ProductProvider
ReactDOM.render(
  <ProductProvider>
    <App />
  </ProductProvider>,
  document.getElementById('root')
);

export default App;
