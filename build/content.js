/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/Core/browser/index.js
const messages = {
  historyChunkRequest: "HISTORY_CHUNK_REQUEST",
  historyChunkResponse: "HISTORY_CHUNK_RESPONSE",

  relatedLinksRequest: "RELATED_LINKS_REQUEST",
  relatedLinksResponse: "RELATED_LINKS_RESPONSE",

  windowsUpdate: "WINDOWS_UPDATE",
};

;// CONCATENATED MODULE: ./src/Core/browser/content.js


chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === messages.windowsUpdate) {
    window.postMessage(
      { type: messages.windowsUpdate, data: request.data },
      "*"
    );
  }
});

window.addEventListener("message", async function (event) {
  if (event.data.type === messages.historyChunkRequest) {
    chrome.runtime.sendMessage(
      { type: messages.historyChunkRequest, startIndex: event.data.startIndex },
      (response) =>
        window.postMessage(
          { type: messages.historyChunkResponse, data: response },
          "*"
        )
    );
    return;
  }

  if (event.data.type === messages.relatedLinksRequest) {
    chrome.runtime.sendMessage(
      { type: messages.relatedLinksRequest, url: event.data.url },
      (response) =>
        window.postMessage(
          { type: messages.relatedLinksResponse, data: response },
          "*"
        )
    );
    return;
  }
});

;// CONCATENATED MODULE: ./src/Common/constants.js
// NOTE(amine): commands are defined in manifest.json
const commands = {
  openApp: "open-app",
  openSlate: "open-slate",
};

const values = {
  version: "1.0.0",
  sds: "0.2.0",
};

const sizes = {
  mobile: 768,
  navigation: 288,
  sidebar: 416,
  header: 56,
  tablet: 960,
  desktop: 1024,
  desktopM: 1300,
  topOffset: 0, //NOTE(martina): Pushes UI down. 16 when there is a persistent announcement banner, 0 otherwise
};

const system = {
  //system color
  white: "#FFFFFF",
  grayLight6: "#F7F8F9",
  grayLight5: "#E5E8EA",
  grayLight4: "#D1D4D6",
  grayLight3: "#C7CACC",
  grayLight2: "#AEB0B2",
  gray: "#8E9093",
  grayDark2: "#636566",
  grayDark3: "#48494A",
  grayDark4: "#3A3B3C",
  grayDark5: "#2C2D2E",
  grayDark6: "#1C1D1E",
  black: "#00050A",

  blue: "#0084FF",
  green: "#34D159",
  yellow: "#FFD600",
  red: "#FF4530",
  purple: "#585CE6",
  teal: "#64C8FA",
  pink: "#FF375F",
  orange: "#FF9F00",

  blueLight6: "#D5EBFF",
  blueLight5: "#AAD7FF",
  blueLight4: "#80C3FF",
  blueLight3: "#55AEFF",
  bluelight2: "#2B99FF",
  blueDark2: "#006FD5",
  blueDark3: "#0059AA",
  blueDark4: "#004380",
  blueDark5: "#002D55",
  blueDark6: "#00172B",

  greenLight6: "#D5FFDE",
  greenLight5: "#AAFFBE",
  greenLight4: "#86FCA2",
  greenLight3: "#66F287",
  greenLight2: "#4BE46F",
  greenDark2: "#20B944",
  greenDark3: "#119D32",
  greenDark4: "#067C22",
  greenDark5: "#005514",
  greenDark6: "#002B09",

  yellowLight6: "#FFFFD5",
  yellowLight5: "#FFFBAA",
  yellowLight4: "#FFF280",
  yellowLight3: "#FFE655",
  yellowLight2: "#FFD62B",
  yellowDark2: "#D5AC00",
  yellowDark3: "#AA9100",
  yellowDark4: "#807300",
  yellowDark5: "#555100",
  yellowDark6: "#2B2A00",

  redLight6: "#FFD5D5",
  redLight5: "#FFAFAA",
  redLight4: "#FF8D80",
  redlight3: "#FF715E",
  redLight2: "#FF5944",
  redDark2: "#D52E1A",
  redDark3: "#AA1C09",
  redDark4: "#800E00",
  redDark5: "#550500",
  redDark6: "#2B0000",

  twitterBlue: "1DA1F2",
};

