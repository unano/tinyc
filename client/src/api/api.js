import axios from "axios";

const host = "http://localhost:8080";
const userRoot = `${host}/api/user`;
const messageRoot = `${host}/api/message`;

const loginRoute = `${userRoot}/login`;
const registerRoute = `${userRoot}/register`;
const getFriendsRoute = `${userRoot}/getFriends`;
const getFriendsReqRoute = `${userRoot}/getFriendsReq`;
const acceptFriendReqRoute = `${userRoot}/acceptFriend`;
const denyFriendReqRoute = `${userRoot}/denyFriend`;
const getSendedFriendsReqRoute = `${userRoot}/getSendedReq`;
const searchUserRoute = `${userRoot}/searchUser`;
const applyFriendrRoute = `${userRoot}/applyFriend`;
const uploadAvatarRoute = `${userRoot}/uploadAvatar`;
const deleteAvatarRoute = `${userRoot}/deleteAvatar`;
const changeUsernameRoute = `${userRoot}/changeUsername`;
const changePasswordRoute = `${userRoot}/changePassword`;

// const sendMessageRoute = `${host}/api/message/addmsg`;
const recieveMessageRoute = `${messageRoot}/getmsg`;
const sendMessageRoute = `${messageRoot}/sendmsg`;
const getMessagesRoute = `${messageRoot}/allmsg`;

const getChatsRoute = `${host}/api/chat/allChat`;

export const loginAPI = (username, password) => {
  return axios.post(loginRoute, { username, password }).then((res) => res);
};

export const registerAPI = (username, password) => {
  return axios.post(registerRoute, { username, password }).then((res) => res);
};

export const searchUserAPI = (username) => {
  return axios.post(searchUserRoute, { username }).then((res) => res);
};

export const getFriendsAPI = (_id) => {
  return axios.post(getFriendsRoute, { _id }).then((res) => res);
};

export const getFriendsReqAPI = (_id) => {
  return axios.post(getFriendsReqRoute, { _id }).then((res) => res);
};

export const getsendedFriendRedAPI = (_id) => {
  return axios.post(getSendedFriendsReqRoute, { _id }).then((res) => res);
};

export const applyFriendsAPI = (sender, receiver) => {
  return axios.post(applyFriendrRoute, { sender, receiver }).then((res) => res);
};

export const acceptFriendsAPI = (sender, receiver) => {
  return axios
    .post(acceptFriendReqRoute, { sender, receiver })
    .then((res) => res);
};

export const denyFriendsAPI = (sender, receiver) => {
  return axios
    .post(denyFriendReqRoute, { sender, receiver })
    .then((res) => res);
};

// export const sendMsg = (from, to , message) => {
//   return axios.post(sendMessageRoute, {from, to, message}).then((res) => res);
// };

export const receiveMsgAPI = (from, to) => {
  return axios.post(recieveMessageRoute, { from, to }).then((res) => res);
};

export const getChatsAPI = (presentUserId) => {
  return axios.post(getChatsRoute, { presentUserId }).then((res) => res);
};

export const sendMsgAPI = (sender, content, chatId) => {
  return axios
    .post(sendMessageRoute, { sender, content, chatId })
    .then((res) => res);
};

export const getMsgsAPI = (chatId) => {
  return axios.post(getMessagesRoute, { chatId }).then((res) => res);
};

export const uploadAvatarAPI = (data) => {
  return axios.post(uploadAvatarRoute, data).then((res) => res);
};

export const deleteAvatarAPI = (avatar) => {
  return axios.post(deleteAvatarRoute, { avatar }).then((res) => res);
};
export const changeUsernameAPI = (_id, username) => {
  return axios.put(changeUsernameRoute, { _id, username }).then((res) => res);
};

export const changePasswordAPI = (_id, password) => {
  return axios.put(changeUsernameRoute, { _id, password }).then((res) => res);
};
