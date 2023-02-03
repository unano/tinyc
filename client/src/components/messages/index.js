import Message from '../message'
import { v4 as uuidv4 } from 'uuid'

const Messages = ({ messages, scrollRef }) => {
  const allMessages = messages.map((m) => (
    <Message key={uuidv4()} message={m} scrollRef={scrollRef} />
  ))
  return <>{allMessages}</>
}

export default Messages
