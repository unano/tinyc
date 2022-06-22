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
  friends: [
    {
      unique: true,
      type: Schema.Types.ObjectId,
      ref: "Friends",
    },
  ],
});

module.exports = mongoose.model("Users", userSchema);
