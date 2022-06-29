import { useContext, useEffect, useState } from "react";
import Info from "../../imgs/info.png";
import "./chat.scss";
import { AuthContext } from "../../contexts/authContext";

const Chat = ({ chat, switchs }) => {
  const { currentUser } = useContext(AuthContext);
  const [avatar, setAvatar] = useState("default.png");
  const chatUser = chat.users.filter((u) => {
    return u._id !== currentUser._id;
  });
  const currentChatUser = chatUser[0].username;

  const switchChat = () => {
    switchs(chat, currentChatUser);
  };

  useEffect(()=>{
        if (chat.isGroupChat) {
          if (chat.avatar) setAvatar(chat.avatar);
          else setAvatar("defaultGroup.png");
        } else {
          if (chatUser[0].avatarImage) setAvatar(chatUser[0].avatarImage);
          else setAvatar("default.png");
        }
  },[currentUser, chat, chatUser])
  return (
    <>
      <div className="friendList">
        <div className="chatIcon">
          <img
            src={
              currentUser.avatarImage
                ? require(`../../images/${avatar}`)
                : require(`../../images/default.png`)
            }
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
            {chat.latestMessage &&
              (chat.isGroupChat
                ? `${chat.latestMessage.sender.username} : ${chat.latestMessage.message}`
                : chat.latestMessage.message)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
