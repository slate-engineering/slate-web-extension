import { viewer } from "../auth/background";
import { browserHistory, Windows } from "../history/background";
import { viewsType } from "../views";
import { messages, appInitialState } from "./";

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
          currentWindow: [],
          allOpen: [],
        };
      }
      const response = {
        ...appInitialState,
        isAuthenticated,
        shouldSync,
        currentWindow: await Windows.getAllTabsInWindow(sender.tab.windowId),
        allOpen: await Windows.getAllTabs(),
      };

      // NOTE(amine): if there is only tab that's open, preload recent view
      if (response.allOpen.length === 1) {
        response.recent = await browserHistory.getChunk();
        response.initialView = viewsType.recent;
      }
      return response;
    };

    getInitialData().then(sendResponse);
    return true;
  }
});
