import {
  AUTH,
  LOGOUT,
  AUTH_ERROR,
  VERIFY_AUTH,
  UPDATE_PROFILE,
  ADD_NOTIFICATION_MSG,
  REMOVE_NOTIFICATION_MSG,
} from "./authTypes";
import app from "../../axiosConfig";
import { removeConversations } from "../conversation/conversationActions";

export const authError = (error) => {
  return {
    type: AUTH_ERROR,
    payload: error,
  };
};

export const login = ({ email, password }, history, socket) => {
  return async (dispatch) => {
    try {
      const user = await app.post("/auth/login/", { email, password });
      delete user?.data.refreshToken;

      dispatch({ type: AUTH, payload: user?.data });

      socket.emit("addUser", user?.data.userData.id);

      history.push("/");
    } catch (error) {
      console.log(`error`, error);
      dispatch(addNotificationMsg(error?.response?.data?.message));
    }
  };
};

export const updateProfile = (formData, history) => {
  return async (dispatch) => {
    try {
      const { data } = await app.put("/auth/update-profile/", formData);
      dispatch({ type: UPDATE_PROFILE, payload: data });

      history.push("/");
    } catch (error) {
      console.log(`error`, error);
    }
  };
};

export const verifyAuth = () => {
  return async (dispatch) => {
    try {
      const user = await app.get("/auth/verify-auth");
      dispatch({ type: VERIFY_AUTH, payload: user?.data });
    } catch (error) {
      console.log(`error`, error);
      dispatch(addNotificationMsg(error.response.data.message));

      dispatch({ type: LOGOUT });
    }
  };
};

export const verifyRefreshToken = () => {
  return async (dispatch) => {
    try {
      const user = await app.get("/auth/refresh-token");
      dispatch({ type: AUTH, payload: user?.data });
    } catch (error) {
      console.log(`error`, error);
      dispatch({ type: LOGOUT });
    }
  };
};

export const signup = ({ fullname, email, password }, history, socket) => {
  return async (dispatch) => {
    try {
      const user = await app.post("/auth/signup", {
        fullname,
        email,
        password,
      });
      delete user?.data.refreshToken;
      dispatch({ type: AUTH, payload: user?.data });

      socket.emit("addUser", user?.data.userData.id);
      history.push("/");
    } catch (error) {
      console.log(`error`, error);
      dispatch(addNotificationMsg(error?.response?.data?.message));
    }
  };
};

export const logout = (history) => {
  return async (dispatch) => {
    try {
      await app.get("/auth/logout/");
      dispatch({ type: LOGOUT });
      dispatch(removeConversations());
      history.push("/");
    } catch (error) {
      console.log(`error`, error);
    }
  };
};

export const addNotificationMsg = (msg) => {
  return {
    type: ADD_NOTIFICATION_MSG,
    payload: msg,
  };
};

export const removeNotificationMsg = () => {
  return {
    type: REMOVE_NOTIFICATION_MSG,
  };
};
