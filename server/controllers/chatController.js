const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Messages = require("../models/messageModel");
let fs = require("fs");

const isAdmin = async (user_id, chat_id) => {
  const result = await Chat.findOne({
    $and: [{ _id: chat_id }, { groupAdmin: user_id }],
  });
  return result;
};

//not used
module.exports.accessChat = async (req, res, next) => {
  const { presentUserId, userId } = req.body;
  if (!userId) {
    return res.status(400).json({ msg: "No id send." });
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: presentUserId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password -friends")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [presentUserId, userId],
    };
  }
  try {
    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password -friends"
    );

    res.status(200).send(FullChat);
  } catch (err) {
    next(err);
  }
};

//   method:GET  route: /allChat
//   成功时返回： 聊天对象集合
module.exports.fetchChat = async (req, res, next) => {
  const { _id } = req.user;
  try {
    Chat.find({ users: { $elemMatch: { $eq: _id } } })
      .populate("users", "-password -friends")
      .populate("groupAdmin", "-password -friends")
      .populate("latestMessage")
      .sort({ updatedAt: 1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "username",
        });
        res.status(200).send(results);
      });
  } catch (err) {
    next(err);
  }
};

//   method:POST  route: /createGroup
//   成功时返回： 成功通知
module.exports.createGropuChat = async (req, res, next) => {
  const { chatName, users, avatar, background } = req.body;
  const { _id } = req.user;
  const applyerId = _id;
  var bgName;
  const avatarName = "avatar" + Date.now() + ".png";
  const avatarPath = "./client/src/images/" + avatarName;
  const avatarImage = avatar.replace(/^data:([A-Za-z-+/]+);base64,/, "");
  fs.writeFileSync(avatarPath, avatarImage, { encoding: "base64" });
  if (background) {
    bgName = "gpbg" + Date.now() + ".png";
    const bgPath = "./client/src/images/background/" + bgName;
    const bgImage = background.replace(/^data:([A-Za-z-+/]+);base64,/, "");
    fs.writeFileSync(bgPath, bgImage, { encoding: "base64" });
  } else {
    bgName = null;
  }

  const user = await User.findById(applyerId).select("-password");
  if (!users || !chatName) {
    return res.status(400).send({ msg: "lack property" });
  }
  if (users.length < 2) {
    return res.status(400).send({ msg: "user >3 is required" });
  }
  users.push(user);
  try {
    const groupChat = await Chat.create({
      chatName: chatName,
      users: users,
      isGroupChat: true,
      groupAdmin: user,
      avatar: avatarName,
      background: bgName,
    });
    var newMessage = {
      sender: applyerId,
      message: "hello everyone!",
      chat: groupChat._id,
    };
    var message = await Messages.create(newMessage);

    message = await message.populate("sender", "username avatarImage");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username avatarImage",
    });
    await Chat.findByIdAndUpdate(groupChat._id, { latestMessage: message });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id });
    // .populate("users", "-password -friends")
    // .populate("groupAdmin", "-password -friends");
    if (fullGroupChat) {
      res.status(200).json({ status: true, msg: "new Chat Created" });
    }
  } catch (error) {
    next(err);
  }
};

//   method:PUT  route: /group/rename
//   成功时返回： 更新后的目标群组对象   *有管理员验证*
module.exports.renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const { _id } = req.user;
  if (await isAdmin(_id, chatId)) {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password -friends")
      .populate("groupAdmin", "-password -friends");

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  } else {
    res.status(401).json("No permission in operating with current credit");
  }
};

//   method:POST  route: /group/addUser
//   成功时返回： 更新后的目标群组对象   *有管理员验证*
module.exports.addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const { _id } = req.user;
  if (await isAdmin(_id, chatId)) {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password -friends")
      .populate("groupAdmin", "-password -friends");
    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  } else {
    res.status(401).json("No permission in operating with current credit");
  }
};

