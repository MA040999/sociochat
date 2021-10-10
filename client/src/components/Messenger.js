import React, { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import User from "./User";
import NavBar from "./NavBar";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversations,
  removeConversations,
} from "../redux/conversation/conversationActions";
import { getMessages, receiveNewMsg } from "../redux/message/messageActions";
function Messenger({ user, socket, onlineUsers }) {
  const [selectedCoversation, setSelectedCoversation] = useState(null);
  const [filteredOnlineUsers, setFilteredOnlineUsers] = useState([]);
  const selectedCoversationRef = useRef();
  const dispatch = useDispatch();
  const conversations = useSelector(
    (state) => state.conversation.conversations
  );

  useEffect(() => {
    const users = [];
    console.log(`useEffect`, onlineUsers);
    console.log(`conversations`, conversations);
    const promise = onlineUsers.map((user) => {
      let exists = false;
      conversations.some((convo) => {
        if (convo.members.includes(user)) {
          exists = true;
          users.push({
            onlineUserId: user,
            convoExists: true,
            conversation: convo,
          });
          return true;
        }
      });
      if (!exists) {
        users.push({
          onlineUserId: user,
          convoExists: false,
        });
      }
    });

    Promise.all(promise).then(() => {
      setFilteredOnlineUsers(users);
    });
  }, [conversations, onlineUsers]);

  useEffect(() => {
    socket?.current?.on(
      "getMessage",
      async ({ senderId, conversationId, text, id, createdAt }) => {
        await dispatch(
          receiveNewMsg(senderId, conversationId, text, id, createdAt)
        );
      }
    );

    return () => {
      socket?.current?.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    selectedCoversationRef.current = selectedCoversation;
  }, [selectedCoversation]);

  useEffect(() => {
    socket?.current?.on(
      "getNewConvo",
      async ({ senderId, conversationId, text, id, createdAt }) => {
        await dispatch(
          receiveNewMsg(senderId, conversationId, text, id, createdAt)
        );
        if (
          selectedCoversationRef.current &&
          selectedCoversationRef.current.emptyConvo &&
          selectedCoversationRef.current.friendId === senderId
        ) {
          const newConversations = await dispatch(getConversations(user?.id));
          await dispatch(getMessages(conversationId));
          const conversation = newConversations.find(
            (convo) => convo._id === conversationId
          );
          setSelectedCoversation(conversation);
        } else if (
          !selectedCoversationRef.current ||
          !selectedCoversationRef.current.emptyConvo ||
          !selectedCoversationRef.current._id
        ) {
          await dispatch(getConversations(user?.id));
        }
      }
    );
  }, [selectedCoversation]);

  useEffect(() => {
    dispatch(getConversations(user?.id));
  }, [user]);

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="users-container">
          <h4 className="users-container-heading">Active Chats</h4>
          <div className="users-continer-div">
            {conversations.map((conversation) => (
              <User
                key={conversation._id}
                conversation={conversation}
                user={user}
                setSelectedCoversation={setSelectedCoversation}
                selectedCoversation={selectedCoversation}
              />
            ))}
          </div>
        </div>
        <Chat
          user={user}
          socket={socket}
          selectedCoversation={selectedCoversation}
          setSelectedCoversation={setSelectedCoversation}
        />
        <div className="users-container">
          <h4 className="users-container-heading">Online Users</h4>
          <div className="users-continer-div">
            {filteredOnlineUsers &&
              filteredOnlineUsers.map((onlineUser) => {
                if (onlineUser.convoExists) {
                  return (
                    <User
                      key={onlineUser.onlineUserId}
                      onlineUserId={onlineUser.onlineUserId}
                      conversation={onlineUser.conversation}
                      user={user}
                      setSelectedCoversation={setSelectedCoversation}
                      selectedCoversation={selectedCoversation}
                    />
                  );
                } else {
                  return (
                    <User
                      key={onlineUser.onlineUserId}
                      onlineUserId={onlineUser.onlineUserId}
                      user={user}
                      setSelectedCoversation={setSelectedCoversation}
                      selectedCoversation={selectedCoversation}
                    />
                  );
                }
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger;
