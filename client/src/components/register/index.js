import { useState, useRef } from "react";
import { registerAPI } from "../../api/api";

const Register = ({ expandLogin, informStyle, successStyle }) => {
  //save register data
  const [registerValues, setRegisterValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const registerUsernameRef = useRef({});
  const registerPasswordRef = useRef({});
  const registerConfirmPswdRef = useRef({});


  //inform style setting
  const [usernameRegistIndiStyle, setUsernameRegistIndiStyle] = useState();
  const [passwordRegistIndiStyle, setPasswordRegistIndiStyle] = useState();
  const [pswdConfirmRegistIndiStyle, setPswdConfirmRegistIndiStyle] =
    useState();

  //set inform word
  const [registUsername, setRegistUsername] = useState("username");
  const [registPassword, setRgistPassword] = useState("password");
  const [registConfirmPswd, setRegistConfirmPswd] =
    useState("confirm password");
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
  // record user register input
  const handleRegisterValueChange = (event) => {
    setRegisterValues({
      ...registerValues,
      [event.target.name]: event.target.value,
    });
  };

  //login input check

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
        dealRegistPasswordError("", successStyle);
        dealRegistPasswordConfirmError("", successStyle);
        setTimeout(() => {
          registerUsernameRef.current.value = "";
          registerPasswordRef.current.value = "";
          registerConfirmPswdRef.current.value = "";
          expandLogin();
        }, 2000);
      }
    }
  };

  return (
      <>
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
    </>
  );
};
export default Register;
