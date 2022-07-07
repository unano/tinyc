const User = require("../models/userModel");
const Friend = require("../models/friendModel");
const Chat = require("../models/chatModel");
const Messages = require("../models/messageModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
let fs = require("fs");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
//route: /user


const generateAccessToken = (user) =>{
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
}

const generateRefreshToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
};

//   method:POST  route: /refreshToken
module.exports.refreshToken = async(req, res, next) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(401).json("no authentication");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("invalid refresh token");
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, users) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(users);
    const newRefreshToken = generateRefreshToken(users);

    refreshTokens.push(newRefreshToken);
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};



//   method:POST  route: /login
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const fetchedUser = await User.findOne({ username });
    if (!fetchedUser)
      return res
        .status(200)
        .json({ msg: "No such user", status: false, err: "username" });
    const isPasswordValid = await bcrypt.compare(
      password,
      fetchedUser.password
    );
    if (!isPasswordValid)
      return res.json({
        msg: "invalid password",
        status: false,
        err: "password",
      });
      let user = fetchedUser.toObject();
      delete user.password;
      delete user.friends;
      user.accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      refreshTokens.push(refreshToken);
      user.refreshToken = refreshToken;
    return res.status(200).json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

//   method:POST  route: /register
module.exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({
        msg: "Username already used",
        status: false,
        err: "username"
      });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      avatarImage: "default.png",
      intro: ""
    });
    delete user.password;
    return res.status(200).json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

//   method:GET route: /getFriends
module.exports.getFriends = async (req, res, next) => {
  try {
    const { _id } = req.user;
    console.log(req.user)
    const test = await User.aggregate([
      {
        $lookup: {
          from: Friend.collection.name,
          let: { friends: "$friends" },
          pipeline: [
            {
              $match: {
                recipient: mongoose.Types.ObjectId(_id),
                $expr: { $in: ["$_id", "$$friends"] },
              },
            },
            { $project: { status: 1 } },
          ],
          as: "friends",
        },
      },
      {
        $addFields: {
          friendsStatus: {
            $ifNull: [{ $min: "$friends.status" }, 0],
          },
        },
      },
      { $project: { username: 1, avatarImage: 1, friendsStatus: 1, intro: 1 ,isOnline: 1} },
      {$match: {friendsStatus: 3}}
    ]);
    if (test)
      return res
        .status(200)
        .json({ status: true, friends: test});
  } catch (error) {
    next(error);
  }
};

//   method:GET  route: /getFriendsReq
module.exports.getFriendsRequest = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const test = await User.aggregate([
      {
        $lookup: {
          from: Friend.collection.name,
          let: { friends: "$friends" },
          pipeline: [
            {
              $match: {
                recipient: mongoose.Types.ObjectId(_id),
                $expr: { $in: ["$_id", "$$friends"] },
              },
            },
            { $project: { status: 1 } },
          ],
          as: "friends",
        },
      },
      {
        $addFields: {
          friendsStatus: {
            $ifNull: [{ $min: "$friends.status" }, 0],
          },
        },
      },
      { $project: { username: 1, avatarImage: 1, friendsStatus: 1 } },
      { $match: { friendsStatus: 1 } },
    ]);
    if (test) return res.status(200).json({ status: true, friends: test });
  } catch (error) {
    next(error);
  }
};

//   method:GET  route:/getSendedReq
module.exports.getSendedRequest = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const test = await User.aggregate([
      {
        $lookup: {
          from: Friend.collection.name,
          let: { friends: "$friends" },
          pipeline: [
            {
              $match: {
                recipient: mongoose.Types.ObjectId(_id),
                $expr: { $in: ["$_id", "$$friends"] },
              },
            },
            { $project: { status: 1 } },
          ],
          as: "friends",
        },
      },
      {
        $addFields: {
          friendsStatus: {
            $ifNull: [{ $min: "$friends.status" }, 0],
          },
        },
      },
      { $project: { username: 1, avatarImage: 1, friendsStatus: 1 } },
      { $match: { friendsStatus: 2 } },
    ]);
    if (test) return res.status(200).json({ status: true, friends: test });
  } catch (error) {
    next(error);
  }
};

//   method:GET  route: /searchUser/:username
module.exports.searchUser = async(req, res, next) =>{
  try {
    const { username } = req.query;
    const findByUsername = await User.findOne({ username });
    if (findByUsername) 
    return res.status(200).json({ 
      status: true, 
      user:{
        username, 
        _id:findByUsername._id, 
        avatarImage:findByUsername.avatarImage
      }
    });
    else return res.json({
      status: false,
      msg:"cannot find the user"
    });
  } catch (error) {
    next(error);
  }
}


//   method:GET  route: /applyFriend
module.exports.friendRequest = async (req, res, next) => {
  try {
    const {receiver} = req.body;
    const {_id } = req.user;
    const sender = _id;
    const exist = await Friend.findOne(
      { requester: sender, recipient: receiver }
    );
    const docA = await Friend.findOneAndUpdate(
      { requester: sender, recipient: receiver },
      { $set: { status: 1 } },
      { upsert: true, new: true }
    );
    const docB = await Friend.findOneAndUpdate(
      { recipient: sender, requester: receiver },
      { $set: { status: 2 } },
      { upsert: true, new: true }
    );
    if(!exist){
      const updateSender = await User.findOneAndUpdate(
        { _id: sender },
        { $push: { friends: docA._id } }
      );
      const updateReceiver = await User.findOneAndUpdate(
        { _id: receiver },
        { $push: { friends: docB._id } }
      );
      if (updateReceiver && updateSender)
        return res.status(200).json({ msg: "Friend request sended" });
    }
    else{
      return res.status(200).json({ msg: "Duplicate friend request" });
    }
  } catch (error) {
    next(error);
  }
};

