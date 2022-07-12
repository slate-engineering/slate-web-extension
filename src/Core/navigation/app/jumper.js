import * as React from "react";

import { messages } from "../";

export const createGroupFromUrls = ({ urls, title }) =>
  window.postMessage({ type: messages.createGroup, urls, title }, "*");

export const openUrls = ({ urls, query }) =>
  window.postMessage({ type: messages.openURLsRequest, urls, query }, "*");

export const closeExtensionJumper = () => {
  window.postMessage({ type: messages.closeExtensionJumperRequest }, "*");
};

/* -------------------------------------------------------------------------------------------------
 * Navigation Provider:
 * First, close the jumper using state to clean up all the components effects
 * before removing the node from jumper node from the dom
 * -----------------------------------------------------------------------------------------------*/

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
