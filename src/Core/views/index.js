export const messages = {
  searchQueryRequest: "SEARCH_QUERY_REQUEST",
  searchQueryResponse: "SEARCH_QUERY_RESPONSE",

  viewFeedRequest: "VIEW_FEED_REQUEST",
  viewFeedResponse: "VIEW_FEED_RESPONSE",

  createViewByTag: "CREATE_VIEW_BY_TAG",
  createViewBySource: "CREATE_VIEW_BY_SOURCE",
};

export const viewsType = {
  allOpen: "allOpen",
  recent: "recent",
  savedFiles: "savedFiles",
  custom: "custom",
};

export const defaultViews = {
  allOpen: { id: "allOpen", name: "All Open", type: viewsType.allOpen },
  recent: { id: "recent", name: "Recent", type: viewsType.recent },
  savedFiles: {
    id: "savedFiles",
    name: "Saved Files",
    type: viewsType.savedFiles,
  },
};

export const initialView = defaultViews.allOpen;
