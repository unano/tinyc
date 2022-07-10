import axios from "axios";

const host = "https://tinyc-chat-app.herokuapp.com";
//"http://localhost:8080";
const userRoot = `${host}/api/user`;
const messageRoot = `${host}/api/message`;
const chatRoot = `${host}/api/chat`;

// -----------------------user route-----------------------
const loginRoute = `${userRoot}/login`;
const registerRoute = `${userRoot}/register`;
const getFriendsRoute = `${userRoot}/getFriends`;
const getFriendsReqRoute = `${userRoot}/getFriendsReq`;
const acceptFriendReqRoute = `${userRoot}/acceptFriend`;
const denyFriendReqRoute = `${userRoot}/denyFriend`;
const getSendedFriendsReqRoute = `${userRoot}/getSendedReq`;
const searchUserRoute = `${userRoot}/searchUser/:username`;
const applyFriendrRoute = `${userRoot}/applyFriend`;
const uploadAvatarRoute = `${userRoot}/uploadAvatar`;
const deleteAvatarRoute = `${userRoot}/deleteAvatar`;
const changeUsernameRoute = `${userRoot}/changeUsername`;
const changePasswordRoute = `${userRoot}/changePassword`;
const changeIntroRoute = `${userRoot}/changeIntro`;
const setOnlineRoute = `${userRoot}/setOnline`;
const setOfflineRoute = `${userRoot}/setOffline`;
const refreshTokenRoute = `${userRoot}/refreshToken`;

// -----------------------message route-----------------------
// const sendMessageRoute = `${host}/api/message/addmsg`;
const recieveMessageRoute = `${messageRoot}/getmsg`;
const sendMessageRoute = `${messageRoot}/sendmsg`;
const getMessagesRoute = `${messageRoot}/allmsg/:chatId`;

// -----------------------chat route-----------------------
const getChatsRoute = `${chatRoot}/allChat`;
const createGroupChatsRoute = `${chatRoot}/createGroup`;
const addGroupUserRoute = `${chatRoot}/group/addUser/`;
const removeGroupUserRoute = `${chatRoot}/group/removeUser`;
const allGroupChatRoute = `${chatRoot}/group/all`;
const applyGroupChatJoinRoute = `${chatRoot}/group/apply`;
const dealGroupChatApplyRoute = `${chatRoot}/group/deal`;
const getGroupChatAppliesRoute = `${chatRoot}/group/getApplies`;
const getMyCreatedChatsRoute = `${chatRoot}/group/MyCreatedChats`;
const getMyJoinedChatsRoute = `${chatRoot}/group/MyJoinedChats`;
const getGroupChatRoute = `${chatRoot}/getGroupChat/:_id`;
const refuseChatApplyRoute = `${chatRoot}/group/refuse`;
const renameGroupRoute = `${chatRoot}/group/rename`;
const changeGroupAvatarRoute = `${chatRoot}/group/changeAvatar`;
const deleteGroupAvatarRoute = `${chatRoot}/group/deleteAvatar`;
const changeGroupBackgroundRoute = `${chatRoot}/group/changeBackground`;
const deleteGroupBackgroundRoute = `${chatRoot}/group/deleteBackground`;
const deleteGroupRoute = `${chatRoot}/group/delete`;
const exitGroupRoute = `${chatRoot}/group/exit`;
const diceChats6Route = `${chatRoot}/diceChats6`;
const diceChats20Route = `${chatRoot}/diceChats20`;
const searchGroupRoute = `${chatRoot}/searchGroup/:keyword`;

