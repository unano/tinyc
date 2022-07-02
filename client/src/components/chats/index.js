import Chat from "../chat";

const ChatList = ({ chats, switchs, left }) => {
  const allChats = chats.map((f) => (
    <Chat key={f._id} chat={f} switchs={switchs} left={left} />
  ));
  return <>{allChats}</>;
};

export default ChatList;
