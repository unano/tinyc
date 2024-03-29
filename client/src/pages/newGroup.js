import './chats.scss'
import { useState, useEffect, useContext } from 'react'
import { getFriendsAPI, createGroupChatsAPI } from '../api/api'
import { AuthContext } from '../contexts/authContext'
import NavBar from '../components/navBar'
import LeftIcons from '../components/leftArea'
import { AiOutlineSearch, AiOutlineUsergroupAdd } from 'react-icons/ai'
import { IoCheckmarkOutline, IoCloseOutline } from 'react-icons/io5'
import './newGroup.scss'
import AvatarEditor from '../components/avatarEditor'
import BGEditor from '../components/bgEditor'
import { blobToBase64, userAvatarHandler } from '../functions'
import { useNavigate } from 'react-router-dom'
import Logo from '../imgs/tinyc.png'
import './common.scss'
const NewGroup = () => {
  const { currentUser } = useContext(AuthContext)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState()
  const [showPreview, setShowPreview] = useState(false)
  const [shownFriends, setShownFriends] = useState([])
  const [friends, setFriends] = useState([])
  const [chosenUsers, setChosenUsers] = useState([]) //选中的要添加进群的好友
  const [GPName, setGPName] = useState('')
  const [warning, SetWarning] = useState(false)
  const [showClipper, setShowClipper] = useState(false)
  const [showBGClipper, setShowBGClipper] = useState(false)
  const [photoURL, setPhotoURL] = useState()
  const [gpbgExpand, setGpbgExpand] = useState(false) //是否展开群组背景选项
  const [disabled, setDisabled] = useState(false)
  const [word, setWord] = useState('Form Group')
  const navigate = useNavigate()
  useEffect(() => {
    const getFriendsFunc = async () => {
      let friendList = await getFriendsAPI()
      let { friends } = friendList.data
      setFriends(friends)
      setShownFriends(friends)
    }
    getFriendsFunc()
  }, [currentUser])

  const setInput = (input) => {
    let filtered = friends.filter((friend) => {
      return friend.username.match(input)
    })
    setShownFriends(filtered)
  }

  // useEffect(() => {
  //   if (!image) {
  //     setPreview(undefined);
  //     return;
  //   }
  //   const objectUrl = URL.createObjectURL(image);
  //   setPreview(objectUrl);
  //   // free memory when ever this component is unmounted
  //   return () => URL.revokeObjectURL(objectUrl);
  // }, [image]);

  const uploadImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setShowPreview(false)
      setPhotoURL(URL.createObjectURL(file))
      setShowBGClipper(true)
    }
  }

  //选择组员
  const chooseOrNot = (id) => {
    if (chosenUsers.includes(id)) {
      chosenUsers.splice(chosenUsers.indexOf(id), 1)
      let choose = [...chosenUsers]
      setChosenUsers(choose)
    } else {
      chosenUsers.push(id)
      let choose = [...chosenUsers]
      setChosenUsers(choose)
    }
  }

  //上传图片前将其转为base64
  const dealImage = async (image) => {
    if (image) {
      let result = await blobToBase64(image)
      return result
    } else {
      let result = await null
      return result
    }
  }

  //检查各项输入是否合法，合法则创建群组并进行跳转
  const check = async () => {
    if (disabled) return
    setDisabled(true)
    if (GPName === '' || chosenUsers.length < 2 || !preview) {
      SetWarning(true)
      setTimeout(() => {
        SetWarning(false)
      }, 2000)
      setDisabled(false)
    } else {
      setWord('Processing')
      const background = await dealImage(image)
      // const formData = new FormData();
      // for (var i = 0; i < chosenUsers.length; i++) {
      //   formData.append("users[]", chosenUsers[i]);
      // }
      // formData.append("chatName", GPName);
      // formData.append("image", preview);
      // formData.append("applyerId", currentUser._id);
      const res = await createGroupChatsAPI(
        GPName,
        chosenUsers,
        preview,
        background
      )
      setDisabled(false)
      setWord('Form Group')
      if (res) navigate('/home')
    }
  }

  const clearBG = () => {
    setShowPreview(false)
    setImage(null)
    setPhotoURL(null)
  }
  const expandGPBG = () => {
    setGpbgExpand(!gpbgExpand)
  }

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
            {/*  头像裁剪  */}
            {showClipper && (
              <AvatarEditor
                setPreview={setPreview}
                setShowClipper={setShowClipper}
                width={200}
                height={200}
              />
            )}
            {/*  背景裁剪  */}
            {showBGClipper && (
              <BGEditor
                setShowClipper={setShowBGClipper}
                photoURL={photoURL}
                setPhotoURL={setPhotoURL}
                setFile={setImage}
                setShowPreview={setShowPreview}
              />
            )}
            <div className="chatOverflow">
              {/* <Cover /> */}
              <div className="chatSwitchLeft">
                {/*  错误提示  */}
                {warning && (
                  <div className="GPwarn">
                    Please fill in all data / add enough member
                  </div>
                )}
                <NavBar />
                <div className="GroupInfo">
                  <div className="title">Create a group</div>
                  <div className="GPcontent">
                    <div>Group Name:</div>
                    <input
                      className="GPInput"
                      onChange={(e) => setGPName(e.target.value)}
                    ></input>
                  </div>
                  <div className="GPcontent">
                    Group Avatar:
                    <div className="avatarContainer">
                      <img
                        src={preview}
                        alt=""
                        className="avatar"
                        onClick={() => {
                          setShowClipper(true)
                        }}
                      />
                      <div className="add">+</div>
                    </div>
                  </div>
                  {/* <div className="GPcontent">Group Tag:</div> */}
                  <div className="GPMember">
                    <div className="GPcontent">Group Member:</div>
                    {/*  成员（好友）搜索  */}
                    <div className="searchArea">
                      <AiOutlineSearch />
                      <input
                        onChange={(e) => setInput(e.target.value)}
                        className="input"
                      ></input>
                    </div>
                  </div>
                  <div className="infrom">Choose at least 2 members</div>
                  {/*  显示自己的所有好友  */}
                  <div className="friends">
                    {shownFriends.map((friend) => {
                      return (
                        <div
                          key={friend._id}
                          className="friend"
                          onClick={() => chooseOrNot(friend._id)}
                        >
                          <img
                            src={userAvatarHandler(friend.avatarImage)}
                            alt="avatar"
                            className="friendAvatar"
                          ></img>
                          <div>{friend.username}</div>
                          {chosenUsers.includes(friend._id) && (
                            <IoCheckmarkOutline className="chosen" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div
                    className={gpbgExpand ? 'groupBGExpand' : 'groupBG'}
                    onClick={expandGPBG}
                  >
                    <div className="gpbdHeadDecoreate"></div>
                    <div className="bgTitle">
                      Group background <span className="grey"> (optional)</span>
                    </div>
                    {showPreview && (
                      <IoCloseOutline className="gpbgClear" onClick={clearBG} />
                    )}
                    {/*  上传群背景及预览  */}
                    <label htmlFor="inputTag">
                      <input
                        type="file"
                        accept="image/*"
                        name="image"
                        filename="image"
                        id="inputTag"
                        onChange={uploadImage}
                        onClick={(event) => {
                          event.target.value = null
                        }}
                      />
                      <div className="BGContainer">
                        {showPreview && (
                          <>
                            <img src={photoURL} alt="" className="avatar" />
                          </>
                        )}
                        <div className="add"> + </div>
                      </div>
                    </label>
                    {/* <div className="BGContainer">
                      <img
                        src={BGpreview}
                        alt=""
                        className="avatar"
                        onClick={() => {
                          setShowBGClipper(true);
                        }}
                      />
                      <div className="add">+</div>
                    </div> */}
                    {/* <label htmlFor="inputTag">
                      <input
                        type="file"
                        name="image"
                        filename="image"
                        id="inputTag"
                        onChange={uploadImage}
                      />
                      <div className="BGContainer">
                        <img src={preview} alt="" className="bg" />
                        <div className="add"> + </div>
                      </div>
                    </label> */}
                  </div>
                  <div className="submitGP" onClick={check}>
                    <div className="submitGPInside">
                      {word}
                      <AiOutlineUsergroupAdd className="newGPIcon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NewGroup