//   method:DELETE route: /group/removeUser
//   成功时返回： 更新后的目标群组对象   *有管理员验证*
module.exports.removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const { _id } = req.user;
  //判断用户是否为该群管理员，否则无权限进行操作
  if (await isAdmin(_id, chatId)) {
    //判断被删除用户是否为该群管理员，否则无法进行删除
    if (await isAdmin(userId, chatId)) {
      res.status(401).json("Group admin cannot be deleted");
    } else {
          const chat = await Chat.findOne({
            $and: [
              { _id: chatId },
              { "users.3": { $exists: true } },
              { isGroupChat: true },
            ],
          });
          //判断该群人数是否大于等于4人，否则无法进行删除（3人为组建群的最小人数，故至少4人才能进行删除操作）
      if (chat) {
        const removed = await Chat.findByIdAndUpdate(
          chatId,
          {
            $pull: { users: userId },
          },
          {
            new: true,
          }
        )
          .populate("users", "-password -friends")
          .populate("groupAdmin", "-password -friends");

        if (!removed) {
          res.status(404);
          throw new Error("Chat Not Found");
        } else {
          res.json(removed);
        }
      } else {
        res.status(401).json("Group member can't be less than 3");
      }
    }
  } else {
    res.status(401).json("No permission in operating with current credit");
  }
};

//   method:GET  route: /group/all
module.exports.getAllGroupChats = async (req, res, next) => {
  try {
    const users = await Chat.find({ isGroupChat: true }).populate(
      "users",
      "-password -friends -isOnline"
    );
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

//   method:POST  route: /group/apply
module.exports.applyJoinGroupChat = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const applyer_id = _id;
    const { group_id } = req.body;
    const chat = await Chat.updateOne(
      { _id: group_id },
      { $addToSet: { applyingUsers: applyer_id } }
    );
    res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
};

//   method:POST  route: /group/deal
module.exports.dealJoinGroupChat = async (req, res, next) => {
  const { applyer_id, group_id } = req.body;
  const { _id } = req.user;
  if (await isAdmin(_id, group_id)) {
    const accept = await Chat.updateOne(
      { _id: group_id },
      { $addToSet: { users: applyer_id } }
    );
    const chat = await Chat.findByIdAndUpdate(
      { _id: group_id },
      { $pull: { applyingUsers: applyer_id } }
    );
    res.status(200).json(chat);
  } else {
    res.status(401).json("No permission in operating with current credit");
  }
};

//   method:POST  route: /group/refuse
module.exports.dealRefuseGroupChat = async (req, res, next) => {
  const { applyer_id, group_id } = req.body;
  const { _id } = req.user;
  if (await isAdmin(_id, group_id)) {
    const chat = await Chat.findByIdAndUpdate(
      { _id: group_id },
      { $pull: { applyingUsers: applyer_id } }
    );
    res.status(200).json(chat);
  } else {
    res.status(401).json("No permission in operating with current credit");
  }
};

//   method:GET  route: /group/getApplies
module.exports.fetchChatApplications = async (req, res, next) => {
  try {
    const { group_id } = req.body;
    const { _id } = req.user;
    const chat = await Chat.findOne(
      {
        $and: [{ _id: group_id }, { groupAdmin: _id }],
      },
      { _id: 1, users: 1, chatName: 1, avatar: 1 }
    );
    res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
};

//   method:GET  route: /group/MyJoinedChats
module.exports.fetchMyJoinedChats = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const chat = await Chat.find(
      {
        $and: [
          { users: _id },
          { isGroupChat: true },
          { groupAdmin: { $ne: _id } },
        ],
      },
      { _id: 1, users: 1, chatName: 1, avatar: 1 }
    );
    res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
};

//   method:GET  route: /group/MyCreatedChats
module.exports.fetchMyCreatedChats = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const chat = await Chat.find(
      {
        $and: [{ users: _id }, { groupAdmin: _id }],
      },
      { _id: 1, users: 1, chatName: 1, avatar: 1, applyingUsers: 1 }
    );
    res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
};

