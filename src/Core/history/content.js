import { messages } from "./";

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
  }
});
