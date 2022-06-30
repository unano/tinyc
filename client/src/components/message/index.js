import './message.scss'
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const isSender = message.sender._id === currentUser._id;
    return (
      <>
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
          </div>
        </div>
      </>
    );
}
export default Message;
