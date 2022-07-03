import Avatar from "react-avatar-edit";
import { useState } from "react";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import './avatarEditor.scss';
const AvatarEditor = ({ setPreview, setShowClipper, width, height}) => {
  const [image, setImage] = useState("");
  const onCrop = (view) => {
    setPreview(view);
  };

  const onClose = () => {
    setPreview(null);
  };
  return (
    <div className="clipAvatar">
      <Avatar
        width={200}
        height={200}
        borderStyle={{
          border: "1px solid black",
          textAlign: "center",
        }}
        labelStyle={{ fontSize: "70px", fontWeight: 200 }}
        label={"+"}
        onCrop={onCrop}
        onClose={onClose}
        cropRadius={0}
        src={image}
      ></Avatar>
      <div className="choose">
        <div>Upload here</div>
        <IoCheckmarkOutline
          className="ok"
          onClick={() => setShowClipper(false)}
        />
        <IoCloseOutline
          className="ok close"
          onClick={() => setShowClipper(false)}
        />
      </div>
    </div>
  );
};

export default AvatarEditor;
