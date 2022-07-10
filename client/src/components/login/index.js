import { useState, useContext } from "react";
import { loginAPI } from "../../api/api";
import { AuthContext } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [usernameWord, setUsernameWord] = useState("username");
  const [passwordWord, setPasswordWord] = useState("password");
  const [usernameInform, setUsernameInform] = useState(false);
  const [passwordInform, setPasswordInform] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const { resetUserData } = useContext(AuthContext);

  //save login data
  const [loginValues, setLoginValues] = useState({
    username: "",
    password: "",
  });

  // record user login input
  const handleChange = (event) => {
    setLoginValues({ ...loginValues, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (disabled) return;
    if (validateForm()) {
      setDisabled(true);
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
      setDisabled(false);
    }
  };

  const dealUsernameError = (error) => {
    setUsernameInform(true);
    setUsernameWord(error);
    setTimeout(() => {
      setUsernameInform(false);
      setUsernameWord("username");
    }, 2000);
  };
  // password error alert
  const dealPasswordError = (error) => {
    setPasswordInform(true);
    setPasswordWord(error);
    setTimeout(() => {
      setPasswordInform(false);
      setPasswordWord("password");
    }, 2000);
  };

  const validateForm = () => {
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
  return (
    <>
      {/* Login Form */}
      <form
        action=""
        onSubmit={(event) => handleSubmit(event)}
        className="loginForm"
      >
        {/* username */}
        <div className="loginInputContiner">
          <div
            className={
              usernameInform
                ? "loginInputInform"
                : "loginInputName"
            }
          >
            {usernameWord}
          </div>
          <input
            className="loginInput"
            type="text"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          ></input>
        </div>
        {/* password */}
        <div className="loginInputContiner">
          <div
            className={
              passwordInform
                ? "loginInputInform"
                : "loginInputName"
            }
          >
            {passwordWord}
          </div>
          <input
            className="loginInput"
            type="password"
            name="password"
            onChange={(e) => handleChange(e)}
          ></input>
        </div>
        {/* Submit */}
        <div className="loginInputContiner2">
          <button type="submit" className="loginInputBtn2">
            Login
          </button>
        </div>
      </form>
    </>
  );
};
export default Login;
