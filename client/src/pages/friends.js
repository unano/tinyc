import "./chat.scss";
import FriendList from "../components/friendList";
import { useState, useEffect, useContext } from "react";
import testIcon from "../imgs/testIcon.jpg";
import { BiSearch } from "react-icons/bi";
import { getFriendsAPI, searchUserAPI, applyFriendsAPI } from "../api/api";
import { AuthContext } from "../contexts/authContext";
import NavBar from "../components/navBar";
import { RiUserAddLine } from "react-icons/ri";
import LeftIcons from "../components/leftArea";
import LoadingBar from "../components/loadingBar";

const FriensArea = () => {
  const { currentUser } = useContext(AuthContext);
  const [shownFriends, setShownFriends] = useState([]);
  const [searchInput, setSearchIput] = useState();
  const [friends, setFriends] = useState([]);
  const [noUser, setNoUser] = useState(false);
  const [hasSearchedUser, setHasSearchedUser] = useState(false);
  const [searchedUser, setSearchedUser] = useState({});
  const [applyResult, setApplyResult] = useState();
  const [refresh, setRefresh] = useState(false);
  const [noFriend, setNoFriend] = useState(false);

  useEffect(() => {
    const getFriendsFunc = async () => {
      if (currentUser._id) {
        let friendList = await getFriendsAPI(currentUser._id);
        let { friends } = friendList.data;
        if (friends.length === 0) setNoFriend(true);
        else setNoFriend(false);
        setFriends(friends);
        setShownFriends(friends);
      }
    };
    getFriendsFunc();
  }, [currentUser, refresh]);

  useEffect(() => {
    setSearchedUser({});
    setHasSearchedUser(false);
  }, [noUser]);

  const applyFriend = async () => {
    let apply = await applyFriendsAPI(currentUser._id, searchedUser._id);
    let msg = apply.data.msg;
    if (msg) setApplyResult(msg);
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
    setApplyResult("");
    let user = await searchUserAPI(searchInput);
    if (user) {
      setSearchedUser(user.data.user);
    }
    setHasSearchedUser(true);
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
                  {!friends.length && !noFriend && <LoadingBar />}
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
                          <img src={testIcon} alt="logo" className="icon"></img>
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
