import {createContext,  useEffect, useState, } from 'react';
import { useNavigate } from "react-router-dom";
import { setOfflineAPI } from "../api/api";
export const AuthContext = createContext(null);

const AuthContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState({});
  const [reloadStorage, setRreloadStorage] = useState();
  const navigate = useNavigate();

  const resetUserData =(data)=>{
    setCurrentUser(data);
    localStorage.setItem(
      "token",
      JSON.stringify(data)
    );
  }
  const logout = async () => {
    await setOfflineAPI(currentUser._id);
    localStorage.clear();
    navigate("/");
  };
  useEffect(() => {
    const result = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("token")));
      }
    };
    result();
  }, [reloadStorage]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setRreloadStorage,
        resetUserData,
        logout
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;