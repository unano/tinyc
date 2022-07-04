import "./leftArea.scss";
import Settings from "../../imgs/settings.png";
import { useNavigate } from "react-router-dom";
import Back from "../../imgs/back2.png";

const LeftIcons = () => {
  const navigate = useNavigate();
    const navigates = () => {
      navigate(-1);
    };
  return (
    <>
      <div className="chatLeftIcon">
        <div className="backOut">
          <img src={Back} alt="logo" className="back" onClick={navigates}></img>
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
