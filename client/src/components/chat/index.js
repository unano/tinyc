
import { useContext } from "react";
import Info from "../../imgs/info.png";
import testIcon from "../../imgs/testIcon.jpg";
import "./friend.css";
import {AuthContext} from '../../contexts/authContext';

const Chat = ({ chat, switchs }) => {
  const { currentUser } = useContext(AuthContext);
  const chatUser = chat.users.filter((u)=>{
      return u._id !== currentUser._id;
  });
  const currentChatUser =  chatUser[0].username;

  const switchChat = () => {
    switchs(chat, currentChatUser);
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
