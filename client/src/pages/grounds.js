import { useState, useEffect, useContext } from "react";
import {
  getAllGroupChatAPI,
  diceChats20,
  diceChats6,
  searchGroupChatsAPI,
} from "../api/api";
import { AuthContext } from "../contexts/authContext";
import LeftIcons from "../components/leftArea";
import LoadingBar from "../components/loadingBar";
import NavBar from "../components/navBar";
import { BiSearch } from "react-icons/bi";
import "./grounds.scss";
import "./common.scss";
import {
  GiDiceTwentyFacesTwenty,
  GiPerspectiveDiceSixFacesSix,
} from "react-icons/gi";
import GroundChat from "../components/groundChat";
import Logo from "../imgs/tinyc.png";
const NewGroup = () => {
  const [chats, setChats] = useState([]);
  const [searchInput, setSearchIput] = useState();
  const { currentUser } = useContext(AuthContext);
  const [searching, setSearching] = useState(false);
  const [stopDice20, setStopDice20] = useState(true); //控制动画的停止
  const [stopDice6, setStopDice6] = useState(true); //控制动画的停止
  useEffect(() => {
    const getChats = async () => {
      const chats = await diceChats20();
      setChats(chats.data);
    };
    getChats();
  }, [currentUser]);

  //根据群组群员个数由大到小排列
  const sortByMember = () => {
    const MemberChats = chats.sort((a, b) => {
      return b.users.length - a.users.length;
    });
    setChats([...MemberChats]);
  };

  //根据群的创建时间由新到旧排序
  const sortByTime = () => {
    const TimecChats = chats.sort((a, b) => {
      let ATime;
      let BTime;
      if (a.createdAt) ATime = new Date(a.createdAt);
      else ATime = 0;
      if (b.createdAt) BTime = new Date(b.createdAt);
      else BTime = 0;
      return BTime - ATime;
    });
    setChats([...TimecChats]);
  };
  const sortRandomly = () => {
    const ramdomOrederChats = chats.sort(() => 0.5 - Math.random());
    setChats([...ramdomOrederChats]);
    console.log(chats);
  };

  const search = async () => {
    if (searchInput) {
      const result = await searchGroupChatsAPI(searchInput);
      setChats(result.data);
      setSearching(true);
    }
  };

  //根据输入搜索群组
  const dealInput = async (value) => {
    setSearchIput(value);
    if (!value) {
      setSearching(false);
      const chats = await getAllGroupChatAPI();
      setChats(chats.data);
    }
  };

  const dice20 = async () => {
    const chats = await diceChats20();
    setStopDice20(false);
    setChats(chats.data);
  };

  const dice6 = async () => {
    const chats = await diceChats6();
    setStopDice6(false);
    setChats(chats.data);
  };

  return (
    <>
      <div className="chatContainer">
        <img src={Logo} alt="logo" className="logo"></img>
        <div className="chatBody">
          {/* <button onClick={submitAvatar}>dd</button> */}
          <div className="chatLeft">
            <LeftIcons />
          </div>
          <div className="chat">
            {/* <Cover /> */}
            <div className="chatSwitchLeft">
              <NavBar />
              <div className="friendLists">
                {/*  搜索群组   */}
                <div className="searchContainer">
                  <BiSearch className="searchIcon" />
                  <input
                    className="searchInput"
                    onChange={(e) => dealInput(e.target.value)}
                  ></input>
                  <div className="searchBtn" onClick={search}>
                    Search
                  </div>
                </div>
                {/*  loading  */}
                <div className="loadingContainer">
                  {!chats.length && !searching && <LoadingBar />}
                </div>
                {/*  三种排序方式：根据创建时间，群人数，随机排序   */}
                <div className="chatsSort">
                  <div>Sort by: </div>
                  <div className="sortChoice" onClick={sortByMember}>
                    Member number
                  </div>
                  <div className="sortChoice" onClick={sortByTime}>
                    newest Created
                  </div>
                  <div className="sortChoice" onClick={sortRandomly}>
                    Random
                  </div>
                </div>
                {/*  显示随机6/20个群组   */}
                <div className="grounds">
                  {chats &&
                    chats.map((chat) => {
                      return <GroundChat chat={chat} key={chat._id} />;
                    })}
                </div>
                <div className="diceContainer">
                  {/* 重新获取20个群组  */}
                  <GiDiceTwentyFacesTwenty
                    className={stopDice20 ? "dice20" : "dice20 diceAnime"}
                    onClick={dice20}
                    onAnimationEnd={() => setStopDice20(true)}
                  />
                  {/* 重新获取6个群组  */}
                  <GiPerspectiveDiceSixFacesSix
                    className={stopDice6 ? "dice6" : "dice6 diceAnime"}
                    onClick={dice6}
                    onAnimationEnd={() => setStopDice6(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default NewGroup;
