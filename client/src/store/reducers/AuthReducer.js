import {
  SIGNUP_CONFIRMED_ACTION,
  SIGNUP_FAILED_ACTION,
  LOGIN_CONFIRMED_ACTION,
  LOGIN_FAILED_ACTION,
  LOADING_TOGGLE_ACTION,
  LOGOUT_ACTION,
} from '../actions/ActionTypes';

const initialState = {
  auth: {
    userId: '',
    role: {
      _id: '',
      name: '',
      permissions: [],
    },
    iat: null,
    exp: null,
  },
  errorMessage: '',
  successMessage: '',
  showLoading: false,
};

export function AuthReducer(state = initialState, action) {
  if (action.type === SIGNUP_CONFIRMED_ACTION) {
    return {
      ...state,
      auth: action.payload,
      errorMessage: '',
      successMessage: 'Signup Successfully Completed',
      showLoading: false,
    };
  }
  if (action.type === LOGIN_CONFIRMED_ACTION) {
    return {
      ...state,
      auth: action.payload,
      errorMessage: '',
      successMessage: 'Login Successfully Completed',
      showLoading: false,
    };
  }

  if (action.type === LOGOUT_ACTION) {
    return {
      ...state,
      auth: {
        userId: '',
        role: {
          _id: '',
          name: '',
          permissions: [],
        },
        iat: null,
        exp: null,
      },
      errorMessage: '',
      successMessage: '',
      showLoading: false,
    };
  }

  if (
    action.type === SIGNUP_FAILED_ACTION ||
    action.type === LOGIN_FAILED_ACTION
  ) {
    return {
      ...state,
      errorMessage: action.payload,
      successMessage: '',
      showLoading: false,
    };
  }

  if (action.type === LOADING_TOGGLE_ACTION) {
    return {
      ...state,
      showLoading: action.payload,
    };
  }
  return state;
}
