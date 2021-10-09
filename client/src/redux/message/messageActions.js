import {
  CREATE_NEW_MESSAGE,
  GET_MESSAGES,
  RECEIVE_NEW_MESSAGE,
  REMOVE_MESSAGES,
  UPDATE_NEW_MESSAGE,
} from "./messageTypes";
import app from "../../axiosConfig";

export const getMessages = (conversationId) => {
  return async (dispatch) => {
    try {
      const messages = await app.get(`/message/${conversationId}`);
      dispatch({ type: GET_MESSAGES, payload: messages.data });
    } catch (error) {
      console.log(`error`, error);
    }
  };
};

export const updateNewMessage = (conversationId, senderId, text) => {
  return async (dispatch) => {
    try {
      const newMsg = await app.post(`/message`, {
        conversationId,
        senderId,
        text,
      });

      dispatch({ type: UPDATE_NEW_MESSAGE, payload: newMsg.data });
      return newMsg.data;
    } catch (error) {
      console.log(`error`, error);
    }
  };
};

export const createNewMessage = (conversationId, senderId, text) => {
  return async (dispatch) => {
    try {
      const newMsg = await app.post(`/message`, {
        conversationId,
        senderId,
        text,
      });

      dispatch({ type: CREATE_NEW_MESSAGE, payload: newMsg.data });
      return newMsg.data;
    } catch (error) {
      console.log(`error`, error);
    }
  };
};

export const receiveNewMsg = (
  senderId,
  conversationId,
  text,
  id,
  createdAt
) => {
  return {
    type: RECEIVE_NEW_MESSAGE,
    payload: { senderId, conversationId, text, _id: id, createdAt },
  };
};

export const removeMessages = () => {
  return {
    type: REMOVE_MESSAGES,
  };
};
