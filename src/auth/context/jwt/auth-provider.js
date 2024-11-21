'use client';

import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get(endpoints.auth.me);

        const { user } = response.data;

        dispatch({
          type: 'INITIAL',
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const data = {
      email,
      password,
    };

    const response = await axios.post(endpoints.auth.login, data);

    const { token, user } = response.data;
    console.log(user.role)
      localStorage.setItem(STORAGE_KEY, token);
      localStorage.setItem('userRole', user.role);
    setSession(token);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (formData) => {
    // Construct the data object with all required fields
    const data = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phone_number: formData.phone_number, // Add more fields as needed
      gender: formData.gender,
      dob: formData.dob, // Date of birth
      city_id: formData.city_id,
      area: formData.area,
      role: formData.role, // E.g., 'teacher', 'student'
      profile_picture: formData.profile_picture, // Optional
    };
  
    try {
      // Make the registration request
      const response = await axios.post(endpoints.auth.register, data);
  
      // Destructure response to get access token and user info
      const { token, user } = response.data;
  
      // Store the access token in localStorage
      localStorage.setItem(STORAGE_KEY, token);
  
      // Dispatch the REGISTER action with the user data
      dispatch({
        type: 'REGISTER',
        payload: {
          user,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
