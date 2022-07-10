import "../userChats.scss";
import { useNavigate } from "react-router-dom";
import { groupAvatarHandler } from "../../../functions";
const ChatInfo = ({ chat }) => {
  const navigate = useNavigate();

  const navigates = () => {
    navigate(`/chat/${chat._id}`);
  };
  return (
    <div className="container" key={chat._id} onClick={navigates}>
      <img
        src={groupAvatarHandler(chat.avatar)}
        alt="logo"
        className="icon"
      ></img>
      <div className="chatName">{chat.chatName}</div>
      {chat.applyingUsers && chat.applyingUsers.length > 0 && (
        <>
          <div className="inform">{chat.applyingUsers.length}</div>
        </>
      )}
    </div>
  );
};
export default ChatInfo;
