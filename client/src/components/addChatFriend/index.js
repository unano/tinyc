import "./addChatFriend.scss";
import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import { getFriendsAPI, addGroupUserAPI } from "../../api/api";
import { BiSearch } from "react-icons/bi";
import { IoCloseOutline, IoAddOutline } from "react-icons/io5";
const AddChatFriend = ({
  currentChat,
  showGPAddFriends,
  setCurrentChat,
}) => {
  const { currentUser } = useContext(AuthContext);
  const [shownFriends, setShownFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const currentChatUsers = currentChat.users;
  useEffect(() => {
    const getFriendsFunc = async () => {
        let friendList = await getFriendsAPI();
        let { friends } = friendList.data;
        let notInFriends = getDifference(friends, currentChatUsers);
        setFriends(notInFriends);
        setShownFriends(notInFriends);
    };
    getFriendsFunc();
  }, [currentUser, currentChat]);

  function getDifference(arr1, arr2) {
    return arr1.filter((obj1) => {
      return !arr2.some((obj2) => {
        return obj1._id === obj2._id;
      });
    });
  }

  const setInput = (input) => {
    let filtered = friends.filter((friend) => {
      return friend.username.match(input);
    });
    setShownFriends(filtered);
  };

  const addToChat = async (friendId) => {
    // setRefresh(!refresh);
    let result = await addGroupUserAPI(currentChat._id, friendId);
    setCurrentChat(result.data);
  };
  return (
    <>
      <div className="chatFriendAdd">
        {shownFriends.map((friend) => {
          return (
            <div className="friendInfo" key={friend._id}>
              <IoAddOutline
                className="add"
                onClick={() => addToChat(friend._id)}
              />
              <img
                src={
                  friend.avatarImage
                    ? require(`../../images/${friend.avatarImage}`)
                    : require(`../../images/default.png`)
                }
                alt="avatar"
                className="friendAvatar"
              ></img>
              <div className="name">{friend.username}</div>
            </div>
          );
        })}
      </div>
      <div className="GPFdown">
        <div className="searchContainer">
          <BiSearch />
          <input
            className="search"
            onChange={(e) => setInput(e.target.value)}
          ></input>
        </div>
        <IoCloseOutline
          className="close"
          onClick={() => showGPAddFriends(false)}
        />
      </div>
    </>
  );
};

export default AddChatFriend;
