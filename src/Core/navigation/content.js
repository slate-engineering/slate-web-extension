import { messages } from "./";

const EXTENSION_JUMPER_WRAPPER_ID = "jumper-slate-extension-wrapper";

const getExtensionJumperWrapper = () =>
  document.getElementById(EXTENSION_JUMPER_WRAPPER_ID);

const createExtensionJumperWrapper = () => {
  if (getExtensionJumperWrapper()) return;

  const wrapper = document.createElement("div");
  wrapper.setAttribute("id", EXTENSION_JUMPER_WRAPPER_ID);
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
      $(styleStashHTML).appendTo(`#${EXTENSION_JUMPER_WRAPPER_ID}`);
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

chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === messages.openExtensionJumperRequest) {
    openApp();
  }
});

window.addEventListener("message", async function (event) {
  if (event.data.type === messages.closeExtensionJumperRequest) {
    closeApp();
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
