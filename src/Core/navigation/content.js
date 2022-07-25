import * as Constants from "../../Common/constants";

import { messages } from "./";

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
  document.getElementById(Constants.jumperSlateExtensionWrapper);

const createExtensionJumperWrapper = () => {
  if (getExtensionJumperWrapper()) return;

  const wrapper = document.createElement("div");
  wrapper.setAttribute("id", Constants.jumperSlateExtensionWrapper);
  wrapper.setAttribute("data-url", chrome.runtime.getURL("/").slice(0, -1));
  document.body.appendChild(wrapper);
};

export const openApp = () => {
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

export const closeApp = () => {
  const extensionJumperWrapper = getExtensionJumperWrapper();
  extensionJumperWrapper.innerHTML = "";
};

/** ------------ Event Listeners ------------- */

let activeElement;
chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === messages.openExtensionJumperRequest) {
    activeElement = document.activeElement;
    openApp();
  }
});

window.addEventListener("message", async function (event) {
  if (event.data.type === messages.closeTabs) {
    chrome.runtime.sendMessage({
      type: messages.closeTabs,
      tabsId: event.data.tabsId,
    });
    return;
  }

  if (event.data.type === messages.closeExtensionJumperRequest) {
    if (activeElement) activeElement.focus();
    closeApp();
    return;
  }

  if (event.data.type === messages.createGroup) {
    chrome.runtime.sendMessage({
      type: messages.createGroup,
      urls: event.data.urls,
      windowId: event.data.windowId,
      title: event.data.title,
    });
    return;
  }

  if (event.data.type === messages.openURLsRequest) {
    chrome.runtime.sendMessage({
      type: messages.openURLsRequest,
      urls: event.data.urls,
      query: event.data.query,
    });
    return;
  }
});
