import { GET_MESSAGES, UPDATE_NEW_MESSAGE } from "./messageTypes";

const intitalState = {
  messages: [],
};

const authReducer = (state = intitalState, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };
    case UPDATE_NEW_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    default:
      return state;
  }
};

export default authReducer;
