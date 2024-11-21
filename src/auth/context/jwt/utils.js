// utils.js
import axios from 'src/utils/axios';

// Decode JWT
export function jwtDecode(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

// Check if token is valid
export const isValidToken = (accessToken) => {
  if (!accessToken) return false;
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000; // Current time in seconds
  return decoded?.exp > currentTime; // Token is valid if `exp` is in the future
};

// Set session
export const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    const decoded = jwtDecode(accessToken);

    // Safely check if decoded.exp exists and is valid
    if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
      console.warn('Token is expired.');
      localStorage.removeItem('accessToken');
      delete axios.defaults.headers.common.Authorization;
      return;
    }

    console.log('Session set successfully.');
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};




// Check if token is expired
export const tokenExpired = (exp) => {
  const currentTime = Date.now() / 1000; // Current time in seconds
  return exp <= currentTime;
};
