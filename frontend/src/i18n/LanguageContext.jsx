import { createContext, useContext, useState, useCallback } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("fr");
  const t = useCallback(
    (key) => {
      const dict = translations[lang] || translations.fr;
      return key.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), dict) ?? key;
    },
    [lang]
  );
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