const semantic = {
  //semantic color
  textWhite: system.white,
  textGrayLight: system.grayLight3,
  textGray: system.gray,
  textGrayDark: system.grayDark3,
  textBlack: system.black,

  bgLight: system.grayLight6,

  bgGrayLight: system.grayLight5,
  bgGrayLight4: system.grayLight4,
  bgBlurWhite: "rgba(255, 255, 255, 0.7)",
  bgBlurWhiteOP: "rgba(255, 255, 255, 0.85)",
  bgBlurWhiteTRN: "rgba(255, 255, 255, 0.3)",
  bgBlurLight: "rgba(247, 248, 249, 0.7)",
  bgBlurLightOP: "rgba(247, 248, 249, 0.85)",
  bgBlurLight6: "rgba(247, 248, 249, 0.7)",
  bgBlurLight6OP: "rgba(247, 248, 249, 0.85)",
  bgBlurLight6TRN: "rgba(247, 248, 249, 0.3)",

  bgDark: system.grayDark6,
  bgLightDark: system.grayDark5,
  bgBlurBlack: "rgba(0, 5, 10, 0.5)",
  bgBlurBlackOP: "rgba(0, 5, 10, 0.85)",
  bgBlurBlackTRN: "rgba(0, 5, 10, 0.3)",
  bgBlurDark: "rgba(28, 29, 30, 0.7)",
  bgBlurDark6: "rgba(28, 29, 30, 0.5)",
  bgBlurDark6OP: "rgba(28, 29, 30, 0.85)",
  bgBlurDark6TRN: "rgba(28, 29, 30, 0.3)",

  borderLight: system.grayLight6,
  borderDark: system.grayDark6,
  borderGray: system.gray,
  borderGrayLight: system.grayLight5,
  borderGrayDark: system.grayDark5,
  borderGrayLight4: system.grayLight4,

  bgBlue: system.blueLight6,
  bgGreen: system.greenLight6,
  bgYellow: system.yellowLight6,
  bgWhite: system.white,
  bgRed: system.redLight6,
};

const shadow = {
  lightSmall: "0px 4px 16px 0 rgba(174, 176, 178, 0.1)",
  lightMedium: "0px 8px 32px 0 rgba(174, 176, 178, 0.2)",
  lightLarge: "0px 12px 64px 0 rgba(174, 176, 178, 0.3)",
  darkSmall: "0px 4px 16px 0 rgba(99, 101, 102, 0.1)",
  darkMedium: "0px 8px 32px 0 rgba(99, 101, 102, 0.2)",
  darkLarge: "0px 12px 64px 0 rgba(99, 101, 102, 0.3)",
  jumperLight: "0px 20px 36px 0 rgba(99, 101, 102, 0.6)",
  card: "0px 0px 32px #E5E8EA;",
};

const zindex = {
  navigation: 1,
  body: 2,
  sidebar: 5,
  alert: 3,
  header: 4,
  modal: 6,
  tooltip: 7,
  cta: 8,
  extensionJumper: 2147483647,
};

const font = {
  text: `'inter-regular', -apple-system, BlinkMacSystemFont, arial, sans-serif`,
  semiBold: `'inter-semi-bold', -apple-system, BlinkMacSystemFont, arial, sans-serif`,
  medium: `'inter-medium', -apple-system, BlinkMacSystemFont, arial, sans-serif`,
  mono: `'mono', monaco, monospace`,
  monoBold: `'mono-bold', monaco, monospace`,
  monoCode: `'fira-code-regular', mono, monospace`,
  monoCodeBold: `'fira-code-bold', mono-bold, monospace`,
  code: `'jet-brains-regular', mono, monospace`,
  codeBold: `'jet-brains-bold', mono, monospace`,
};

const typescale = {
  lvlN1: `0.75rem`,
  lvl0: `0.875rem`,
  lvl1: `1rem`,
  lvl2: `1.25rem`,
  lvl3: `1.563rem`,
  lvl4: `1.953rem`,
  lvl5: `2.441rem`,
  lvl6: `3.052rem`,
  lvl7: `3.815rem`,
  lvl8: `4.768rem`,
  lvl9: `5.96rem`,
  lvl10: `7.451rem`,
  lvl11: `9.313rem`,
};

