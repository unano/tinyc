import "./imgConatiner.css";

const ImgContainer = ({ img }) => {
  return <div className="imgContainer"><img src={img} alt="logo" className="imgStyle"></img></div>;
};

export default ImgContainer;
