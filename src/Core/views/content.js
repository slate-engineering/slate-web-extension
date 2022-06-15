import { messages } from "./";

window.addEventListener("message", async function (event) {
  if (event.data.type === messages.searchQueryRequest) {
    chrome.runtime.sendMessage(
      {
        type: messages.searchQueryRequest,
        query: event.data.query,
        viewType: event.data.viewType,
      },
      (response) =>
        window.postMessage(
          { type: messages.searchQueryResponse, data: response },
          "*"
        )
    );
  }

  if (event.data.type === messages.viewByTypeRequest) {
    chrome.runtime.sendMessage(
      {
        type: messages.viewByTypeRequest,
        viewType: event.data.viewType,
        query: event.data.query,
      },
      (response) =>
        window.postMessage(
          { type: messages.viewByTypeResponse, data: response },
          "*"
        )
    );
  }
});
