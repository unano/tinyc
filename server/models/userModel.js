const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  intro: {
    type: String,
    max: 50,
  },
  isOnline: {
    type: Boolean
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "Friends",
    },
  ],
});

module.exports = mongoose.model("Users", userSchema);
