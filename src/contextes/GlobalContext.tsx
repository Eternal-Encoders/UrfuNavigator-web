import { createContext, useState } from "react";
import { Languages } from "../utils/interfaces";

interface IGlobalContext {
    isSearchModal: boolean,
    isSettingsModal: boolean,
    currentLanguage: Languages,
    setIsSearchModal: (isSearchModal: boolean) => void,
    setIsSettingsModal: (isSettingsModal: boolean) => void,
    setCurrentLanguage: (language: Languages) => void
}

export const GlobalContext = createContext<IGlobalContext>({
    isSearchModal: false,
    isSettingsModal: false,
    currentLanguage: Languages.Russian,
    setIsSearchModal: () => {},
    setIsSettingsModal: () => {},
    setCurrentLanguage: () => {}
});
  
export const GlobalState = ({ children }: {children: React.ReactNode}) => {
    const [isSearchModal, setIsSearchModal] = useState(false);
    const [isSettingsModal, setIsSettingsModal] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(Languages.Russian);

    return (
        <GlobalContext.Provider value={{ 
            isSearchModal,
            isSettingsModal,
            currentLanguage,
            setIsSearchModal,
            setIsSettingsModal,
            setCurrentLanguage
        }}>
            {children}
        </GlobalContext.Provider>
    );
}