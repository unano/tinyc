import { useState, useEffect, useRef } from 'react';
import './chat.css';
import Back from "../imgs/back2.png"
import Search from "../imgs/search.png";
import AddFriend from "../imgs/addFriend.png";
import testIcon from "../imgs/testIcon.jpg";
import LogoPure from "../imgs/tinycPure.png";
import User from "../imgs/user.png";
import { useNavigate } from "react-router-dom";
import { getFriends, searchUser, applyFriends, receiveMsg, sendMsg } from "../api/api";
import FriendList from '../components/friendList';
import Messages from "../components/messages";
function Chat() {
    const [chatSwitch, setChatSwitch] = useState();
    const [chatBtnSwitch, setChatBtnSwitch] = useState();
    const [currentUser, setCurrentUser] = useState({});
    const [friends, setFriends] =useState([]);
    const [shownFriends, setShownFriends] = useState([]);
    const [switched, setSwitched] = useState(false);
    const [noUser, setNoUser] = useState(false);
    const [chatInputStyle, setChatInputStyle] = useState({});
    const [searchInput, setSearchIput] = useState();
    const [searchedUser, setSearchedUser] = useState({});
    const [hasSearchedUser, setHasSearchedUser] = useState(false);
    const [applyResult, setApplyResult] = useState();
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();
    const [currentChat, setCurrentChat] = useState({});

    useEffect(() => {
      const loadChat = async()=>{
        const response = await receiveMsg(currentUser._id, currentChat._id);
        setMessages(response.data);
      }
      loadChat();
      }, [currentChat]);
      


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
      setSearchedUser({});
      setHasSearchedUser(false);
    },[noUser])

    useEffect(()=>{
      const getFriendsFunc = async () => {
        if(currentUser){
          let friendList = await getFriends(currentUser._id);
          let { friends }  =friendList.data;
          setFriends(friends);
          setShownFriends(friends);
        }
      }
      getFriendsFunc();
    },[currentUser])

    const switchs = (index) => {
        setCurrentChat(index);
        setChatSwitch({left:"-610px"})
        setChatBtnSwitch({ left: "-85px"});
    };
    const switchsBack = () => {
      setChatSwitch({ left: "0px"});
      setChatBtnSwitch({ left: "5px" });
    };

    const expandInputbox = () =>{
      chatInputStyle.height === "300px"
        ? setChatInputStyle({ height: "40px" })
        : setChatInputStyle({ height: "300px" });
    }

    const setInput = (input) =>{
      setSearchIput(input);
      let filtered = friends.filter((friend)=>{
        return friend.username.match(input)
      });
      setShownFriends(filtered);
      if(filtered.length===0){
        setNoUser(true);
      }
      if (filtered.length !== 0) {
        setNoUser(false);
      }
    }

    const searchInputUser = async() =>{
      let user = await searchUser(searchInput);
      if(user) {
        setSearchedUser(user.data.user);
      }
      setHasSearchedUser(true);
    }

    const applyFriend = async()=>{
      let apply = await applyFriends(currentUser._id,searchedUser._id);
      let msg = apply.data.msg;
      if (msg) setApplyResult(msg);
    }

    // const inputAreaRef = useRef();
    // useEffect(()=>{
    //   console.log(inputAreaRef.current.scrollHeight);
    //   inputAreaRef.current.scrollTop = 40;
    // })

    const sendChat = async() => {
      if (msg.length > 0) {
        await sendMsg(currentUser._id, currentChat._id, msg);
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
        setMsg("");
      }
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
                    <input
                      className="searchInput"
                      onChange={(e) => setInput(e.target.value)}
                    ></input>
                    <div className="waitLine"></div>
                  </div>
                  {noUser ? (
                    <div className="searchNewFriend">
                      no such friend,
                      <span className="searchUser" onClick={searchInputUser}>
                        <b> search the use with this name</b>
                      </span>
                      {hasSearchedUser ? (
                        searchedUser ? (
                          <div className="searchedUser">
                            <div className="searchFriendIcon inline">
                              <img
                                src={testIcon}
                                alt="logo"
                                className="icon"
                              ></img>
                            </div>
                            <div className="searchedUsername inline">
                              {searchedUser.username}
                            </div>
                            <div className="addFriendIcon inline fright">
                              <img
                                src={AddFriend}
                                alt="logo"
                                className="icon"
                                onClick={applyFriend}
                              ></img>
                            </div>
                            <div className="searchedUsername inline smallName fright">
                              {applyResult}
                            </div>
                          </div>
                        ) : (
                          <div className="searchedUser">
                            <div>No such user</div>
                          </div>
                        )
                      ) : null}
                    </div>
                  ) : null}
                  <FriendList friends={shownFriends} switchs={switchs} />
                </div>
              </div>
              <div className="chatSwitchRight">
                <div className="chatbox">
                  <Messages messages={messages}/>
                </div>
                <div className="chatInputContiner">
                  <div
                    // ref={inputAreaRef}
                    className="chatInputName"
                    onClick={expandInputbox}
                  ></div>
                  <textarea
                    className="chatInput"
                    style={chatInputStyle}
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                  ></textarea>
                </div>
                <div className="chatSubmitContiner" onClick={sendChat}>
                  <div className="chatInputName"></div>
                  <input className="chatInput"></input>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default Chat;