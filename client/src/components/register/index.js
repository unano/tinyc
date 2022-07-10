import { useState, useRef } from "react";
import { registerAPI } from "../../api/api";

const Register = ({ expandLogin }) => {
  //save register data
  const [registerValues, setRegisterValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const registerUsernameRef = useRef({});
  const registerPasswordRef = useRef({});
  const registerConfirmPswdRef = useRef({});

  const [disabled, setDisabled] = useState(false);

  //inform style setting
  const [usernameInform, setUsernameInform] = useState(false);
  const [passwordInform, setPasswordInform] = useState(false);
    const [passwordConfirmInform, setPasswordConfirmInform] = useState(false);

  //set inform word
  const [registUsername, setRegistUsername] = useState("username");
  const [registPassword, setRgistPassword] = useState("password");
  const [registConfirmPswd, setRegistConfirmPswd] =
    useState("confirm password");
  // register username error alert
  const dealRegistUsernameError = (error, success=false) => {
    if (success) setUsernameInform("success");
    else setUsernameInform(true);
    setRegistUsername(error);
    setTimeout(() => {
      setUsernameInform(false);
      setRegistUsername("username");
    }, 2000);
  };
  // register password error alert
  const dealRegistPasswordError = (error, success = false) => {
    if (success) setPasswordInform("success");
    else setPasswordInform(true);
    setRgistPassword(error);
    setTimeout(() => {
      setPasswordInform(false);
      setRgistPassword("password");
    }, 2000);
  };
  // register confirmation error alert
  const dealRegistPasswordConfirmError = (error, success = false) => {
    if (success) setPasswordConfirmInform("success");
    else setPasswordConfirmInform(true);
    setRegistConfirmPswd(error);
    setTimeout(() => {
      setPasswordConfirmInform(false);
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
    if (disabled) return;
    if (validateRegisterForm()) {
      setDisabled(true);
      const { username, password } = registerValues;
      const { data } = await registerAPI(username, password);
      if (data.status === false && data.err === "username") {
        dealRegistUsernameError(data.msg);
      }
      if (data.status === false && data.err === "password") {
        dealRegistPasswordError(data.msg);
      }
      if (data.status === true) {
        dealRegistUsernameError("register secceed!", true);
        dealRegistPasswordError("", true);
        dealRegistPasswordConfirmError("", true);
        setTimeout(() => {
          registerUsernameRef.current.value = "";
          registerPasswordRef.current.value = "";
          registerConfirmPswdRef.current.value = "";
          expandLogin();
        }, 2000);
      }
      setDisabled(false);
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
          <div
            className={
              usernameInform
                ? usernameInform === "success"
                  ? "loginInputSuccess"
                  : "loginInputInform"
                : "loginInputName"
            }
          >
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
          <div
            className={
              passwordInform
                ? passwordInform === "success"
                  ? "loginInputSuccess"
                  : "loginInputInform"
                : "loginInputName"
            }
          >
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
            className={
              passwordConfirmInform
                ? passwordConfirmInform === "success"
                  ? "loginInputSuccess"
                  : "loginInputInform"
                : "loginInputName loginInputNameSmall"
            }
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
