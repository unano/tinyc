const {
  accessChat,
  fetchChat,
  createGropuChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");
const router = require("express").Router();

router.post("/access/", accessChat);
router.post("/allChat/", fetchChat);
router.post("/createGroup/", createGropuChat);
router.post("/renameGroup/", renameGroup);
router.post("/addUser/", addToGroup);
router.post("/removeUser/", removeFromGroup);
module.exports = router;
