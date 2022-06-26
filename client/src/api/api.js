import axios from "axios";

const host = "http://localhost:8080";
const loginRoute = `${host}/api/user/login`;
const registerRoute = `${host}/api/user/register`;
const getFriendsRoute = `${host}/api/user/getFriends`;
const searchUserRoute = `${host}/api/user/searchUser`;
const applyFriendrRoute = `${host}/api/user/applyFriend`;
// const sendMessageRoute = `${host}/api/message/addmsg`;
const recieveMessageRoute = `${host}/api/message/getmsg`;
const getChatsRoute = `${host}/api/chat/allChat`;
const sendMessageRoute = `${host}/api/message/sendmsg`;
const getMessagesRoute = `${host}/api/message/allmsg`;
const uploadAvatarRoute = `${host}/api/user/uploadAvatar`;


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

// export const sendMsg = (from, to , message) => {
//   return axios.post(sendMessageRoute, {from, to, message}).then((res) => res);
// };

export const receiveMsg = (from, to) => {
  return axios.post(recieveMessageRoute, { from, to }).then((res) => res);
};

export const getChats = (presentUserId) => {
  return axios.post(getChatsRoute, { presentUserId }).then((res) => res);
};

export const sendMsg = (sender, content, chatId) => {
  return axios
    .post(sendMessageRoute, { sender, content, chatId })
    .then((res) => res);
};

export const getMsgs = (chatId) => {
  return axios
    .post(getMessagesRoute, { chatId })
    .then((res) => res);
};

export const uploadAvatar = (data) => {
  return axios.post(uploadAvatarRoute, data).then((res) => res);
};
