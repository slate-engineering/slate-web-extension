import * as React from "react";

import {
  messages,
  updateAddressBarUrl,
  getAddressBarElement,
  getAddressBarUrl,
  ADDRESS_BAR_CURRENT_URL_ATTRIBUTE,
} from "../";

export const createGroupFromUrls = ({ urls, title }) =>
  window.postMessage({ type: messages.createGroup, urls, title }, "*");

export const openUrls = ({ urls, query }) =>
  window.postMessage({ type: messages.openURLsRequest, urls, query }, "*");

export const closeExtensionJumper = () => {
  window.postMessage({ type: messages.closeExtensionJumperRequest }, "*");
};

export const closeTabs = (tabsId) => {
  window.postMessage({ type: messages.closeTabs, tabsId }, "*");
};

/* -------------------------------------------------------------------------------------------------
 * Navigation Provider:
 * First, close the jumper using state to clean up all the components effects
 * before removing the jumper node from the dom
 * -----------------------------------------------------------------------------------------------*/

export const useHandleJumperNavigation = () => {
  const _getUrlPathnameAndSearchParams = (url) => {
    //NOTE(amine): using http://example as a workaround to get pathname using URL api.
    const { pathname, search, searchParams } = new URL(url, "http://example");
    return { pathname, search, searchParams };
  };

  const initialUrl = getAddressBarUrl();
  const initialState = _getUrlPathnameAndSearchParams(initialUrl);
  const [navigationState, setNavigationState] = React.useState(initialState);

  const handleAddressBarUpdates = (url) => {
    const { pathname, search, searchParams } =
      _getUrlPathnameAndSearchParams(url);
    setNavigationState({ pathname, search, searchParams });
  };

  const storedURLRef = React.useRef(null);
  React.useEffect(() => {
    storedURLRef.current = navigationState.pathname + navigationState.search;
  }, [navigationState]);

  React.useEffect(() => {
    const element = getAddressBarElement();
    const handleMutation = (mutationList) => {
      const currentUrl = getAddressBarUrl();
      mutationList.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === ADDRESS_BAR_CURRENT_URL_ATTRIBUTE &&
          storedURLRef.current !== currentUrl
        ) {
          handleAddressBarUpdates(currentUrl);
        }
      });
    };

    const observer = new MutationObserver(handleMutation);
    observer.observe(element, {
      attributeFilter: [ADDRESS_BAR_CURRENT_URL_ATTRIBUTE],
    });
  }, []);

  return { navigationState, navigate: updateAddressBarUrl };
};

/* -----------------------------------------------------------------------------------------------*/

const NavigationContext = React.createContext({ open: true });

export const useNavigation = () => React.useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  React.useEffect(() => {
    if (!isOpen) closeExtensionJumper();
  }, [isOpen]);

  const { navigationState, navigate } = useHandleJumperNavigation();
  const navigateToHomeJumper = React.useCallback(() => navigate("/"), []);
  const navigateToSlatesJumper = React.useCallback((objects) => {
    const urlsQuery = encodeURIComponent(JSON.stringify(objects));
    navigate(`/slates?urls=${urlsQuery}`);
  }, []);

  const value = React.useMemo(
    () => ({
      navigationState,
      navigateToHomeJumper,
      navigateToSlatesJumper,
      isOpen: isOpen,
      closeTheJumper: () => setIsOpen(false),
    }),
    [isOpen, navigationState]
  );

  // NOTE(amine): unmout the react app before deleting from the dom
  if (!isOpen) return null;

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Route
 * -----------------------------------------------------------------------------------------------*/

export const Route = ({ path, component }) => {
  const { navigationState } = useNavigation();

  if (path !== navigationState.pathname) return null;

  const Component = component;
  return <Component />;
};
