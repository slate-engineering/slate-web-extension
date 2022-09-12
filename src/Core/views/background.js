import { messages, viewsType } from "./";
import { Viewer, ViewerActions, getViewId } from "../viewer/background";
import { browserHistory, Windows } from "../browser/background";

import Fuse from "fuse.js";

class ViewsHandler {
  async search({ query, view }) {
    if (view.type === viewsType.allOpen) {
      return Windows.search(query);
    }

    if (view.type === viewsType.recent) {
      return await browserHistory.search(query);
    }

    if (view.type === viewsType.custom) {
      const handleFetchCustomFeed = async (viewCustomId) => {
        const viewer = await Viewer.get();
        const viewId = getViewId({ viewer, customId: viewCustomId });
        const view = viewer.views.find((view) => view.id === viewId);

        if (!view) return [];

        if (view.filterBySource) {
          const feed = await browserHistory.getRelatedLinks(
            view.filterBySource
          );
          return feed;
        }

        if (view.filterBySlateId) {
          const slate = viewer.slates.find(
            (slate) => slate.id === view.filterBySlateId
          );

          if (!slate) return [];

          return slate.objects.map(Viewer._serializeObject);
        }
      };

      const viewsResult = await handleFetchCustomFeed(view.id);
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
  if (request.type === messages.viewFeedRequest) {
    console.log(`VIEW FOR`, request.view);

    const handleFetchCustomFeed = async (viewCustomId) => {
      const viewer = await Viewer.get();
      const viewId = getViewId({ viewer, customId: viewCustomId });
      const view = viewer.views.find((view) => view.id === viewId);

      if (!view) return [];

      if (view.filterBySource) {
        const feed = await browserHistory.getRelatedLinks(view.filterBySource);

        return feed;
      }

      if (view.filterBySlateId) {
        const slate = viewer.slates.find(
          (slate) => slate.id === view.filterBySlateId
        );

        if (!slate) return [];

        return slate.objects.map(Viewer._serializeObject);
      }
    };

    if (request.view.type === viewsType.custom) {
      handleFetchCustomFeed(request.view.id).then((res) =>
        sendResponse({
          result: res,
          view: request.view,
        })
      );
      return true;
    }

    if (request.view.type === viewsType.saved) {
      Viewer.get().then((res) =>
        sendResponse({
          result: res.objects.filter((object) => object.isLink),
          view: request.view,
        })
      );
      return true;
    }

    if (request.view.type === viewsType.files) {
      Viewer.get().then((res) =>
        sendResponse({
          result: res.objects.filter((object) => !object.isLink),
          view: request.view,
        })
      );
      return true;
    }
  }

  if (request.type === messages.createViewByTag) {
    ViewerActions.createView({ slateName: request.slateName }).then(
      sendResponse
    );
    return true;
  }

  if (request.type === messages.createViewBySource) {
    ViewerActions.createView({ source: request.source }).then(sendResponse);
    return true;
  }

  if (request.type === messages.searchQueryRequest) {
    const searchHandler = async ({ query, view }) => {
      let slates = [];
      const searchFeedKeys = ["Saved"];
      const searchFeed = {};

      const handleSlatesSearch = async () => {
        slates = await ViewerActions.searchSlates(query);
      };

      const handleSavedFilesSearch = async () => {
        const savedSearchResult = await ViewerActions.search(query);
        searchFeed["Saved"] = savedSearchResult.files;
      };

      const handleViewsSearch = async () => {
        if (view.type !== viewsType.saved && view.type !== viewsType.files) {
          const viewsSearchResult = await Views.search({
            view,
            query,
          });
          searchFeedKeys.push(view.name);
          searchFeed[view.name] = viewsSearchResult;
        }
      };

      await Promise.all([
        handleSavedFilesSearch(),
        handleSlatesSearch(),
        handleViewsSearch(),
      ]);

      return { query, slates, searchFeedKeys, searchFeed };
    };

    searchHandler({
      query: request.query,
      view: request.view,
    }).then(sendResponse);

    return true;
  }
});
