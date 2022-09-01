import { messages } from "./";

window.addEventListener("message", async function (event) {
  if (event.data.type === messages.searchQueryRequest) {
    chrome.runtime.sendMessage(
      {
        type: messages.searchQueryRequest,
        query: event.data.query,
        view: event.data.view,
      },
      (response) => {
        window.postMessage(
          { type: messages.searchQueryResponse, data: response },
          "*"
        );
      }
    );
  }

  if (event.data.type === messages.viewFeedRequest) {
    chrome.runtime.sendMessage(
      {
        type: messages.viewFeedRequest,
        view: event.data.view,
      },
      (response) =>
        window.postMessage(
          { type: messages.viewFeedResponse, data: response },
          "*"
        )
    );
  }

  if (event.data.type === messages.createViewByTag) {
    chrome.runtime.sendMessage({
      type: messages.createViewByTag,
      slateName: event.data.slateName,
    });
  }
});

chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === messages.createViewByTagSuccess) {
    window.postMessage(
      { type: messages.createViewByTagSuccess, data: request.data },
      "*"
    );
  }
});