const theme = {
  foreground: system.white,
  ctaBackground: system.blue,
  pageBackground: semantic.bgLight,
  pageText: system.black,
};

const gateways = {
  ipfs: "https://slate.textile.io/ipfs",
};

//NOTE(martina): dev server uri's
// export const uri = {
//   hostname: "https://slate-dev.onrender.com",
//   domain: "slate-dev.onrender.com",
//   upload: "https://shovelstaging.onrender.com",
// };

//NOTE(martina): production server uri's
const uri = {
  hostname: "https://slate.host",
  domain: "slate.host",
  upload: "https://uploads.slate.host",
};

const NFTDomains = (/* unused pure expression or super */ null && (["foundation.app", "zora.co", "opensea.io"]));

// more important filetypes to consider:
// midi
// txt, rtf, docx
// html, css, js, other code-related extensions
// json, csv, other script/data extensions
const filetypes = {
  images: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  audio: ["audio/mpeg", "audio/aac", "audio/flac", "audio/wav", "audio/webm"],
  assets: ["font/ttf", "font/otf", "image/svg+xml"],
  videos: ["video/mpeg", "video/webm", "video/quicktime"],
  books: [
    "application/pdf",
    "application/epub+zip",
    "application/vnd.amazon.ebook",
  ],
};

const linkPreviewSizeLimit = 5000000; //NOTE(martina): 5mb limit for twitter preview images

// NOTE(amine): used to calculate how many cards will fit into a row in sceneActivity
const grids = {
  activity: {
    profileInfo: {
      width: 260,
    },
  },
  object: {
    desktop: { width: 248, rowGap: 20 },
    mobile: { width: 166, rowGap: 12 },
  },
  collection: {
    desktop: { width: 382, rowGap: 16 },
    mobile: { width: 280, rowGap: 8 },
  },
  profile: {
    desktop: { width: 248, rowGap: 16 },
    mobile: { width: 248, rowGap: 8 },
  },
};

const profileDefaultPicture =
  "https://slate.textile.io/ipfs/bafkreick3nscgixwfpq736forz7kzxvvhuej6kszevpsgmcubyhsx2pf7i";

const jumperSlateExtensionWrapper = "jumper-slate-extension-wrapper";

;// CONCATENATED MODULE: ./src/Core/navigation/index.js
const navigation_messages = {
  openExtensionJumperRequest: "OPEN_EXTENSION_JUMPER_REQUEST",
  closeExtensionJumperRequest: "CLOSE_EXTENSION_JUMPER_REQUEST",

  openURLsRequest: "OPEN_URLS_REQUEST",

  createGroup: "BROWSER_CREATE_GROUP",

  closeTabs: "CLOSE_TABS",
};

;// CONCATENATED MODULE: ./src/Core/navigation/content.js




// SOURCE(amine): https://stackoverflow.com/questions/2592092/executing-script-elements-inserted-with-innerhtml
const setInnerHTML = (element, html) => {
  element.innerHTML = html;
  Array.from(element.querySelectorAll("script")).forEach((oldScript) => {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes).forEach((attr) =>
      newScript.setAttribute(attr.name, attr.value)
    );
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
};

const getExtensionJumperWrapper = () =>
  document.getElementById(jumperSlateExtensionWrapper);

const createExtensionJumperWrapper = () => {
  if (getExtensionJumperWrapper()) return;

  const wrapper = document.createElement("div");
  wrapper.setAttribute("id", jumperSlateExtensionWrapper);
  wrapper.setAttribute("data-url", chrome.runtime.getURL("/").slice(0, -1));
  document.body.appendChild(wrapper);
};

const openApp = () => {
  const extensionOrigin = "chrome-extension://" + chrome.runtime.id;

  const isAppOpen = document.getElementById("modal-window-slate-extension");
  if (isAppOpen) return;

  createExtensionJumperWrapper();
  // Fetch the local React index.html page
  fetch(chrome.runtime.getURL("index.html"))
    .then((response) => response.text())
    .then((html) => {
      const styleStashHTML = html.replace(
        /\/static\//g,
        `${extensionOrigin}/static/`
      );
      setInnerHTML(getExtensionJumperWrapper(), styleStashHTML);
    })
    .catch((error) => {
      console.warn(error);
    });
};

const closeApp = () => {
  const extensionJumperWrapper = getExtensionJumperWrapper();
  extensionJumperWrapper.innerHTML = "";
};

/** ------------ Event Listeners ------------- */

let activeElement;
chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === navigation_messages.openExtensionJumperRequest) {
    activeElement = document.activeElement;
    openApp();
  }
});

