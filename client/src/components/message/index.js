import './message.css'
import { useEffect } from "react";
const Message = ({ message, user}) => {
    console.log(message)
    return (
      <div
        className={`message ${message.sender._id===user ? "sended" : "recieved"}`}
      >
        <div className="content ">
          <div>{message.message}</div>
        </div>
      </div>
    );
}
export default Message;
