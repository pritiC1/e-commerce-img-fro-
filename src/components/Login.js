import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to handle error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the login endpoint
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });

      // Store tokens in localStorage
      localStorage.setItem('access_token', response.data.access);  // Access token
      localStorage.setItem('refresh_token', response.data.refresh); // Refresh token

      axios.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;

      // Navigate to dashboard after successful login
      navigate('/Dashboard');
    } catch (error) {
      console.error('Login failed', error);
      // Check if the error response contains a specific message
      if (error.response) {
        setError(error.response.data.error || 'Invalid username or password. Please try again.'); // Show error message from API
      } else {
        setError('An error occurred. Please try again.'); // Fallback error message
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>} {/* Display error if login fails */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
