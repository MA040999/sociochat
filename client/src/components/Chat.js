import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { RiSendPlaneFill } from "react-icons/ri";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import app from "../axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewMessage,
  getMessages,
  removeMessages,
  updateNewMessage,
} from "../redux/message/messageActions";
import { createConversation } from "../redux/conversation/conversationActions";

function Chat({ user, socket, selectedCoversation, setSelectedCoversation }) {
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
    if (!text) return null;
    if (selectedCoversation.emptyConvo) {
      const conversation = await dispatch(
        createConversation({
          senderId: user?.id,
          receiverId: selectedCoversation.friendId,
        })
      );
      const newMsg = await dispatch(
        createNewMessage(conversation._id, user?.id, text)
      );

      socket.current.emit("sendMessage", {
        senderId: user?.id,
        receiverId: selectedCoversation.friendId,
        conversationId: conversation._id,
        text,
        createdAt: newMsg.createdAt,
        id: newMsg._id,
      });

      setSelectedCoversation(conversation);
    } else {
      const newMsg = await dispatch(
        updateNewMessage(selectedCoversation._id, user?.id, text)
      );

      socket.current.emit("sendMessage", {
        senderId: user?.id,
        receiverId: friendInfo?.id,
        conversationId: selectedCoversation._id,
        text,
        createdAt: newMsg.createdAt,
        id: newMsg._id,
      });
    }
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
    dispatch(removeMessages());
    selectedCoversation &&
      !selectedCoversation.emptyConvo &&
      getConversationMessages() &&
      getFriendInfo();
  }, [selectedCoversation]);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      {selectedCoversation && !selectedCoversation?.emptyConvo ? (
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
          {!selectedCoversation?.emptyConvo
            ? `Open a conversation to start chatting.`
            : `Send a message to initiate coversation.`}
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
