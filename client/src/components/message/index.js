import './message.css'
const Message = ({ message, user}) => {
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