window.addEventListener("message", async function (event) {
  if (event.data.type === navigation_messages.closeTabs) {
    chrome.runtime.sendMessage({
      type: navigation_messages.closeTabs,
      tabsId: event.data.tabsId,
    });
    return;
  }

  if (event.data.type === navigation_messages.closeExtensionJumperRequest) {
    if (activeElement) activeElement.focus();
    closeApp();
    return;
  }

  if (event.data.type === navigation_messages.createGroup) {
    chrome.runtime.sendMessage({
      type: navigation_messages.createGroup,
      urls: event.data.urls,
      windowId: event.data.windowId,
      title: event.data.title,
    });
    return;
  }

  if (event.data.type === navigation_messages.openURLsRequest) {
    chrome.runtime.sendMessage({
      type: navigation_messages.openURLsRequest,
      urls: event.data.urls,
      query: event.data.query,
    });
    return;
  }
});

;// CONCATENATED MODULE: ./src/Core/views/index.js
const views_messages = {
  searchQueryRequest: "SEARCH_QUERY_REQUEST",
  searchQueryResponse: "SEARCH_QUERY_RESPONSE",

  viewByTypeRequest: "VIEW_BY_TYPE_REQUEST",
  viewByTypeResponse: "VIEW_BY_TYPE_RESPONSE",
};

const viewsType = {
  currentWindow: "currentWindow",
  allOpen: "allOpen",
  recent: "recent",
  savedFiles: "savedFiles",
  relatedLinks: "relatedLinks",
};

const initialView = viewsType.currentWindow;

;// CONCATENATED MODULE: ./src/Core/views/content.js


window.addEventListener("message", async function (event) {
  if (event.data.type === views_messages.searchQueryRequest) {
    chrome.runtime.sendMessage(
      {
        type: views_messages.searchQueryRequest,
        query: event.data.query,
        viewType: event.data.viewType,
      },
      (response) =>
        window.postMessage(
          { type: views_messages.searchQueryResponse, data: response },
          "*"
        )
    );
  }

  if (event.data.type === views_messages.viewByTypeRequest) {
    chrome.runtime.sendMessage(
      {
        type: views_messages.viewByTypeRequest,
        viewType: event.data.viewType,
        query: event.data.query,
      },
      (response) =>
        window.postMessage(
          { type: views_messages.viewByTypeResponse, data: response },
          "*"
        )
    );
  }
});

;// CONCATENATED MODULE: ./src/Core/viewer/index.js


const viewer_messages = {
  loadViewerDataRequest: "LOAD_VIEWER_DATA_REQUEST",
  loadViewerDataResponse: "LOAD_VIEWER_DATA_RESPONSE",

  saveLink: "SAVE_LINK",
  savingStatus: "SAVING_STATUS",
};

// NOTE(amine): commands are defined in manifest.json
const viewer_commands = {
  directSave: "direct-save",
};

const savingStates = {
  start: "start",
  done: "done",
  duplicate: "duplicate",
  failed: "failed",
};

const savingSources = {
  command: "command",
  app: "app",
};

const viewerInitialState = {
  isAuthenticated: false,
  shouldSync: false,
  initialView: initialView,
  windows: {
    data: { currentWindow: [], allOpen: [] },
  },
  // NOTE(amine):if there is one tab is open,populate the recent view
};

;// CONCATENATED MODULE: ./src/Core/viewer/content.js




/* -------------------------------------------------------------------------------------------------
 * Saving popup
 * -----------------------------------------------------------------------------------------------*/

const SAVING_POPUP_ID = "slate-extension-saving-popup";
const SAVING_POPUP_REMOVAL_TIMEOUT = 2500;

const STYLES_SAVING_POPUP_POSITION_FIXED = {
  position: "fixed",
  top: "16px",
  right: "23px",
  zIndex: zindex.extensionJumper,
};