//  method:GET  route: /getGroupChat/:_id
module.exports.getGroupChat = async (req, res, next) => {
  try {
    const { _id } = req.query;
    const chat = await Chat.findOne(
      { _id: _id },
      {
        _id: 1,
        users: 1,
        chatName: 1,
        avatar: 1,
        applyingUsers: 1,
        background: 1,
        groupAdmin: 1,
      }
    )
      .populate("applyingUsers", "-password -friends")
      .populate("users", "-password -friends")
      .populate("groupAdmin", "-password -friends");
    res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
};

//  method:PUT  route: /group/changeAvatar
module.exports.changeGroupAvatar = async (req, res) => {
  const { chatId, avatar } = req.body;
  const { _id } = req.user;
  if (await isAdmin(_id, chatId)) {
    const avatarName = "avatar" + Date.now() + ".png";
    const avatarPath = "./client/src/images/" + avatarName;
    const avatarImage = avatar.replace(/^data:([A-Za-z-+/]+);base64,/, "");
    fs.writeFileSync(avatarPath, avatarImage, { encoding: "base64" });

    try {
      await Chat.findByIdAndUpdate(chatId, { avatar: avatarName });
      res.status(200).json({ msg: "updated" });
    } catch (err) {
      next(err);
    }
  } else {
    res.status(401).json("No permission in operating with current credit");
  }
};

//  method:DELETE  route: /group/deleteAvatar
module.exports.deleteGroupAvatar = async (req, res, next) => {
  try {
    const path = "./client/src/images/";
    const { avatar } = req.body;
    if (avatar !== "default.png") {
      fs.unlinkSync(path + avatar);
    }
    return res.json({ status: true, result: "deleted" });
  } catch (ex) {
    next(ex);
  }
};

//  method:PUT  route:/group/changeBackground
module.exports.changeGroupBackground = async (req, res) => {
  const { chatId, background } = req.body;
  const { _id } = req.user;
  if (await isAdmin(_id, chatId)) {
    const bgName = "gpbg" + Date.now() + ".png";
    const bgPath = "./client/src/images/background/" + bgName;
    const bgImage = background.replace(/^data:([A-Za-z-+/]+);base64,/, "");
    fs.writeFileSync(bgPath, bgImage, { encoding: "base64" });

    try {
      await Chat.findByIdAndUpdate(chatId, { background: bgName });
      res.status(200).json({ msg: "updated" });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  } else {
    res.status(401).json("No permission in operating with current credit");
  }
};

// method:DELETE  route:  /group/deleteBackground
module.exports.deleteGroupBackground = async (req, res, next) => {
  try {
    const path = "./client/src/images/background/";
    const { avatar } = req.body;
    if (avatar && avatar !== "default.png") {
      fs.unlinkSync(path + avatar);
    }
    return res.json({ status: true, result: "deleted" });
  } catch (ex) {
    next(ex);
  }
};

// method:DELETE  route:  /group/delete
module.exports.deleteGroup = async (req, res, next) => {
  const { _id } = req.user;
  const { chatId } = req.body;
  if (await isAdmin(_id, chatId)) {
    try {
      await Chat.deleteOne({ _id: chatId });
      return res.json({ status: true, result: "deleted" });
    } catch (ex) {
      next(ex);
    }
  } else {
    res.status(401).json("No permission in operating with current credit");
  }
};

// method:POST  route:  /group/exitGroup
module.exports.exitFromGroup = async (req, res, next) => {
  const { group_id } = req.body;
  const { _id } = req.user;
  const user_id = _id;
  try {
    const chat = await Chat.findByIdAndUpdate(
      { _id: group_id },
      { $pull: { users: user_id } }
    );
    res.status(200).json(chat);
  } catch (ex) {
    next(ex);
  }
};

// method:GET  route:  /diceChats6
module.exports.diceChats6 = async (req, res, next) => {
  try {
    const chat = await Chat.aggregate([
      { $match: { isGroupChat: true } },
      { $sample: { size: 6 } },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $project: {
          _id: 1,
          chatName: 1,
          isGroupChat: 1,
          "users.username": 1,
          "users._id": 1,
          "users.avatarImage": 1,
          avatar: 1,
          groupAdmin: 1,
          background: 1,
          applyingUsers: 1,
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json(chat);
  } catch (ex) {
    next(ex);
  }
};

// method:GET  route:  /diceChats20
module.exports.diceChats20 = async (req, res, next) => {
  try {
    const chat = await Chat.aggregate([
      { $match: { isGroupChat: true } },
      { $sample: { size: 20 } },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $project: {
          _id: 1,
          chatName: 1,
          isGroupChat: 1,
          "users.username": 1,
          "users._id": 1,
          "users.avatarImage": 1,
          avatar: 1,
          groupAdmin: 1,
          background: 1,
          applyingUsers: 1,
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json(chat);
  } catch (ex) {
    next(ex);
  }
};

// method:GET route:  /searchGroup
module.exports.searchChats = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    var rgx = new RegExp(keyword, "i");
    const chat = await Chat.find({ chatName: { $regex: rgx } }).populate(
      "users",
      "-password -friends -isOnline"
    );
    res.status(200).json(chat);
  } catch (ex) {
    next(ex);
  }
};
