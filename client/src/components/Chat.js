import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { RiSendPlaneFill } from "react-icons/ri";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import app from "../axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, updateNewMessage } from "../redux/message/messageActions";

function Chat({ user, socket, selectedCoversation }) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [friendInfo, setFriendInfo] = useState(null);

  const messages = useSelector((state) => state.message.messages);
  const bottomRef = useRef();

  const handleSubmit = async () => {
    // const { data } = await app.post(`/message`, {
    //   conversationId: selectedCoversation._id,
    //   senderId: user?.id,
    //   text,
    // });
    // setMessages((prevMsgs) => {
    //   const newMsgs = [...prevMsgs];
    //   newMsgs.push(data);
    //   return newMsgs;
    // });

    const newMsg = await dispatch(
      updateNewMessage(selectedCoversation._id, user?.id, text)
    );
    socket.current.emit("sendMessage", {
      senderId: user?.id,
      receiverId: friendInfo?.id,
      conversationId: selectedCoversation._id,
      text,
      id: newMsg._id,
    });
    setText("");
  };

  const getConversationMessages = async () => {
    dispatch(getMessages(selectedCoversation._id));
  };

  const getFriendInfo = async () => {
    const friendId = selectedCoversation.members.find(
      (member) => member !== user?.id
    );
    const friendData = await app.get(`/auth/get-user/${friendId}`);
    setFriendInfo(friendData.data);
  };
  useEffect(() => {
    socket?.current?.on("getMessage", (senderId, text) => {
      console.log(`text`, text);
    });
  }, []);

  useEffect(() => {
    selectedCoversation && getConversationMessages() && getFriendInfo();
  }, [selectedCoversation]);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      {selectedCoversation ? (
        <div className="messages-container">
          {messages.map((msg) => (
            <Message
              key={msg._id}
              text={msg.text}
              own={msg.senderId === user?.id ? true : false}
              image={
                msg.senderId === user?.id
                  ? user?.displayImage
                  : friendInfo?.displayImage
              }
              date={msg.createdAt}
            />
          ))}
          <span ref={bottomRef}></span>
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
            value={text}
            onChange={(e) => setText(e.target.value)}
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
