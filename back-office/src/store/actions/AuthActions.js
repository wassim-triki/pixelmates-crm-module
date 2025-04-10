import React from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  formatError,
  login,
  runLogoutTimer,
  saveTokenInLocalStorage,
  signUp,
  logout,
  forgotPassword,
  refreshToken,
  resetPassword,
} from '../../services/AuthService';

import {
  SIGNUP_CONFIRMED_ACTION,
  SIGNUP_FAILED_ACTION,
  LOGIN_CONFIRMED_ACTION,
  LOGIN_FAILED_ACTION,
  LOADING_TOGGLE_ACTION,
  LOGOUT_ACTION,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
} from './ActionTypes';

// Signup Action
export function signupAction(formData, navigate) {
  return (dispatch) => {
    dispatch({ type: LOADING_TOGGLE_ACTION, payload: true });
    signUp(formData)
      .then((response) => {
        const { message, accessToken } = response.data;
        saveTokenInLocalStorage(accessToken);
        const decodedUser = jwtDecode(accessToken);
        const { userId, role: { _id, name, permissions }, iat, exp } = decodedUser;

        dispatch({
          type: SIGNUP_CONFIRMED_ACTION, // Changed to SIGNUP_CONFIRMED_ACTION
          payload: { userId, role: { _id, name, permissions }, iat, exp, message },
        });
        setTimeout(() => navigate('/dashboard'), 2000);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || 'Signup failed';
        dispatch({ type: SIGNUP_FAILED_ACTION, payload: errorMessage });
      })
      .finally(() => dispatch({ type: LOADING_TOGGLE_ACTION, payload: false }));
  };
}

// Login Action
export function loginAction(email, password, navigate) {
  return (dispatch) => {
    dispatch({ type: LOADING_TOGGLE_ACTION, payload: true });
    login(email, password)
      .then((response) => {
        const { message, accessToken } = response.data;
        saveTokenInLocalStorage(accessToken);
        const decodedUser = jwtDecode(accessToken);
        const { userId, role: { _id, name, permissions }, iat, exp } = decodedUser;

        dispatch({
          type: LOGIN_CONFIRMED_ACTION,
          payload: { userId, role: { _id, name, permissions }, iat, exp, message },
        });
        setTimeout(() => navigate('/dashboard'), 2000);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || 'Login failed';
        dispatch({ type: LOGIN_FAILED_ACTION, payload: errorMessage });
      })
      .finally(() => dispatch({ type: LOADING_TOGGLE_ACTION, payload: false }));
  };
}

// Logout Action
export function logoutAction(navigate) {
  return (dispatch) => {
    logout()
      .then(() => {
        dispatch({ type: LOGOUT_ACTION });
        localStorage.removeItem('accessToken');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      })
      .finally(() => navigate('/login'));
  };
}

// Forgot Password Action
export function forgotPasswordAction(email) {
  return (dispatch) => {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });
    forgotPassword(email)
      .then((response) => {
        dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: response.data });
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || 'Failed to send reset link';
        dispatch({ type: FORGOT_PASSWORD_FAILURE, payload: errorMessage });
      });
  };
}

// Reset Password Action
export function resetPasswordAction({ token, newPassword, email }, navigate) {
  return async (dispatch) => {
    dispatch({ type: LOADING_TOGGLE_ACTION, payload: true });
    try {
      const response = await resetPassword({ token, newPassword, email });
      dispatch({ type: RESET_PASSWORD_SUCCESS, payload: response.data.message });
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      dispatch({ type: RESET_PASSWORD_FAILURE, payload: errorMessage });
    } finally {
      dispatch({ type: LOADING_TOGGLE_ACTION, payload: false });
    }
  };
}

// Refresh Token Action
export function refreshTokenAction(navigate) {
  return async (dispatch) => {
    dispatch({ type: LOADING_TOGGLE_ACTION, payload: true });
    try {
      const response = await refreshToken(navigate);
      const { message, accessToken } = response.data;
      saveTokenInLocalStorage(accessToken);
      const decodedUser = jwtDecode(accessToken);
      const { userId, role: { _id, name, permissions }, iat, exp } = decodedUser;

      dispatch({
        type: LOGIN_CONFIRMED_ACTION,
        payload: { userId, role: { _id, name, permissions }, iat, exp, message },
      });
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Token refresh failed';
      dispatch({ type: LOGIN_FAILED_ACTION, payload: errorMessage });
    } finally {
      dispatch({ type: LOADING_TOGGLE_ACTION, payload: false });
    }
  };
}

// Action Creators
export function loginFailedAction(data) {
  return { type: LOGIN_FAILED_ACTION, payload: data };
}

export function confirmedSignupAction(payload) {
  return { type: SIGNUP_CONFIRMED_ACTION, payload };
}

export function signupFailedAction(message) {
  return { type: SIGNUP_FAILED_ACTION, payload: message };
}

export function loadingToggleAction(status) {
  return { type: LOADING_TOGGLE_ACTION, payload: status };
}