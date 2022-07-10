import { getGroupChat } from "../../api/api";
import { useContext, useState, useEffect } from "react";
import {
  IoPencilOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { AuthContext } from "../../contexts/authContext";
import { useParams } from "react-router-dom";
import {
  dealGroupChatApplyAPI,
  refuseChatApplyAPI,
  renameGroupAPI,
} from "../../api/api";
import { RiDeleteBin7Line } from "react-icons/ri";
import { userAvatarHandler, groupAvatarHandler } from "../../functions";
import "./application.scss";
const Application = () => {
  const { currentUser } = useContext(AuthContext);
  const [chat, setChat] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [showChangeInput, setShowChangeInput] = useState(false);
  const [input, setInput] = useState();
  const [deleteStyle, setDeleteStyle] = useState({});
  const [disabled, setDisabled] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    const getChat = async () => {
      let chat = await getGroupChat(id);
      setChat(chat.data);
    };
    getChat();
  }, [currentUser, refresh]);
  const accept = async (userId) => {
    if (disabled) return;
    setDisabled(true);
    let result = await dealGroupChatApplyAPI(userId, chat._id);
    setDisabled(false);
    setRefresh(!refresh);
  };
  const refuse = async (userId) => {
    if (disabled) return;
    setDisabled(true);
    let result = await refuseChatApplyAPI(userId, chat._id);
    setRefresh(!refresh);
    setDisabled(false);
  };

  const changeUsername = async () => {
    if (input !== "") {
      if (disabled) return;
      setDisabled(true);
      let result = await renameGroupAPI(chat._id, input);
      setShowChangeInput(false);
      setRefresh(!refresh);
      setDisabled(false);
    }
  };

  const expand = () => {
    setDeleteStyle({ marginLeft: 0 });
  };
  return (
    <>
      <div className="chatManage">
        <div className="rowFlex head">
          <RiDeleteBin7Line
            className="delete"
            onClick={expand}
            style={deleteStyle}
          />
          <img
            src={groupAvatarHandler(chat.avatar)}
            alt="avatar"
            className="avatar"
          ></img>
          {!showChangeInput ? (
            <div className="flex">
              <div>{chat.chatName}</div>
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
                defaultValue={chat.chatName}
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
        </div>
        <div className="rowFlex">
          <div className="columnFlex part zeroGap">
            <div className="title">Applying users</div>
            <div className="users columnFlex">
              {chat.applyingUsers &&
                chat.applyingUsers.map((user) => {
                  return (
                    <div className="rowFlex">
                      <img
                        src={userAvatarHandler(user.avatarImage)}
                        alt="avatar"
                        className="avatar"
                      ></img>
                      <div className="columnFlex zeroGap">
                        <div className="username">{user.username}</div>
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
          <div className="columnFlex part">
            <div className="title">Current members</div>
            <div className="users columnFlex">
              {chat.users &&
                chat.users.map((user) => {
                  return (
                    <div className="rowFlex">
                      <img
                        src={userAvatarHandler(user.avatarImage)}
                        alt="avatar"
                        className="avatar"
                      ></img>
                      <div className="username"> {user.username}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Application;
