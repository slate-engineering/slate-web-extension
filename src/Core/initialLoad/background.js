import { viewer } from "../auth/background";
import { Windows } from "../history/background";
import { messages } from "./";

/** ------------ Event listeners ------------- */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === messages.preloadInitialDataRequest) {
    const getInitialData = async () => {
      const isAuthenticated = await viewer.checkIfAuthenticated();
      const shouldSync = await viewer.checkIfShouldSync();

      if (shouldSync) viewer.lazySync();

      if (!isAuthenticated) {
        return {
          isAuthenticated,
          shouldSync,
          windows: { currentWindow: [], allOpen: [] },
        };
      }

      const windows = await Windows.getAll();
      return {
        isAuthenticated,
        shouldSync,
        windows: { currentWindow: windows, allOpen: windows },
      };
    };

    getInitialData().then(sendResponse);
    return true;
  }
});
