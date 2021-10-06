import React, { useRef } from "react";
import { io } from "socket.io-client";
import Chat from "./Chat";
import User from "./User";
import NavBar from "./NavBar";

function Messenger() {
  const socket = useRef(io("http://localhost:4000"));

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="users-container">
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
        </div>
        <Chat socket={socket} />
        <div className="users-container">
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User />
        </div>
      </div>
    </>
  );
}

export default Messenger;
