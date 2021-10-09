import {
  CREATE_NEW_MESSAGE,
  GET_MESSAGES,
  RECEIVE_NEW_MESSAGE,
  REMOVE_MESSAGES,
  UPDATE_NEW_MESSAGE,
} from "./messageTypes";

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
    case CREATE_NEW_MESSAGE:
      return {
        ...state,
        messages: [action.payload],
      };

    case RECEIVE_NEW_MESSAGE:
      if (state.messages[0]) {
        return {
          ...state,
          messages:
            state.messages[0].conversationId === action.payload.conversationId
              ? [...state.messages, action.payload]
              : state.messages,
        };
      } else {
        return state;
      }
    case REMOVE_MESSAGES:
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
};

export default authReducer;
