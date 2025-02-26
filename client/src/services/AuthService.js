import axios from './AxiosInstance';
import swal from 'sweetalert';
import { logoutAction, refreshTokenAction } from '../store/actions/AuthActions';
import { jwtDecode } from 'jwt-decode';
import { LOGIN_CONFIRMED_ACTION } from '../store/actions/ActionTypes';

export function signUp(formData) {
  //axios call
  return axios.post(`/auth/signup`, formData);
}

export function login(email, password) {
  return axios.post(`/auth/login`, { email, password });
}
export function forgotPassword(email) {
  return axios.post(`/auth/forgot-password`, { email });
}

export function logout() {
  return axios.post(`/auth/logout`);
}

export function formatError(errorResponse) {
  let formattedError = '';
  switch (errorResponse.message) {
    case 'Invalid credentials':
      swal('Oops', 'Incorrect email or password', 'error');
      formattedError = 'Incorrect email or password';
      break;
    // case 'EMAIL_EXISTS':
    //   //return 'Email already exists';
    //   swal('Oops', 'Email already exists', 'error');
    //   break;
    // case 'EMAIL_NOT_FOUND':
    //   //return 'Email not found';
    //   swal('Oops', 'Email not found', 'error', { button: 'Try Again!' });
    //   break;
    // case 'INVALID_PASSWORD':
    //   //return 'Invalid Password';
    //   swal('Oops', 'Invalid Password', 'error', { button: 'Try Again!' });
    //   break;
    // case 'USER_DISABLED':
    //   return 'User Disabled';

    default:
      formattedError = '';
  }
  return formattedError;
}

export function saveTokenInLocalStorage(accessToken) {
  localStorage.setItem('accessToken', accessToken);
}

export function runLogoutTimer(dispatch, timer, navigate) {
  setTimeout(() => {
    //dispatch(Logout(history));
    dispatch(logoutAction(navigate));
  }, timer);
}

export const refreshToken = () => {
  return axios.post('/auth/refresh');
};

export function checkAutoLogin(dispatch, navigate) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    dispatch(logoutAction(navigate));
    return;
  }

  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  if (decodedToken.exp > currentTime) {
    // If the token is still valid, restore user session
    dispatch({
      type: LOGIN_CONFIRMED_ACTION,
      payload: decodedToken,
    });
  } else {
    // If the token has expired, refresh it
    dispatch(refreshTokenAction(navigate));
  }
}
export function isLogin() {
  const tokenString = localStorage.getItem('accessToken');

  if (tokenString) {
    return true;
  } else {
    return false;
  }
}