const STYLES_SAVING_POPUP_H5 = {
  boxSizing: "border-box",
  padding: 0,
  margin: 0,
  overflowWrap: "break-word",
  textAlign: "left",
  fontWeight: "normal",
  fontFamily: font.medium,
  fontSize: "14px",
  lineHeight: "20px",
  letterSpacing: "-0.006px",
};

const STYLES_SAVING_POPUP_WRAPPER = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: "16px",
  backgroundColor: semantic.bgLight,
  borderColor: semantic.borderGrayLight4,
  boxShadow: shadow.jumperLight,
};

const STYLES_SAVING_POPUP_HEADING = {
  ...STYLES_SAVING_POPUP_H5,
  marginLeft: "8px",
  color: semantic.textBlack,
};

const STYLES_SAVING_POPUP_LINK = {
  ...STYLES_SAVING_POPUP_H5,
  width: "131px",
  maxWidth: "131px",
  marginLeft: "4px",
  color: semantic.textGray,

  overflow: "hidden",
  wordBreak: "break-all",
  textOverflow: "ellipsis",
  WebkitLineClamp: 1,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
};

const SavingPopupSuccessIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z" fill="#34D159"/>
<path d="M12 5L6.5 10.5L4 8" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const SavingPopupFailureIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.99935 18.3334C14.6017 18.3334 18.3327 14.6024 18.3327 10C18.3327 5.39765 14.6017 1.66669 9.99935 1.66669C5.39698 1.66669 1.66602 5.39765 1.66602 10C1.66602 14.6024 5.39698 18.3334 9.99935 18.3334Z" fill="#FFD5D5"/>
  <path d="M10 6.66669V10" stroke="#FF4530" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10 13.3333H10.0083" stroke="#FF4530" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

const SavingButtonDismissIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 4L4 12" stroke="#48494A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 4L12 12" stroke="#48494A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const loadFont = async () => {
  const fontUrl = chrome.runtime.getURL("/fonts/inter-medium.ttf");
  const slateMediumFont = new FontFace("inter-medium", `url(${fontUrl})`);
  await slateMediumFont.load();
};

const createElement = ({ tag, innerHTML, attrs, styles }) => {
  const appendStyles = (element, styles) => {
    Object.keys(styles).forEach(
      (property) => (element.style[property] = styles[property])
    );
  };
  const appendAttrs = (element, attrs) => {
    Object.keys(attrs).forEach((attr) => {
      element.setAttribute(attr, attrs[attr]);
    });
  };

  const element = document.createElement(tag);
  if (styles) appendStyles(element, styles);
  if (attrs) appendAttrs(element, attrs);
  if (innerHTML) element.innerHTML = innerHTML;

  return element;
};

const createSavingPopupSuccess = async () => {
  const wrapper = createElement({
    tag: "div",
    innerHTML: SavingPopupSuccessIcon,
    styles: {
      ...STYLES_SAVING_POPUP_POSITION_FIXED,
      ...STYLES_SAVING_POPUP_WRAPPER,
    },
    attrs: { id: SAVING_POPUP_ID },
  });

  const heading = createElement({
    tag: "p",
    innerHTML: "Saved!",
    styles: STYLES_SAVING_POPUP_HEADING,
  });
  wrapper.appendChild(heading);

  const link = createElement({
    tag: "p",
    innerHTML: document.location.host + document.location.pathname,
    styles: STYLES_SAVING_POPUP_LINK,
  });
  wrapper.appendChild(link);

  await loadFont();
  document.body.appendChild(wrapper);
};

const STYLES_SAVING_POPUP_BUTTON_RESET = {
  margin: 0,
  backgroundColor: "unset",
  border: "none",
  cursor: "pointer",
  outline: 0,
};

const STYLES_SAVING_POPUP_RETRY_BUTTON = {
  ...STYLES_SAVING_POPUP_BUTTON_RESET,
  boxSizing: "border-box",
  overflowWrap: "break-word",
  textAlign: "left",
  fontFamily: font.medium,
  fontSize: "0.875rem",
  lineFeight: "20px",
  letterSpacing: "-0.006px",

  borderRadius: "8px",
  backgroundColor: semantic.bgGrayLight,
  padding: "1px 12px 3px",
};

