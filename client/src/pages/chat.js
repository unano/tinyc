import { useState, useEffect, useRef, useContext } from "react";
import "./chat.scss";
import Back from "../imgs/back2.png";
import AddFriend from "../imgs/addFriend.png";
import Settings from "../imgs/settings.png";
import { useNavigate } from "react-router-dom";
import {
  searchUserAPI,
  applyFriendsAPI,
  sendMsgAPI,
  getChatsAPI,
  getMsgsAPI,
  removeGroupUserAPI,
} from "../api/api";
import Chats from "../components/chats";
import Messages from "../components/messages";
import io from "socket.io-client";
import NewMsgs from "../components/newMsgs";
import { AuthContext } from "../contexts/authContext";
import { BiSearch } from "react-icons/bi";
import { GrSend } from "react-icons/gr";
import { IoRemoveCircleSharp, IoAddOutline } from "react-icons/io5";
import { BsEmojiHeartEyes } from "react-icons/bs";
import { BiLeftArrow } from "react-icons/bi";
import Picker from "emoji-picker-react";
import NavBar from "../components/navBar";
import AddChatFriend from "../components/addChatFriend";

const ENDPOINT = "http://localhost:8080";
var socket, selectedChatCompare;

function Chat() {
  const [chatSwitch, setChatSwitch] = useState();
  const [chatBtnSwitch, setChatBtnSwitch] = useState();
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
  const scrollRefOut = useRef();
  const scrollRef = useRef();
  const inputRef = useRef();
  const [chats, setChats] = useState([]);
  const [shownChats, setShownChats] = useState([]);
  const [socketConnected, setScoketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState([]);
  const [showAddFriends, setShowAddFriends] = useState(false);

  const [currentChatUsername, setCurrentChatUsername] = useState();
  const [currentChatUserAvatar, setCurrentChatUserAvatar] = useState();
  const [refresh, setRefresh] = useState(false);

  const [rightBarStyle, setRightBarStyle] = useState({});
  const [left, setLeft] = useState(false);
  const stretchStyle = { right: "-1%" };
  const inStyle = { right: "-16.2%" };

  const { currentUser } = useContext(AuthContext);


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
    if(!left){
      const scrollHeight = scrollRefOut.current.scrollHeight;
      const height = scrollRefOut.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      scrollRefOut.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [messages]);

    useEffect(() => {
      if(left)
      scrollRef.current?.scrollIntoView({
        behavior: "smooth"
      });
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
    const getChatsFunc = async () => {
      if (currentUser) {
        let chatsList = await getChatsAPI(currentUser._id);
        let chats = chatsList.data;
        let sortedChat = chats.sort((a,b)=>{
          let aDate0 = new Date(a.latestMessage.createdAt);
          let bDate0 = new Date(b.latestMessage.createdAt);
          let aDate = aDate0.getTime()
          let bDate = bDate0.getTime();
          return bDate - aDate;
        })
        setChats(sortedChat);
        setShownChats(sortedChat);
      }
    };
    getChatsFunc();
  }, [currentUser, refresh]);
  useEffect(() => {
    socket.on("message received", (newMsgReceived) => {
      setRefresh(!refresh);
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
        }
      } else {
        setMessages([...messages, newMsgReceived]);
      }
    });
  });

  const switchs = async (index, currentChatUsername, currentChatAvatar) => {
    setCurrentChat(index);
    setCurrentChatUsername(currentChatUsername);
    setCurrentChatUserAvatar(currentChatAvatar);
    const response = await getMsgsAPI(index);
    setMessages(response.data);
    socket.emit("join chat", index);
    selectedChatCompare = index;

    setChatSwitch({ left: "-100%" });
    setChatBtnSwitch({ left: "-85px" });
    setTimeout(()=>{
      setLeft(true);
    },1000)
  };
  const switchsBack = () => {
    setLeft(false);
    setRightBarStyle(inStyle);
    setRefresh(!refresh);
    setShowAddFriends(false);
    setChatSwitch({ left: "0px" });
    setChatBtnSwitch({ left: "5px" });
  };

  const setInput = (input) => {
    setSearchIput(input);
    let filtered = chats.filter((chat) => {
      if(chat.isGroupChat) return chat.chatName.match(input);
      else return chat.users
        .filter((user) => user._id !== currentUser._id)[0].username
        .match(input);
    });
    setShownChats(filtered);
    // setShownFriends(filtered);
    // if (filtered.length === 0) {
    //   setNoUser(true);
    // }
    // if (filtered.length !== 0) {
    //   setNoUser(false);
    // }
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

  const setStretch = () => {
    if (rightBarStyle.right !== stretchStyle.right)
      setRightBarStyle(stretchStyle);
    else setRightBarStyle(inStyle);
  };

  const removeUser = async (user) => {
    let result = await removeGroupUserAPI(currentChat._id, user._id);
    if (result) {
      setCurrentChat(result.data);
    }
  };

  const AddFriendsToChat = (value) => {
    setShowAddFriends(value);
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
              <div className="backOut">
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
            <div className="backOut borderBackout">
              <img src={Settings} alt="logo" className="back rotate"></img>
            </div>
          </div>
          <NewMsgs newMsgs={notification} />
        </div>
        <div className="chat">
          <div className="chatOverflow">
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
                  <Chats chats={shownChats} switchs={switchs} />
                </div>
              </div>
              <div className="chatSwitchRight">
                {currentChat.isGroupChat && (
                  <div className="rightBar" style={rightBarStyle}>
                    <div className="rightBarInside">
                      <div className="stretchBtn" onClick={setStretch}>
                        <BiLeftArrow />
                      </div>
                      {currentChat.users &&
                        currentChat.users.map((user) => {
                          return (
                            <div className="chatUser" key={user._id}>
                              <img
                                src={
                                  user.avatarImage
                                    ? require(`../images/${user.avatarImage}`)
                                    : require(`../images/default.png`)
                                }
                                alt="logo"
                                className="icon"
                              ></img>
                              <div className="chatUsername">
                                {user.username}
                              </div>
                              {currentChat.groupAdmin._id === currentUser._id &&
                                user._id !== currentUser._id && (
                                  <IoRemoveCircleSharp
                                    className="removeGroupMate"
                                    onClick={() => removeUser(user)}
                                  />
                                )}
                            </div>
                          );
                        })}
                      {currentChat.groupAdmin._id === currentUser._id && (
                        <div className="newGroupMate">
                          <IoAddOutline
                            onClick={() => setShowAddFriends(true)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="chatInfo">
                  <img
                    src={
                      currentChat.isGroupChat
                        ? currentChat.avatar
                          ? require(`../images/${currentChat.avatar}`)
                          : require(`../images/defaultGroup.png`)
                        : currentChatUserAvatar
                        ? require(`../images/${currentChatUserAvatar}`)
                        : require(`../images/default.png`)
                    }
                    alt="logo"
                    className="chatAvatar"
                    onClick={navigateToUser}
                  ></img>
                  <div className="currentChatName">
                    {currentChat.isGroupChat
                      ? currentChat.chatName
                      : currentChatUsername}
                  </div>
                </div>
                <div className="chatbox" ref={scrollRefOut}>
                  <Messages messages={messages} scrollRef={scrollRef} />
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
          {currentChat._id && showAddFriends && (
            <div className="findFriends">
              <AddChatFriend
                currentChat={currentChat}
                showGPAddFriends={AddFriendsToChat}
                setCurrentChat={setCurrentChat}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
