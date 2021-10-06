import { ADD_NOTIFICATION_MSG, AUTH, AUTH_ERROR, LOGOUT, REMOVE_NOTIFICATION_MSG, UPDATE_PROFILE, VERIFY_AUTH } from "./authTypes";

const intitalState = {
  token: null,
  user: null,
  err: "",
  notificationMsg: null,
};

const authReducer = (state = intitalState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE:
      return {
        ...state,
        user: action.payload
      }
    case AUTH:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.userData,
        err: "",
      }
    case VERIFY_AUTH:
      return {
        ...state,
        user: action.payload,
        err: "",
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
        user: null,
        err: "",
      };
    case AUTH_ERROR:
      return {
        ...state,
        err: action.payload,
      };
    case REMOVE_NOTIFICATION_MSG:
      return {
        ...state,
        notificationMsg: null,
      };
    case ADD_NOTIFICATION_MSG:
      return {
        ...state,
        notificationMsg: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