const STYLES_SAVING_POPUP_DISMISS_BUTTON = {
  ...STYLES_SAVING_POPUP_BUTTON_RESET,
  marginRight: "8px",
  padding: "4px",
  borderRadius: "50%",
  border: "1px solid",
  backgroundColor: semantic.bgLight,
  borderColor: semantic.borderGrayLight4,
  boxShadow: shadow.jumperLight,
};

const createSavingPopupFailure = ({ onDismiss, onRetry }) => {
  const wrapper = createElement({
    tag: "div",
    styles: {
      ...STYLES_SAVING_POPUP_POSITION_FIXED,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    attrs: { id: SAVING_POPUP_ID },
  });

  const dismissButton = createElement({
    tag: "button",
    innerHTML: SavingButtonDismissIcon,
    styles: STYLES_SAVING_POPUP_DISMISS_BUTTON,
  });
  dismissButton.addEventListener("click", onDismiss);
  wrapper.appendChild(dismissButton);

  const alert = createElement({
    tag: "div",
    innerHTML: SavingPopupFailureIcon,
    styles: STYLES_SAVING_POPUP_WRAPPER,
  });
  wrapper.appendChild(alert);

  const heading = createElement({
    tag: "p",
    innerHTML: "Failed to save",
    styles: STYLES_SAVING_POPUP_HEADING,
  });
  alert.appendChild(heading);

  const link = createElement({
    tag: "p",
    innerHTML: document.location.host + document.location.pathname,
    styles: { ...STYLES_SAVING_POPUP_LINK, maxWidth: 101 },
  });
  alert.appendChild(link);

  const retryButton = createElement({
    tag: "button",
    innerHTML: "Retry",
    styles: STYLES_SAVING_POPUP_RETRY_BUTTON,
  });
  retryButton.addEventListener("click", onRetry);

  alert.appendChild(retryButton);

  document.body.appendChild(wrapper);
};

const removeSavingPopup = () => {
  const popup = document.getElementById(SAVING_POPUP_ID);
  if (!popup) return;
  popup.remove();
};

let timeout;
const showSavingStatusPopup = async ({ status, url, title, favicon }) => {
  if (status === savingStates.start) {
    removeSavingPopup();
    await createSavingPopupSuccess();
    timeout = setTimeout(removeSavingPopup, SAVING_POPUP_REMOVAL_TIMEOUT);
  }
  if (status === savingStates.failed) {
    // NOTE(amine): clear popup's timeout before showing failure
    clearTimeout(timeout);
    removeSavingPopup();
    await loadFont();
    const handleOnRetry = () => {
      console.log("retrying");
      chrome.runtime.sendMessage({
        type: viewer_messages.saveLink,
        url,
        title,
        favicon,
        source: savingSources.command,
      });
    };
    createSavingPopupFailure({
      onDismiss: removeSavingPopup,
      onRetry: handleOnRetry,
    });
  }
};

/* -------------------------------------------------------------------------------------------------
 * Event listeners
 * -----------------------------------------------------------------------------------------------*/

chrome.runtime.onMessage.addListener(async (request) => {
  const { type, data } = request;
  if (type === viewer_messages.savingStatus) {
    // NOTE(amine): forward the saving status to the jumper and new tab
    window.postMessage({ type: viewer_messages.savingStatus, data }, "*");

    // NOTE(amine): show saving popup when saving through cmd+b
    if (
      data.url === window.location.href &&
      data.source === savingSources.command
    ) {
      await showSavingStatusPopup({
        status: request.data.savingStatus,
        url: data.url,
        title: data.title,
        favicon: data.favicon,
      });
    }
  }
});

window.addEventListener("message", async function (event) {
  if (event.data.type === viewer_messages.loadViewerDataRequest) {
    chrome.runtime.sendMessage(
      { type: viewer_messages.loadViewerDataRequest },
      (response) => {
        window.postMessage(
          { type: viewer_messages.loadViewerDataResponse, data: response },
          "*"
        );
      }
    );
    return;
  }

  if (event.data.type === viewer_messages.saveLink) {
    chrome.runtime.sendMessage({
      type: viewer_messages.saveLink,
      url: event.data.url,
      title: event.data.title,
    });
  }
});

;// CONCATENATED MODULE: ./src/content.js





/******/ })()
;