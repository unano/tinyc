import './message.css'
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
    return (
      <div
        className={`message ${message.sender._id===currentUser._id ? "sended" : "recieved"}`}
      >
        <div className="content ">
          <div>{message.message}</div>
        </div>
      </div>
    );
}
export default Message;
