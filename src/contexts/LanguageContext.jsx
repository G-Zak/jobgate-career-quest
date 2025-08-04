import React from 'react';

export const LanguageContext = React.createContext();

export const LanguageProvider = ({ children }) => {
  return (
    <LanguageContext.Provider value={{}}>
      {children}
    </LanguageContext.Provider>
  );
};
