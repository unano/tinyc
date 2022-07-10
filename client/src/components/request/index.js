import "./request.scss";
import { useState } from "react";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import { acceptFriendsAPI, denyFriendsAPI } from "../../api/api";
import { userAvatarHandler } from "../../functions";
const Request = ({ request, refresh, setRefresh }) => {
  const [disabled, setDisabled] = useState(false);
  const accept = async () => {
    if (disabled) return;
    setDisabled(true);
    await acceptFriendsAPI(request._id);
    setRefresh(!refresh);
    setDisabled(false);
  };
  const refuse = async () => {
    if (disabled) return;
    setDisabled(true);
    await denyFriendsAPI(request._id);
    setRefresh(!refresh);
    setDisabled(false);
  };
  return (
    <div className="request">
      <img
        src={userAvatarHandler(request.avatarImage)}
        alt="logo"
        className="avatar"
      ></img>
      <div className="userInfos">
        <div className="name">{request.username}</div>
        <div className="chooses">
          <IoCheckmarkOutline className="choose accept" onClick={accept} />
          <IoCloseOutline className=" choose refuse" onClick={refuse} />
        </div>
      </div>
    </div>
  );
};

export default Request;
