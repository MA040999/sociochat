import React, { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import User from "./User";
import NavBar from "./NavBar";
import { useDispatch, useSelector } from "react-redux";
import { getConversations } from "../redux/conversation/conversationActions";
import { getMessages, receiveNewMsg } from "../redux/message/messageActions";
function Messenger({ user, socket, onlineUsers }) {
  const [selectedCoversation, setSelectedCoversation] = useState(null);
  const selectedCoversationRef = useRef();
  const onlineUsersRef = useRef([]);
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();
  const conversations = useSelector(
    (state) => state.conversation.conversations
  );

  useEffect(() => {
    // console.log(`1`);
    // socket.emit("addUser", user?.id);

    // socket.on("getUsers", (users) => {
    //   const userIds = users.map(({ userId }) => userId);
    //   setOnlineUsers(userIds);
    // });

    // console.log(`12`);

    socket.current.on(
      "getMessage",
      async ({ senderId, conversationId, text, id, createdAt }) => {
        await dispatch(
          receiveNewMsg(senderId, conversationId, text, id, createdAt)
        );
      }
    );

    return () => {
      socket.current.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    selectedCoversationRef.current = selectedCoversation;
  }, [selectedCoversation]);

  useEffect(() => {
    socket.current.on(
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
            {onlineUsers &&
              onlineUsers.map((onlineUser) => {
                let convoExists = false;
                if (onlineUser !== user?.id) {
                  const prevConvo = conversations.map((convo) => {
                    if (
                      convo.members.every((member) =>
                        [user?.id, onlineUser].includes(member)
                      )
                    ) {
                      convoExists = true;
                      return (
                        <User
                          key={onlineUser}
                          onlineUserId={onlineUser}
                          conversation={convo}
                          user={user}
                          setSelectedCoversation={setSelectedCoversation}
                          selectedCoversation={selectedCoversation}
                        />
                      );
                    }
                    // return null;
                  });
                  if (convoExists) {
                    return prevConvo;
                  } else if (!convoExists) {
                    return (
                      <User
                        key={onlineUser}
                        onlineUserId={onlineUser}
                        user={user}
                        setSelectedCoversation={setSelectedCoversation}
                        selectedCoversation={selectedCoversation}
                      />
                    );
                  }
                }
                return null;
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger;
