import { useState, useContext } from "react";
import Close from "../../imgs/close.png";
import Info from "../../imgs/info.png";
import "./friend.scss";
import { TiUserDeleteOutline } from "react-icons/ti";
import { IoCloseOutline, IoCheckmarkOutline } from "react-icons/io5";
import { denyFriendsAPI } from "../../api/api";
import { AuthContext } from "../../contexts/authContext";
const Friend = ({ friend, refresh, setRefresh }) => {
  const [friendInfo, setFriendInfo] = useState();
  const [deleteInfo, setDeleteInfo] = useState();
  const { currentUser } = useContext(AuthContext);
  const showInfo = () => {
    setFriendInfo({ width: "506px" });
  };
  const closeInfo = () => {
    setFriendInfo({ width: "70px" });
  };

  const deleteAlert = () => {
    setDeleteInfo({ width: "506px" });
  };
  const cancelDeleteAlert = () => {
    setDeleteInfo({ width: "70px" });
  };

  const deleteFriend = async () => {
    await denyFriendsAPI(friend._id);
    setRefresh(!refresh);
  };

  return (
    <>
      <div className="friendListi">
        <div className={`friendIcon ${friend.isOnline ? "onlined" : ""}`}>
          <img
            src={
              friend.avatarImage
                ? require(`../../images/${friend.avatarImage}`)
                : require(`../../images/default.png`)
            }
            alt="avatar"
            className="icon showBtn"
          ></img>
          <img
            src={Info}
            alt="logo"
            className="icon showBtn "
            onClick={showInfo}
          ></img>
        </div>
        <div className="friendNameAndWord">
          <div className="friendName">{friend.username}</div>
          <div className="friendWord">{friend.intro}</div>
        </div>
        <div className="friendInfo" style={friendInfo}>
          <img
            src={Close}
            alt="logo"
            className="icon showBtn"
            onClick={closeInfo}
          ></img>
          <div className="friendNameAndWord">
            <div className="friendName friendName2">{friend.username}</div>
          </div>
          <TiUserDeleteOutline className="deleteFriend" onClick={deleteAlert} />
          {/* <div className="imgBorder btn01">
            <img src={Star} alt="logo" className="icon  icon02 "></img>
          </div>
          <div className="imgBorder btn02">
            <img
              src={Delete}
              alt="logo"
              className="icon icon02 "
              onClick={deleteAlert}
            ></img>
          </div> */}
          <div className="rightSpace"></div>
        </div>
        <div className="deleteInfo" style={deleteInfo}>
          <div className="deleteInfoWord">
            Sure to delete {friend.username}?
          </div>
          <div className="chooses">
            <IoCheckmarkOutline className="choose" onClick={deleteFriend} />
            <IoCloseOutline className="choose" onClick={cancelDeleteAlert} />
          </div>
          {/* <div className="imgBorder whireBorder btn03">
            <img src={Tick} alt="logo" className="icon  icon02 "></img>
          </div>
          <div className="imgBorder whireBorder btn03">
            <img
              src={Delete}
              alt="logo"
              className="icon icon02 "
              onClick={cancelDeleteAlert}
            ></img>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Friend;
