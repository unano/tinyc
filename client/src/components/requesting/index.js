import "./requesting.scss";
import { userAvatarHandler } from "../../functions";
const Requesting = ({ requesting }) => {
  return (
    <div className="requesting">
      <img
        src={userAvatarHandler(requesting.avatarImage)}
        alt="logo"
        className="avatar"
      ></img>
      <div className="userInfos">
        <div className="name">{requesting.username}</div>
      </div>
    </div>
  );
};

export default Requesting;
