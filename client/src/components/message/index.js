import './message.scss'
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import {getDate} from "../../functions"
const Message = ({ message, scrollRef }) => {
  const { currentUser } = useContext(AuthContext);
  const isSender = message.sender._id === currentUser._id;
  const date0 = new Date(message.createdAt);
  const date = getDate(date0, "MM.DD HH:mm");
    return (
      <div ref={scrollRef}>
        <div className={`message ${isSender ? "sended" : "recieved"}`}>
          {!isSender && (
            <img
              src={
                currentUser.avatarImage
                  ? require(`../../images/${message.sender.avatarImage}`)
                  : require(`../../images/default.png`)
              }
              alt="logo"
              className="avatar"
            ></img>
          )}
          <div className={`msgIn ${isSender ? "sendedIn" : "recievedIn"}`}>
            {!isSender && <div>{message.sender.username}</div>}
              <div className="MSGcontent ">
                <div>{message.message}</div>
              </div>
              <div className='date'>{date}</div>
          </div>
        </div>
      </div>
    );
}
export default Message;
