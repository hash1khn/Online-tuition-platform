'use client';

import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
import axios, { endpoints } from 'src/utils/axios';
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils'; // Ensure these are correctly defined in utils

// ----------------------------------------------------------------------

// Initial state
const initialState = {
  user: null,
  loading: true,
};

// Reducer for managing auth state
const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIAL':
      return { loading: false, user: action.payload.user };
    case 'LOGIN':
    case 'REGISTER':
      return { ...state, user: action.payload.user };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize session
  const initialize = useCallback(async () => {
    const accessToken = localStorage.getItem(STORAGE_KEY);

    if (accessToken && isValidToken(accessToken)) {
      setSession(accessToken);

      try {
        const response = await axios.get(endpoints.auth.me); // Call /api/auth/me
        const { user } = response.data;

        dispatch({ type: 'INITIAL', payload: { user } });
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setSession(null); // Clear session if the fetch fails
        dispatch({ type: 'INITIAL', payload: { user: null } });
      }
    } else {
      console.warn('Token is invalid or expired.');
      setSession(null);
      dispatch({ type: 'INITIAL', payload: { user: null } });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Login
  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post(endpoints.auth.login, { email, password });
      const { token, user } = response.data;

      setSession(token); // Save token to storage and set headers
      localStorage.setItem(STORAGE_KEY, token);
      dispatch({ type: 'LOGIN', payload: { user } });
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }, []);

  // Register
  const register = useCallback(async (formData) => {
    console.log("Register function called with formData:", formData); // Log formData
  
    try {
      const response = await axios.post(endpoints.auth.register, formData);
  
      console.log("API response received:", response); // Log the full response object
  
      const { token, user } = response.data;
  
      console.log("Token received:", token); // Log the token
      console.log("User received:", user); // Log the user object
  
      setSession(token); // Save token to storage and set headers
      console.log("Session set successfully."); // Confirm session setting
  
      localStorage.setItem(STORAGE_KEY, token); // Save the token to localStorage
      console.log("Token saved to localStorage:", localStorage.getItem(STORAGE_KEY)); // Confirm token saved
  
      dispatch({ type: 'REGISTER', payload: { user } });
      console.log("Dispatch called with user:", user); // Confirm dispatch success
    } catch (error) {
      console.error("Registration error:", error); // Log the full error object
  
      if (error.response) {
        console.error("Error response data:", error.response.data); // Log the error response data
        console.error("Error status:", error.response.status); // Log the status code
        console.error("Error headers:", error.response.headers); // Log the headers
      } else {
        console.error("Error message:", error.message); // Log any other error messages
      }
  
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  }, []);
  

  // Logout
  const logout = useCallback(() => {
    setSession(null); // Clear session and remove token
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Memoize context value
  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: state.loading,
      authenticated: !!state.user,
      login,
      register,
      logout,
    }),
    [state.user, state.loading, login, register, logout]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
