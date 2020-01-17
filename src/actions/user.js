import { request } from "./";

// Action Types
export const types = {
  LOGIN: {
    START: "LOGIN_START",
    SUCCESS: "LOGIN_SUCCESS",
    FAILURE: "LOGIN_FAILURE"
  },
  // Start and fail are not necessary,
  // outcome is certain
  LOGOUT: 'LOGOUT'
};

// Action Creators

export const login = ({ username, password }) => dispatch => {
  return request(dispatch, "post", "/login", types.LOGIN, {
    username,
    password
  });
};

// Refresh uses the currently stored token, if any, to retrieve user data
export const refresh = () => dispatch => {
  return request(dispatch, "get", "/refresh", types.LOGIN);
}

export const signup = ({ username, email, password }) => dispatch => {
  return request(dispatch, "post", "/users", types.LOGIN, {
    username,
    email,
    password
  });
};

export const logout = () => dispatch => {
  dispatch({
    type: types.LOGOUT
  })
  return null;
}
