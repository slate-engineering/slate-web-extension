import * as views from "../views";

export const messages = {
  preloadInitialDataRequest: "PRELOAD_INITIAL_DATA_REQUEST",
  preloadInitialDataResponse: "PRELOAD_INITIAL_DATA_RESPONSE",
};

export const appInitialState = {
  isAuthenticated: false,
  shouldSync: false,
  initialView: views.initialView,
  windows: {
    data: { currentWindow: [], allOpen: [] },
  },
  // NOTE(amine):if there is one tab is open,populate the recent view
};
