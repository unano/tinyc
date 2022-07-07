const {
  addMessage,
  getMessages,
  allMessages,
  sendMessage,
} = require("../controllers/messageController");
const router = require("express").Router();
const { verify } = require("../authenticate");

router.post("/addmsg/", verify, addMessage);   //not used
router.post("/getmsg/", verify, getMessages);  //not used
router.get("/allmsg/:chatId", verify, allMessages);
router.post("/sendmsg/", verify, sendMessage);

module.exports = router;
