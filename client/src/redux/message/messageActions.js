import { GET_MESSAGES, UPDATE_NEW_MESSAGE } from "./messageTypes";
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

export const receiveNewMsg = (senderId, conversationId, text, id) => {
  console.log(`{ senderId, conversationId, text, _id: id }`, {
    senderId,
    conversationId,
    text,
    _id: id,
  });
  return {
    type: UPDATE_NEW_MESSAGE,
    payload: { senderId, conversationId, text, _id: id },
  };
};
