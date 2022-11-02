import { messages, savingStates, savingSources } from ".";

import * as Constants from "~/common/constants";

/* -------------------------------------------------------------------------------------------------
 * Saving popup
 * -----------------------------------------------------------------------------------------------*/

const SAVING_POPUP_ID = "slate-extension-saving-popup";
const SAVING_POPUP_REMOVAL_TIMEOUT = 2500;

const STYLES_SAVING_POPUP_POSITION_FIXED = {
  position: "fixed",
  right: "47px",
  bottom: "44px",
  zIndex: Constants.zindex.extensionJumper,
};

const STYLES_SAVING_POPUP_H5 = {
  boxSizing: "border-box",
  padding: 0,
  margin: 0,
  overflowWrap: "break-word",
  textAlign: "left",
  fontWeight: "normal",
  fontFamily: Constants.font.medium,
  fontSize: "14px",
  lineHeight: "20px",
  letterSpacing: "-0.006px",
};

const STYLES_SAVING_POPUP_WRAPPER = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "12px 16px",
  borderRadius: "16px",
  backgroundColor: Constants.semantic.bgLight,
  borderColor: Constants.semantic.borderGrayLight4,
  boxShadow: Constants.shadow.jumperLight,
};

const STYLES_SAVING_POPUP_HEADING = {
  ...STYLES_SAVING_POPUP_H5,
  marginLeft: "8px",
  color: Constants.semantic.textBlack,
};

const STYLES_SAVING_POPUP_LINK = {
  ...STYLES_SAVING_POPUP_H5,
  width: "131px",
  maxWidth: "131px",
  marginLeft: "4px",
  color: Constants.semantic.textGray,

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
  fontFamily: Constants.font.medium,
  fontSize: "0.875rem",
  lineFeight: "20px",
  letterSpacing: "-0.006px",

  borderRadius: "8px",
  backgroundColor: Constants.semantic.bgGrayLight,
  padding: "1px 12px 3px",
};

const STYLES_SAVING_POPUP_DISMISS_BUTTON = {
  ...STYLES_SAVING_POPUP_BUTTON_RESET,
  marginRight: "8px",
  padding: "4px",
  borderRadius: "50%",
  border: "1px solid",
  backgroundColor: Constants.semantic.bgLight,
  borderColor: Constants.semantic.borderGrayLight4,
  boxShadow: Constants.shadow.jumperLight,
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
      chrome.runtime.sendMessage({
        type: messages.saveLink,
        objects: [{ url, title, favicon }],
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
  if (type === messages.updateViewer) {
    // TODO(amine): check if jumper is open
    window.postMessage({ type: messages.updateViewer, data }, "*");
    return;
  }

  if (type === messages.savingStatus) {
    // NOTE(amine): forward the saving status to the jumper and new tab
    window.postMessage({ type: messages.savingStatus, data }, "*");

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
  if (event.data.type === messages.updateViewerSettings) {
    chrome.runtime.sendMessage({
      type: messages.updateViewerSettings,
      ...event.data,
    });
    return;
  }

  if (event.data.type === messages.loadViewerDataRequest) {
    chrome.runtime.sendMessage(
      { type: messages.loadViewerDataRequest },
      (response) => {
        window.postMessage(
          { type: messages.loadViewerDataResponse, data: response },
          "*"
        );
      }
    );
    return;
  }

  if (event.data.type === messages.getSavedLinksSourcesRequest) {
    chrome.runtime.sendMessage(
      { type: messages.getSavedLinksSourcesRequest },
      (response) => {
        window.postMessage(
          { type: messages.getSavedLinksSourcesResponse, data: response },
          "*"
        );
      }
    );
    return;
  }

  if (event.data.type === messages.removeObjects) {
    chrome.runtime.sendMessage({
      type: messages.removeObjects,
      objects: event.data.objects,
    });
    return;
  }

  if (event.data.type === messages.createSlate) {
    chrome.runtime.sendMessage({
      type: messages.createSlate,
      objects: event.data.objects,
      slateName: event.data.slateName,
    });
    return;
  }

  if (event.data.type === messages.addObjectsToSlate) {
    chrome.runtime.sendMessage({
      type: messages.addObjectsToSlate,
      objects: event.data.objects,
      slateName: event.data.slateName,
    });
    return;
  }

  if (event.data.type === messages.removeObjectsFromSlate) {
    chrome.runtime.sendMessage({
      type: messages.removeObjectsFromSlate,
      objects: event.data.objects,
      slateName: event.data.slateName,
    });
    return;
  }

  if (event.data.type === messages.saveLink) {
    chrome.runtime.sendMessage({
      type: messages.saveLink,
      objects: event.data.objects,
    });
  }
});
