import React, { useState } from "react";
import Message from "./Message";
import { RiSendPlaneFill } from "react-icons/ri";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useSelector } from "react-redux";

function Chat({ socket }) {
  const user = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    setMessage("");
  };
  return (
    <div className="chat-container">
      <div className="messages-container">
        <Message own={true} />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message own={true} />
        <Message own={true} />
        <Message />
      </div>
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
    </div>
  );
}

export default Chat;
