import React, { useEffect, useRef, useState } from "react";
import app from "../axiosConfig";
import { v4 as uuidv4 } from "uuid";
function User({
  conversation,
  user,
  setSelectedCoversation,
  onlineUserId,
  selectedCoversation,
}) {
  const [userInfo, setUserInfo] = useState(null);
  const uuid = useRef(uuidv4());

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
        onClick={() =>
          setSelectedCoversation(
            conversation
              ? conversation
              : { emptyConvo: true, friendId: onlineUserId, uuid: uuid.current }
          )
        }
        className={`user-container ${
          selectedCoversation
            ? !conversation
              ? selectedCoversation.uuid === uuid.current
                ? "active-container"
                : ""
              : selectedCoversation?._id === conversation?._id
              ? "active-container"
              : ""
            : ""
        }`}
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
