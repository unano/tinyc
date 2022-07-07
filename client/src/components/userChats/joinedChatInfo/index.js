import "../userChats.scss";
import { useContext, useState, useEffect } from "react";
import {
  IoPencilOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { IoMdExit } from "react-icons/io";
import { StepContent } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { exitGroupAPI } from "../../../api/api";
import { AuthContext } from "../../../contexts/authContext";
const ChatInfo = ({ chat, refresh, setRefresh }) => {
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const exit = async () => {
    await exitGroupAPI(chat._id);
    setShowDelete(false);
    setRefresh(!refresh);
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
          chat.avatar
            ? require(`../../../images/${chat.avatar}`)
            : require(`../../../images/default.png`)
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
