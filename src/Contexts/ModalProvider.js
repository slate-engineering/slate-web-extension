import React, { useEffect, useState } from 'react';
export const ModalContext = React.createContext({});

const ModalProvider = ({ children }) => {
  const [search, setSearch] = useState({ query: null });

  const [pageData, setPageData] = useState({ 
    title: document.title,
    description: document.description,
    url: window.location.href
  });

  useEffect(() => { 
    window.addEventListener("message", function(event) {
      if (event.source !== window) return;
    });
  }, []);

  return (
    <ModalContext.Provider value={{ pageData }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
