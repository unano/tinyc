import {createContext, useContext, useEffect, useState, } from 'react';
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext(null);

const AuthContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState({});
  const [reloadStorage, setRreloadStorage] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const result = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )
        );
      }
    };
    result();
  }, [reloadStorage]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setRreloadStorage,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;