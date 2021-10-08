import React, { useEffect, useState } from "react";
import app from "../axiosConfig";

function User({ conversation, user, setSelectedCoversation, onlineUserId }) {
  const [userInfo, setUserInfo] = useState(null);

  const getUserInfo = async () => {
    const friendId = conversation?.members.find(
      (member) => member !== user?.id
    );
    const { data } = await app.get(
      `/auth/get-user/${friendId ? friendId : onlineUserId}`
    );
    setUserInfo(data);
  };

  useEffect(() => {
    (conversation || onlineUserId) && getUserInfo();
  }, [conversation]);

  return (
    userInfo && (
      <div
        onClick={() => setSelectedCoversation(conversation)}
        className="user-container"
      >
        <img
          className="user-image"
          src={
            userInfo.displayImage ? userInfo.displayImage : "/displayImage1.png"
          }
          alt=""
        />
        <div className="user-name">{userInfo.fullname}</div>
      </div>
    )
  );
}

export default User;
