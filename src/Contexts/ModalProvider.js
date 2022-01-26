import React, { useEffect, useState } from "react";
export const ModalContext = React.createContext({});

const ModalProvider = ({ children }) => {
  const [pageData, setPageData] = useState({
    title: document.title,
    description: document.description,
    url: window.location.href,
  });

  useEffect(() => {
    let handleMessage = (event) => {
      if (event.source !== window) return;
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <ModalContext.Provider value={{ pageData }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
