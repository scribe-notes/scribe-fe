import { types } from "../actions/user";

const initialState = {
  isLoading: false,
  data: null,
  error: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN.START: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case types.LOGIN.SUCCESS: {
      action.payload.token &&
        localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isLoading: false,
        data: action.payload
      };
    }
    case types.LOGIN.FAILURE: {
      localStorage.removeItem("token");
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }
    case types.LOGOUT: {
      localStorage.removeItem("token");
      return {
        ...state,
        data: null
      };
    }
    default:
      return state;
  }
};

export default userReducer;