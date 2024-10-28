import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  // Optionally, you can also check for token expiration
  return token !== null;
};

const protectedroute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      element={isAuthenticated() ? <Component {...rest} /> : <Navigate to="/login" replace />}
    />
  );
};

export default protectedroute;
