import { useContext, useEffect, useState } from 'react'
import Info from '../../imgs/info.png'
import './chat.scss'
import { AuthContext } from '../../contexts/authContext'
import { SettingContext } from '../../contexts/settingContext'
import LoadingBar from '../loadingBar'
import {
  userAvatarHandler,
  groupBgHandler,
  groupAvatarHandler,
} from '../../functions'
import { DEFAULT_BG_URL_SINGLE } from '../../common'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const Chat = ({ chat, switchs, right }) => {
  const { currentUser } = useContext(AuthContext)
  const { showBg } = useContext(SettingContext)
  const [avatar, setAvatar] = useState('default.png')
  const [loading, setLoading] = useState(false)
  const chatUser = chat.users.filter((u) => {
    return u._id !== currentUser._id
  })
  const currentChatUsername = chatUser[0].username
  const currentChatAvatar = chatUser[0].avatarImage

  const switchChat = () => {
    setLoading(true)
    switchs(chat, currentChatUsername, currentChatAvatar)
  }

  useEffect(() => {
    if (!right) setLoading(false)
    else setLoading(true)
  }, [right])

  useEffect(() => {
    if (chat.isGroupChat) {
      if (chat.avatar) setAvatar(chat.avatar)
      else setAvatar('defaultGroup.png')
    } else {
      if (chatUser[0].avatarImage) setAvatar(chatUser[0].avatarImage)
      else setAvatar('default.png')
    }
  }, [currentUser, chat, chatUser])
  return (
    <>
      <div className="friendList">
        <div className="chatIcon">
          <LazyLoadImage
            src={
              chat.isGroupChat
                ? groupAvatarHandler(chat.avatar)
                : userAvatarHandler(currentChatAvatar)
            }
            alt="logo"
            className="icon"
            onClick={switchChat}
            effect="blur"
          ></LazyLoadImage>
        </div>
        <div className="friendNameAndWord">
          {showBg &&
            (chat.isGroupChat ? (
              <div>
                <img
                  src={groupBgHandler(chat.background)}
                  alt="logo"
                  className="background"
                  onClick={switchChat}
                ></img>
                <div className="bgCover"></div>
                <div className="bgCover2"></div>
              </div>
            ) : (
              <div>
                <img
                  src={DEFAULT_BG_URL_SINGLE}
                  alt="logo"
                  className="background"
                  onClick={switchChat}
                ></img>
                <div className="bgCover"></div>
                <div className="bgCover2"></div>
              </div>
            ))}
          <div className="friendName" onClick={switchChat}>
            {chat.isGroupChat ? chat.chatName : currentChatUsername}
          </div>
          <div className="friendWord" onClick={switchChat}>
            {chat.latestMessage &&
              (chat.isGroupChat
                ? `${chat.latestMessage.sender.username} : ${chat.latestMessage.message}`
                : chat.latestMessage.message)}
          </div>
          {loading && <LoadingBar />}
        </div>
      </div>
    </>
  )
}

export default Chat
