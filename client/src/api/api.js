import axios from "axios";

const host = "http://localhost:8080";
const loginRoute = `${host}/api/user/login`;
const registerRoute = `${host}/api/user/register`;

export const login = (username, password) => {
  return axios
    .post(loginRoute, {username, password})
    .then(res => res);
};

export const register = (username, password) =>{
  return axios
  .post(registerRoute,{username,password})
  .then(res => res)
}