import {
  CREATE_CONVERSATION,
  GET_CONVERSATIONS,
  REMOVE_CONVERSATIONS,
} from "./conversationTypes";
import app from "../../axiosConfig";

export const getConversations = (userId) => {
  return async (dispatch) => {
    try {
      const conversations = await app.get(`/conversation/${userId}`);

      dispatch({ type: GET_CONVERSATIONS, payload: conversations.data });
      return conversations.data;
    } catch (error) {
      console.log(`error`, error);
    }
  };
};

export const createConversation = ({ senderId, receiverId }) => {
  return async (dispatch) => {
    try {
      const conversation = await app.post(`/conversation/create-conversation`, {
        senderId,
        receiverId,
      });
      dispatch({ type: CREATE_CONVERSATION, payload: conversation.data });
      return conversation.data;
    } catch (error) {
      console.log(`error`, error);
    }
  };
};

export const removeConversations = () => {
  return {
    type: REMOVE_CONVERSATIONS,
  };
};