// add header
axios.interceptors.request.use(
  (config) => {
    const data = JSON.parse(localStorage.getItem("token"));
    if (data) {
      config.headers["authorization"] = `Bearer ${
        JSON.parse(localStorage.getItem("token")).accessToken
      }`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// -----------------------user route axios-----------------------

//   /login
// 登录   发送： 用户名 密码
export const loginAPI = (username, password) => {
  return axios.post(loginRoute, { username, password }).then((res) => res);
};

//   /register
// 注册  发送： 用户名 密码 密码确认
export const registerAPI = (username, password) => {
  return axios.post(registerRoute, { username, password }).then((res) => res);
};

//   /getFriends
// 获取登录用户的好友  发送： 无   *有用户验证*
export const getFriendsAPI = () => {
  return axios.get(getFriendsRoute).then((res) => res);
};

//   /getFriendsReq
// 获取好友申请  发送： 无  *有用户验证*
export const getFriendsReqAPI = () => {
  return axios.get(getFriendsReqRoute).then((res) => res);
};

//   /getSendedReq
// 获取自己的好友申请  发送： 无   *有用户验证*
export const getsendedFriendRedAPI = () => {
  return axios.get(getSendedFriendsReqRoute).then((res) => res);
};

//   /searchUser/:username
// 查找用户  发送： 搜索的用户名(params)
export const searchUserAPI = (username) => {
  return axios
    .get(searchUserRoute, { params: { username } })
    .then((res) => res);
};

//   /applyFriend
// 申请好友  发送： 想要添加的好友的ID   *有用户验证*
export const applyFriendsAPI = (receiver) => {
  return axios.post(applyFriendrRoute, { receiver }).then((res) => res);
};

//   /acceptFriend
// 接收好友申请  发送： 发送申请者的ID  *有用户验证*
export const acceptFriendsAPI = (receiver) => {
  return axios.post(acceptFriendReqRoute, { receiver }).then((res) => res);
};

//   /denyFriend
// 拒绝好友申请  发送： 发送申请者的ID  *有用户验证*
export const denyFriendsAPI = (receiver) => {
  return axios.post(denyFriendReqRoute, { receiver }).then((res) => res);
};

//   /uploadAvatar
// 上传新头像  发送： 新头像的base64字符串   *有用户验证*
export const uploadAvatarAPI = (base64image) => {
  return axios.post(uploadAvatarRoute, { base64image }).then((res) => res);
};

//   /deleteAvatar
// 更新头像后删除  发送： 头像文件名
export const deleteAvatarAPI = (avatarId) => {
  return axios
    .delete(deleteAvatarRoute, { data: { avatarId } })
    .then((res) => res);
};

//   /changeUsername
// 注册  发送： 用户名 密码 密码确认   *有用户验证*
export const changeUsernameAPI = (username) => {
  return axios.put(changeUsernameRoute, { username }).then((res) => res);
};

//   /changePassword
// 注册  发送： 用户名 密码 密码确认   *有用户验证*
export const changePasswordAPI = (password) => {
  return axios.put(changePasswordRoute, { password }).then((res) => res);
};

//   /changeIntro
// 注册  发送： 用户名 密码 密码确认   *有用户验证*
export const changeIntroAPI = (intro) => {
  return axios.put(changeIntroRoute, { intro }).then((res) => res);
};

//   /setOnline
// 上线  发送： 无  *有用户验证*
export const setOnlineAPI = () => {
  return axios.put(setOnlineRoute).then((res) => res);
};

//   /setOffline
// 登出/下线  发送： 无   *有用户验证*
export const setOfflineAPI = () => {
  return axios.put(setOfflineRoute).then((res) => res);
};

//   /refreshToken
// 更新token  发送： 更新用token
export const refreshTokenAPI = async (token) => {
  const res = await axios.post(refreshTokenRoute, { token });
  return res;
};

// -----------------------message route axios-----------------------

//not used
export const receiveMsgAPI = (to) => {
  return axios.post(recieveMessageRoute, { to }).then((res) => res);
};

//   /sendmsg
// 在指定群发消息  发送： 当前群ID 要发送的聊天内容   *有用户验证*
export const sendMsgAPI = (content, chatId) => {
  return axios.post(sendMessageRoute, { content, chatId }).then((res) => res);
};

//   /allmsg/:chatId
// 获取当前聊天的所有消息  发送：当前群ID(params)   *有用户验证*
export const getMsgsAPI = (chatId) => {
  return axios.get(getMessagesRoute, { params: { chatId } }).then((res) => res);
};

// export const sendMsg = (from, to , message) => {
//   return axios.post(sendMessageRoute, {from, to, message}).then((res) => res);
// };

// -----------------------chat route axios-----------------------

//   /allChat
export const getChatsAPI = () => {
  return axios.get(getChatsRoute).then((res) => res);
};

//   /createGroup
// 创建群组   发送： 群组名 群用户 群头像 群背景  *有用户验证*
export const createGroupChatsAPI = (chatName, users, avatar, background) => {
  return axios
    .post(createGroupChatsRoute, {
      chatName,
      users,
      avatar,
      background,
    })
    .then((res) => res);
};

//   /group/rename
// 重命名群组   发送： 群ID  新群名  *有管理员验证*
export const renameGroupAPI = (chatId, chatName) => {
  return axios.put(renameGroupRoute, { chatId, chatName }).then((res) => res);
};

//   /group/addUser
// 添加群员   发送： 群ID  添加的用户ID  *有管理员验证*
export const addGroupUserAPI = (chatId, userId) => {
  return axios.post(addGroupUserRoute, { chatId, userId }).then((res) => res);
};

//   /group/removeUser
// 移除群员   发送： 群ID  移除的用户ID  *有管理员验证*
export const removeGroupUserAPI = (chatId, userId) => {
  return axios
    .delete(removeGroupUserRoute, { data: { chatId, userId } })
    .then((res) => res);
};

//   /group/all
// 获取所有《多人》群   发送： 无
export const getAllGroupChatAPI = () => {
  return axios.get(allGroupChatRoute).then((res) => res);
};

//   /group/apply
// 申请加群   发送： 群ID   *有用户验证*
export const applyGroupChatJoinAPI = (group_id) => {
  return axios.post(applyGroupChatJoinRoute, { group_id }).then((res) => res);
};

//   /group/deal
// 处理加群申请   发送： 申请人ID 群ID   *有管理员验证*
export const dealGroupChatApplyAPI = (applyer_id, group_id) => {
  return axios
    .post(dealGroupChatApplyRoute, { applyer_id, group_id })
    .then((res) => res);
};

//   /group/refuse
// 拒绝加群申请   发送： 申请人ID 群ID   *有管理员验证*
export const refuseChatApplyAPI = (applyer_id, group_id) => {
  return axios
    .post(refuseChatApplyRoute, { applyer_id, group_id })
    .then((res) => res);
};

//  /group/getApplies
// 获取当前群的所有申请   发送： 群ID   *有管理员验证*
export const getGroupChatAppliesAPI = (group_id) => {
  return axios.get(getGroupChatAppliesRoute, { group_id }).then((res) => res);
}; //??????????????????????????????????????????????????????????????

//   /group/MyJoinedChats
// 获取我加入的所有群   发送： 无   *有用户验证*
export const getMyJoinedChatsAPI = () => {
  return axios.get(getMyJoinedChatsRoute).then((res) => res);
};

//    /group/MyCreatedChats
// 获取我创建的所有群   发送： 无   *有用户验证*
export const getMyCreatedChatsAPI = () => {
  return axios.get(getMyCreatedChatsRoute).then((res) => res);
};

//   /getGroupChat/:_id
// 获取选择的群信息   发送： 群ID(params)
export const getGroupChat = (_id) => {
  return axios.get(getGroupChatRoute, { params: { _id } }).then((res) => res);
};

//   /group/changeAvatar
// 换群头像  发送： 群ID 群头像   *有管理员验证*  *********改成params*********
export const changeGroupAvatar = (chatId, avatar) => {
  return axios
    .put(changeGroupAvatarRoute, { chatId, avatar })
    .then((res) => res);
};

//   /group/deleteAvatar
// （换头像后）删除旧头像   发送：群头像
export const deleteGroupAvatarAPI = (avatarId) => {
  return axios
    .delete(deleteGroupAvatarRoute, { data: { avatarId } })
    .then((res) => res);
};

//    /group/changeBackground
// 换背景  发送： 群ID 群头像   *有管理员验证*
export const changeGroupBackgroundAPI = (chatId, background) => {
  return axios
    .put(changeGroupBackgroundRoute, { chatId, background })
    .then((res) => res);
};

//   /group/deleteBackground
// （换背景后）删除旧背景  发送： 群背景
export const deleteGroupBackgroundAPI = (avatarId) => {
  return axios
    .delete(deleteGroupBackgroundRoute, { data: { avatarId } })
    .then((res) => res);
};

//   /group/delete
// 删除群  发送： 群ID    *有管理员验证*
export const deleteGroupAPI = (chatId) => {
  return axios
    .delete(deleteGroupRoute, { data: { chatId } })
    .then((res) => res);
};

//   /group/exitGroup
// 退出群  发送： 群ID  用户ID  *有用户验证*
export const exitGroupAPI = (group_id) => {
  return axios.post(exitGroupRoute, { group_id }).then((res) => res);
};

//   /diceChats6
// 随机获取6个群   发送： 无
export const diceChats6 = () => {
  return axios.get(diceChats6Route).then((res) => res);
};

//   /diceChats20
// 随机获取20个群   发送： 无
export const diceChats20 = () => {
  return axios.get(diceChats20Route).then((res) => res);
};

//   /searchGroup/:keyword
// 搜索群   发送： 搜索关键字
export const searchGroupChatsAPI = (keyword) => {
  return axios
    .get(searchGroupRoute, { params: { keyword } })
    .then((res) => res);
};
