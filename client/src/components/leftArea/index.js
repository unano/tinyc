import "./leftArea.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/authContext";
import Settings from "../../imgs/settings.png";
import { useNavigate } from "react-router-dom";
import Back from "../../imgs/back2.png";
import { BsBell, BsImage, BsX } from "react-icons/bs";
import {SettingContext} from "../../contexts/settingContext";
const LeftIcons = ({
  ischat = false,
  chatBtnSwitch = {},
  switchsBack = null,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { inform, setInform, showBg, setShowBg } = useContext(SettingContext);
  const [expanded, setExpanded] = useState(false);
  const [settingStyle, setSettingStyle] = useState({});
  const navigateToUser = () => {
    navigate("/user");
  };
  const show = () => {
    setExpanded(true);
  };

  const rotate = (style) =>{
    clearStyle();
    const styles = { transform: `rotate(${style})` };
    setSettingStyle(styles);
  }
  const clearStyle=()=>{
    setSettingStyle({})
  }

  const changeInform = () =>{
    setInform(!inform);
  }

  const changeShowBg = () => {
    setShowBg(!showBg);
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
        <div className="settingOption"></div>
        <div className="chatLeftIcon" onClick={show} style={settingStyle}>
          <div className="backOut borderBackout">
            <img src={Settings} alt="logo" className="back rotate"></img>
          </div>
        </div>
        <div className={expanded ? "expandedSetting setting" : "setting"}>
          <div
            className="settingChoices"
            onMouseOver={() => rotate("-105deg")}
            onMouseLeave={clearStyle}
            onClick={changeInform}
          >
            <div
              className={inform ? "ringLine hideRingLine" : "ringLine"}
            ></div>
            <BsBell className="choiceIcon" />
          </div>
        </div>
        <div className={expanded ? "expandedSetting setting" : "setting"}>
          <div
            className="settingChoices"
            onMouseOver={() => rotate("-165deg")}
            onMouseLeave={clearStyle}
            onClick={changeShowBg}
          >
            <div className={showBg ? "BgLine hideBgLine" : "BgLine"}></div>
            <BsImage className="choiceIcon" />
          </div>
        </div>
        <div className={expanded ? "expandedSetting setting" : "setting"}>
          <div
            className="settingChoices"
            onMouseOver={() => rotate("-225deg")}
            onMouseLeave={clearStyle}
            onClick={()=>setExpanded(false)}
          >
            <BsX className="choiceIcon" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftIcons;
