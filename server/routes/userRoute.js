const {
  refreshToken,
  login,
  register,
  friendRequest,
  acceptFriend,
  denyFriend,
  searchUser,
  getFriends,
  getFriendsRequest,
  getSendedRequest,
  uploadAvatar,
  changeUsername,
  changePassword,
  changeIntro,
  deleteAvatar,
  setIsOnline,
  setIsOffline,
} = require("../controllers/userController");

const router = require("express").Router();
const { verify } = require("../authenticate");
// const multer = require("multer");
// const storage = multer.diskStorage({
//     destination:(req, file, callback) =>{
//         callback(null,"./client/src/images")
//     },
//     filename:(req, file, callback) =>{
//         callback(null, Date.now() + "-" + file.originalname);
//     }
// });
// const upload = multer({ storage: storage });
router.post("/refreshToken", refreshToken);
router.post("/login", login);
router.post("/register", register);
router.get("/getFriends", verify, getFriends);
router.get("/getFriendsReq", verify, getFriendsRequest);
router.get("/getSendedReq", verify, getSendedRequest);
router.get("/searchUser/:username", searchUser);
router.post("/applyFriend", verify, friendRequest);
router.post("/acceptFriend", verify, acceptFriend);
router.post("/denyFriend", verify, denyFriend);
// router.post("/uploadAvatar", upload.single("image"), uploadAvatar);
router.post("/uploadAvatar", verify, uploadAvatar);
router.delete("/deleteAvatar", deleteAvatar);
router.put("/changeUsername", verify, changeUsername);
router.put("/changePassword", verify, changePassword);
router.put("/changeIntro", verify, changeIntro);
router.put("/setOnline", verify, setIsOnline);
router.put("/setOffline", verify, setIsOffline);
module.exports = router;