//   method:GET  route:/acceptFriend
module.exports.acceptFriend = async(req, res, next) => {
  try{
    //bidirection bind
    const { receiver } = req.body;
    const { _id } = req.user;
    const sender = _id;
    const acceptStep1 = await Friend.findOneAndUpdate(
        { requester: sender, recipient: receiver },
        { $set: { status: 3 }}
    )
    const acceptStep2 = await Friend.findOneAndUpdate(
        { recipient: sender, requester: receiver },
        { $set: { status: 3 }}
    )

    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: sender } } },
        { users: { $elemMatch: { $eq: receiver } } },
      ],
    });

    if (isChat.length == 0) {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [sender, receiver],
      };
      const createdChat = await Chat.create(chatData);
      var newMessage = {
        sender: sender,
        message: "hello",
        chat: createdChat._id,
      };
      var message = await Messages.create(newMessage);
      message = await message.populate("sender", "username avatarImage");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "username avatarImage",
      });
      await Chat.findByIdAndUpdate(createdChat._id, { latestMessage: message });
    }

    if (acceptStep1 && acceptStep2)
      return res.status(200).json({ msg: "Friend request accepted" });

  }catch (error) {
    next(error);
  }
}

//   method:POST  route:/denyFriend
module.exports.denyFriend = async (req, res, next) => {
  try {
    const { receiver } = req.body;
    const { _id } = req.user;
    const sender = _id;
    const docA = await Friend.findOneAndRemove({
      requester: sender,
      recipient: receiver,
    });
    const docB = await Friend.findOneAndRemove({
      recipient: sender,
      requester: receiver,
    });
    const updatesender = await User.findOneAndUpdate(
      { _id: sender },
      { $pull: { friends: docA._id } }
    );
    const updatereceiver = await User.findOneAndUpdate(
      { _id: receiver },
      { $pull: { friends: docB._id } }
    );
    if (updatesender && updatereceiver)
      return res.status(200).json({ msg: "Friend request denied" });
  } catch (error) {
    next(error);
  }
};


// module.exports.uploadAvatar = async (req, res, next) => {
//   try {
//     const {_id } = req.body;
//     const upload = await User.findOneAndUpdate(
//       { _id: _id },
//       { $set: { avatarImage: req.file.filename } },
//       { new: true }
//     ).select("-password -friends");
//     return res.json({ status: true, upload });
//   } catch (ex) {
//     next(ex);
//   }
// };

//   method:POST  route: /uploadAvatar
module.exports.uploadAvatar = async (req, res, next) => {
  try {
    const name = Date.now() + ".png";
    const path = "./client/src/images/" + name;
    const { _id } = req.user;
    const { base64image } = req.body;

    // to convert base64 format into random filename
    const base64Data = base64image.replace(/^data:([A-Za-z-+/]+);base64,/, "");

    fs.writeFileSync(path, base64Data, { encoding: "base64" });

    const upload = await User.findOneAndUpdate(
      { _id: _id },
      { $set: { avatarImage: name } },
      { new: true }
    ).select("-password -friends");
    return res.json({ status: true, upload });
  } catch (ex) {
    next(ex);
  }
};

//   method:DELETE  route: /deleteAvatar
module.exports.deleteAvatar = async (req, res, next) => {
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

//   method:PUT  route: /changeUsername
module.exports.changeUsername = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { username } = req.body;
    const upload = await User.findOneAndUpdate(
      { _id: _id },
      { $set: { username: username } },
      { new: true }
    ).select("-password -friends");
    return res.json({ status: true, upload });
  } catch (ex) {
    next(ex);
  }
};

//   method:PUT  route: /changePassword
module.exports.changePassword = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { password } = req.body;
    const upload = await User.findOneAndUpdate(
      { _id: _id },
      { $set: { password: password } },
      { new: true }
    ).select("-password -friends");
    return res.json({ status: true, upload });
  } catch (ex) {
    next(ex);
  }
};

//   method:PUT  route: /changeIntro
module.exports.changeIntro = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { intro } = req.body;
    const upload = await User.findOneAndUpdate(
      { _id: _id },
      { $set: { intro: intro } },
      { new: true }
    ).select("-password -friends");
    return res.json({ status: true, upload });
  } catch (ex) {
    next(ex);
  }
};

//   method:PUT  route: /setOnline
module.exports.setIsOnline = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const upload = await User.findOneAndUpdate(
      { _id: _id },
      { $set: { isOnline: true } },
      { new: true }
    ).select("-password -friends");
    return res.json({ status: true, upload });
  } catch (ex) {
    next(ex);
  }
};

//   method:PUT  route: /setOffline
module.exports.setIsOffline = async (req, res, next) => {
  try {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    const { _id } = req.user;
    const upload = await User.findOneAndUpdate(
      { _id: _id },
      { $set: { isOnline: false } },
      { new: true }
    ).select("-password -friends");
    return res.json({ status: true, msg:"successfully logout" });
  } catch (ex) {
    next(ex);
  }
};

