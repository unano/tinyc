const {
  accessChat,
  fetchChat,
  createGropuChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  getAllGroupChats,
  applyJoinGroupChat,
  dealJoinGroupChat,
  fetchChatApplications,
  fetchMyJoinedChats,
  fetchMyCreatedChats,
  getGroupChat,
  dealRefuseGroupChat,
  changeGroupAvatar,
  deleteGroupAvatar,
  changeGroupBackground,
  deleteGroupBackground,
  deleteGroup,
  exitFromGroup,
  diceChats6,
  diceChats20,
  searchChats
} = require("../controllers/chatController");
const router = require("express").Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./client/src/images");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});
const { verify } = require("../authenticate");


const upload = multer({ storage: storage });
router.post("/access/", accessChat);  //not used
router.get("/allChat/", verify, fetchChat);
// router.post("/createGroup/", upload.single("image"), createGropuChat);
router.post("/createGroup/", verify, createGropuChat);
router.put("/group/rename/", verify, renameGroup);
router.post("/group/addUser/", verify, addToGroup);
router.delete("/group/removeUser/", verify, removeFromGroup);
router.get("/group/all", getAllGroupChats);  
router.post("/group/apply", verify, applyJoinGroupChat);
router.post("/group/deal", verify, dealJoinGroupChat);
router.post("/group/refuse", verify, dealRefuseGroupChat);
router.get("/group/getApplies", verify, fetchChatApplications);
router.get("/group/MyJoinedChats", verify, fetchMyJoinedChats);
router.get("/group/MyCreatedChats", verify, fetchMyCreatedChats);
router.get("/getGroupChat/:_id", getGroupChat);
router.put("/group/changeAvatar", verify, changeGroupAvatar);
router.delete("/group/deleteAvatar", verify, deleteGroupAvatar);
router.put("/group/changeBackground", verify, changeGroupBackground);
router.delete("/group/deleteBackground", verify, deleteGroupBackground);
router.delete("/group/delete", verify, deleteGroup);
router.post("/group/exit", verify, exitFromGroup);
router.get("/diceChats6", diceChats6);
router.get("/diceChats20", diceChats20);
router.get("/searchGroup/:keyword", searchChats);

module.exports = router;
