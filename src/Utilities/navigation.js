import * as React from "react";

import { useLocation, useNavigate } from "react-router-dom";

export const messages = {
  navigate: "NAVIGATE",
};

/* -------------------------------------------------------------------------------------------------
 *  Address bar
 * -----------------------------------------------------------------------------------------------*/

const ADDRESS_BAR_ELEMENT_ID = "slate-extension-address-bar";
const createAddressBarElement = () => {
  const element = document.createElement("div");
  element.setAttribute("id", ADDRESS_BAR_ELEMENT_ID);
  $(element).prependTo("body");
};
const getAddressBarElement = () =>
  document.getElementById(ADDRESS_BAR_ELEMENT_ID);

const DATA_CURRENT_URL = "data-current-url";
const getAddressBarUrl = () => {
  const element = document.getElementById(ADDRESS_BAR_ELEMENT_ID);
  return element.getAttribute(DATA_CURRENT_URL) || "/";
};
const updateAddressBarUrl = (url) => {
  let nextUrl = url;
  if (typeof url === "function") {
    const currentUrl = getAddressBarUrl();
    nextUrl = url(currentUrl);
  }

  const element = document.getElementById(ADDRESS_BAR_ELEMENT_ID);
  element.setAttribute(DATA_CURRENT_URL, nextUrl);
};

/** ------------ Background ------------- */

export const sendNavigationRequestToContent = ({ tab, pathname, search }) => {
  chrome.tabs.sendMessage(parseInt(tab), {
    type: messages.navigate,
    data: { pathname, search },
  });
};

/** ------------ Content------------- */

export const handleNavigationRequests = ({ pathname, search }) => {
  if (pathname) {
    navigateToUrl([pathname, search].join(""));
  } else {
    navigateToUrl((currentUrl) => {
      //NOTE(amine): using http://example as a workaround to get pathname using URL api.
      const { pathname } = new URL(currentUrl, "http://example");
      return [pathname, search].join("");
    });
  }
};

export const navigateToUrl = (url) => {
  const extensionOrigin = "chrome-extension://" + chrome.runtime.id;
  // const isAppOpen = !location.ancestorOrigins.contains(extensionOrigin);
  const isAppOpen = document.getElementById("modal-window-slate-extension");

  if (isAppOpen) {
    updateAddressBarUrl(url);
    return;
  }

  createAddressBarElement();
  updateAddressBarUrl(url);
  // Fetch the local React index.html page
  fetch(chrome.runtime.getURL("index.html"))
    .then((response) => response.text())
    .then((html) => {
      const styleStashHTML = html.replace(
        /\/static\//g,
        `${extensionOrigin}/static/`
      );
      $(styleStashHTML).prependTo("body");
    })
    .catch((error) => {
      console.warn(error);
    });
};

/** ------------ App ------------- */

export const getInitialUrl = getAddressBarUrl;

export const useHandleExternalNavigation = () => {
  let location = useLocation();
  const navigate = useNavigate();

  const storedLinkRef = React.useRef(null);
  React.useEffect(() => {
    updateAddressBarUrl(location.pathname);
    storedLinkRef.current = location.pathname + location.search;
  }, [location]);

  React.useEffect(() => {
    const element = getAddressBarElement();
    const handleMutation = (mutationList) => {
      const currentUrl = getAddressBarUrl();
      mutationList.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === DATA_CURRENT_URL &&
          storedLinkRef.current !== currentUrl
        ) {
          navigate(currentUrl);
        }
      });
    };

    const observer = new MutationObserver(handleMutation);
    observer.observe(element, { attributeFilter: [DATA_CURRENT_URL] });
  }, []);
};
