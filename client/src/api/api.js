import axios from "axios";

const host = "http://localhost:8080";
const loginRoute = `${host}/api/user/login`;
const registerRoute = `${host}/api/user/register`;
const getFriendsRoute = `${host}/api/user/getFriends`;
const searchUserRoute = `${host}/api/user/searchUser`;
const applyFriendrRoute = `${host}/api/user/applyFriend`;
export const login = (username, password) => {
  return axios
    .post(loginRoute, {username, password})
    .then(res => res);
};

export const register = (username, password) =>{
  return axios
  .post(registerRoute,{username,password})
  .then(res => res);
}

export const searchUser = (username) => {
  return axios.post(searchUserRoute, { username }).then((res) => res);
};

export const getFriends = (_id) => {
  return axios.post(getFriendsRoute, { _id }).then((res) => res);
};

export const applyFriends = (sender, receiver) => {
  return axios.post(applyFriendrRoute, { sender, receiver }).then((res) => res);
};