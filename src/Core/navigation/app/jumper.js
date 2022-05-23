import * as React from "react";

import { messages } from "../";

export const openUrls = ({ urls, query }) =>
  window.postMessage({ type: messages.openURLsRequest, urls, query }, "*");

const closeExtensionJumper = () => {
  window.postMessage({ type: messages.closeExtensionJumperRequest }, "*");
};

const NavigationContext = React.createContext({ open: true });

export const useNavigation = () => React.useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const value = React.useMemo(
    () => ({ isOpen: isOpen, closeTheJumper: () => setIsOpen(false) }),
    [isOpen]
  );

  React.useEffect(() => {
    if (!isOpen) closeExtensionJumper();
  }, [isOpen]);

  // NOTE(amine): unmout the react app before deleting from the dom
  if (!isOpen) return null;

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
