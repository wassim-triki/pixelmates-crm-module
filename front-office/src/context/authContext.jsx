import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../config/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('accessToken');
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      localStorage.setItem('accessToken', response.data.accessToken);
      fetchUser(); // Fetch user immediately after login
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout'); // Ensure server clears cookies
    } catch (error) {
      console.error('Logout request failed:', error);
    }
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Don't attempt refresh if there is no access token
        if (!localStorage.getItem('accessToken')) {
          return Promise.reject(error);
        }

        // Refresh token only for 401, NOT 403 (to prevent looping)
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const refreshResponse = await axiosInstance.post('/auth/refresh');
            localStorage.setItem(
              'accessToken',
              refreshResponse.data.accessToken
            );
            originalRequest.headers[
              'Authorization'
            ] = `Bearer ${refreshResponse.data.accessToken}`;

            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);

            if (refreshError.response?.status === 403) {
              console.warn(
                'Refresh token is invalid or expired. Logging out user.'
              );
              logout();
            }

            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
