import Chat from '../chat'
import './chats.scss'
const ChatList = ({ chats, switchs, right }) => {
  const allChats = chats.map((f) => (
    <Chat key={f._id} chat={f} switchs={switchs} right={right} />
  ))
  return <div className="allChats">{allChats}</div>
}

export default ChatList
