import { useState } from 'react';
import './chat.css';
import Back from "./imgs/back2.png"
import Search from "./imgs/search.png";
import testIcon from "./imgs/testIcon.jpg";
import LogoPure from "./imgs/tinycPure.png";
import Delete from "./imgs/delete.png";
import Close from "./imgs/close.png";
import Info from "./imgs/info.png";
import User from "./imgs/user.png";
import Star from "./imgs/star.png";
import Tick from "./imgs/tick.png";
function Chat() {
    const [chatSwitch, setChatSwitch] = useState();
    const [chatBtnSwitch, setChatBtnSwitch] = useState();
    const [switched, setSwitched] = useState(false);
    const [friendInfo,setFriendInfo] =useState();
    const [deleteInfo, setDeleteInfo] = useState();
    const switchs = () => {
        setChatSwitch({left:"-610px"})
        setChatBtnSwitch({ left: "-85px"});
    };
    const switchsBack = () => {
      setChatSwitch({ left: "0px"});
      setChatBtnSwitch({ left: "5px" });
    };

    const showInfo = () =>{
      setFriendInfo({width: "506px"})
    }
    const closeInfo = () => {
      setFriendInfo({ width: "70px"});
    };

    const deleteAlert = () =>{
      setDeleteInfo({ width: "506px" });
    }
    const cancelDeleteAlert = () => {
      setDeleteInfo({ width: "70px" });
    };
      return (
        <div className="chatBody">
          <div className="chatLeft">
            <div className="chatLeftIn" style={chatBtnSwitch}>
              <div className="backOut" onClick={switchsBack}>
                <img src={testIcon} alt="logo" className="icon"></img>
              </div>
              <div className="backOut" onClick={switchsBack}>
                <img src={Back} alt="logo" className="back"></img>
              </div>
            </div>
          </div>
          <div className="chat">
            <div className="cover2">
              <img src={LogoPure} alt="logo" className="logoBig"></img>
            </div>
            <div className="chatSwitch" style={chatSwitch}>
              <div className="chatSwitchLeft">
                <div className="listSwitch">
                  <div className="backOut2">
                    <img src={User} alt="logo" className="back"></img>
                  </div>
                  <div className="backOut2"></div>
                </div>
                <div className="friendLists">
                  <div className="searchContainer">
                    <div className="searchIcon">
                      <img src={Search} alt="logo" className="icon2"></img>
                    </div>
                    <input className="searchInput"></input>
                    <div className="waitLine"></div>
                  </div>
                  <div className="friendList">
                    <div className="friendIcon">
                      <img
                        src={testIcon}
                        alt="logo"
                        className="icon"
                        onClick={switchs}
                      ></img>
                      <img
                        src={Info}
                        alt="logo"
                        className="icon showBtn"
                        onClick={showInfo}
                      ></img>
                    </div>
                    <div className="friendNameAndWord">
                      <div className="friendName">chika</div>
                      <div className="friendWord">cafafasfsafafhika</div>
                    </div>
                    <div className="friendInfo" style={friendInfo}>
                      <img
                        src={Close}
                        alt="logo"
                        className="icon showBtn"
                        onClick={closeInfo}
                      ></img>
                      <div className="friendNameAndWord">
                        <div className="friendName friendName2">
                          ID: 2104569
                        </div>
                        <div className="friendName friendName3">chika</div>
                      </div>
                      <div className="imgBorder btn01">
                        <img
                          src={Star}
                          alt="logo"
                          className="icon  icon02 "
                        ></img>
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
                        Sure to delete Chika?
                      </div>
                      <div className="imgBorder whireBorder btn03">
                        <img
                          src={Tick}
                          alt="logo"
                          className="icon  icon02 "
                        ></img>
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
                  <div className="friendList">
                    <div className="friendIcon">
                      <img src={testIcon} alt="logo" className="icon"></img>
                    </div>
                    <div className="friendNameAndWord">
                      <div className="friendName">chika</div>
                      <div className="friendWord">cafafasfsafafhika</div>
                    </div>
                  </div>
                  <div className="friendList">
                    <div className="friendIcon">
                      <img src={testIcon} alt="logo" className="icon"></img>
                    </div>
                    <div className="friendNameAndWord">
                      <div className="friendName">chika</div>
                      <div className="friendWord">cafafasfsafafhika</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chatSwitchRight">
                <div className="chatbox"></div>
                <div className="chatInputContiner">
                  <div className="loginInputName">username</div>
                  <input className="loginInput"></input>
                </div>
                <div className="chatSubmitContiner">
                  <div className="loginInputName">username</div>
                  <input className="loginInput"></input>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default Chat;