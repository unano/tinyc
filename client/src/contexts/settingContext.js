import { createContext, useState } from 'react'
export const SettingContext = createContext(null)

//将设置属性应用到全局
const SettingContextProvider = (props) => {
  const [inform, setInform] = useState(true)
  const [showBg, setShowBg] = useState(true)

  return (
    <SettingContext.Provider
      value={{
        inform,
        setInform,
        showBg,
        setShowBg,
      }}
    >
      {props.children}
    </SettingContext.Provider>
  )
}

export default SettingContextProvider
