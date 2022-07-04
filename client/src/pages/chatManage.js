import { getGroupChat } from "../api/api";
import { useContext, useState, useEffect } from "react";
import {
  IoPencilOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { AuthContext } from "../contexts/authContext";
import { useParams, useNavigate } from "react-router-dom";
import { StepContent } from "@material-ui/core";
import {
  dealGroupChatApplyAPI,
  refuseChatApplyAPI,
  renameGroupAPI,
  changeGroupAvatar,
  deleteGroupAvatarAPI,
  changeGroupBackgroundAPI,
  deleteGroupBackgroundAPI,
  deleteGroupAPI,
} from "../api/api";
import { BsUpload, BsChevronDoubleRight } from "react-icons/bs";
import AvatarEditor from "../components/avatarEditor";
import { RiDeleteBin7Line } from "react-icons/ri";
import LeftIcons from "../components/leftArea";
import "./chatManage.scss";
import BGEditor from "../components/bgEditor";
import { blobToBase64 } from "../functions";
import LeftAreaBack from "../components/leftAreaBackV";

const Application = () => {
  const { currentUser } = useContext(AuthContext);
  const [chat, setChat] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [showChangeInput, setShowChangeInput] = useState(false);
  const [input, setInput] = useState();
  const [deleteStyle, setDeleteStyle] = useState({});
  const [showInform, setShowInform] = useState(false);
  const { id } = useParams();
  const [preview, setPreview] = useState(null);
  const [showClipper, setShowClipper] = useState(false);

  const [showBGClipper, setShowBGClipper] = useState(false);
  const [photoURL, setPhotoURL] = useState();
  const [image, setImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const getChat = async () => {
      let chat = await getGroupChat(id);
      setChat(chat.data);
    };
    getChat();
  }, [currentUser, refresh]);
  const accept = async (userId) => {
    let result = await dealGroupChatApplyAPI(userId, currentUser._id, chat._id);
    console.log(result);
    setRefresh(!refresh);
  };
  const refuse = async (userId) => {
    let result = await refuseChatApplyAPI(userId, currentUser._id, chat._id);
    console.log(result);
    setRefresh(!refresh);
  };

  const changeUsername = async () => {
    if (input !== "") {
      let result = await renameGroupAPI(chat._id, input);
      setShowChangeInput(false);
      setRefresh(!refresh);
    }
  };

  const expand = () => {
    setDeleteStyle({ marginLeft: 0 });
  };

  const submitAvatar = async () => {
    const previousImage = chat.avatar;
    const updatedChat = await changeGroupAvatar(chat._id, preview);
    setTimeout(() => {
      setRefresh(!refresh);
      setPreview(null);
      setTimeout(async () => await deleteGroupAvatarAPI(previousImage), 2000);
    }, 1000);
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setShowPreview(false);
      setPhotoURL(URL.createObjectURL(file));
      setShowBGClipper(true);
    }
  };

  const submitBg = async () => {
    const previousImage = chat.background;
    const background = await dealImage(image);
    await changeGroupBackgroundAPI(chat._id, background);
    setTimeout(() => {
      setShowPreview(false);
      setRefresh(!refresh);
      setPreview(null);
      setTimeout(
        async () => await deleteGroupBackgroundAPI(previousImage),
        2000
      );
    }, 1000);
  };

  const dealImage = async (image) => {
    if (image) {
      let result = await blobToBase64(image);
      return result;
    } else {
      let result = await null;
      return result;
    }
  };

  const confirmAndDelete = () => {
    setShowInform(true);
  };

  const deleteGroup = async () => {
    await deleteGroupAPI(chat._id);
    navigate(-1);
  };

  const hideInform = (e) => {
    e.stopPropagation();
    setShowInform(false);
  };

  const isAdmin = chat.groupAdmin && currentUser._id === chat.groupAdmin._id;

  return (
    <>
      <div className="chatContainer">
        <div className="chatBody">
          {/* <button onClick={submitAvatar}>dd</button> */}
          <div className="chatLeft">
            <LeftAreaBack />
          </div>
          <div className="chat">
            {/* <Cover /> */}
            {showClipper && (
              <AvatarEditor
                setPreview={setPreview}
                setShowClipper={setShowClipper}
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
            {preview && !showClipper && (
              <div className="groupAvatarPreviewContainer">
                <div>Preview</div>
                <img src={preview} alt="" className="groupAvatarPreview" />
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
              </div>
            )}
            {showPreview && !showBGClipper && (
              <div className="groupAvatarPreviewContainer">
                <div>Preview</div>
                <>
                  <img src={photoURL} alt="" className="previewBG" />
                </>
                <div className="buttonsContainer">
                  <BsUpload
                    className="usernameBtn smallBtn"
                    onClick={submitBg}
                  />
                  <IoCloseOutline
                    className="usernameBtn"
                    onClick={() => setShowPreview(null)}
                  />
                </div>
              </div>
            )}
            <div className="chatSwitchLeft">
              <div className="chatManage">
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
                  {isAdmin && <div className="changeBg">Change background</div>}
                </label>
                <div className="rowFlex head">
                  <div className="avatarContainer">
                    <img
                      src={
                        chat.avatar
                          ? require(`../images/${chat.avatar}`)
                          : require(`../images/defaultGroup.png`)
                      }
                      alt="avatar"
                      className="avatar"
                    ></img>
                    {isAdmin && (
                      <IoPencilOutline
                        className="modify"
                        onClick={() => setShowClipper(true)}
                      />
                    )}
                  </div>
                  {!showChangeInput ? (
                    <div className="rowFlex chatName">
                      <div>{chat.chatName}</div>
                      {isAdmin && (
                        <IoPencilOutline
                          className="modify"
                          onClick={() => setShowChangeInput(true)}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="rowFlex chatName">
                      <input
                        className="changeUsername"
                        onChange={(e) => setInput(e.target.value)}
                        defaultValue={chat.chatName}
                      ></input>
                      {isAdmin && (
                        <>
                          <IoCheckmarkOutline
                            className="usernameBtn"
                            onClick={changeUsername}
                          />
                          <IoCloseOutline
                            className="usernameBtn"
                            onClick={() => setShowChangeInput(false)}
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="bgContainer">
                  <img
                    src={
                      chat.background
                        ? require(`../images/background/${chat.background}`)
                        : require(`../images/defaultGroup.png`)
                    }
                    alt="avatar"
                    className="bg"
                  ></img>
                  <div className="bgCover"></div>
                </div>
                <div className="rowFlex usersInfo">
                  {!isAdmin && (
                    <div className="columnFlex part zeroGap">
                      <div className="title">Group Owner</div>
                      <div className="admin">
                        {chat.groupAdmin && (
                          <>
                            <img
                              src={
                                chat.groupAdmin.avatarImage
                                  ? require(`../images/${chat.groupAdmin.avatarImage}`)
                                  : require(`../images/defaultGroup.png`)
                              }
                              alt="avatar"
                              className="avatarSmall"
                            ></img>
                            <div>{chat.groupAdmin.username}</div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  {isAdmin && (
                    <div className="columnFlex part">
                      <div className="title">Applying users</div>
                      <div className="users columnFlex allUsers">
                        {chat.applyingUsers &&
                          chat.applyingUsers.map((user) => {
                            return (
                              <div className="rowFlex memberFull">
                                <img
                                  src={
                                    user.avatarImage
                                      ? require(`../images/${user.avatarImage}`)
                                      : require(`../images/defaultGroup.png`)
                                  }
                                  alt="avatar"
                                  className="avatarSmall"
                                ></img>
                                <div className="columnFlex zeroGap">
                                  <div className="username">
                                    {user.username}
                                  </div>
                                  <div className="rowFlex chooses">
                                    <IoCheckmarkOutline
                                      className="choose accept"
                                      onClick={() => accept(user._id)}
                                    />
                                    <IoCloseOutline
                                      className=" choose refuse"
                                      onClick={() => refuse(user._id)}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                  <div className="columnFlex part partRight">
                    <div className="title">Current members</div>
                    <div className="users columnFlex allUsers">
                      {chat.users &&
                        chat.users.map((user) => {
                          return (
                            <div className="rowFlex member">
                              <img
                                src={
                                  user.avatarImage
                                    ? require(`../images/${user.avatarImage}`)
                                    : require(`../images/defaultGroup.png`)
                                }
                                alt="avatar"
                                className="avatarSmall"
                              ></img>
                              <div className="username"> {user.username}</div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  {isAdmin && (
                    <div
                      className={
                        showInform ? "deleteGroup expandConfirm" : "deleteGroup"
                      }
                      onClick={confirmAndDelete}
                    >
                      {!showInform ? (
                        <RiDeleteBin7Line />
                      ) : (
                        <>
                          Are you sure to delete this group?
                          <IoCheckmarkOutline
                            className="choose accept"
                            onClick={deleteGroup}
                          />
                          <IoCloseOutline
                            className=" choose refuse"
                            onClick={(e) => hideInform(e)}
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Application;