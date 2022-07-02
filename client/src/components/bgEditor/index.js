import Avatar from "react-avatar-edit";
import { useState } from "react";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import Cropper from "react-easy-crop";
import getCroppedImg from "./utils/cropImage";
import "./bgEditor.scss";
const BGEditor = ({
  photoURL,
  setShowClipper,
  setPhotoURL,
  setFile,
  setShowPreview,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropImage = async () => {
    try {
      const { file, url } = await getCroppedImg(photoURL, croppedAreaPixels);
      setPhotoURL(url);
      setFile(file);
      setShowClipper(false);
      setShowPreview(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bgClipAvatar">
      <div className="cropperContainer">
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          aspect={2 / 1}
          onZoomChange={setZoom}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
        />
      </div>
      <div className="choose">
        <div>Upload here</div>
        <input
          type="range"
          min="1"
          max="3"
          defaultValue="1"
          step="0.1"
          onChange={(event) => setZoom(event.target.value)}
          className="zoom"
        ></input>
        <IoCheckmarkOutline className="ok" onClick={cropImage} />
        <IoCloseOutline
          className="ok close"
          onClick={() => {
            setShowClipper(false);
            setShowPreview(false);
          }}
        />
      </div>
    </div>
  );
};

export default BGEditor;
