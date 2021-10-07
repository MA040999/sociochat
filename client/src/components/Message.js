import React from "react";
import moment from "moment";

function Message({ own, text, image, date }) {
  return (
    <div className={`message ${own === true ? "own" : ""}`}>
      <div className="line-one">
        <img
          className="message-img"
          src={image ? image : "/displayImage1.png"}
          alt=""
        />
        <div className="message-container">{text}</div>
      </div>
      <div className="date">{moment(date).fromNow()}</div>
    </div>
  );
}

export default Message;
