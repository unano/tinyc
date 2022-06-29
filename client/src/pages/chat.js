import { useState, useEffect, useRef, useContext } from "react";
import "./chat.scss";
import Back from "../imgs/back2.png";
import AddFriend from "../imgs/addFriend.png";
import Settings from "../imgs/settings.png";
import { useNavigate } from "react-router-dom";
import {
  getFriendsAPI,
  searchUserAPI,
  applyFriendsAPI,
  sendMsgAPI,
  getChatsAPI,
  getMsgsAPI,
} from "../api/api";
import Chats from "../components/chats";
import Messages from "../components/messages";
import io from "socket.io-client";
import NewMsgs from "../components/newMsgs";
import { AuthContext } from "../contexts/authContext";
import { BiSearch } from "react-icons/bi";
import { GrSend } from "react-icons/gr";
import { BsEmojiHeartEyes } from "react-icons/bs";
import Picker from "emoji-picker-react";
import NavBar from '../components/navBar'

const ENDPOINT = "http://localhost:8080";
var socket, selectedChatCompare;

function Chat() {
  const [chatSwitch, setChatSwitch] = useState();
  const [chatBtnSwitch, setChatBtnSwitch] = useState();
  const [friends, setFriends] = useState([]);
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
  const scrollRef = useRef();
  const inputRef = useRef();
  const [chats, setChats] = useState([]);
  const [socketConnected, setScoketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState([]);
  // const [shownchats, setShownChats] = useState([]);
  const [reFetch, setReFetch] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState();

  const { currentUser } = useContext(AuthContext);
  console.log(currentChat)

  useEffect(() => {
    socket = io(ENDPOINT);
    if (currentUser._id) {
      socket.emit("setup", currentUser);
      socket.on("connected", () => {
        setScoketConnected(true);
      });
      socket.on("typingBro", () => setIsTyping(true));
      socket.on("stop typingBro", () => setIsTyping(false));
    }
  }, [currentUser]);

  useEffect(() => {
    const scrollHeight = scrollRef.current.scrollHeight;
    const height = scrollRef.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    scrollRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }, [messages]);

  useEffect(() => {
    inputRef.current.style.height = "inherit";
    const scrollHeight = inputRef.current.scrollHeight;
    inputRef.current.style.height = scrollHeight + "px";
  }, [msg]);

  useEffect(() => {
    setSearchedUser({});
    setHasSearchedUser(false);
  }, [noUser]);

  useEffect(() => {
    const getFriendsFunc = async () => {
      if (currentUser) {
        let friendList = await getFriendsAPI(currentUser._id);
        let { friends } = friendList.data;
        setFriends(friends);
        setShownFriends(friends);
      }
    };
    getFriendsFunc();
  }, [currentUser]);

  useEffect(() => {
    const getFriendsFunc = async () => {
      if (currentUser) {
        let chatsList = await getChatsAPI(currentUser._id);
        let chats = chatsList.data;
        setChats(chats);
        // setShownChats(chats);
      }
    };
    getFriendsFunc();
  }, [currentUser]);
  useEffect(() => {
    socket.on("message received", (newMsgReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare !== newMsgReceived.chat._id
      ) {
        if (!notification.includes(newMsgReceived)) {
          setNotification([newMsgReceived, ...notification]);
          setTimeout(() => {
            let arr = [...notification];
            arr.shift();
            setNotification(arr);
          }, 4000);
          setReFetch(!reFetch);
        }
      } else {
        setMessages([...messages, newMsgReceived]);
      }
    });
  });

  const switchs = async (index, currentChatUser) => {
    setCurrentChat(index);
    setCurrentChatUser(currentChatUser);
    const response = await getMsgsAPI(index);
    setMessages(response.data);
    socket.emit("join chat", index);
    setChatSwitch({ left: "-100%" });
    setChatBtnSwitch({ left: "-85px" });
    selectedChatCompare = index;
  };
  const switchsBack = () => {
    setChatSwitch({ left: "0px" });
    setChatBtnSwitch({ left: "5px" });
  };

  const setInput = (input) => {
    setSearchIput(input);
    let filtered = friends.filter((friend) => {
      return friend.username.match(input);
    });
    setShownFriends(filtered);
    if (filtered.length === 0) {
      setNoUser(true);
    }
    if (filtered.length !== 0) {
      setNoUser(false);
    }
  };

  const searchInputUser = async () => {
    let user = await searchUserAPI(searchInput);
    if (user) {
      setSearchedUser(user.data.user);
    }
    setHasSearchedUser(true);
  };

  const applyFriend = async () => {
    let apply = await applyFriendsAPI(currentUser._id, searchedUser._id);
    let msg = apply.data.msg;
    if (msg) setApplyResult(msg);
  };

  const handleType = (e) => {
    setMsg(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", currentChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 2000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", currentChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const sendChat = async () => {
    if (msg.length > 0) {
      const { data } = await sendMsgAPI(currentUser._id, msg, currentChat._id);
      socket.emit("stop typing", currentChat._id);
      console.log(data);
      socket.emit("new message", data);
      // const msgs = [...messages];
      // msgs.push({ sender: {_id:currentUser._id}, message: msg });
      setMessages([...messages, data]);
      setMsg("");
    }
  };

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleEmojiPickerhideShow = () => {
      setShowEmojiPicker(!showEmojiPicker);
    };

      const handleEmojiClick = (event, emojiObject) => {
        let message = msg;
        message += emojiObject.emoji;
        setMsg(message);
      };



  const navigateToUser = () => {
    navigate("/user");
  };
  return (
    <div className="chatContainer">
      <div className="chatBody">
        {/* <button onClick={submitAvatar}>dd</button> */}
        <div className="chatLeft">
          <div className="chatLeftIcon">
            <div className="chatLeftIn" style={chatBtnSwitch}>
              <div className="backOut" onClick={switchsBack}>
                <img
                  src={
                    currentUser.avatarImage
                      ? require(`../images/${currentUser.avatarImage}`)
                      : require(`../images/default.png`)
                  }
                  alt="logo"
                  className="icon"
                  onClick={navigateToUser}
                ></img>
              </div>
              <div className="backOut" onClick={switchsBack}>
                <img src={Back} alt="logo" className="back"></img>
              </div>
            </div>
          </div>
          <div className="chatLeftIcon">
            <div className="backOut borderBackout" onClick={switchsBack}>
              <img src={Settings} alt="logo" className="back rotate"></img>
            </div>
          </div>
          <NewMsgs newMsgs={notification} />
        </div>
        <div className="chat">
          {/* <Cover /> */}
          <div className="chatSwitch" style={chatSwitch}>
            <div className="chatSwitchLeft">
              <NavBar />
              <div className="friendLists">
                <div className="searchContainer">
                  <BiSearch className="searchIcon" />
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
                              src={searchedUser.avatarImage}
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
                {/* <FriendList friends={shownFriends} switchs={switchs} /> */}
                <Chats chats={chats} switchs={switchs} />
              </div>
            </div>
            <div className="chatSwitchRight">
              <div className="currentChatName">
                {currentChat.isGroupChat
                  ? currentChat.chatName
                  : currentChatUser}
              </div>
              <div className="chatbox" ref={scrollRef}>
                <Messages messages={messages} />
              </div>
              {isTyping ? <div>The other side is typing...</div> : <></>}
              {showEmojiPicker && (
                <div className="emojiPickerContainer">
                  <Picker
                    onEmojiClick={handleEmojiClick}
                    pickerStyle={{
                      boxShasow: "none",
                      border: "1px solid black",
                      animation: "showEmojis 0.3s linear",
                    }}
                  />
                </div>
              )}
              <div className="chatInputContiner">
                <BsEmojiHeartEyes
                  className="openEmoji"
                  onClick={handleEmojiPickerhideShow}
                />
                <textarea
                  rows="1"
                  ref={inputRef}
                  className="chatInput"
                  style={chatInputStyle}
                  onChange={handleType}
                  value={msg}
                ></textarea>
              </div>
              <div className="chatSubmitContiner" onClick={sendChat}>
                  <GrSend className="sendIcon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
