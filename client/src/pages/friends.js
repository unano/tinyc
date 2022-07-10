import "./chats.scss";
import "./common.scss";
import FriendList from "../components/friendList";
import { useState, useEffect, useContext } from "react";
import { BiSearch } from "react-icons/bi";
import { getFriendsAPI, searchUserAPI, applyFriendsAPI } from "../api/api";
import { AuthContext } from "../contexts/authContext";
import NavBar from "../components/navBar";
import { RiUserAddLine } from "react-icons/ri";
import LeftIcons from "../components/leftArea";
import LoadingBar from "../components/loadingBar";
import Logo from "../imgs/tinyc.png";
import { userAvatarHandler } from "../functions";
const FriensArea = () => {
  const { currentUser } = useContext(AuthContext);
  const [shownFriends, setShownFriends] = useState([]);
  const [searchInput, setSearchIput] = useState();
  const [friends, setFriends] = useState([]);
  const [noUser, setNoUser] = useState(false); //判断搜索的用户是否在自己好友列表存在
  const [hasSearchedUser, setHasSearchedUser] = useState(false); //搜索的用户是否存在（前提是搜索用户不在自己好友列表）
  const [searchedUser, setSearchedUser] = useState({});
  const [applyResult, setApplyResult] = useState(); //显示申请结果（申请成功/重复的申请）
  const [refresh, setRefresh] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [noFriend, setNoFriend] =
    useState(false); /*判断该用户是否有好友，该项主要消除loading的误会，
  因为loading会在未读取到用户时显示，而没有好友的用户也符合触发条件，故需判断用户是否有好友消除歧义*/

  //获取好友，并检查该用户是否有好友
  useEffect(() => {
    const getFriendsFunc = async () => {
      let friendList = await getFriendsAPI();
      let { friends } = friendList.data;
      if (friends.length === 0) setNoFriend(true);
      else setNoFriend(false);
      setFriends(friends);
      setShownFriends(friends);
    };
    getFriendsFunc();
  }, [currentUser, refresh]);

  useEffect(() => {
    setSearchedUser();
    setHasSearchedUser(false);
  }, [noUser]);

  //申请好友
  const applyFriend = async () => {
    if (disabled) return;
    setDisabled(true);
    let apply = await applyFriendsAPI(searchedUser._id);
    let msg = apply.data.msg;
    if (msg) setApplyResult(msg);
    setDisabled(false);
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
    if (disabled) return;
    setDisabled(true);
    setApplyResult("");
    let user = await searchUserAPI(searchInput);
    if (user?.data.user) {
      if (user.data.user._id !== currentUser._id) {
        setSearchedUser(user.data.user);
      }
    }
    setHasSearchedUser(true);
    setDisabled(false);
  };

  const handleInput = (e) => {
    const input = e.target.value;
    setInput(e.target.value);
    if (!input) setNoUser(false);
  };

  return (
    <>
      <div className="chatContainer">
        <img src={Logo} alt="logo" className="logo"></img>
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
                  <input className="searchInput" onChange={handleInput}></input>
                </div>
                <div className="loadingContainer">
                  {!friends.length && !noFriend && <LoadingBar />}
                </div>
                {/* 首先判断是否好友列表里不存在该用户，其次判断是否搜索用户是自己，
                再其次才展示说明没有该好友，并提供给用户根据输入内容查询用户的按钮 */}
                {noUser ? (
                  searchInput !== currentUser.username ? (
                    <div className="searchNewFriend">
                      no such friend,
                      <span className="searchUser" onClick={searchInputUser}>
                        <b> search the use with this name</b>
                      </span>
                      {hasSearchedUser ? (
                        searchedUser ? (
                          <div className="searchedUser">
                            <img
                              src={userAvatarHandler(searchedUser.avatarImage)}
                              alt="logo"
                              className="icon"
                            ></img>
                            <div className="searchedUsername">
                              {searchedUser.username}
                            </div>
                            <div className="addFriendIcon">
                              <RiUserAddLine onClick={applyFriend} />
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
                  ) : (
                    <div className="searchedUser">
                      <div>It's you</div>
                    </div>
                  )
                ) : null}
                <FriendList
                  friends={shownFriends}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FriensArea;
