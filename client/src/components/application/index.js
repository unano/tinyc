import {getGroupChat} from "../../api/api"
import { useContext, useState, useEffect } from "react";
import {
  IoPencilOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { AuthContext } from "../../contexts/authContext";
import {useParams} from "react-router-dom";
import { StepContent } from "@material-ui/core";
import { dealGroupChatApplyAPI, refuseChatApplyAPI, renameGroupAPI } from "../../api/api";
import { BsUpload, BsChevronDoubleRight } from "react-icons/bs";
import AvatarEditor from "../../components/avatarEditor";
import { RiDeleteBin7Line } from "react-icons/ri";
import "./application.scss";
const Application = () => {
      const { currentUser } = useContext(AuthContext);
      const [chat, setChat] = useState({});
      const [refresh, setRefresh] = useState(false);
      const [showChangeInput, setShowChangeInput] = useState(false);
      const [input, setInput] = useState();
      const [deleteStyle, setDeleteStyle] = useState({});
    const {id} = useParams();
    useEffect(()=>{
        const getChat = async()=>{
        let chat = await getGroupChat(id);
        setChat(chat.data);
        }
        getChat();
    },[currentUser,refresh]);
    const accept = async (userId)=>{
        let result = await dealGroupChatApplyAPI(userId, currentUser._id, chat._id);
        console.log(result)
        setRefresh(!refresh);
    }
    const refuse = async(userId) =>{
        let result = await refuseChatApplyAPI(
          userId,
          currentUser._id,
          chat._id
        );
        console.log(result);
        setRefresh(!refresh);
    }

      const changeUsername = async () => {
        if (input !== "") {
          let result = await renameGroupAPI(chat._id, input);
          setShowChangeInput(false);
          setRefresh(!refresh);
        }
      };

      const expand = () =>{
          setDeleteStyle({marginLeft:0});
      }
    return (
      <>
        <div className="chatManage">
          <div className="rowFlex head">
              <RiDeleteBin7Line className="delete" onClick={expand} style={deleteStyle}/>
            <img
              src={
                chat.avatar
                  ? require(`../../images/${chat.avatar}`)
                  : require(`../../images/defaultGroup.png`)
              }
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
                          src={
                            user.avatarImage
                              ? require(`../../images/${user.avatarImage}`)
                              : require(`../../images/defaultGroup.png`)
                          }
                          alt="avatar"
                          className="avatar"
                        ></img>
                        <div className="columnFlex">
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
                          src={
                            user.avatarImage
                              ? require(`../../images/${user.avatarImage}`)
                              : require(`../../images/defaultGroup.png`)
                          }
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
