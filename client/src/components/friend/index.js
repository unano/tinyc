import { useState } from "react";
import Delete from "../../imgs/delete.png";
import Close from "../../imgs/close.png";
import Info from "../../imgs/info.png";
import Star from "../../imgs/star.png";
import Tick from "../../imgs/tick.png";
import testIcon from "../../imgs/testIcon.jpg";

const Friend = ({ friend, switchs }) => {
  const [friendInfo, setFriendInfo] = useState();
  const [deleteInfo, setDeleteInfo] = useState();
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

  const switchChat = () =>{
      switchs(friend);
  }
  return (
    <>
      <div className="friendList">
        <div className="friendIcon">
          <img
            src={testIcon}
            alt="logo"
            className="icon"
            onClick={switchChat}
          ></img>
          <img
            src={Info}
            alt="logo"
            className="icon showBtn"
            onClick={showInfo}
          ></img>
        </div>
        <div className="friendNameAndWord">
          <div className="friendName" onClick={switchChat}>
            {friend.username}
          </div>
          <div className="friendWord" onClick={switchChat}>
            cafafasfsafafhika
          </div>
        </div>
        <div className="friendInfo" style={friendInfo}>
          <img
            src={Close}
            alt="logo"
            className="icon showBtn"
            onClick={closeInfo}
          ></img>
          <div className="friendNameAndWord">
            <div className="friendName friendName2">ID: 2104569</div>
            <div className="friendName friendName3">{friend.username}</div>
          </div>
          <div className="imgBorder btn01">
            <img src={Star} alt="logo" className="icon  icon02 "></img>
          </div>
          <div className="imgBorder btn02">
            <img
              src={Delete}
              alt="logo"
              className="icon icon02 "
              onClick={deleteAlert}
            ></img>
          </div>
          <div className="rightSpace"></div>
        </div>
        <div className="deleteInfo" style={deleteInfo}>
          <div className="deleteInfoWord">
            Sure to delete {friend.username}?
          </div>
          <div className="imgBorder whireBorder btn03">
            <img src={Tick} alt="logo" className="icon  icon02 "></img>
          </div>
          <div className="imgBorder whireBorder btn03">
            <img
              src={Delete}
              alt="logo"
              className="icon icon02 "
              onClick={cancelDeleteAlert}
            ></img>
          </div>
        </div>
      </div>
    </>
  );
};

export default Friend;
