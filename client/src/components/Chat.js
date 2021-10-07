import React, { useEffect, useState } from "react";
import Message from "./Message";
import { RiSendPlaneFill } from "react-icons/ri";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import app from "../axiosConfig";

function Chat({ user, socket, selectedCoversation }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userImage, setUserImage] = useState("");
  const [friendImage, setFriendImage] = useState("");

  const handleSubmit = () => {
    setMessage("");
  };

  const getConversationMessages = async () => {
    const { data } = await app.get(`/message/${selectedCoversation._id}`);
    setMessages(data);
  };

  const getImages = async () => {
    const friendId = selectedCoversation.members.find(
      (member) => member !== user?.id
    );
    const friendData = await app.get(`/auth/get-user/${friendId}`);
    setFriendImage(friendData.data.displayImage);

    const userData = await app.get(`/auth/get-user/${user?.id}`);
    setUserImage(userData.data.displayImage);
  };

  useEffect(() => {
    selectedCoversation && getConversationMessages() && getImages();
  }, [selectedCoversation]);

  return (
    <div className="chat-container">
      {selectedCoversation ? (
        <div className="messages-container">
          {messages.map((msg) => (
            <Message
              key={msg._id}
              text={msg.text}
              own={msg.senderId === user?.id ? true : false}
              image={msg.senderId === user?.id ? userImage : friendImage}
              date={msg.createdAt}
            />
          ))}
        </div>
      ) : (
        <div className="empty-message-container">
          Open a conversation to start chatting.
        </div>
      )}
      {selectedCoversation ? (
        <div className="message-creator">
          <TextareaAutosize
            name="postInput"
            className="post-input"
            placeholder="Message..."
            minRows={1}
            maxRows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
          />
          <RiSendPlaneFill
            color="white"
            className="send-icon"
            onClick={handleSubmit}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Chat;
