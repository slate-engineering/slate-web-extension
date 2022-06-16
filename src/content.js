import * as Constants from "./Common/constants";
import * as UploadUtilities from "./Utilities/upload";

import "./Core/history/content";
import "./Core/navigation/content";
import "./Core/views/content";
import "./Core/initialLoad/content";

// eslint-disable-next-line no-redeclare
/* global chrome */
if (window.location.href.startsWith(Constants.uri.hostname)) {
  if (window.location.href.includes("extension=true")) {
    document.addEventListener("keydown", function () {
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

chrome.runtime.onMessage.addListener(function (request) {
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
