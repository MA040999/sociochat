import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Chat from "./Chat";
import User from "./User";
import NavBar from "./NavBar";
import { useDispatch, useSelector } from "react-redux";
import { getConversations } from "../redux/conversation/conversationActions";

function Messenger({ user }) {
  const [selectedCoversation, setSelectedCoversation] = useState(null);
  const socket = useRef();
  const dispatch = useDispatch();
  const conversations = useSelector(
    (state) => state.conversation.conversations
  );

  useEffect(() => {
    socket.current = io("ws://localhost:4000");
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
        <div className="users-container"></div>
      </div>
    </>
  );
}

export default Messenger;
