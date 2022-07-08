import "./userChats.scss";
import { AuthContext } from "../../contexts/authContext";
import { useContext, useState, useEffect } from "react";
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
        const createdChats = await getMyCreatedChatsAPI();
        setCreatedChats(createdChats.data);
      }
    };
    fetchChat();
  }, [currentUser]);

  useEffect(() => {
    const fetchChat = async () => {
      if (currentUser._id) {
        const joinedChats = await getMyJoinedChatsAPI();
        setJoinedChats(joinedChats.data);
      }
    };
    fetchChat();
  }, [currentUser, refresh]);
  return (
    <div className="allMyChatsContainer">
      <div className="allMyChats">
        <div className="title">Joined Chats</div>
        <div className="myChatContainer">
          {joinedChats.map((chat) => {
            return (
              <JoinedChatInfo
                chat={chat}
                key={chat._id}
                refersh={refresh}
                setRefresh={setRefresh}
              />
            );
          })}
        </div>
      </div>
      <div className="allMyChats myChats">
        <div className="title">Created Chats</div>
        <div className="myChatContainer">
          {createdChats.map((chat) => {
            return <CreatedChatInfo chat={chat} key={chat._id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default UserUsers;
