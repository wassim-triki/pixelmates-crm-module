import axios from 'axios';
import { store } from '../store/store';
import { logoutAction, refreshTokenAction } from '../store/actions/AuthActions';
import { logout } from './AuthService';

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

export default axiosInstance;
