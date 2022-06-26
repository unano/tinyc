import "./user.css";
import Back from "../imgs/back2.png";
import Settings from "../imgs/settings.png";
import { useNavigate } from "react-router-dom";

function Personal() {
  const navigate = useNavigate();
  const navigates = () =>{
    navigate("/home");
  }
  return (
    <div className="chatBody">
      <div className="chatLeft">
        <div className="chatLeftIcon">
            <div className="backOut">
              <img src={Back} alt="logo" className="back" onClick={navigates}></img>
            </div>
        </div>
        <div className="chatLeftIcon">
          <div className="backOut borderBackout">
            <img src={Settings} alt="logo" className="back"></img>
          </div>
        </div>
      </div>
      <div className="users">
        
      </div>
    </div>
  );
}

export default Personal;
