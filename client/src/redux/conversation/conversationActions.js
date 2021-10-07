import {
  GET_CONVERSATIONS
} from "./conversationTypes";
import app from "../../axiosConfig";

export const getConversations = (userId) => {
  return async (dispatch) => {
    try {
      const conversations = await app.get(`/conversation/${userId}`);

      dispatch({ type: GET_CONVERSATIONS, payload: conversations.data });

    } catch (error) {
      console.log(`error`, error)
    }
  };
};
