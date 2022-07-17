import { messages, viewsType } from "./";
import { viewer } from "../viewer/background";
import { browserHistory, Windows } from "../browser/background";

/** ------------ Event listeners ------------- */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === messages.viewByTypeRequest) {
    console.log(`VIEW FOR ${request.viewType} ${request.query}`);
    if (request.viewType === viewsType.savedFiles) {
      viewer.get().then((res) =>
        sendResponse({
          result: res.objects,
          viewType: request.viewType,
        })
      );

      return true;
    }

    browserHistory.getRelatedLinks(request.query).then((result) => {
      sendResponse({
        result: result,
        query: request.query,
      });
    });

    return true;
  }

  if (request.type === messages.searchQueryRequest) {
    const searchHandlers = [];
    if (
      request.viewType === viewsType.allOpen ||
      request.viewType === viewsType.currentWindow
    ) {
      const searchOptions = {};
      if (request.viewType === viewsType.currentWindow)
        searchOptions.windowId = sender.tab.windowId;

      searchHandlers.push({
        handler: Windows.search(request.query, searchOptions),
        title: request.viewType,
      });
    }
    searchHandlers.push({
      handler: browserHistory.search(request.query),
      title: "recent",
    });

    Promise.all(searchHandlers.map(({ handler }) => handler)).then((result) => {
      sendResponse({
        result: result.reduce((acc, result, i) => {
          if (result.length === 0) return acc;
          acc.push({
            title: searchHandlers[i].title,
            result,
          });
          return acc;
        }, []),
        query: request.query,
      });
    });

    return true;
  }
});
