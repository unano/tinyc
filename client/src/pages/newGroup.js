import "./chats.scss";
import { useState, useEffect, useContext } from "react";
import { getFriendsAPI } from "../api/api";
import { AuthContext } from "../contexts/authContext";
import NavBar from "../components/navBar";
import LeftIcons from "../components/leftArea";
import { AiOutlineSearch, AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import "./newGroup.scss";
import { createGroupChatsAPI } from "../api/api";
import Avatar from 'react-avatar-edit';
import { HiScale } from "react-icons/hi";
import AvatarEditor from "../components/avatarEditor";
import BGEditor from "../components/bgEditor";
import { blobToBase64 } from "../functions";
import {BsCaretDown} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Logo from "../imgs/tinyc.png";
import "./common.scss";
const NewGroup = () => {
  const { currentUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [BGpreview, setBGPreview] = useState(null);
  const [shownFriends, setShownFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [chosenUsers, setChosenUsers] = useState([]);
  const [GPName, setGPName] = useState("");
  const [warning, SetWarning] = useState(false);
  const [showClipper, setShowClipper] = useState(false);
  const [showBGClipper, setShowBGClipper] = useState(false);
  const [photoURL, setPhotoURL] = useState();
  const navigate = useNavigate();
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

  // useEffect(() => {
  //   if (!image) {
  //     setPreview(undefined);
  //     return;
  //   }
  //   const objectUrl = URL.createObjectURL(image);
  //   setPreview(objectUrl);
  //   // free memory when ever this component is unmounted
  //   return () => URL.revokeObjectURL(objectUrl);
  // }, [image]);

  const uploadImage = (e) => {
    const file = e.target.files[0];
      if (file) {
        setImage(file);
        setShowPreview(false);
        setPhotoURL(URL.createObjectURL(file));
        setShowBGClipper(true);
    }
  }

   //查下选择和输出的数组是否一致
  const chooseOrNot = (id) => {
    if (chosenUsers.includes(id)) {
      chosenUsers.splice(chosenUsers.indexOf(id), 1);
      let choose = [...chosenUsers];
      setChosenUsers(choose);
    } else {
      chosenUsers.push(id);
      let choose = [...chosenUsers];
      setChosenUsers(choose);
    }
  };
  const dealImage = async (image)=>{
    if(image) {
      let result = await blobToBase64(image);
      return result;
    }
    else{
      let result = await null;
      return result;
    }
  }
  console.log(chosenUsers)

  const check = async () => {
    if (GPName === "" || chosenUsers.length < 2 || !preview) {
      SetWarning(true);
      setTimeout(() => {
        SetWarning(false);
      }, 2000);
    } else {
      const background = await dealImage(image);
      // const formData = new FormData();
      // for (var i = 0; i < chosenUsers.length; i++) {
      //   formData.append("users[]", chosenUsers[i]);
      // }
      // formData.append("chatName", GPName);
      // formData.append("image", preview);
      // formData.append("applyerId", currentUser._id);
      const res = await createGroupChatsAPI(GPName, chosenUsers, currentUser._id, preview, background);
      if(res) navigate("/home");
    }
  };

  const [gpbgStyle, setGpbgStyle] = useState({});
  const clearBG = () =>{
    setShowPreview(false);
    setImage(null);
    setPhotoURL(null);
  }
  const expandGPBG = () =>{
    if (gpbgStyle.bottom !== "-10px") setGpbgStyle({ bottom: "-10px", width: "76%" });
    else setGpbgStyle({ bottom: "-40%", width: "42%"});
  }

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
            {showClipper && (
              <AvatarEditor
                setPreview={setPreview}
                setShowClipper={setShowClipper}
                width={200}
                height={200}
              />
            )}
            {showBGClipper && (
              <BGEditor
                setShowClipper={setShowBGClipper}
                photoURL={photoURL}
                setPhotoURL={setPhotoURL}
                setFile={setImage}
                setShowPreview={setShowPreview}
              />
            )}
            <div className="chatOverflow">
              {/* <Cover /> */}
              <div className="chatSwitchLeft">
                {warning && (
                  <div className="GPwarn">
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
                    <div className="avatarContainer">
                      <img
                        src={preview}
                        alt=""
                        className="avatar"
                        onClick={() => {
                          setShowClipper(true);
                        }}
                      />
                      <div className="add">+</div>
                    </div>
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
                  <div className="infrom">Choose at least 2 members</div>
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
                  <div
                    className="groupBG"
                    style={gpbgStyle}
                    onClick={expandGPBG}
                  >
                    <div className="gpbdHeadDecoreate"></div>
                    <div className="bgTitle">
                      Group background <span className="grey"> (optional)</span>
                    </div>
                    {showPreview && (
                      <IoCloseOutline className="gpbgClear" onClick={clearBG} />
                    )}
                    <label htmlFor="inputTag">
                      <input
                        type="file"
                        accept="image/*"
                        name="image"
                        filename="image"
                        id="inputTag"
                        onChange={uploadImage}
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                      />
                      <div className="BGContainer">
                        {showPreview && (
                          <>
                            <img src={photoURL} alt="" className="avatar" />
                          </>
                        )}
                        <div className="add"> + </div>
                      </div>
                    </label>
                    {/* <div className="BGContainer">
                      <img
                        src={BGpreview}
                        alt=""
                        className="avatar"
                        onClick={() => {
                          setShowBGClipper(true);
                        }}
                      />
                      <div className="add">+</div>
                    </div> */}
                    {/* <label htmlFor="inputTag">
                      <input
                        type="file"
                        name="image"
                        filename="image"
                        id="inputTag"
                        onChange={uploadImage}
                      />
                      <div className="BGContainer">
                        <img src={preview} alt="" className="bg" />
                        <div className="add"> + </div>
                      </div>
                    </label> */}
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
      </div>
    </>
  );
};

export default NewGroup;
