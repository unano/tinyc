
import { useState } from "react";
import Delete from "../../imgs/delete.png";
import Close from "../../imgs/close.png";
import Info from "../../imgs/info.png";
import Star from "../../imgs/star.png";
import Tick from "../../imgs/tick.png";
import testIcon from "../../imgs/testIcon.jpg";
import "./friend.css";

const Chat = ({ chat, switchs, user }) => {
    console.log(chat)
  const chatUser = chat.users.filter((u)=>{
      return u._id!==user
  });
  const currentChatUser =  chatUser[0].username;

  const switchChat = () => {
    switchs(chat._id);
  };
  return (
    <>
      <div className="friendList">
        <div className="chatIcon">
          <img
            src={testIcon}
            alt="logo"
            className="icon"
            onClick={switchChat}
          ></img>
          <img src={Info} alt="logo" className="icon showBtn "></img>
        </div>
        <div className="friendNameAndWord">
          <div className="friendName" onClick={switchChat}>
            {chat.isGroupChat ? chat.chatName : currentChatUser}
          </div>
          <div className="friendWord" onClick={switchChat}>
            {chat.isGroupChat
              ? `${chat.latestMessage.sender.username} : ${chat.latestMessage.message}`
              : chat.latestMessage.message}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
