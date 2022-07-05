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
  const { currentUser } = useContext(AuthContext);
  const [showDelete, setShowDelete] = useState(false);
  const exit = async () => {
    await exitGroupAPI(chat._id, currentUser._id);
    setShowDelete(false);
    setRefresh(!refresh);
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
      ></img>
      <div className="chatName">{chat.chatName}</div>
    </div>
  );
};
export default ChatInfo;
