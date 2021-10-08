import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import authReducer from "./auth/authReducer";
import conversationReducer from "./conversation/conversationReducer";
import messageReducer from "./message/messageReducer";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

const reducer = combineReducers({
  auth: authReducer,
  conversation: conversationReducer,
  message: messageReducer,
});

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(logger, thunk))
);

export default store;
