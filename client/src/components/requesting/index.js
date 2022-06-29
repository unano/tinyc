import './requesting.scss'
const Requesting = ({ requesting }) => {
    console.log(requesting)

    return(<div className="requesting">
      <img
        src={
          requesting.avatarImage
            ? require(`../../images/${requesting.avatarImage}`)
            : require(`../../images/default.png`)
        }
        alt="logo"
        className="avatar"
      ></img>
      <div className="userInfos">
        <div className="name">{requesting.username}</div>
      </div>
    </div>)
};

export default Requesting;
