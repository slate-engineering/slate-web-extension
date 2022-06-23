import { messages } from ".";

window.addEventListener("message", async function (event) {
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
  }
});
