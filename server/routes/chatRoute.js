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
  exitFromGroup
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
const upload = multer({ storage: storage });
router.post("/access/", accessChat);
router.post("/allChat/", fetchChat);
router.post("/createGroup/", upload.single("image"), createGropuChat);
router.post("/renameGroup/", renameGroup);
router.post("/addUser/", addToGroup);
router.post("/removeUser/", removeFromGroup);
router.get("/group/all", getAllGroupChats);
router.post("/group/apply", applyJoinGroupChat);
router.post("/group/deal", dealJoinGroupChat);
router.post("/group/refuse", dealRefuseGroupChat);
router.get("/group/getApplies", fetchChatApplications);
router.post("/group/MyJoinedChats", fetchMyJoinedChats);
router.post("/group/MyCreatedChats", fetchMyCreatedChats);
router.post("/getGroupChat", getGroupChat);
router.post("/group/changeAvatar", changeGroupAvatar);
router.post("/group/deleteAvatar",deleteGroupAvatar);
router.post("/group/changeBackground", changeGroupBackground);
router.post("/group/deleteBackground", deleteGroupBackground);
router.post("/group/delete", deleteGroup);
router.post("/exitGroup", exitFromGroup);

module.exports = router;
