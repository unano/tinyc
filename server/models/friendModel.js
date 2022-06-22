const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const friendsSchema = new Schema(
  {
    requester: { type: Schema.Types.ObjectId, ref: "Users" },
    recipient: { type: Schema.Types.ObjectId, ref: "Users" },
    status: {
      type: Number,
      enums: [
        0, //'add friend',
        1, //'requested',
        2, //'pending',
        3, //'friends'
      ],
    },
  }
);

module.exports = mongoose.model("Friends", friendsSchema);
