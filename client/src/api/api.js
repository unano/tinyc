import axios from "axios";

const host = "http://localhost:8080";
const userRoot = `${host}/api/user`;
const messageRoot = `${host}/api/message`;
const chatRoot = `${host}/api/chat`;

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
const changeIntroRoute = `${userRoot}/changeIntro`;
const setOnlineRoute = `${userRoot}/setOnline`;
const setOfflineRoute = `${userRoot}/setOffline`;

// const sendMessageRoute = `${host}/api/message/addmsg`;
const recieveMessageRoute = `${messageRoot}/getmsg`;
const sendMessageRoute = `${messageRoot}/sendmsg`;
const getMessagesRoute = `${messageRoot}/allmsg`;

const getChatsRoute = `${chatRoot}/allChat`;
const createGroupChatsRoute = `${chatRoot}/createGroup`;
const addGroupUserRoute = `${chatRoot}/addUser`;
const removeGroupUserRoute = `${chatRoot}/removeUser`;
const allGroupChatRoute = `${chatRoot}/group/all`;
const applyGroupChatJoinRoute = `${chatRoot}/group/apply`;
const dealGroupChatApplyRoute = `${chatRoot}/group/deal`;
const getGroupChatAppliesRoute = `${chatRoot}/group/getApplies`;
const getMyCreatedChatsRoute = `${chatRoot}/group/MyCreatedChats`;
const getMyJoinedChatsRoute = `${chatRoot}/group/MyJoinedChats`;
const getGroupChatRoute = `${chatRoot}/getGroupChat`;
const refuseChatApplyRoute = `${chatRoot}/group/refuse`;
const renameGroupRoute = `${chatRoot}/renameGroup`;
const changeGroupAvatarRoute = `${chatRoot}/group/changeAvatar`;
const deleteGroupAvatarRoute = `${chatRoot}/group/deleteAvatar`;
const changeGroupBackgroundRoute = `${chatRoot}/group/changeBackground`;
const deleteGroupBackgroundRoute = `${chatRoot}/group/deleteBackground`;
const deleteGroupRoute = `${chatRoot}/group/delete`;
const exitGroupRoute = `${chatRoot}/exitGroup`;

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

export const uploadAvatarAPI = (_id, base64image) => {
  return axios.post(uploadAvatarRoute, {_id, base64image}).then((res) => res);
};

export const deleteAvatarAPI = (avatar) => {
  return axios.post(deleteAvatarRoute, { avatar }).then((res) => res);
};
export const changeUsernameAPI = (_id, username) => {
  return axios.put(changeUsernameRoute, { _id, username }).then((res) => res);
};

export const changeIntroAPI = (_id, intro) => {
  return axios.put(changeIntroRoute, { _id, intro }).then((res) => res);
};

export const changePasswordAPI = (_id, password) => {
  return axios.put(changeUsernameRoute, { _id, password }).then((res) => res);
};

export const createGroupChatsAPI = (chatName, users, applyerId, avatar, background) => {
  return axios
    .post(createGroupChatsRoute, {
      chatName,
      users,
      applyerId,
      avatar,
      background,
    })
    .then((res) => res);
};

export const addGroupUserAPI = (chatId, userId) => {
  return axios.post(addGroupUserRoute, { chatId, userId }).then((res) => res);
};

export const removeGroupUserAPI = (chatId, userId) => {
  return axios
    .post(removeGroupUserRoute, { chatId, userId })
    .then((res) => res);
};

export const setOnlineAPI = (_id) => {
  return axios.put(setOnlineRoute, { _id }).then((res) => res);
};

export const setOfflineAPI = (_id) => {
  return axios.put(setOfflineRoute, { _id }).then((res) => res);
};

export const getAllGroupChatAPI = () => {
  return axios.get(allGroupChatRoute).then((res) => res);
};


export const dealGroupChatApplyAPI = (applyer_id, admin_id, group_id) => {
  return axios
    .post(dealGroupChatApplyRoute, { applyer_id, admin_id, group_id })
    .then((res) => res);
};

export const applyGroupChatJoinAPI = ( applyer_id, group_id) => {
  return axios
    .post(applyGroupChatJoinRoute, { applyer_id, group_id })
    .then((res) => res);
};


export const getGroupChatAppliesAPI = (_id, group_id) => {
  return axios
    .get(getGroupChatAppliesRoute, { _id, group_id })
    .then((res) => res);
};

export const getMyCreatedChatsAPI = (_id) => {
  return axios.post(getMyCreatedChatsRoute, { _id }).then((res) => res);
};

export const getMyJoinedChatsAPI = (_id ) => {
  return axios
    .post(getMyJoinedChatsRoute, { _id })
    .then((res) => res);
};

export const getGroupChat = (_id) =>{
  return axios.post(getGroupChatRoute, { _id }).then((res) => res);

}

export const refuseChatApplyAPI = (applyer_id, admin_id, group_id) => {
  return axios
    .post(refuseChatApplyRoute, { applyer_id, admin_id, group_id })
    .then((res) => res);
};

export const renameGroupAPI = (chatId, chatName) => {
  return axios.post(renameGroupRoute, { chatId, chatName }).then((res) => res);
};

export const changeGroupAvatar = (chatId, avatar) => {
  return axios
    .post(changeGroupAvatarRoute, { chatId, avatar })
    .then((res) => res);
};

export const deleteGroupAvatarAPI = ( avatar) => {
  return axios
    .post(deleteGroupAvatarRoute, { avatar })
    .then((res) => res);
};


export const changeGroupBackgroundAPI = (chatId, background) => {
  return axios
    .post(changeGroupBackgroundRoute, { chatId, background })
    .then((res) => res);
};

export const deleteGroupBackgroundAPI = (avatar) => {
  return axios.post(deleteGroupBackgroundRoute, { avatar }).then((res) => res);
};

export const deleteGroupAPI = (_id) => {
  return axios.post(deleteGroupRoute, { _id }).then((res) => res);
};

export const exitGroupAPI = (group_id, user_id) => {
  return axios.post(exitGroupRoute, { group_id, user_id }).then((res) => res);
};
