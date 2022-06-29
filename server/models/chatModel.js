const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  chatName: { type: String, trim: true },
  isGroupChat: { type: Boolean, default: false },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Messages",
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  avatar: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Chats", chatSchema);