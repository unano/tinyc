import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setOfflineAPI } from '../api/api' //refreshTokenAPI
// import axios from "axios";
// import jwt_decode from "jwt-decode";
export const AuthContext = createContext(null)

const AuthContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState({})
  const [reloadStorage, setRreloadStorage] = useState()
  const [disabled, setDisabled] = useState(false)
  const navigate = useNavigate()

  // const refreshToken = async () => {
  //   try {
  //     const data = JSON.parse(localStorage.getItem("token"));
  //     const res = await refreshTokenAPI(data?.refreshToken);
  //     const newData = {
  //       ...data,
  //       accessToken: res.data.accessToken,
  //       refreshToken: res.data.refreshToken,
  //     };
  //     localStorage.setItem("token", JSON.stringify(newData));
  //     console.log(res.data);
  //     return res.data;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const axiosJWT = axios.create();
  // axios.interceptors.request.use(async (config) => {
  //   let currentDate = new Date();
  //   const data = JSON.parse(localStorage.getItem("token"));
  //   console.log(data)
  //   if (data?.accessToken) {
  //     console.log(data);
  //     const decodeToken = jwt_decode(data.accessToken);
  //     if (decodeToken.exp * 1000 < currentDate.getTime()) {
  //       const data = await refreshToken();
  //       config.headers["authorization"] = "Bearer " + data.accessToken;
  //     }
  //   }
  //   return config;
  // },(error)=>{
  //   return Promise.reject(error);
  // });

  // axios.interceptors.request.use(
  //   async (config) => {
  //     const session = JSON.parse(localStorage.getItem("session"));

  //     if (session?.accessToken) {
  //       config.headers = {
  //         ...config.headers,
  //         authorization: `Bearer ${session?.accessToken}`,
  //       };
  //     }

  //     return config;
  //   },
  //   (error) => Promise.reject(error)
  // );

  // axios.interceptors.response.use(
  //   (response) => response,
  //   async (error) => {
  //     const config = error?.config;

  //     if (error?.response?.status === 401 && !config?.sent) {
  //       config.sent = true;

  //       const result = await refreshToken();

  //       if (result?.accessToken) {
  //         config.headers = {
  //           ...config.headers,
  //           authorization: `Bearer ${result?.accessToken}`,
  //         };
  //       }

  //       return axios(config);
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  //用户更新头像，姓名时，更新存储的token信息
  const resetUserData = (data) => {
    let prevUserData = JSON.parse(localStorage.getItem('token'))
    let newData = { ...prevUserData, ...data }
    setCurrentUser(newData)
    localStorage.setItem('token', JSON.stringify(newData))
  }

  // const resetUserData =(data)=>{
  //   setCurrentUser(data);
  //   localStorage.setItem(
  //     "token",
  //     JSON.stringify(data)
  //   );
  // }
  const logout = async () => {
    if (disabled) return
    setDisabled(true)
    await setOfflineAPI(currentUser._id)
    localStorage.clear()
    setDisabled(false)
    navigate('/')
  }
  useEffect(() => {
    const result = async () => {
      if (!localStorage.getItem('token')) {
        navigate('/login')
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem('token')))
      }
    }
    result()
  }, [reloadStorage])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setRreloadStorage,
        resetUserData,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
