const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Messages = require("../models/messageModel");
let fs = require("fs");
module.exports.accessChat = async (req, res, next) => {
    const { presentUserId, userId } = req.body;
    if(!userId){
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
          path:'latestMessage.sender',
          select: "username"
    })

      if(isChat.length > 0 ){
          res.send(isChat[0]);
      }else{
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

module.exports.fetchChat = async (req, res, next) => {
    const { presentUserId } = req.body;
    try{
        Chat.find({ users: { $elemMatch: { $eq: presentUserId } } })
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

    }catch(err){
        next(err)
    }
}

module.exports.createGropuChat = async (req, res, next) => {
  const { chatName, users, applyerId, avatar, background } = req.body;
  var bgName;
  const avatarName = "avatar" + Date.now() + ".png";
  const avatarPath = "./client/src/images/" + avatarName;
  const avatarImage = avatar.replace(/^data:([A-Za-z-+/]+);base64,/, "");
  fs.writeFileSync(avatarPath, avatarImage, { encoding: "base64" });
  if(background){
    bgName = "gpbg" + Date.now() + ".png";
    const bgPath = "./client/src/images/background/" + bgName;
    const bgImage = background.replace(/^data:([A-Za-z-+/]+);base64,/, "");
    fs.writeFileSync(bgPath, bgImage, { encoding: "base64" });
  }
  else{
    bgName=null;
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

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password -friends")
      .populate("groupAdmin", "-password -friends");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports.sendMessage = async (req, res) => {
  const { sender, content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: sender,
    message: "hello everyone!",
    chat: chatId,
  };

  try {
    var message = await Messages.create(newMessage);

    message = await message.populate("sender", "username avatarImage");
    message = await message.populate("chat");
    message = await Users.populate(message, {
      path: "chat.users",
      select: "username avatarImage",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports.renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

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
};

module.exports.addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
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
};

module.exports.removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;
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
  };

module.exports.getAllGroupChats = async (req, res, next) => {
  try {
    const users = await Chat.find({ isGroupChat: true }).populate(
      "users",
      "-password -friends -isOnline"
    );
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};


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

module.exports.dealJoinGroupChat = async (req, res, next) => {
  const { applyer_id, admin_id, group_id } = req.body;
  const isAdmin = await Chat.findOne({ _id: group_id, groupAdmin: admin_id });
  if (isAdmin) {
    const chat = await Chat.updateOne(
      { _id: group_id },
      { $addToSet: { users: applyer_id } }
    );
    res.status(200).json(chat);
  }
};

module.exports.applyJoinGroupChat = async (req, res, next) => {
  const { applyer_id, group_id } = req.body;
  const chat = await Chat.updateOne(
    { _id: group_id },
    { $addToSet: { applyingUsers: applyer_id } }
  );
  res.status(200).json(chat);
};

module.exports.fetchChatApplications = async (req, res, next) => {
  const { _id, group_id } = req.body;
  const chat = await Chat.findOne(
    {
      $and: [{ _id: group_id }, { groupAdmin: _id }],
    },
    { _id: 1, users: 1, chatName: 1, avatar :1}
  );
  res.status(200).json(chat);
};