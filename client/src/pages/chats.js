import { useState, useEffect, useRef, useContext } from "react";
import "./chats.scss";
import "./common.scss";
import { useNavigate } from "react-router-dom";
import {
  sendMsgAPI,
  getChatsAPI,
  getMsgsAPI,
  removeGroupUserAPI,
  setOnlineAPI,
  setOfflineAPI,
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
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import Picker from "emoji-picker-react";
import NavBar from "../components/navBar";
import AddChatFriend from "../components/addChatFriend";
import { useBeforeunload } from "react-beforeunload";
import LoadingBar from "../components/loadingBar";
import LeftArea from "../components/leftArea";
import Logo from "../imgs/tinyc.png";
import { userAvatarHandler, groupAvatarHandler } from "../functions";

const ENDPOINT = "http://localhost:8080";
//"https://tinyc-chat-app.herokuapp.com";
var socket, selectedChatCompare;

function Chat() {
  //该界面分左右区域，左边显示登陆用户的所有聊天，点击一个聊天自动切换至右边聊天区域，聊天区域有返回按钮返回至左边

  const navigate = useNavigate();
  const scrollRefOut = useRef();
  const scrollRef = useRef();
  const inputRef = useRef();
  const [chatSwitch, setChatSwitch] = useState(); //切换聊天页面的左右
  const [chatBtnSwitch, setChatBtnSwitch] = useState(); //聊天页面切换时按钮同时切换
  const [msg, setMsg] = useState(""); //用户输入框输入的内容
  const [messages, setMessages] = useState([]); //聊天界面的所有聊天内容
  const [currentChat, setCurrentChat] = useState({}); //当前聊天
  const [chats, setChats] = useState([]); //用户加入的所有聊天
  const [shownChats, setShownChats] = useState([]); //显示在界面的聊天
  const [socketConnected, setScoketConnected] = useState(false);
  const [typing, setTyping] = useState(false); //监测自己是否在打字，用于提示socket
  const [isTyping, setIsTyping] = useState(false); //监测聊天对方是否在打字
  const [notification, setNotification] = useState([]); //自己在和其他人聊天时用于提示其他聊天的新消息
  const [showAddFriends, setShowAddFriends] = useState(false); //群管理员用于添加新用户

  const [currentChatUsername, setCurrentChatUsername] = useState(); //当前群名/当前聊天对象名字
  const [currentChatUserAvatar, setCurrentChatUserAvatar] = useState(); //当前群头像/当前聊天对象头像
  const [refresh, setRefresh] = useState(false); //用于刷新更新内容
  const [noChat, setNoChat] = useState(false); //当前页面是否显示聊天

  const [right, setRight] = useState(false); //当前在聊天页面左侧还是右侧
  const [stretchBar, setStretchBar] = useState(false); // 是否展开聊天界面右边的用户栏

  const { currentUser } = useContext(AuthContext);

  //页面被关闭时触发登出
  useBeforeunload(async () => {
    await setOfflineAPI();
  });

  //socket 初始化及检测聊天对象是否在输入
  useEffect(() => {
    socket = io(ENDPOINT);
    if (currentUser._id) {
      socket.emit("setup", currentUser._id);
      socket.on("connected", () => {
        setOnlineAPI();
        setRefresh(!refresh);
        setScoketConnected(true);
      });
      socket.on("typingBro", () => setIsTyping(true));
      socket.on("stop typingBro", () => setIsTyping(false));
    }
  }, [currentUser]);

  //切换到右侧时滑动至消息最底部
  useEffect(() => {
    if (!right) {
      const scrollHeight = scrollRefOut.current.scrollHeight;
      const height = scrollRefOut.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      scrollRefOut.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [messages]);

  //发送聊天消息滑动至底部（smooth）
  useEffect(() => {
    if (right)
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
      });
  }, [messages]);

  //根据用户输入改变输入框高度
  useEffect(() => {
    inputRef.current.style.height = "inherit";
    const scrollHeight = inputRef.current.scrollHeight;
    inputRef.current.style.height = scrollHeight + "px";
  }, [msg]);

  useEffect(() => {
    // 获取用户所有聊天
    const getChatsFunc = async () => {
      if (currentUser._id) {
        let chatsList = await getChatsAPI();
        let chats = chatsList.data;
        if (chats.length === 0) setNoChat(true);
        else setNoChat(false);
        //根据最新消息时间排序
        let sortedChat = chats.sort((a, b) => {
          let aDate0 = new Date(a.latestMessage.createdAt);
          let bDate0 = new Date(b.latestMessage.createdAt);
          let aDate = aDate0.getTime();
          let bDate = bDate0.getTime();
          return bDate - aDate;
        });
        setChats(sortedChat);
        setShownChats(sortedChat);
      }
    };
    getChatsFunc();
  }, [currentUser, refresh]);
  useEffect(() => {
    //接收消息时刷新
    socket.on("message received", (newMsgReceived) => {
      setRefresh(!refresh);
      //判断接收的消息是否时当天聊天界面的消息，是则直接在当前界面显示，不是则当作新消息提醒在侧边显示
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMsgReceived.chat._id
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

  //左右区域切换
  const switchs = async (index, currentChatUsername, currentChatAvatar) => {
    //点击一个聊天后首先标记当天选择的聊天，之后更新当天聊天的名字和头像
    setCurrentChat(index);
    setCurrentChatUsername(currentChatUsername);
    setCurrentChatUserAvatar(currentChatAvatar);
    //根据选择获取聊天内容
    const response = await getMsgsAPI(index._id);
    setMessages(response.data);
    //socket加入聊天标记room
    socket.emit("join chat", index._id);
    selectedChatCompare = index;

    //切换至右侧聊天
    setChatSwitch({ left: "-100%" });
    setChatBtnSwitch({ left: "-85px" });
    setTimeout(() => {
      setRight(true);
    }, 1000);
  };

  //切换回左侧，*清空输入框内容
  const switchsBack = () => {
    setRight(false);
    setStretchBar(false);
    setRefresh(!refresh);
    setShowAddFriends(false);
    setChatSwitch({ left: "0px" });
    setChatBtnSwitch({ left: "5px" });
    setMsg("");
  };

  //根据用户搜索显示过滤后的聊天
  const setInput = (input) => {
    let filtered = chats.filter((chat) => {
      if (chat.isGroupChat) return chat.chatName.match(input);
      else
        return chat.users
          .filter((user) => user._id !== currentUser._id)[0]
          .username.match(input);
    });
    setShownChats(filtered);
  };

  //向socket发送自己是否正在打字，自己是否已经停止打字(仅私人聊天)
  const handleType = (e) => {
    setMsg(e.target.value);
    if (!socketConnected) return;
    if (!currentChat.isGroupChat) {
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
    }
  };

  //发送输入框的内容，向socket发送停止打字的信号和输入框的内容，清空输入框
  const sendChat = async () => {
    if (msg.length > 0) {
      const { data } = await sendMsgAPI(msg, currentChat._id);
      socket.emit("stop typing", currentChat._id);
      socket.emit("new message", data);
      // const msgs = [...messages];
      // msgs.push({ sender: {_id:currentUser._id}, message: msg });
      setMessages([...messages, data]);
      setMsg("");
    }
  };
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); //是否展现emoji选择器

  //控制emoji选择器的展示与隐藏
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  //往输入框添加选择的emoji
  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  //删除群成员
  const removeUser = async (user) => {
    let result = await removeGroupUserAPI(currentChat._id, user._id);
    if (result) {
      setCurrentChat(result.data);
    }
  };

  //添加群成员
  const AddFriendsToChat = (value) => {
    setShowAddFriends(value);
  };

  const navigateToUser = () => {
    navigate("/user");
  };

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      sendChat();
    }
  };

  return (
    <div className="chatContainer">
      <img src={Logo} alt="logo" className="logo"></img>
      <div className="chatBody">
        {/* <button onClick={submitAvatar}>dd</button> */}
        <div className="chatLeft">
          <LeftArea
            ischat={true}
            chatBtnSwitch={chatBtnSwitch}
            switchsBack={switchsBack}
          />
          <NewMsgs newMsgs={notification} />
        </div>

        {/* 右侧  */}
        <div className="chat">
          <div className="chatOverflow">
            {/* <Cover /> */}
            <div className="chatSwitch" style={chatSwitch}>
              <div className="chatSwitchLeft">
                <NavBar />
                <div className="friendLists">
                  {/* 聊天搜索  */}
                  <div className="searchContainer">
                    <BiSearch className="searchIcon" />
                    <input
                      className="searchInput"
                      onChange={(e) => setInput(e.target.value)}
                    ></input>
                  </div>
                  {/* loading  */}
                  <div className="loadingContainer">
                    {!chats.length && !noChat && <LoadingBar />}
                  </div>
                  {/* <FriendList friends={shownFriends} switchs={switchs} /> */}
                  <Chats chats={shownChats} switchs={switchs} right={right} />
                </div>
              </div>
              <div className="chatSwitchRight">
                {/*  此处是群组聊天才会有的侧边栏，显示群员，管理员可在此添加删除用户 */}
                {currentChat.isGroupChat && (
                  <div
                    className={
                      stretchBar ? "rightBar rightBarExpand" : "rightBar"
                    }
                  >
                    <div className="rightBarInside">
                      <div
                        className="stretchBtn"
                        onClick={() => setStretchBar(!stretchBar)}
                      >
                        {stretchBar ? <BiRightArrow /> : <BiLeftArrow />}
                      </div>
                      {currentChat.users &&
                        currentChat.users.map((user) => {
                          return (
                            <div className="chatUser" key={user._id}>
                              <img
                                src={userAvatarHandler(user.avatarImage)}
                                alt="logo"
                                className="icon"
                              ></img>
                              <div className="chatUsername">
                                {user.username}
                              </div>
                              {/* 如果是管理员则显示删除群员的按钮 */}
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
                      {/* 如果是管理员则显示打开添加群员区域的按钮 */}
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
                {/* 当前聊天的头像（群头像或用户头像）以及聊天名(群名或用户名）*/}
                <div className="chatInfo">
                  <img
                    src={
                      currentChat.isGroupChat
                        ? groupAvatarHandler(currentChat.avatar)
                        : userAvatarHandler(currentChatUserAvatar)
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
                {/*   聊天内容  */}
                <div className="chatbox" ref={scrollRefOut}>
                  <Messages messages={messages} scrollRef={scrollRef} />
                </div>
                {/*   EmojiPicke   */}
                {showEmojiPicker && (
                  <div className="emojiPickerContainer">
                    <Picker
                      onEmojiClick={handleEmojiClick}
                      pickerStyle={{
                        boxShasow: "none",
                        border: "1px solid silver",
                        animation: "showEmojis 0.3s linear",
                      }}
                    />
                  </div>
                )}
                {/*  聊天输入框，以及提示对方是否在输入（仅私人聊天） */}
                <div className="chatInputSubmitContainer">
                  {isTyping && (
                    <div className="isTyping">The other side is typing...</div>
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
                      onChange={handleType}
                      value={msg}
                      onKeyDown={onEnterPress}
                    ></textarea>
                  </div>
                  <div className="chatSubmitContiner" onClick={sendChat}>
                    <GrSend className="sendIcon" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 如果是管理员且打开该区域的状态为true则显示添加群员区域 */}
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
