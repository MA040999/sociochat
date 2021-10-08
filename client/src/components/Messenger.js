import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Chat from "./Chat";
import User from "./User";
import NavBar from "./NavBar";
import { useDispatch, useSelector } from "react-redux";
import { getConversations } from "../redux/conversation/conversationActions";
import { receiveNewMsg } from "../redux/message/messageActions";

function Messenger({ user }) {
  const [selectedCoversation, setSelectedCoversation] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const dispatch = useDispatch();
  const conversations = useSelector(
    (state) => state.conversation.conversations
  );

  useEffect(() => {
    socket.current = io("ws://localhost:4000");

    socket.current.emit("addUser", user?.id);

    socket.current.on("getUsers", (users) => {
      const userIds = users.map(({ userId }) => userId);
      setOnlineUsers(userIds);
    });

    socket.current.on(
      "getMessage",
      ({ senderId, conversationId, text, id }) => {
        console.log(`selectedCoversation`, selectedCoversation);
        console.log(`conversationId`, conversationId);
        conversationId === selectedCoversation &&
          dispatch(receiveNewMsg(senderId, conversationId, text, id));
      }
    );
  }, []);

  useEffect(() => {
    dispatch(getConversations(user?.id));
  }, [user]);

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="users-container">
          {conversations.map((conversation) => (
            <User
              key={conversation._id}
              conversation={conversation}
              user={user}
              setSelectedCoversation={setSelectedCoversation}
            />
          ))}
        </div>
        <Chat
          user={user}
          socket={socket}
          selectedCoversation={selectedCoversation}
        />
        <div className="users-container">
          {onlineUsers &&
            onlineUsers.map((onlineUser) => (
              <User
                key={onlineUser}
                onlineUserId={onlineUser}
                user={user}
                setSelectedCoversation={setSelectedCoversation}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export default Messenger;
