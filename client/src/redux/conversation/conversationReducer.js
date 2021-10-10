import {
  CREATE_CONVERSATION,
  GET_CONVERSATIONS,
  REMOVE_CONVERSATIONS,
} from "./conversationTypes";

const intitalState = {
  conversations: [],
};

const authReducer = (state = intitalState, action) => {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload,
      };
    case CREATE_CONVERSATION:
      return {
        ...state,
        conversations: [...state.conversations, action.payload],
      };
    case REMOVE_CONVERSATIONS:
      return {
        ...state,
        conversations: [],
      };
    default:
      return state;
  }
};

export default authReducer;
