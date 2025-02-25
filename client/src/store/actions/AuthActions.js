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
} from '../../services/AuthService';

import {
  SIGNUP_CONFIRMED_ACTION,
  SIGNUP_FAILED_ACTION,
  LOGIN_CONFIRMED_ACTION,
  LOGIN_FAILED_ACTION,
  LOADING_TOGGLE_ACTION,
  LOGOUT_ACTION,
} from './ActionTypes';

export function signupAction(formData, navigate) {
  return (dispatch) => {
    signUp(formData)
      .then((response) => {
        console.log(response);
        // saveTokenInLocalStorage(response.data);
        // dispatch(confirmedSignupAction(response.data));
        // navigate('/dashboard');
        //history.push('/dashboard');
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = formatError(error.response.data);
        dispatch(signupFailedAction(errorMessage));
      });
  };
}

export function logoutAction(navigate) {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return; // Prevent multiple logout calls
    }
    logout()
      .then(() => {
        dispatch({
          type: LOGOUT_ACTION,
        });
        localStorage.removeItem('accessToken');
        navigate('/login');
      })
      .catch((error) => {
        formatError(error.response.data);
      });
  };
}

export function loginAction(email, password, navigate) {
  return (dispatch) => {
    login(email, password)
      .then((response) => {
        saveTokenInLocalStorage(response.data.accessToken);
        const decodedUser = jwtDecode(response.data.accessToken);
        const {
          userId,
          role: { _id, name, permissions },
          iat,
          exp,
        } = decodedUser;

        dispatch(
          loginConfirmedAction({
            userId,
            role: { _id, name, permissions },
            iat,
            exp,
          })
        );
        navigate('/dashboard');
      })
      .catch((error) => {
        const errorMessage = formatError(error.response.data);

        dispatch(loginFailedAction(errorMessage || 'Something went wrong'));
      });
  };
}

export function loginFailedAction(data) {
  return {
    type: LOGIN_FAILED_ACTION,
    payload: data,
  };
}

export function loginConfirmedAction(data) {
  return {
    type: LOGIN_CONFIRMED_ACTION,
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
