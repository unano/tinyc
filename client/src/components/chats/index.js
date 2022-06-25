import Chat from "../chat";

const ChatList = ({ chats, switchs, user }) => {
    console.log(chats)
  const allChats = chats.map((f) => <Chat key={f._id} chat={f} switchs={switchs} user={user}/>);
  return <>{allChats}</>;
};

export default ChatList;
