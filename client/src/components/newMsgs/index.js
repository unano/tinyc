import NewMsg from '../newMsg'

const NewMsgs = ({ newMsgs }) => {
  const allMessages = newMsgs.map((newMsg) => (
    <NewMsg key={newMsg._id} newMsg={newMsg} />
  ))
  return <>{allMessages}</>
}

export default NewMsgs
