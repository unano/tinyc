import NewMsg from "../newMsg";
import { v4 as uuidv4 } from "uuid";

const NewMsgs = ({ newMsgs }) => {
  const allMessages = newMsgs.map((newMsg) => <NewMsg key={newMsg._id} newMsg={newMsg}/>);
  return <>{allMessages}</>;
};

export default NewMsgs;
