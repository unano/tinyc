import "./leftArea.scss";
import { useNavigate } from "react-router-dom";
import Back from "../../imgs/back2.png";
import LeftAreaSetting from "../leftAreaSetting";

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
      <LeftAreaSetting />
    </>
  );
};

export default LeftIcons;
