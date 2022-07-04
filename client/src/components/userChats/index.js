import Request from "../request";
import { v4 as uuidv4 } from "uuid";
import Requestings from "../requestings";
import Requests from "../requests";
import "./userChats.scss";
import { AuthContext } from "../../contexts/authContext";
import { useContext, useState, useEffect } from "react";
import { AiOutlineExclamation } from "react-icons/ai";
import { getMyCreatedChatsAPI, getMyJoinedChatsAPI } from "../../api/api";
import CreatedChatInfo from "./createdChatInfo";
import JoinedChatInfo from "./joinedChatInfo";

const UserUsers = () => {
  const { currentUser } = useContext(AuthContext);
  const [createdChats, setCreatedChats] = useState([]);
  const [joinedChats, setJoinedChats] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchChat = async () => {
      if (currentUser._id) {
        const createdChats = await getMyCreatedChatsAPI(currentUser._id);
        setCreatedChats(createdChats.data);
      }
    };
    fetchChat();
  }, [currentUser]);

  useEffect(() => {
    const fetchChat = async () => {
      if (currentUser._id) {
        const joinedChats = await getMyJoinedChatsAPI(currentUser._id);
        setJoinedChats(joinedChats.data);
      }
    };
    fetchChat();
  }, [currentUser, refresh]);
  return (
    <div className="allMyChatsContainer">
      <div className="allMyChats">
        <div className="title">Joined Chats</div>
        {joinedChats.map((chat) => {
          return <JoinedChatInfo chat={chat} key={chat._id} refersh={refresh}  setRefresh={setRefresh} />;
        })}
      </div>
      <div className="allMyChats myChats">
        <div className="title">Created Chats</div>
        {createdChats.map((chat) => {
          return <CreatedChatInfo chat={chat} key={chat._id} />;
        })}
      </div>
    </div>
  );
};

export default UserUsers;
