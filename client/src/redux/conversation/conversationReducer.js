import { GET_CONVERSATIONS } from "./conversationTypes";

const intitalState = {
  conversations: []
};

const authReducer = (state = intitalState, action) => {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload
      };
    default:
      return state;
  }
};

export default authReducer;
