import "./newMsg.css";
import { AuthContext } from "../../contexts/authContext";
import { SettingContext } from "../../contexts/settingContext";
import { useContext } from "react";
const NewMsg = ({ newMsg }) => {
  const { currentUser } = useContext(AuthContext);
  const { inform } = useContext(SettingContext);
  const getUser = () => {
    return newMsg.chat.users.filter((user) => user._id !== currentUser.id)[0]
      .avatarImage;
  };
  return (
    <>
      {inform && (
        <div className="informOutside">
          <div className="chatLeftIcon informAnime">
            {newMsg.chat.isGroupChat ? (
              <img
                src={
                  newMsg.chat.avatar
                    ? require(`../../images/${newMsg.chat.avatar}`)
                    : require(`../../images/default.png`)
                }
                alt="logo"
                className="avatar"
              ></img>
            ) : (
              <img
                src={
                  getUser()
                    ? require(`../../images/${getUser()}`)
                    : require(`../../images/default.png`)
                }
                alt="logo"
                className="avatar"
              ></img>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default NewMsg;
