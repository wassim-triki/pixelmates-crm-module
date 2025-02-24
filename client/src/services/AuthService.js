import axios from 'axios';
import swal from 'sweetalert';
import { loginConfirmedAction, Logout } from '../store/actions/AuthActions';

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
  return axios.post(`http://localhost:5000/api/auth/login`, postData);
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

export function checkAutoLogin(dispatch, navigate) {
  const accessTokenString = localStorage.getItem('accessToken');
  if (!accessTokenString) {
    dispatch(Logout(navigate));
    return;
  }

  let accessToken = { accessToken: accessTokenString };
  // let expireDate = new Date(tokenDetails.expireDate);
  // let todaysDate = new Date();
  // console.log(expireDate, todaysDate);

  // if (todaysDate > expireDate) {
  //   dispatch(Logout(navigate));
  //   return;
  // }

  dispatch(loginConfirmedAction(accessToken));

  // const timer = expireDate.getTime() - todaysDate.getTime();
  // runLogoutTimer(dispatch, timer, navigate);
}
export function isLogin() {
  const tokenDetailsString = localStorage.getItem('userDetails');

  if (tokenDetailsString) {
    return true;
  } else {
    return false;
  }
}
