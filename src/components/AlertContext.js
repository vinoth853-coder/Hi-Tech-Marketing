"use client";

import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [showAlertContent, setShowAlertContent] = useState(null);

  const alertContent = (message, type) => {
    setShowAlertContent({ message, type });
    setTimeout(() => setShowAlertContent(null), 5000);
  };

  return (
    <AlertContext.Provider value={{ showAlertContent, alertContent }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
