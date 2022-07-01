const User = require("../models/userModel");
const Friend = require("../models/friendModel");
const bcrypt = require("bcrypt");
const { stringify } = require("nodemon/lib/utils");
const mongoose = require("mongoose");
let fs = require("fs");

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
    return res.status(200).json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

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

module.exports.getFriends = async (req, res, next) => {
  try {
    const { _id } = req.body;
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

module.exports.getFriendsRequest = async (req, res, next) => {
  try {
    const { _id } = req.body;
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

module.exports.getSendedRequest = async (req, res, next) => {
  try {
    const { _id } = req.body;
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

module.exports.searchUser = async(req, res, next) =>{
  try {
    const { username } = req.body;
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

module.exports.friendRequest = async (req, res, next) => {
  try {
    const {sender, receiver} = req.body;
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

module.exports.acceptFriend = async(req, res, next) => {
  try{
    //bidirection bind
    const { sender, receiver } = req.body;
    const acceptStep1 = await Friend.findOneAndUpdate(
        { requester: sender, recipient: receiver },
        { $set: { status: 3 }}
    )
    const acceptStep2 = await Friend.findOneAndUpdate(
        { recipient: sender, requester: receiver },
        { $set: { status: 3 }}
    )
    if (acceptStep1 && acceptStep2)
      return res.status(200).json({ msg: "Friend request accepted" });

  }catch (error) {
    next(error);
  }
}

module.exports.denyFriend = async (req, res, next) => {
  try {
    const { sender, receiver } = req.body;
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


module.exports.uploadAvatar = async (req, res, next) => {
  try {
    const {_id } = req.body;
    const upload = await User.findOneAndUpdate(
      { _id: _id },
      { $set: { avatarImage: req.file.filename } },
      { new: true }
    ).select("-password -friends");
    return res.json({ status: true, upload });
  } catch (ex) {
    next(ex);
  }
};


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


module.exports.changeUsername = async (req, res, next) => {
  try {
    const { _id, username } = req.body;
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

module.exports.changePassword = async (req, res, next) => {
  try {
    const { _id, password } = req.body;
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

module.exports.changeIntro = async (req, res, next) => {
  try {
    const { _id, intro } = req.body;
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

module.exports.setIsOnline = async (req, res, next) => {
  try {
    console.log("gg")
    const { _id } = req.body;
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

module.exports.setIsOffline = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const upload = await User.findOneAndUpdate(
      { _id: _id },
      { $set: { isOnline: false } },
      { new: true }
    ).select("-password -friends");
    return res.json({ status: true, upload });
  } catch (ex) {
    next(ex);
  }
};


