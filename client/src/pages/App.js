import { useState, useRef, useContext} from 'react';
import './App.scss';
import Logo from "../imgs/tinyc.png"
import LogoPure from "../imgs/tinycPure.png";
import { useNavigate} from "react-router-dom";
import { loginAPI, registerAPI } from "../api/api";
import { AuthContext } from "../contexts/authContext";

function App() {
  const { resetUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  //save login data
  const [loginValues, setLoginValues] = useState({
    username: "",
    password: "",
  });

  //save register data
  const [registerValues, setRegisterValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const registerUsernameRef = useRef({});
  const registerPasswordRef = useRef({});
  const registerConfirmPswdRef = useRef({});

  //login/register switch style setting
  const [loginArea, setLoginArea] = useState({ width: "380px" });
  const [logineExpand1, setLoginExpand1] = useState({ height: "30px" });
  const [logineExpand2, setLoginExpand2] = useState();
  const [registArea, setRegistArea] = useState({ opacity: "0.3" });

  //inform style setting
  const [usernameIndiStyle, setUsernameIndiStyle] = useState();
  const [passwordIndiStyle, setPasswordIndiStyle] = useState();
  const [usernameRegistIndiStyle, setUsernameRegistIndiStyle] = useState();
  const [passwordRegistIndiStyle, setPasswordRegistIndiStyle] = useState();
  const [pswdConfirmRegistIndiStyle, setPswdConfirmRegistIndiStyle] =
    useState();

  //set inform word
  const [usernameWord, setUsernameWord] = useState("username");
  const [passwordWord, setPasswordWord] = useState("password");
  const [registUsername, setRegistUsername] = useState("username");
  const [registPassword, setRgistPassword] = useState("password");
  const [registConfirmPswd, setRegistConfirmPswd] =
    useState("confirm password");

  //input error inform style
  const informStyle = {
    width: "376px",
    "backgroundColor": "rgb(251, 89, 83)",
    "borderColor": "rgb(251, 89, 83)",
    color: "white",
  };

  const successStyle = {
    width: "376px",
    "backgroundColor": "rgb(114, 226, 168)",
    "borderColor": "rgb(114, 226, 168)",
    color: "white",
  };


  // username error alert
  const dealUsernameError = (error) => {
    setUsernameIndiStyle(informStyle);
    setUsernameWord(error);
    setTimeout(() => {
      setUsernameIndiStyle({});
      setUsernameWord("username");
    }, 2000);
  };
  // password error alert
  const dealPasswordError = (error) => {
    setPasswordIndiStyle(informStyle);
    setPasswordWord(error);
    setTimeout(() => {
      setPasswordIndiStyle({});
      setPasswordWord("password");
    }, 2000);
  };
  // register username error alert
  const dealRegistUsernameError = (error, style = informStyle) => {
    setUsernameRegistIndiStyle(style);
    setRegistUsername(error);
    setTimeout(() => {
      setUsernameRegistIndiStyle({});
      setRegistUsername("username");
    }, 2000);
  };
  // register password error alert
  const dealRegistPasswordError = (error, style = informStyle) => {
    setPasswordRegistIndiStyle(style);
    setRgistPassword(error);
    setTimeout(() => {
      setPasswordRegistIndiStyle({});
      setRgistPassword("password");
    }, 2000);
  };
  // register confirmation error alert
  const dealRegistPasswordConfirmError = (error, style = informStyle) => {
    setPswdConfirmRegistIndiStyle(style);
    setRegistConfirmPswd(error);
    setTimeout(() => {
      setPswdConfirmRegistIndiStyle({});
      setRegistConfirmPswd("confirm password");
    }, 2000);
  };

  // record user login input
  const handleLoginValueChange = (event) => {
    setLoginValues({ ...loginValues, [event.target.name]: event.target.value });
  };
  // record user register input
  const handleRegisterValueChange = (event) => {
    setRegisterValues({
      ...registerValues,
      [event.target.name]: event.target.value,
    });
  };

  //login input check
  const validateLoginForm = () => {
    const { username, password } = loginValues;
    if (username === "") {
      dealUsernameError("please enter username");
      return false;
    } else if (password === "") {
      dealPasswordError("please enter password");
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (validateLoginForm()) {
      const { username, password } = loginValues;
      const { data } = await loginAPI(username, password);
      if (data.status === false && data.err === "username") {
        dealUsernameError(data.msg);
      }
      if (data.status === false && data.err === "password") {
        dealPasswordError(data.msg);
      }
      if (data.status === true) {
        resetUserData(data.user);
        navigate("/home");
      }
    }
  };
  //register input check
  const validateRegisterForm = () => {
    const { password, confirmPassword, username } = registerValues;
    if (password !== confirmPassword) {
      dealRegistPasswordConfirmError("password not consistent");
      return false;
    } else if (username.length < 3) {
      dealRegistUsernameError("Username should be greater than 2 characters");
      return false;
    } else if (password.length < 8) {
      dealRegistPasswordError("Password should be greater than 7 characters");
      return false;
    }
    return true;
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    if (validateRegisterForm()) {
      const { username, password } = registerValues;
      const { data } = await registerAPI(username, password);
       if (data.status === false && data.err === "username") {
         dealRegistUsernameError(data.msg);
       }
       if (data.status === true) {
         dealRegistUsernameError("register secceed!", successStyle);
         dealRegistPasswordError("",successStyle);
         dealRegistPasswordConfirmError("", successStyle);
         setTimeout(() => {
           registerUsernameRef.current.value = "";
           registerPasswordRef.current.value = "";
           registerConfirmPswdRef.current.value = "";
           expand1();
         }, 2000);
       }
    }
  };

  //login/register switch
  const expand1 = () => {
    setLoginArea({ width: "380px", opacity: "1" });
    setRegistArea({ width: "103px", opacity: "0.3" });
    setLoginExpand1({ height: "30px" });
    setLoginExpand2({ height: "350px" });
  };

  const expand2 = () => {
    setLoginArea({ width: "103px", opacity: "0.3" });
    setRegistArea({ width: "380px", opacity: "1" });
    setLoginExpand2({ height: "30px" });
    setLoginExpand1({ height: "350px" });
  };

  return (
    <div className="loginBody">
      {/* <div className="loginAndRegisterLeft"></div> */}
      <div className="loginAndRegister">
        {/* initial anmiation */}
        <div className="cover">
          <img src={LogoPure} alt="logo" className="logoBig"></img>
        </div>

        {/* Logo and its intro */}
        <div className="head">
          <img src={Logo} alt="logo" className="logo"></img>
          <div className="simpWordIntro">Tiny Chat tinyC! (๑ˉ∀ˉ๑) </div>
        </div>

        {/* Login & register */}
        <div className="body">
          {/* Login */}
          <div className="login" style={loginArea}>
            <div className="loginWord" onClick={expand1} style={logineExpand1}>
              Login
            </div>
            {/* Login Form */}
            <form
              action=""
              onSubmit={(event) => handleLoginSubmit(event)}
              className="loginForm"
            >
              {/* username */}
              <div className="loginInputContiner">
                <div className="loginInputName" style={usernameIndiStyle}>
                  {usernameWord}
                </div>
                <input
                  className="loginInput"
                  type="text"
                  name="username"
                  onChange={(e) => handleLoginValueChange(e)}
                  min="3"
                ></input>
              </div>
              {/* password */}
              <div className="loginInputContiner">
                <div className="loginInputName" style={passwordIndiStyle}>
                  {passwordWord}
                </div>
                <input
                  className="loginInput"
                  type="password"
                  name="password"
                  onChange={(e) => handleLoginValueChange(e)}
                ></input>
              </div>
              {/* Submit */}
              <div className="loginInputContiner2">
                <button type="submit" className="loginInputBtn2">
                  Login
                </button>
                {/* <div className="loginInputBtn3">Register</div> */}
              </div>
            </form>
          </div>

          {/* Register */}
          <div className="login" style={registArea}>
            <div className="loginWord" onClick={expand2} style={logineExpand2}>
              Regist
            </div>
            {/* username */}
            <form
              action=""
              className="loginForm"
              onSubmit={(event) => handleRegisterSubmit(event)}
            >
              <div className="loginInputContiner">
                <div className="loginInputName" style={usernameRegistIndiStyle}>
                  {registUsername}
                </div>
                <input
                  ref={registerUsernameRef}
                  className="loginInput"
                  type="text"
                  name="username"
                  onChange={(e) => handleRegisterValueChange(e)}
                />
              </div>
              {/* password */}
              <div className="loginInputContiner">
                <div className="loginInputName" style={passwordRegistIndiStyle}>
                  {registPassword}
                </div>
                <input
                  ref={registerPasswordRef}
                  type="password"
                  className="loginInput"
                  name="password"
                  onChange={(e) => handleRegisterValueChange(e)}
                />
              </div>
              {/* Confirm password */}
              <div className="loginInputContiner">
                <div
                  className="loginInputName loginInputNameSmall"
                  style={pswdConfirmRegistIndiStyle}
                >
                  {registConfirmPswd}
                </div>
                <input
                  ref={registerConfirmPswdRef}
                  type="password"
                  className="loginInput"
                  name="confirmPassword"
                  onChange={(e) => handleRegisterValueChange(e)}
                />
              </div>
              {/* Submit */}
              <div className="loginInputContiner2">
                <button type="submit" className="loginInputBtn2">
                  Regist
                </button>
                {/* <div className="loginInputBtn3">Register</div> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
