import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to handle error messages
  const navigate = useNavigate();

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      // No refresh token, handle logout
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login'; // Redirect to login page
      return null;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/token/refresh/', {
        refresh: refreshToken,
      });

      // Store new access token
      const newAccessToken = response.data.access;
      localStorage.setItem('access_token', newAccessToken);
      return newAccessToken;
    } catch (error) {
      // Handle token refresh error
      console.error('Error refreshing token', error);
      return null;
    }
  };

  // Axios interceptor to refresh token on expiry
  axios.interceptors.response.use(
    (response) => response, // Pass the successful response through
    async (error) => {
      const originalRequest = error.config;
      
      // Check if it's a 401 error (Unauthorized) and we haven't already retried
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Try refreshing the token
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // Retry the original request with the new access token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest); // Retry the request
        }
      }
      return Promise.reject(error); // If the refresh failed, reject the error
    }
  );




  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the login endpoint
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });

      const accessToken = response.data.access;
      const isSuperuser = response.data.is_superuser;  // Assuming the login API returns this data



      // Store tokens in localStorage
      localStorage.setItem('access_token', response.data.access);  // Access token
      localStorage.setItem('refresh_token', response.data.refresh); // Refresh token
      localStorage.setItem('is_superuser', isSuperuser);  // Store the superuser status


      axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

      
      
      navigate('/dashboard');
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
