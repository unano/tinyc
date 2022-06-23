import './message.css'
const Message = ({ message }) => {
    return (
        <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
          <div className="content ">
            <div>{message.message}</div>
          </div>
        </div>
    );
}
export default Message;
