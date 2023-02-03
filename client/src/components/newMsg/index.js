import './newMsg.css'
import { AuthContext } from '../../contexts/authContext'
import { SettingContext } from '../../contexts/settingContext'
import { useContext } from 'react'
import { userAvatarHandler } from '../../functions'
const NewMsg = ({ newMsg }) => {
  const { currentUser } = useContext(AuthContext)
  const { inform } = useContext(SettingContext)
  const getUser = () => {
    return newMsg.chat.users.filter((user) => user._id !== currentUser.id)[0]
      .avatarImage
  }
  return (
    <>
      {inform && (
        <div className="informOutside">
          <div className="chatLeftIcon informAnime">
            {newMsg.chat.isGroupChat ? (
              <img
                src={userAvatarHandler(newMsg.chat.avatar)}
                alt="logo"
                className="avatar"
              ></img>
            ) : (
              <img
                src={userAvatarHandler(getUser())}
                alt="logo"
                className="avatar"
              ></img>
            )}
          </div>
        </div>
      )}
    </>
  )
}
export default NewMsg
