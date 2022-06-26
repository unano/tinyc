import "./user.css";
import Back from "../imgs/back2.png";
import Settings from "../imgs/settings.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { useContext } from "react";

function Personal() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const navigates = () =>{
    navigate("/home");
  }
  return (
    <div className="chatBody">
      <div className="chatLeft">
        <div className="chatLeftIcon">
          <div className="backOut">
            <img
              src={Back}
              alt="logo"
              className="back"
              onClick={navigates}
            ></img>
          </div>
        </div>
        <div className="chatLeftIcon">
          <div className="backOut borderBackout">
            <img src={Settings} alt="logo" className="back"></img>
          </div>
        </div>
      </div>
      <div className="users">
        <div className="userInfoAvatar">
          <img
            src={
              currentUser.avatarImage
                ? require(`../images/${currentUser.avatarImage}`)
                : require(`../images/default.png`)
            }
            alt="logo"
            className="back"
            onClick={navigates}
          ></img>
        </div>
      </div>
    </div>
  );
}

export default Personal;
