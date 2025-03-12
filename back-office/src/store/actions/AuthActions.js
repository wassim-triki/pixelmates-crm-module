import React from 'react';
//import { useNavigate } from "react-router-dom";
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
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
} from './ActionTypes';

export function signupAction(formData, navigate) {
  return (dispatch) => {
    signUp(formData)
      .then((response) => {
        const { message, accessToken } = response.data;
        saveTokenInLocalStorage(accessToken);
        const decodedUser = jwtDecode(accessToken);
        const {
          userId,
          role: { _id, name, permissions },
          iat,
          exp,
        } = decodedUser;

        dispatch({
          type: LOGIN_CONFIRMED_ACTION,
          payload: {
            userId,
            role: { _id, name, permissions },
            iat,
            exp,
            message,
          },
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      })
      .catch((error) => {
        // const errorMessage = formatError(error.response.data);
        dispatch({
          type: LOGIN_FAILED_ACTION,
          payload: error.response.data.message,
        });
      });
  };
}

export function loginAction(email, password, navigate) {
  return (dispatch) => {
    login(email, password)
      .then((response) => {
        const { message, accessToken } = response.data;
        saveTokenInLocalStorage(accessToken);
        const decodedUser = jwtDecode(accessToken);
        const {
          userId,
          role: { _id, name, permissions },
          iat,
          exp,
        } = decodedUser;

        dispatch({
          type: LOGIN_CONFIRMED_ACTION,
          payload: {
            userId,
            role: { _id, name, permissions },
            iat,
            exp,
            message,
          },
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      })
      .catch((error) => {
        // const errorMessage = formatError(error.response.data);
        dispatch({
          type: LOGIN_FAILED_ACTION,
          payload: error.response.data.message,
        });
      });
  };
}

export function logoutAction(navigate) {
  return (dispatch) => {
    // const token = localStorage.getItem('accessToken');
    // if (!token) {
    //   return; // Prevent multiple logout calls
    // }
    logout()
      .then(() => {
        dispatch({
          type: LOGOUT_ACTION,
        });
        localStorage.removeItem('accessToken');
      })
      .catch((error) => {
        console.log(error);
        // formatError(error.response.data);
        // const errorMessage = formatError(error.response.data);
        // console.log(error.response.data.message);
        // dispatch(
        //   loginFailedAction(
        //     error.response.data.message || 'Something went wrong'
        //   )
        // );
      })
      .finally(() => {
        navigate('/login');
      });
  };
}

export function forgotPasswordAction(email) {
  return (dispatch) => {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    forgotPassword(email)
      .then((response) => {
        console.log(response.data.resetLink);
        dispatch({
          type: FORGOT_PASSWORD_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
        const errorMessage =
          error.response?.data?.message || 'An error occurred';
        dispatch({
          type: FORGOT_PASSWORD_FAILURE,
          payload: errorMessage,
        });
      });
  };
}
export function resetPasswordAction({ token, newPassword, email }, navigate) {
  return async (dispatch) => {
    dispatch({ type: LOADING_TOGGLE_ACTION, payload: true });

    try {
      const response = await resetPassword({ token, newPassword, email });

      dispatch({
        type: RESET_PASSWORD_SUCCESS,
        payload: response.data.message,
      });

      navigate('/login');
    } catch (error) {
      dispatch({
        type: RESET_PASSWORD_FAILURE,
        payload: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      dispatch({ type: LOADING_TOGGLE_ACTION, payload: false });
    }
  };
}

export function loginFailedAction(data) {
  return {
    type: LOGIN_FAILED_ACTION,
    payload: data,
  };
}

export function confirmedSignupAction(payload) {
  return {
    type: SIGNUP_CONFIRMED_ACTION,
    payload,
  };
}

export function signupFailedAction(message) {
  return {
    type: SIGNUP_FAILED_ACTION,
    payload: message,
  };
}

export function loadingToggleAction(status) {
  return {
    type: LOADING_TOGGLE_ACTION,
    payload: status,
  };
}

export const refreshTokenAction = (navigate) => {
  return async (dispatch) => {
    refreshToken(navigate)
      .then((response) => {
        const { message, accessToken } = response.data;
        saveTokenInLocalStorage(accessToken);
        const decodedUser = jwtDecode(accessToken);
        const {
          userId,
          role: { _id, name, permissions },
          iat,
          exp,
        } = decodedUser;

        dispatch({
          type: LOGIN_CONFIRMED_ACTION,
          payload: {
            userId,
            role: { _id, name, permissions },
            iat,
            exp,
            message,
          },
        });
        navigate('/dashboard');
      })
      .catch((error) => {
        const errorMessage = formatError(error.response.data);
        dispatch(loginFailedAction(errorMessage || 'Something went wrong'));
      });
  };
};
