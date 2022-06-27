import { useState } from "react";
import "./loginRegister.scss";
import Logo from "../imgs/tinyc.png";
import Cover from "../components/cover";
import Register from "../components/register";
import Login from "../components/login";

function App() {
  const [loginArea, setLoginArea] = useState({ width: "380px" });
  const [registArea, setRegistArea] = useState({ opacity: "0.3" });
  const [loginExpand, setLoginExpand] = useState({ height: "30px" });
  const [registerExpand, setRegisterExpand] = useState();

  const expandLogin = () => {
    setLoginArea({ width: "380px", opacity: "1" });
    setRegistArea({ width: "103px", opacity: "0.3" });
    setLoginExpand({ height: "30px" });
    setRegisterExpand({ height: "350px" });
  };

  const expandRegister = () => {
    setLoginArea({ width: "103px", opacity: "0.3" });
    setRegistArea({ width: "380px", opacity: "1" });
    setRegisterExpand({ height: "30px" });
    setLoginExpand({ height: "350px" });
  };
  //input error inform style
  const informStyle = {
    width: "376px",
    backgroundColor: "rgb(251, 89, 83)",
    borderColor: "rgb(251, 89, 83)",
    color: "white",
  };

  const successStyle = {
    width: "376px",
    backgroundColor: "rgb(114, 226, 168)",
    borderColor: "rgb(114, 226, 168)",
    color: "white",
  };

  return (
    <div className="loginContainer">
      <div className="loginBody">
        {/* <div className="loginAndRegisterLeft"></div> */}
        <div className="loginAndRegister">
          {/* initial anmiation */}
          <Cover />

          {/* Logo and its intro */}
          <div className="head">
            <img src={Logo} alt="logo" className="logo"></img>
            <div className="simpWordIntro">Tiny Chat tinyC! </div>
          </div>

          {/* Login & register */}
          <div className="body">
            {/* Login */}
            <div className="login" style={loginArea}>
              <div
                className="loginWord"
                onClick={expandLogin}
                style={loginExpand}
              >
                Login
              </div>
              <Login informStyle={informStyle} />
            </div>

            {/* Register */}
            <div className="login" style={registArea}>
              {" "}
              <div
                className="loginWord"
                onClick={expandRegister}
                style={registerExpand}
              >
                Regist
              </div>
              <Register
                informStyle={informStyle}
                successStyle={successStyle}
                expandLogin={expandLogin}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
