import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { getToken } from './auth'; // Utility to get the token
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode

const PrivateRoute = ({ children  }) => {
  const token = getToken(); // Ensure this retrieves the correct token or user info

  let isAuthenticated = false;
  let decodedToken = null;

  if (token) {
    try {
      decodedToken = jwtDecode(token); // Decode the token to access its payload
      console.log(decodedToken.role);  // Log the role from the decoded token
      isAuthenticated = true;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  } else {
    console.error("No token found");
  }

  console.log(token);
  console.log(isAuthenticated);

  return isAuthenticated ? children : alert("Don't have authorized access");
};

export default PrivateRoute;
