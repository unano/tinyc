import "./user.scss";
import "./common.scss";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { useContext, useState } from "react";
import UserNavBar from "../components/userPageNavBar";
import {
  uploadAvatarAPI,
  deleteAvatarAPI,
  changeUsernameAPI,
  changeIntroAPI,
} from "../api/api";

import {
  IoPencilOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { BsUpload, BsChevronDoubleRight } from "react-icons/bs";
import { AiOutlineLogout } from "react-icons/ai";
import AvatarEditor from "../components/avatarEditor";
import LeftAreaBack from "../components/leftAreaBackV";
import Logo from "../imgs/tinyc.png";
import LoadingBar from "../components/loadingBar";
import {userAvatarHandler} from "../functions"

function Personal() {
  const { currentUser, resetUserData, logout } = useContext(AuthContext);
  const [showChangeInput, setShowChangeInput] = useState(false); //根据是否准备用户名进行修改控制相应内容的显示
  const [showChangeIntro, setShowChangeIntro] = useState(false); //根据是否准备用户介绍进行修改控制相应内容的显示
  const [nameInput, setNameInput] = useState(""); //用户修改用户名的输入
  const [introInput, setIntroInput] = useState(""); //用户修改用户介绍的输入
  const [preview, setPreview] = useState(null); //新头像预览
  const [showClipper, setShowClipper] = useState(false); //控制裁剪组建的展示
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const changeUsername = async () => {
    if (disabled) return;
    if (nameInput !== "") {
      setDisabled(true);
      let result = await changeUsernameAPI(nameInput);
      if (result.status) resetUserData(result.data.upload);
      setShowChangeInput(false);
      setDisabled(false);
    }
  };

  const changeIntro = async () => {
    if (disabled) return;
    if (introInput !== "") {
      setDisabled(true);
      let result = await changeIntroAPI(introInput);
      if (result.status) resetUserData(result.data.upload);
      setShowChangeIntro(false);
      setDisabled(false);
    }
  };

  // useEffect(() => {
  //   const fetchRequest = async () => {
  //     const requests = await getFriendsReqAPI(currentUser._id);
  //     setRequests(requests.data.friends);
  //   };
  //   fetchRequest();
  // }, [currentUser, refresh]);

  //   useEffect(() => {
  //     const fetchRequest = async () => {
  //       const requests = await getsendedFriendRedAPI(currentUser._id);
  //       setRequesting(requests.data.friends);
  //     };
  //     fetchRequest();
  //   }, [currentUser]);

    const submitAvatar = async () => {
      if (disabled) return;
    setLoading(true);
    setDisabled(true);
    const updatedUser = await uploadAvatarAPI(preview);
    // setTimeout(() => {
    await resetUserData(updatedUser.data.user);
    setLoading(false);
    setPreview(null);
    setDisabled(false);
    if (currentUser.avatarId){
      setTimeout(async () => await deleteAvatarAPI(currentUser.avatarId), 2000);
    }
    // }, 200);
  };

  console.log(userAvatarHandler(currentUser.avatarImage));
  return (
    <div className="chatContainer">
      <img src={Logo} alt="logo" className="logo"></img>
      <div className="chatBody">
        <div className="chatLeft">
          <LeftAreaBack />
        </div>
        {/*   头像裁剪   */}
        <div className="userInfo">
          {showClipper && (
            <AvatarEditor
              setPreview={setPreview}
              setShowClipper={setShowClipper}
            />
          )}
          <div className="userOverflow">
            <div className="loadingCon">{loading && <LoadingBar />}</div>
            <div className="flex">
              <div className="avatarContainer">
                <img
                  src={
                    userAvatarHandler(currentUser.avatarImage)
                  }
                  alt="avatar"
                  className="avatar"
                ></img>
              </div>
              {/*   头像裁剪预览   */}
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
              {/*   修改头像按钮   */}
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
            {/*   修改用户名   */}
            {!showChangeInput ? (
              // 未修改前，显示用户名和编辑用户名按钮
              <div className="flex">
                <div className="username">{currentUser.username}</div>
                <IoPencilOutline
                  className="modify"
                  onClick={() => setShowChangeInput(true)}
                />
              </div>
            ) : (
              //修改中，显示输入框，以及是否保存修改
              <div className="flex">
                <input
                  className="changeUsername"
                  onChange={(e) => setNameInput(e.target.value)}
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
            {/*   修改用户介绍   */}
            {!showChangeIntro ? (
              // 未修改前，显示用户介绍和编辑用户介绍按钮
              <div className="flex flexEnd">
                <div className="username intro">{currentUser.intro}</div>
                <IoPencilOutline
                  className="modify smallModify"
                  onClick={() => setShowChangeIntro(true)}
                />
              </div>
            ) : (
              //修改中，显示输入框，以及是否保存修改
              <div className="flex flexEnd">
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
            {/*  切换路由NavBar, 切换成好友申请管理或者群组管理   */}
            <div className="userNavBar">
              <UserNavBar />
            </div>
            <Outlet />
            {/*  登出   */}
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
