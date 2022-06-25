const Messages = require("../models/messageModel");
const Users = require("../models/userModel");
const Chat = require("../models/chatModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.allMessages = async (req, res) => {
  try {
    const messages = await Messages.find({ chat: req.body.chatId })
      .populate("sender", "username avatarImage")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports.sendMessage = async (req, res) => {
  console.log(req.body)
  const { sender, content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: sender,
    message: content,
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

