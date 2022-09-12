export const messages = {
  searchQueryRequest: "SEARCH_QUERY_REQUEST",
  searchQueryResponse: "SEARCH_QUERY_RESPONSE",

  viewFeedRequest: "VIEW_FEED_REQUEST",
  viewFeedResponse: "VIEW_FEED_RESPONSE",

  createViewByTag: "CREATE_VIEW_BY_TAG",
  createViewBySource: "CREATE_VIEW_BY_SOURCE",

  removeView: "REMOVE_VIEW",
};

export const viewsType = {
  allOpen: "allOpen",
  recent: "recent",
  saved: "saved",
  files: "files",
  custom: "custom",
};

export const defaultViews = {
  allOpen: { id: "allOpen", name: "All Open", type: viewsType.allOpen },
  recent: { id: "recent", name: "Recent", type: viewsType.recent },
  saved: {
    id: "saved",
    name: "Saved",
    type: viewsType.saved,
  },
  files: {
    id: "files",
    name: "Files",
    type: viewsType.files,
  },
};

export const initialView = defaultViews.allOpen;
