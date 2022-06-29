const Chat = require("../models/chatModel");
const User = require("../models/userModel");
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
    const { chatName, users, applyerId } = req.body;
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
         avatar: req.file.filename,
       });

       const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
         .populate("users", "-password -friends")
         .populate("groupAdmin", "-password -friends");

       res.status(200).json(fullGroupChat);
     } catch (error) {
       res.status(400);
       throw new Error(error.message);
     }
}

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