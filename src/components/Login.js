import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for loader
  const navigate = useNavigate();

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      return null;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/token/refresh/', {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      localStorage.setItem('access_token', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing token', error);
      return null;
    }
  };

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });

      const accessToken = response.data.access;
      const isSuperuser = response.data.is_superuser;

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('is_superuser', isSuperuser);

      axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

      toast.success('Login successful!', { position: 'top-right', autoClose: 2000 });

      setTimeout(() => {
        setLoading(false); // Hide loader before redirecting
        if (isSuperuser) {
          navigate('/Superuserdashboard');
        } else {
          navigate('/UserDashboard');
        }
      }, 2500);
    } catch (error) {
      setLoading(false);
      toast.error('Invalid username or password. Please try again.', { position: 'top-right' });
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <form onSubmit={handleLogin}>
        <h2>Login</h2>

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

        <button className="login-button" type="submit" disabled={loading}>
          {loading ? <span className="loader"></span> : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
