import { useState, useEffect } from 'react'
import './loginRegister.scss'
import Logo from '../imgs/tinyc.png'
import Cover from '../components/cover'
import Register from '../components/register'
import Login from '../components/login'
import { useNavigate } from 'react-router-dom'
import './common.scss'
function App() {
  const [loginExpand, setLoginExpand] = useState(true)
  const navigate = useNavigate()

  const expandLogin = () => {
    setLoginExpand(true)
  }

  const expandRegister = () => {
    setLoginExpand(false)
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      console.log('dd')
      navigate('/home')
    }
  }, [])

  return (
    <div className="loginContainer">
      <div className="loginBody">
        {/* <div className="loginAndRegisterLeft"></div> */}
        <div className="loginAndRegister">
          {/* initial anmiation */}
          <Cover />

          {/* Logo and its intro */}
          <div className="head">
            <img src={Logo} alt="logo" className="logoInLogin"></img>
            <div className="simpWordIntro">Tiny Chat tinyC! </div>
          </div>

          {/* Login & register */}
          <div className="body">
            {/* Login */}
            <div className={loginExpand ? 'loginExpand' : 'login'}>
              <div
                className={loginExpand ? ' loginWord' : 'loginWordStretch'}
                onClick={expandLogin}
              >
                Login
              </div>
              <Login />
            </div>

            {/* Register */}
            <div className={!loginExpand ? 'loginExpand' : 'login'}>
              <div
                className={!loginExpand ? ' loginWord' : 'loginWordStretch'}
                onClick={expandRegister}
              >
                Regist
              </div>
              <Register expandLogin={expandLogin} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
