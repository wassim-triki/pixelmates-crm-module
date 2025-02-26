import {
  SIGNUP_CONFIRMED_ACTION,
  SIGNUP_FAILED_ACTION,
  LOGIN_CONFIRMED_ACTION,
  LOGIN_FAILED_ACTION,
  LOADING_TOGGLE_ACTION,
  LOGOUT_ACTION,
  FORGOT_PASSWORD_FAILURE,
  FORGOT_PASSWORD_SUCCESS,
  CLEAR_MESSAGES,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
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
  switch (action.type) {
    case SIGNUP_CONFIRMED_ACTION:
      return {
        ...state,
        auth: action.payload,
        errorMessage: '',
        successMessage: action.payload.message,
        showLoading: false,
      };

    case LOGIN_CONFIRMED_ACTION:
      return {
        ...state,
        auth: action.payload,
        errorMessage: '',
        successMessage: action.payload.message,
        showLoading: false,
      };

    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        errorMessage: '',
        successMessage: action.payload.message,
        showLoading: false,
      };

    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        successMessage: action.payload,
        errorMessage: '',
        showLoading: false,
      };

    case LOGOUT_ACTION:
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

    case SIGNUP_FAILED_ACTION:
    case LOGIN_FAILED_ACTION:
    case FORGOT_PASSWORD_FAILURE:
    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        errorMessage: action.payload,
        successMessage: '',
        showLoading: false,
      };

    case LOADING_TOGGLE_ACTION:
      return {
        ...state,
        showLoading: action.payload,
      };

    case CLEAR_MESSAGES:
      return {
        ...state,
        errorMessage: '',
        successMessage: '',
      };

    default:
      return state;
  }
}
