import React, { useEffect, useState } from "react";
import app from "../axiosConfig";

function User({conversation, user, setSelectedCoversation}) {
    const [userInfo, setUserInfo] = useState(null)

    const getUserInfo = async () => {
        const friendId = conversation.members.find(member=>member!==user?.id)
        const {data} = await app.get(`/auth/get-user/${friendId}`)
        setUserInfo(data)
    }
    
    useEffect(() => {
        conversation && getUserInfo()
    }, [conversation])

  return (
    userInfo && <div onClick={()=>setSelectedCoversation(conversation)} className="user-container">
      <img className="user-image" src={userInfo.displayImage} alt="" />
      <div>{userInfo.fullname}</div>
    </div>
  );
}

export default User;
