import './leftArea.scss'
import { useContext, useState } from 'react'
import Settings from '../../imgs/settings.png'
import { BsBell, BsImage, BsX } from 'react-icons/bs'
import { SettingContext } from '../../contexts/settingContext'
const LeftAreaSetting = () => {
  const { inform, setInform, showBg, setShowBg } = useContext(SettingContext)
  const [expanded, setExpanded] = useState(false)
  const [settingStyle, setSettingStyle] = useState({})
  const show = () => {
    setExpanded(true)
  }

  const rotate = (style) => {
    clearStyle()
    const styles = { transform: `rotate(${style})` }
    setSettingStyle(styles)
  }
  const clearStyle = () => {
    setSettingStyle({})
  }

  const changeInform = () => {
    setInform(!inform)
  }

  const changeShowBg = () => {
    setShowBg(!showBg)
  }

  return (
    <>
      <div className="settingContainer">
        <div className="settingOption"></div>
        <div className="chatLeftIcon" onClick={show} style={settingStyle}>
          <div className="backOut borderBackout">
            <img src={Settings} alt="logo" className="back rotate"></img>
          </div>
        </div>
        <div className={expanded ? 'expandedSetting setting' : 'setting'}>
          <div
            className="settingChoices"
            onMouseOver={() => rotate('-105deg')}
            onMouseLeave={clearStyle}
            onClick={changeInform}
          >
            <div
              className={inform ? 'ringLine hideRingLine' : 'ringLine'}
            ></div>
            <BsBell className="choiceIcon" />
          </div>
        </div>
        <div className={expanded ? 'expandedSetting setting' : 'setting'}>
          <div
            className="settingChoices"
            onMouseOver={() => rotate('-165deg')}
            onMouseLeave={clearStyle}
            onClick={changeShowBg}
          >
            <div className={showBg ? 'BgLine hideBgLine' : 'BgLine'}></div>
            <BsImage className="choiceIcon" />
          </div>
        </div>
        <div className={expanded ? 'expandedSetting setting' : 'setting'}>
          <div
            className="settingChoices"
            onMouseOver={() => rotate('-225deg')}
            onMouseLeave={clearStyle}
            onClick={() => setExpanded(false)}
          >
            <BsX className="choiceIcon" />
          </div>
        </div>
      </div>
    </>
  )
}

export default LeftAreaSetting
