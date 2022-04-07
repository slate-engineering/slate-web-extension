import * as Constants from "./Common/constants";
import * as UploadUtilities from "./Utilities/upload";
import * as Navigation from "./Utilities/navigation";

import "./Core/history/content";

/* global chrome */
if (window.location.href.startsWith(Constants.uri.hostname)) {
  if (window.location.href.includes("extension=true")) {
    document.addEventListener("keydown", function (e) {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      chrome.runtime.sendMessage({
        type: "GO_BACK",
        id: id,
      });
    });
  }
  //TODO: Have the extension change the 'download chrome extension' button
}

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  if (request.type === Navigation.messages.navigate) {
    Navigation.handleNavigationRequests(request.data);
    return;
  }

  if (request.type === Navigation.messages.openApp) {
    Navigation.openApp();
  }

  if (request.type === UploadUtilities.messages.uploadStatus) {
    UploadUtilities.forwardUploadStatusToApp({
      status: request.status,
      data: request.data,
    });
  }

  if (request.run === "AUTH_REQ") {
    window.postMessage({ type: "AUTH_REQ" }, "*");
    return true;
  }

  if (request.run === "CHECK_LINK") {
    window.postMessage(
      { type: "CHECK_LINK", data: request.data, user: request.user },
      "*"
    );
    return true;
  }
});

window.addEventListener("message", async function (event) {
  if (event.data.type === UploadUtilities.messages.saveLink) {
    UploadUtilities.forwardSaveLinkRequestsToBackground({
      url: event.data.url,
    });
  }

  if (event.data.run === "CHECK_LOGIN") {
    chrome.runtime.sendMessage({ type: "CHECK_LOGIN" });
    return true;
  }

  if (event.data.run === "SIGN_OUT") {
    chrome.runtime.sendMessage({ type: "SIGN_OUT" });
  }
});
