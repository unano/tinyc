import "../userChats.scss";
import { useState } from "react";
import {
  IoCloseOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { exitGroupAPI } from "../../../api/api";
import { userAvatarHandler } from "../../../functions";
const ChatInfo = ({ chat, refresh, setRefresh }) => {
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const exit = async () => {
    if (disabled) return;
    setDisabled(true);
    await exitGroupAPI(chat._id);
    setShowDelete(false);
    setRefresh(!refresh);
    setDisabled(false);
  };
  const navigates = () => {
    navigate(`/chat/${chat._id}`);
  };
  return (
    <div className="container" key={chat._id}>
      {showDelete && (
        <div className="confirm">
          <div>Exit this group?</div>
          <div className="chooses">
            <IoCheckmarkOutline className="choose" onClick={exit} />
            <IoCloseOutline
              className="choose"
              onClick={() => setShowDelete(false)}
            />
          </div>
        </div>
      )}
      <div className="delete" onClick={() => setShowDelete(true)}>
        <IoMdExit />
      </div>
      <img
        src={
          userAvatarHandler(chat.avatar)
        }
        alt="logo"
        className="icon"
        onClick={navigates}
      ></img>
      <div className="chatName" onClick={navigates}>
        {chat.chatName}
      </div>
    </div>
  );
};
export default ChatInfo;
