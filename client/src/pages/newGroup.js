import "./chat.scss";
import { useState, useEffect, useContext } from "react";
import { getFriendsAPI } from "../api/api";
import { AuthContext } from "../contexts/authContext";
import NavBar from "../components/navBar";
import LeftIcons from "../components/leftArea";
import { AiOutlineSearch, AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoCheckmarkOutline } from "react-icons/io5";
import "./newGroup.scss";
import { createGroupChatsAPI } from "../api/api";
const NewGroup = () => {
  const { currentUser } = useContext(AuthContext);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState();
  const [shownFriends, setShownFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [chosenUsers, setChosenUsers] = useState([]);
  const [GPName, setGPName] = useState("");
  const [warning, SetWarning] = useState(false);

  useEffect(() => {
    const getFriendsFunc = async () => {
      if (currentUser._id) {
        let friendList = await getFriendsAPI(currentUser._id);
        let { friends } = friendList.data;
        setFriends(friends);
        setShownFriends(friends);
      }
    };
    getFriendsFunc();
  }, [currentUser]);

  const setInput = (input) => {
    let filtered = friends.filter((friend) => {
      return friend.username.match(input);
    });
    setShownFriends(filtered);
  };

  useEffect(() => {
    if (!image) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const uploadImage = (e) => {
    setImage(e.target.files[0]);
  };
  const chooseOrNot = (id) => {
    if (chosenUsers.includes(id)) {
      chosenUsers.splice(chosenUsers.indexOf("62b1e7cd15b04834a22d4be5"), 1);
      let choose = [...chosenUsers];
      setChosenUsers(choose);
    } else {
      chosenUsers.push(id);
      let choose = [...chosenUsers];
      setChosenUsers(choose);
    }
  };

  const check = async () => {
    if (GPName === "" || chosenUsers.length <= 2 || !image) {
      SetWarning(true);
      setTimeout(() => {
        SetWarning(false);
      }, 2000);
    } else {
      const formData = new FormData();
      for (var i = 0; i < chosenUsers.length; i++) {
        formData.append("users[]", chosenUsers[i]);
      }
      formData.append("chatName", GPName);
      formData.append("image", image);
      formData.append("applyerId", currentUser._id);
      const res = await createGroupChatsAPI(formData);
    }
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
              {warning && (
                <div className="GPwarn">
                  {" "}
                  Please fill in all data / add enough member
                </div>
              )}
              <NavBar />
              <div className="GroupInfo">
                <div className="title">Create a group</div>
                <div className="GPcontent">
                  <div>Group Name:</div>
                  <input
                    className="GPInput"
                    onChange={(e) => setGPName(e.target.value)}
                  ></input>
                </div>
                <div className="GPcontent">
                  Group Avatar:
                  <label htmlFor="inputTag">
                    <input
                      type="file"
                      name="image"
                      filename="image"
                      id="inputTag"
                      onChange={uploadImage}
                    />
                    <div className="avatarContainer">
                      <img src={preview} alt="" className="avatar" />
                      <div className="add"> + </div>
                    </div>
                  </label>
                </div>
                {/* <div className="GPcontent">Group Tag:</div> */}
                <div className="GPMember">
                  <div className="GPcontent">Group Member:</div>
                  <div className="searchArea">
                    <AiOutlineSearch />
                    <input
                      onChange={(e) => setInput(e.target.value)}
                      className="input"
                    ></input>
                  </div>
                </div>
                <div className="friends">
                  {shownFriends.map((friend) => {
                    return (
                      <div
                        key={friend._id}
                        className="friend"
                        onClick={() => chooseOrNot(friend._id)}
                      >
                        <img
                          src={
                            friend.avatarImage
                              ? require(`../images/${friend.avatarImage}`)
                              : require(`../images/default.png`)
                          }
                          alt="avatar"
                          className="friendAvatar"
                        ></img>
                        <div>{friend.username}</div>
                        {chosenUsers.includes(friend._id) && (
                          <IoCheckmarkOutline className="chosen" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="submitGP" onClick={check}>
                  <div className="submitGPInside">
                    Form Group
                    <AiOutlineUsergroupAdd className="newGPIcon" />
                  </div>
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
