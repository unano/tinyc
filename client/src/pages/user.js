import "./user.scss";
import Back from "../imgs/back2.png";
import Settings from "../imgs/settings.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { useContext, useState, useEffect } from "react";
import Requestings from '../components/requestings';
import Requests from "../components/requests";
import {
  uploadAvatarAPI,
  deleteAvatarAPI,
  changeUsernameAPI,
  changeIntroAPI,
  getFriendsReqAPI,
  getsendedFriendRedAPI,
} from "../api/api";

import {
  IoPencilOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { BsUpload, BsChevronDoubleRight } from "react-icons/bs";
import { AiOutlineLogout } from "react-icons/ai";
import AvatarEditor from "../components/avatarEditor";
function Personal() {
  const { currentUser, resetUserData, logout } = useContext(AuthContext);
  const [showChangeInput, setShowChangeInput] = useState(false);
  const [showChangeIntro, setShowChangeIntro] = useState(false);
  const [input, setInput] = useState("");
  const [introInput,  setIntroInput] = useState("");
  const [preview, setPreview] = useState(null);
  const [requests, setRequests] = useState([]);
  const [requesting, setRequesting] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showClipper, setShowClipper] = useState(false);

  const changeUsername = async () => {
    if (input !== "") {
      let result = await changeUsernameAPI(currentUser._id, input);
      if (result.status) resetUserData(result.data.upload);
      setShowChangeInput(false);
    }
  };

  const changeIntro = async () => {
    if (introInput !== "") {
      let result = await changeIntroAPI(currentUser._id, introInput);
      if (result.status) resetUserData(result.data.upload);
      setShowChangeIntro(false);
    }
  };


  useEffect(() => {
    const fetchRequest = async () => {
      const requests = await getFriendsReqAPI(currentUser._id);
      setRequests(requests.data.friends);
    };
    fetchRequest();
  }, [currentUser, refresh]);

    useEffect(() => {
      const fetchRequest = async () => {
        const requests = await getsendedFriendRedAPI(currentUser._id);
        setRequesting(requests.data.friends);
      };
      fetchRequest();
    }, [currentUser]);
  const navigate = useNavigate();
  const navigates = () => {
    navigate("/home");
  };

  const submitAvatar = async () => {
    const previousImage = currentUser.avatarImage;
    const updatedUser = await uploadAvatarAPI(currentUser._id, preview);
    setTimeout(() => {
      resetUserData(updatedUser.data.upload);
      setPreview(null);
      setTimeout(async () => await deleteAvatarAPI(previousImage), 2000);
    }, 1000);
  };
  return (
    <div className="chatContainer">
      <div className="chatBody">
        <div className="chatLeft">
          <div className="chatLeftIcon">
            <div className="backOut">
              <img
                src={Back}
                alt="logo"
                className="back"
                onClick={navigates}
              ></img>
            </div>
          </div>
          <div className="chatLeftIcon">
            <div className="backOut borderBackout">
              <img src={Settings} alt="logo" className="back rotate"></img>
            </div>
          </div>
        </div>
        <div className="userInfo">
          {showClipper && (
            <AvatarEditor
              setPreview={setPreview}
              setShowClipper={setShowClipper}
            />
          )}
          <div className="userOverflow">
            <div className="flex">
              <div className="avatarContainer">
                <img
                  src={
                    currentUser.avatarImage
                      ? require(`../images/${currentUser.avatarImage}`)
                      : require(`../images/default.png`)
                  }
                  alt="avatar"
                  className="avatar"
                ></img>
              </div>
              {preview && (
                <div className="avatarContainer">
                  <div className="right">
                    <BsChevronDoubleRight />
                  </div>
                  <img
                    src={preview}
                    alt=""
                    className="avatar"
                    onClick={() => {
                      setShowClipper(true);
                    }}
                  />
                </div>
              )}
              {!preview ? (
                <IoPencilOutline
                  className="modify"
                  onClick={() => {
                    setShowClipper(true);
                  }}
                />
              ) : (
                <div className="buttonsContainer">
                  <BsUpload
                    className="usernameBtn smallBtn"
                    onClick={submitAvatar}
                  />
                  <IoCloseOutline
                    className="usernameBtn"
                    onClick={() => setPreview(null)}
                  />
                </div>
              )}
            </div>
            {!showChangeInput ? (
              <div className="flex">
                <div className="username">{currentUser.username}</div>
                <IoPencilOutline
                  className="modify"
                  onClick={() => setShowChangeInput(true)}
                />
              </div>
            ) : (
              <div className="flex">
                <input
                  className="changeUsername"
                  onChange={(e) => setInput(e.target.value)}
                  defaultValue={currentUser.username}
                ></input>
                <IoCheckmarkOutline
                  className="usernameBtn"
                  onClick={changeUsername}
                />
                <IoCloseOutline
                  className="usernameBtn"
                  onClick={() => setShowChangeInput(false)}
                />
              </div>
            )}
            {!showChangeIntro ? (
              <div className="flex">
                <div className="username intro">{currentUser.intro}</div>
                <IoPencilOutline
                  className="modify smallModify"
                  onClick={() => setShowChangeIntro(true)}
                />
              </div>
            ) : (
              <div className="flex">
                <input
                  className="changeIntro"
                  defaultValue={currentUser.intro}
                  onChange={(e) => setIntroInput(e.target.value)}
                ></input>
                <IoCheckmarkOutline
                  className="introBtn"
                  onClick={changeIntro}
                />
                <IoCloseOutline
                  className="introBtn"
                  onClick={() => setShowChangeIntro(false)}
                />
              </div>
            )}
            <div className="twoRequests">
              <Requests
                requests={requests}
                refresh={refresh}
                setRefresh={setRefresh}
              />
              <Requestings requestings={requesting} />
            </div>
            <div className="logout">
              <AiOutlineLogout onClick={logout} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Personal;
