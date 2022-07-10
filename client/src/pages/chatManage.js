import "./chatManage.scss";
import "./common.scss";
import { getGroupChat } from "../api/api";
import { useContext, useState, useEffect } from "react";
import {
  IoPencilOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { AuthContext } from "../contexts/authContext";
import { useParams, useNavigate } from "react-router-dom";
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
import { BsUpload } from "react-icons/bs";
import AvatarEditor from "../components/avatarEditor";
import { RiDeleteBin7Line } from "react-icons/ri";
import BGEditor from "../components/bgEditor";
import { blobToBase64 } from "../functions";
import LeftAreaBack from "../components/leftAreaBackV";
import Logo from "../imgs/tinyc.png";
import { userAvatarHandler, groupAvatarHandler, groupBgHandler } from "../functions";

const Application = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [chat, setChat] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [showChangeInput, setShowChangeInput] = useState(false);
  const [input, setInput] = useState();
  const [showInform, setShowInform] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showClipper, setShowClipper] = useState(false);

  const [showBGClipper, setShowBGClipper] = useState(false);
  const [photoURL, setPhotoURL] = useState();
  const [image, setImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getChat = async () => {
      let chat = await getGroupChat(id);
      setChat(chat.data);
    };
    getChat();
  }, [currentUser, refresh]);
  //接受用户的入群申请
  const accept = async (userId) => {
    await dealGroupChatApplyAPI(userId, chat._id);
    setRefresh(!refresh);
  };
  //拒绝用户的入群申请
  const refuse = async (userId) => {
    await refuseChatApplyAPI(userId, chat._id);
    setRefresh(!refresh);
  };

  const changeUsername = async () => {
    if (input !== "") {
      await renameGroupAPI(chat._id, input);
      setShowChangeInput(false);
      setRefresh(!refresh);
    }
  };

  //提交更新后的头像
  const submitAvatar = async () => {
    setLoading(true);
    const previousImageId = chat.avatarId;
    await changeGroupAvatar(chat._id, preview);
    // setTimeout(() => {
      setRefresh(!refresh);
      setPreview(null);
      setLoading(false);
      if (previousImageId) {
        setTimeout(async () => await deleteGroupAvatarAPI(previousImageId), 2000);
      }
    // }, 1000);
  };

  //读取上传的图片以进行后续裁剪
  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setShowPreview(false);
      setPhotoURL(URL.createObjectURL(file));
      setShowBGClipper(true);
    }
  };

  // 提交更新后的背景
  const submitBg = async () => {
    const previousImageId = chat.backgroundId;
    const background = await dealImage(image);
    setLoading(true);
    await changeGroupBackgroundAPI(chat._id, background);
    // setTimeout(() => {
    setShowPreview(false);
    setRefresh(!refresh);
    setPreview(null);
    setLoading(false);
    if (previousImageId) {
      setTimeout(
        async () => await deleteGroupBackgroundAPI(previousImageId),
        2000
      );
    }
    // }, 1000);
  };

  //将图像从Blob转为base64
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

  //删除群组并跳转回上个页面
  const deleteGroup = async () => {
    await deleteGroupAPI(chat._id);
    navigate(-1);
  };

  const hideInform = (e) => {
    e.stopPropagation();
    setShowInform(false);
  };

  //检查是否为当前群的管理员
  const isAdmin = chat.groupAdmin && currentUser._id === chat.groupAdmin._id;

  return (
    <>
      <div className="chatContainer">
        <img src={Logo} alt="logo" className="logo"></img>
        <div className="chatBody">
          {/* <button onClick={submitAvatar}>dd</button> */}
          <div className="chatLeft">
            <LeftAreaBack />
          </div>
          <div className="chat">
            {/* <Cover /> */}
            {/* 群头像裁剪及群背景裁剪 */}
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
            {/* 新群头像预览及新群背景预览 */}
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
                {loading && <div>Loading...</div>}
              </div>
            )}
            {showPreview && !showBGClipper && (
              <div className="groupAvatarPreviewContainer">
                <div>Preview</div>
                  <img src={photoURL} alt="" className="previewBG" />
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
                {loading && <div>Loading...</div>}
              </div>
            )}
            <div className="chatSwitchLeft">
              <div className="chatManage">
                {/* 群背景修改按钮（仅管理员） */}
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
                {/* 群头像及修改群头像按钮（仅管理员） */}
                <div className="rowFlex head">
                  <div className="avatarContainer">
                    <img
                      src={groupAvatarHandler(chat.avatar)}
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
                {/* 群背景 */}
                <div className="bgContainer">
                  <img
                    src={groupBgHandler(chat.background)}
                    alt="avatar"
                    className="bg"
                  ></img>
                  <div className="bgCover"></div>
                </div>
                <div className="rowFlex usersInfo">
                  {/*  群所有者/管理员 (不会对当前群管理员展示) */}
                  {!isAdmin && (
                    <div className="columnFlex part zeroGap">
                      <div className="title">Group Owner</div>
                      <div className="admin">
                        {chat.groupAdmin && (
                          <>
                            <img
                              src={userAvatarHandler(
                                chat.groupAdmin.avatarImage
                              )}
                              alt="avatar"
                              className="avatarSmall"
                            ></img>
                            <div>{chat.groupAdmin.username}</div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  {/*  申请入群用户（只展示给管理员） */}
                  {isAdmin && (
                    <div className="columnFlex part">
                      <div className="title">Applying users</div>
                      <div className="users columnFlex allUsers">
                        {chat.applyingUsers &&
                          chat.applyingUsers.map((user) => {
                            return (
                              <div className="rowFlex memberFull">
                                <img
                                  src={userAvatarHandler(user.avatarImage)}
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
                  {/*  当前群内群员 */}
                  <div className="columnFlex part partRight">
                    <div className="title">Current members</div>
                    <div className="users columnFlex allUsers">
                      {chat.users &&
                        chat.users.map((user) => {
                          return (
                            <div className="rowFlex member">
                              <img
                                src={userAvatarHandler(user.avatarImage)}
                                alt="avatar"
                                className="avatarSmall"
                              ></img>
                              <div className="username"> {user.username}</div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  {/*  删除群（只展示给管理员） */}
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
