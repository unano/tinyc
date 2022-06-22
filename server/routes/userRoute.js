const {
  login,
  register,
  friendRequest,
  acceptFriend,
  denyFriend,
  searchUser,
  getFriends
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.post("/applyFriend", friendRequest);
router.post("/acceptFriend", acceptFriend);
router.post("/denyFriend", denyFriend);
router.post("/searchUser", searchUser);
router.post("/getFriends", getFriends);

module.exports = router;
