import { messages } from "./";

chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === messages.historyChunk) {
    window.postMessage(
      { type: messages.historyChunk, data: request.data },
      "*"
    );
  }
});

chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === messages.windowsUpdate) {
    window.postMessage(
      { type: messages.windowsUpdate, data: request.data },
      "*"
    );
  }
});

window.addEventListener("message", async function (event) {
  if (event.data.type === messages.requestHistoryDataByChunk) {
    chrome.runtime.sendMessage({
      type: messages.requestHistoryDataByChunk,
      id: event.data.id,
    });
  }
});
