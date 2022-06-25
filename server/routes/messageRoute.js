const {
  addMessage,
  getMessages,
  allMessages,
  sendMessage,
} = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/allmsg/", allMessages);
router.post("/sendmsg/", sendMessage);

module.exports = router;
