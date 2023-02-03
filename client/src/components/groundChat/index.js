import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/authContext'
import { useNavigate } from 'react-router-dom'
import { applyGroupChatJoinAPI } from '../../api/api'
import {
  userAvatarHandler,
  groupBgHandler,
  groupAvatarHandler,
} from '../../functions'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const GroundChat = ({ chat }) => {
  const { currentUser } = useContext(AuthContext)
  const [isApplying, setIsApplying] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const shownLength = 4
  const navigate = useNavigate()
  const navigates = (chatId) => {
    navigate(`/chat/${chatId}`)
  }

  const apply = async (chatId) => {
    if (disabled) return
    setDisabled(true)
    const result = await applyGroupChatJoinAPI(chatId)
    setDisabled(false)
    if (result) {
      setIsApplying(true)
    }
  }
  return (
    <>
      <div className="GPchat">
        <div className="GPchatIn">
          <LazyLoadImage
            src={groupBgHandler(chat.background)}
            alt="logo"
            className="backgroundPic"
            effect="blur"
          ></LazyLoadImage>
          <div className="transparentCover"></div>
          <div className="gpContent">
            <div className="flex">
              <LazyLoadImage
                src={groupAvatarHandler(chat.avatar)}
                alt="avatar"
                className="gpAvatar"
                onClick={() => navigates(chat._id)}
                effect="blur"
              ></LazyLoadImage>
              <div
                onClick={() => navigates(chat._id)}
                style={{ cursor: 'pointer' }}
              >
                {chat.chatName}
              </div>
            </div>
            <div className="groupMembers">
              {chat.users.slice(0, shownLength).map((user) => {
                return (
                  <div className="avatarContainer" key={user._id}>
                    <img
                      src={userAvatarHandler(user.avatarImage)}
                      alt="logo"
                      className="avatar"
                    ></img>
                    <div className="username">{user.username}</div>
                  </div>
                )
              })}
              {chat.users.length > shownLength && (
                <div className="otherMember">
                  +{chat.users.length - shownLength}
                </div>
              )}
              {chat.users.find((user) => {
                return user._id === currentUser._id
              }) ? (
                <div className="apply applied">joined</div>
              ) : chat.applyingUsers.find((userId) => {
                  return userId === currentUser._id
                }) || isApplying ? (
                <div className="apply applying" onClick={() => apply(chat._id)}>
                  applying
                </div>
              ) : (
                <div className="apply" onClick={() => apply(chat._id)}>
                  apply for join
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GroundChat
