import { createContext, useEffect, useState } from "react";
export const SettingContext = createContext(null);

const SettingContextProvider = (props) => {
  const [inform, setInform] = useState(true);
  const [showBg, setShowBg] = useState(true);

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
  );
};

export default SettingContextProvider;
