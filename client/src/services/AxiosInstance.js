import axios from 'axios';
import { store } from '../store/store';
import { refreshTokenAction } from './AuthService';
import { Logout } from '../store/actions/AuthActions';

const axiosInstance = axios.create({
  baseURL: `http://localhost:5000/api`,
  withCredentials: true, // Important for refresh token in cookies
});

axiosInstance.interceptors.request.use((config) => {
  //   const state = store.getState();
  //   const token = state.auth.auth.idToken;
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  //   config.params = config.params || {};
  //   config.params['auth'] = token;
  return config;
});

// Add a response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Dispatch action to refresh token
        await store.dispatch(refreshTokenAction());

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (err) {
        store.dispatch(Logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
