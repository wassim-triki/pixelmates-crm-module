import axios from './AxiosInstance';
import swal from 'sweetalert';
import { loginConfirmedAction, Logout } from '../store/actions/AuthActions';
import { jwtDecode } from 'jwt-decode';

export function signUp(email, password) {
  //axios call
  const postData = {
    email,
    password,
    returnSecureToken: true,
  };
  return axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`,
    postData
  );
}

export function login(email, password) {
  const postData = {
    email,
    password,
  };
  return axios.post(`/auth/login`, postData);
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
    dispatch(Logout(navigate));
  }, timer);
}

export const refreshTokenAction = (navigate) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        '/auth/refresh',
        {},
        { withCredentials: true }
      );

      const newAccessToken = response.data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);

      const decodedUser = jwtDecode(newAccessToken);
      const { userId, role, iat, exp } = decodedUser;

      dispatch(loginConfirmedAction({ userId, role, iat, exp }));
    } catch (error) {
      dispatch(Logout(navigate)); // If refresh fails, logout the user
    }
  };
};

export function checkAutoLogin(dispatch, navigate) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    dispatch(Logout(navigate));
    return;
  }

  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  if (decodedToken.exp > currentTime) {
    // If the token is still valid, restore user session
    dispatch(loginConfirmedAction(decodedToken));
  } else {
    // If the token has expired, refresh it
    dispatch(refreshTokenAction(navigate));
  }
}
export function isLogin() {
  const tokenDetailsString = localStorage.getItem('userDetails');

  if (tokenDetailsString) {
    return true;
  } else {
    return false;
  }
}
