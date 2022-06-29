import "./chat.scss";
import FriendList from '../components/friendList';
import { useState, useEffect, useContext } from "react";
import AddFriend from "../imgs/addFriend.png";
import testIcon from "../imgs/testIcon.jpg";
import {
  BiSearch,
} from "react-icons/bi";
import {
  getFriendsAPI,
  searchUserAPI,
  applyFriendsAPI,
} from "../api/api";
import { AuthContext } from "../contexts/authContext";
import Settings from "../imgs/settings.png";
import Cover from "../components/cover";
import NavBar from "../components/navBar";
import { useNavigate } from "react-router-dom";
import { RiUserAddLine } from "react-icons/ri";
const FriensArea = () => {
    const { currentUser } = useContext(AuthContext);
    const [shownFriends, setShownFriends] = useState([]);
    const [searchInput, setSearchIput] = useState();
    const [friends, setFriends] = useState([]);
    const [noUser, setNoUser] = useState(false);
    const [hasSearchedUser, setHasSearchedUser] = useState(false);
    const [searchedUser, setSearchedUser] = useState({});
    const [applyResult, setApplyResult] = useState();
    const navigate = useNavigate();
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
    let user = await searchUserAPI(searchInput);
    if (user) {
      setSearchedUser(user.data.user);
    }
    setHasSearchedUser(true);
  };

    const navigateToUser = () => {
      navigate("/user");
    };
  return (
    <>
      <div className="chatContainer">
        <div className="chatBody">
          {/* <button onClick={submitAvatar}>dd</button> */}
          <div className="chatLeft">
            <div className="chatLeftIcon">
              <div className="backOut">
                <img
                  src={
                    currentUser.avatarImage
                      ? require(`../images/${currentUser.avatarImage}`)
                      : require(`../images/default.png`)
                  }
                  alt="logo"
                  className="back"
                  onClick={navigateToUser}
                ></img>
              </div>
            </div>
            <div className="chatLeftIcon">
              <div className="backOut borderBackout">
                <img src={Settings} alt="logo" className="back rotate"></img>
              </div>
            </div>
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
                            <img
                              src={testIcon}
                              alt="logo"
                              className="icon"
                            ></img>
                          <div className="searchedUsername">
                            {searchedUser.username}
                          </div>
                          <div className="addFriendIcon">
                            <RiUserAddLine onClick={applyFriend}/>
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
                <FriendList friends={shownFriends} />
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  <img src={testIcon} alt="logo" className="icon"></img>
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
    </>
  );
};

export default FriensArea;

