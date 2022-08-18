import { messages, viewsType } from "./";
import { Viewer, ViewerActions } from "../viewer/background";
import { browserHistory, Windows } from "../browser/background";

import Fuse from "fuse.js";

class ViewsHandler {
  async search({ viewType, viewQuery, query }) {
    if (viewType === viewsType.allOpen) {
      return Windows.search(query);
    }

    if (viewType === viewsType.recent) {
      return await browserHistory.search(query);
    }

    if (viewType === viewsType.relatedLinks) {
      const viewsResult = await browserHistory.getRelatedLinks(viewQuery);
      const options = {
        findAllMatches: true,
        shouldSort: true,
        threshold: 0.5,
        keys: ["url", "title"],
      };

      const fuse = new Fuse(viewsResult, options);
      const results = fuse.search(query);

      return results.map(({ item }) => item);
    }
  }
}

const Views = new ViewsHandler();

/** ------------ Event listeners ------------- */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === messages.viewByTypeRequest) {
    console.log(`VIEW FOR ${request.viewType} ${request.query}`);
    if (request.viewType === viewsType.savedFiles) {
      Viewer.get().then((res) =>
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
    const searchHandler = async ({ viewType, viewQuery, viewLabel, query }) => {
      let slates = [];
      const searchFeedKeys = ["Saved"];
      const searchFeed = {};

      const handleSavedFilesSearch = async () => {
        const savedSearchResult = await ViewerActions.search(query);
        slates = savedSearchResult.slates;
        searchFeed["Saved"] = savedSearchResult.files;
      };

      const handleViewsSearch = async () => {
        if (viewType !== viewsType.savedFiles) {
          const viewsSearchResult = await Views.search({
            viewType: viewType,
            viewQuery: viewQuery,
            query,
          });
          searchFeedKeys.push(viewLabel);
          searchFeed[viewLabel] = viewsSearchResult;
        }
      };

      await Promise.all([handleSavedFilesSearch(), handleViewsSearch()]);

      return { query, slates, searchFeedKeys, searchFeed };
    };

    searchHandler({
      query: request.query,
      viewType: request.viewType,
      viewQuery: request.viewQuery,
      viewLabel: request.viewLabel,
    }).then(sendResponse);

    return true;
  }
});
