import * as React from "react";

import { useLocation, useNavigate } from "react-router-dom";

export const messages = {
  navigate: "NAVIGATE",
  openApp: "OPEN_APP",
  openUrls: "OPEN_URLS",
};

// NOTE(amine): commands are defined in manifest.json
export const commands = {
  openApp: "open-app",
  openSlate: "open-slate",
};

/* -------------------------------------------------------------------------------------------------
 *  Address bar
 * -----------------------------------------------------------------------------------------------*/

const ADDRESS_BAR_ELEMENT_ID = "slate-extension-address-bar";
const createAddressBarElement = () => {
  const element = document.createElement("div");
  element.setAttribute("id", ADDRESS_BAR_ELEMENT_ID);
  $(element).appendTo("html");
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

export const sendOpenAppRequestToContent = ({ tab }) => {
  chrome.tabs.sendMessage(parseInt(tab), {
    type: messages.openApp,
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

export const openApp = (url = "/") => {
  const extensionOrigin = "chrome-extension://" + chrome.runtime.id;

  const isAppOpen = document.getElementById("modal-window-slate-extension");
  if (isAppOpen) return;
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
      $(styleStashHTML).appendTo("html");
    })
    .catch((error) => {
      console.warn(error);
    });
};

export const navigateToUrl = (url) => {
  const isAppOpen = document.getElementById("modal-window-slate-extension");

  if (isAppOpen) {
    updateAddressBarUrl(url);
  } else {
    openApp(url);
  }
};

export const handleOpenUrlsRequests = async ({ urls, query, sender }) => {
  if (query.newWindow) {
    await chrome.windows.create({ focused: true, url: urls });
    return;
  }

  if (query.tabId) {
    await chrome.windows.update(query.windowId, { focused: true });
    await chrome.tabs.update(query.tabId, { active: true });
    return;
  }

  for (let url of urls) {
    await chrome.tabs.create({ windowId: sender.tab.windowId, url });
  }
};

export const forwardOpenUrlsRequestToBackground = ({ urls, query }) => {
  chrome.runtime.sendMessage({ type: messages.openUrls, urls, query });
};

/** ------------ App ------------- */

export const sendOpenUrlsRequest = ({ urls, query = { newWindow: false } }) =>
  window.postMessage({ type: messages.openUrls, urls, query }, "*");

export const getInitialUrl = getAddressBarUrl;

export const useHandleExternalNavigation = () => {
  let location = useLocation();
  const navigate = useNavigate();

  const storedLinkRef = React.useRef(null);
  React.useEffect(() => {
    updateAddressBarUrl(location.pathname + location.search);
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
