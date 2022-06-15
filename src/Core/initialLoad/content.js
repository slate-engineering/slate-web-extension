import { messages } from "./";

window.addEventListener("message", async function (event) {
  if (event.data.type === messages.preloadInitialDataRequest) {
    chrome.runtime.sendMessage(
      { type: messages.preloadInitialDataRequest },
      (response) => {
        window.postMessage(
          { type: messages.preloadInitialDataResponse, data: response },
          "*"
        );
      }
    );
  }
});
