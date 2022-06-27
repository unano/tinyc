import "./user.scss";
import Back from "../imgs/back2.png";
import Settings from "../imgs/settings.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { useContext, useState, useEffect } from "react";
import { uploadAvatarAPI, deleteAvatarAPI, changeUsernameAPI } from "../api/api";
import Modify from "../imgs/modify.png";
import Crop from '../components/cropper';
import {
  IoPencilOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { BsUpload,BsChevronDoubleRight } from "react-icons/bs";
function Personal() {
    const { currentUser, resetUserData } = useContext(AuthContext);
    const [showChangeInput, setShowChangeInput] = useState(false);
    const [input, setInput] = useState("");
    const [image, setImage] = useState("");
    const [preview, setPreview] = useState();
    useEffect(() => {
      if (!image) {
        setPreview(undefined);
        return;
      }

      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    }, [image]);
    const changeUsername = async() =>{
      if(input!=="") {
        let result = await changeUsernameAPI(currentUser._id, input);
        if(result.status)  resetUserData(result.data.upload);
        setShowChangeInput(false);
      }
    }
    const navigate = useNavigate();
    const navigates = () => {
      navigate("/home");
    };

    const uploadImage = (e) => {
      setImage(e.target.files[0]);
    };
    

    const submitAvatar = async() => {
      const formData = new FormData();
      const previousImage = currentUser.avatarImage;
      console.log(previousImage)
      formData.append("_id", currentUser._id);
      formData.append("image", image);
      const updatedUser = await uploadAvatarAPI(formData);
      console.log(updatedUser)
      setTimeout(()=>{
        resetUserData(updatedUser.data.upload);
        setImage("");
        setTimeout(async()=> await deleteAvatarAPI(previousImage),
        2000)
      }
      ,1000);
    };
  return (
    <div className="chatBody">
      <div className="chatLeft">
        <div className="chatLeftIcon">
          <div className="backOut">
            <img
              src={Back}
              alt="logo"
              className="back"
              onClick={navigates}
            ></img>
          </div>
        </div>
        <div className="chatLeftIcon">
          <div className="backOut borderBackout">
            <img src={Settings} alt="logo" className="back"></img>
          </div>
        </div>
      </div>
      <div className="userInfo">
        <div className="flex">
          <div className="avatarContainer">
            <img
              src={
                currentUser.avatarImage
                  ? require(`../images/${currentUser.avatarImage}`)
                  : require(`../images/default.png`)
              }
              alt="logo"
              className="avatar"
              onClick={navigates}
            ></img>
          </div>
          {/* <label htmlFor="inputTag">
            <IoPencilOutline className="modify" />
            <input
              type="file"
              name="image"
              filename="image"
              id="inputTag"
              onChange={uploadImage}
            />
          </label> */}
          {/* {image && <div className="cropper">
            <Crop img={image}/>
          </div>} */}
          {image !== "" ? (
            <>
              <div className="avatarContainer">
                <div className="right">
                  <BsChevronDoubleRight />
                </div>
                <img src={preview} alt="" className="avatar" />
              </div>
              <div className="buttonsContainer">
                <BsUpload
                  className="usernameBtn smallBtn"
                  onClick={submitAvatar}
                />
                <IoCloseOutline
                  className="usernameBtn"
                  onClick={() => setImage("")}
                />
                {/* <button onClick={submitAvatar} className="submitAvatar">
                submit
              </button>
              <button onClick={() => setImage("")} className="submitAvatar">
                cancel
              </button> */}
              </div>
            </>
          ) : (
            <label htmlFor="inputTag">
              <IoPencilOutline className="modify" />
              <input
                type="file"
                name="image"
                filename="image"
                id="inputTag"
                onChange={uploadImage}
              />
            </label>
          )}
        </div>
        {!showChangeInput ? (
          <div className="flex">
            <div className="username">{currentUser.username}</div>
            <IoPencilOutline
              className="modify smallModify"
              onClick={() => setShowChangeInput(true)}
            />
          </div>
        ) : (
          <div className="flex">
            <input
              className="changeUsername"
              onChange={(e) => setInput(e.target.value)}
            ></input>
            <IoCheckmarkOutline
              className="usernameBtn"
              onClick={changeUsername}
            />
            <IoCloseOutline
              className="usernameBtn"
              onClick={() => setShowChangeInput(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Personal;
