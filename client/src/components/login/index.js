import { useState, useContext } from "react";
import { loginAPI, setOnlineAPI } from "../../api/api";
import { AuthContext } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";

const Login = ({ informStyle }) => {
  const [usernameWord, setUsernameWord] = useState("username");
  const [passwordWord, setPasswordWord] = useState("password");
  const [usernameIndiStyle, setUsernameIndiStyle] = useState();
  const [passwordIndiStyle, setPasswordIndiStyle] = useState();
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
    if (validateForm()) {
      const { username, password } = loginValues;
      const { data } = await loginAPI(username, password);
      if (data.status === false && data.err === "username") {
        dealUsernameError(data.msg);
      }
      if (data.status === false && data.err === "password") {
        dealPasswordError(data.msg);
      }
      if (data.status === true) {
        setOnlineAPI(data.user._id);
        resetUserData(data.user);
        navigate("/home");
      }
    }
  };

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
          <div className="loginInputName" style={usernameIndiStyle}>
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
          <div className="loginInputName" style={passwordIndiStyle}>
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
