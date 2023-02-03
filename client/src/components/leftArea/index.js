import './leftArea.scss'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/authContext'
import { useNavigate } from 'react-router-dom'
import Back from '../../imgs/back2.png'
import LeftAreaSetting from '../leftAreaSetting'
import { userAvatarHandler } from '../../functions'
const LeftIcons = ({
  ischat = false,
  chatBtnSwitch = {},
  switchsBack = null,
}) => {
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)
  const navigateToUser = () => {
    navigate('/user')
  }

  return (
    <>
      <div className="chatLeftIcon">
        {ischat ? (
          <div className="chatLeftIn" style={chatBtnSwitch}>
            <div className="backOut">
              <img
                src={userAvatarHandler(currentUser.avatarImage)}
                alt="logo"
                className="back"
                onClick={navigateToUser}
              ></img>
            </div>
            <div className="backOut" onClick={switchsBack}>
              <img src={Back} alt="logo" className="back"></img>
            </div>
          </div>
        ) : (
          <div className="backOut">
            <img
              src={userAvatarHandler(currentUser.avatarImage)}
              alt="logo"
              className="back"
              onClick={navigateToUser}
            ></img>
          </div>
        )}
      </div>
      <LeftAreaSetting />
    </>
  )
}

export default LeftIcons
