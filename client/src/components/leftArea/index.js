import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import Settings from "../../imgs/settings.png";
import { useNavigate } from "react-router-dom";
const LeftIcons = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const navigateToUser = () => {
    navigate("/user");
  };
  return (
    <>
      <div className="chatLeftIcon">
        <div className="backOut">
          <img
            src={
              currentUser.avatarImage
                ? require(`../../images/${currentUser.avatarImage}`)
                : require(`../../images/default.png`)
            }
            alt="logo"
            className="back"
            onClick={navigateToUser}
          ></img>
        </div>
      </div>
      <div className="chatLeftIcon">
        <div className="backOut borderBackout">
          <img src={Settings} alt="logo" className="back rotate"></img>
        </div>
      </div>
    </>
  );
};

export default LeftIcons;
