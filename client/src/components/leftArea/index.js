import './leftArea.scss'
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/authContext";
import Settings from "../../imgs/settings.png";
import { useNavigate } from "react-router-dom";
import Back from "../../imgs/back2.png";

const LeftIcons = ({
  ischat = false,
  chatBtnSwitch = {},
  switchsBack = null,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [setting01, setSetting01] = useState({});
  const [rotate, setRotate] = useState({});
  const navigateToUser = () => {
    navigate("/user");
  };
  const show = () => {
    setting01.left !== "-80%"
      ? setSetting01({ left: "-80%" })
      : setSetting01({ left: "10%" });
  };

  const setStyle = () => {
    setRotate({ transform: "rotate(-135deg" });
  };

  const setLeaveStyle = () => {
    setRotate({ transform: "rotate(0deg)" });
  };
  return (
    <>
      <div className="chatLeftIcon">
        {ischat ? (
          <div className="chatLeftIn" style={chatBtnSwitch}>
            <div className="backOut">
              <img
                src={
                  currentUser.avatarImage
                    ? require(`../../images/${currentUser.avatarImage}`)
                    : require(`../../images/default.png`)
                }
                alt="logo"
                className="back"
                onClick={navigateToUser}
              ></img>
            </div>
            <div className="backOut" onClick={switchsBack}>
              <img src={Back} alt="logo" className="back"></img>
            </div>
          </div>
        ) : (
          <div className="backOut">
            <img
              src={
                currentUser.avatarImage
                  ? require(`../../images/${currentUser.avatarImage}`)
                  : require(`../../images/default.png`)
              }
              alt="logo"
              className="back"
              onClick={navigateToUser}
            ></img>
          </div>
        )}
      </div>
      <div className="settingContainer">
        <div className="chatLeftIcon" onClick={show} style={rotate}>
          <div className="backOut borderBackout">
            <img src={Settings} alt="logo" className="back rotate"></img>
          </div>
        </div>
        <div
          className="setting01"
          style={setting01}
          onMouseOver={setStyle}
          onMouseLeave={setLeaveStyle}
        ></div>
      </div>
    </>
  );
};

export default LeftIcons;
