import { useState, useEffect } from 'react';
import './chat.css';
import Back from "./imgs/back2.png"
import Search from "./imgs/search.png";
import testIcon from "./imgs/testIcon.jpg";
import LogoPure from "./imgs/tinycPure.png";
import User from "./imgs/user.png";
import { useNavigate } from "react-router-dom";
import { getFriends } from "./api/api";
import FriendList from './components/friendList';
function Chat() {
    const [chatSwitch, setChatSwitch] = useState();
    const [chatBtnSwitch, setChatBtnSwitch] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [friends, setFriends] =useState([]);
    const [switched, setSwitched] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
      const result = async () => {
        if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
          navigate("/login");
        } else {
          setCurrentUser(
            await JSON.parse(
              localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            )
          );
        }
      }
      result();
      }, []);

    useEffect(()=>{
      const getFriendsFunc = async () => {
        if(currentUser){
          let friendList = await getFriends(currentUser._id);
          let { friends }  =friendList.data;
          setFriends(friends);
        }
      }
      getFriendsFunc();
    },[currentUser])

    const switchs = () => {
        setChatSwitch({left:"-610px"})
        setChatBtnSwitch({ left: "-85px"});
    };
    const switchsBack = () => {
      setChatSwitch({ left: "0px"});
      setChatBtnSwitch({ left: "5px" });
    };

    const setInput = (input) =>{
      console.log(input);
    }
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
                    <input
                      className="searchInput"
                      onChange={(e) => setInput(e.target.value)}
                    ></input>
                    <div className="waitLine"></div>
                  </div>
                  <FriendList friends={friends} switchs={switchs} />
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