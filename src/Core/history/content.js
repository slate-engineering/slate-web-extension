import { messages } from "./";

chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === messages.historyChunk) {
    window.postMessage(
      {
        type: messages.historyChunk,
        data: request.data,
        canFetchMore: request.canFetchMore,
      },
      "*"
    );
    return;
  }

  if (request.type === messages.windowsUpdate) {
    window.postMessage(
      { type: messages.windowsUpdate, data: request.data },
      "*"
    );
  }

  if (request.type === messages.searchResults) {
    window.postMessage(
      { type: messages.searchResults, data: request.data },
      "*"
    );
  }
});

window.addEventListener("message", async function (event) {
  if (event.data.type === messages.requestHistoryDataByChunk) {
    chrome.runtime.sendMessage({
      type: messages.requestHistoryDataByChunk,
      startIndex: event.data.startIndex,
    });
  }

  if (event.data.type === messages.requestSearchQuery) {
    chrome.runtime.sendMessage({
      type: messages.requestSearchQuery,
      query: event.data.query,
    });
  }
});
