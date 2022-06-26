const {
  login,
  register,
  friendRequest,
  acceptFriend,
  denyFriend,
  searchUser,
  getFriends,
  uploadAvatar,
} = require("../controllers/userController");

const router = require("express").Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination:(req, file, callback) =>{
        callback(null,"./client/src/images")
    },
    filename:(req, file, callback) =>{
        callback(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post("/login", login);
router.post("/register", register);
router.post("/applyFriend", friendRequest);
router.post("/acceptFriend", acceptFriend);
router.post("/denyFriend", denyFriend);
router.post("/searchUser", searchUser);
router.post("/getFriends", getFriends);
router.post("/uploadAvatar", upload.single("image"), uploadAvatar);

module.exports = router;
