import Chat from "../chat";

const ChatList = ({ chats, switchs }) => {
  const allChats = chats.map((f) => <Chat key={f._id} chat={f} switchs={switchs}/>);
  return <>{allChats}</>;
};

export default ChatList;
