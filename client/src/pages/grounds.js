import { useState, useEffect, useContext } from "react";
import { getAllGroupChatAPI, applyGroupChatJoinAPI } from "../api/api";
import { AuthContext } from "../contexts/authContext";
import LeftIcons from "../components/leftArea";
import LoadingBar from "../components/loadingBar";
import NavBar from "../components/navBar";
import { BiSearch } from "react-icons/bi";
import './grounds.scss'
import {useNavigate} from "react-router-dom"
const NewGroup = () => {
    const [chats, setChats] = useState([]);
    const [shownChats, setShownChats] = useState();
    const [searchInput, setSearchIput] = useState();
    const { currentUser } = useContext(AuthContext);
    const [isApplying, setIsApplying] = useState(false);
    const shownLength = 4;
    useEffect(()=>{
        const getChats = async() =>{
            const chats = await getAllGroupChatAPI();
            setChats(chats.data);
        }
        getChats();
    },[currentUser])

      const setInput = (input) => {
        setSearchIput(input);
        let filtered = chats.filter((friend) => {
          return friend.username.match(input);
        });
        setShownChats(filtered);
      };
    const apply = async (chatId) =>{
      const result = await applyGroupChatJoinAPI(currentUser._id, chatId);
      if(result){
         setIsApplying(true);
      }
    }

      const navigate = useNavigate();

      const navigates = (chatId) => {
        navigate(`/chat/${chatId}`);
      };

    return (
      <>
        <div className="chatContainer">
          <div className="chatBody">
            {/* <button onClick={submitAvatar}>dd</button> */}
            <div className="chatLeft">
              <LeftIcons />
            </div>
            <div className="chat">
              {/* <Cover /> */}
              <div className="chatSwitchLeft">
                <NavBar />
                <div className="friendLists">
                  <div className="searchContainer">
                    <BiSearch className="searchIcon" />
                    <input
                      className="searchInput"
                      onChange={(e) => setInput(e.target.value)}
                    ></input>
                  </div>
                  <div className="loadingContainer">
                    {!chats.length && <LoadingBar />}
                  </div>
                  <div className="grounds">
                    {chats &&
                      chats.map((chat) => {
                        return (
                          <>
                            <div className="GPchat">
                              <div className="GPchatIn">
                                {chat.background && (
                                  <img
                                    src={require(`../images/background/${chat.background}`)}
                                    alt="logo"
                                    className="backgroundPic"
                                  ></img>
                                )}
                                <div className="transparentCover"></div>
                                <div className="gpContent">
                                  <div className="flex">
                                    <img
                                      src={require(`../images/${chat.avatar}`)}
                                      alt="avatar"
                                      className="gpAvatar"
                                      onClick={()=>navigates(chat._id)}
                                    ></img>
                                    <div onClick={() =>navigates(chat._id)}>
                                      {chat.chatName}
                                    </div>
                                  </div>
                                  <div className="groupMembers">
                                    {chat.users
                                      .slice(0, shownLength)
                                      .map((user) => {
                                        return (
                                          <div className="avatarContainer">
                                            <img
                                              src={
                                                user.avatarImage
                                                  ? require(`../images/${user.avatarImage}`)
                                                  : require(`../images/default.png`)
                                              }
                                              alt="logo"
                                              className="avatar"
                                            ></img>
                                            <div className="username">
                                              {user.username}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    {chat.users.length > shownLength && (
                                      <div className="otherMember">
                                        +{chat.users.length - shownLength}
                                      </div>
                                    )}
                                    {chat.users.find((user) => {
                                      return user._id === currentUser._id;
                                    }) ? (
                                      <div className="apply applied">
                                        joined
                                      </div>
                                    ) : chat.applyingUsers.find((userId) => {
                                        return userId === currentUser._id;
                                      }) || isApplying ? (
                                      <div
                                        className="apply applying"
                                        onClick={() => apply(chat._id)}
                                      >
                                        applying
                                      </div>
                                    ) : (
                                      <div
                                        className="apply"
                                        onClick={() => apply(chat._id)}
                                      >
                                        apply for join
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
};
export default NewGroup;
