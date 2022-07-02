import Chat from "../chat";
import './chats.scss';
const ChatList = ({ chats, switchs, left }) => {
  const allChats = chats.map((f) => (
    <Chat key={f._id} chat={f} switchs={switchs} left={left} />
  ));
  return <div className="allChats">{allChats}</div>;
};

export default ChatList;
