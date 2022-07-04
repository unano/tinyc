import "../userChats.scss";
import { useContext, useState, useEffect } from "react";
import {
  IoPencilOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { StepContent } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
const ChatInfo = ({ chat }) => {
  const navigate = useNavigate();

  const navigates = () => {
    navigate(`/chat/${chat._id}`);
  };
  return (
    <div className="container" key={chat._id} onClick={navigates}>
      <img
        src={
          chat.avatar
            ? require(`../../../images/${chat.avatar}`)
            : require(`../../../images/default.png`)
        }
        alt="logo"
        className="icon"
      ></img>
      <div className="chatName">{chat.chatName}</div>
      {chat.applyingUsers && chat.applyingUsers.length > 0 && (
        <>
          <div className="inform" onClick={navigates}>
            {chat.applyingUsers.length}
          </div>
        </>
      )}
    </div>
  );
};
export default ChatInfo;
