import * as views from "../views";

export const messages = {
  loadViewerDataRequest: "LOAD_VIEWER_DATA_REQUEST",
  loadViewerDataResponse: "LOAD_VIEWER_DATA_RESPONSE",

  saveLink: "SAVE_LINK",
  savingStatus: "SAVING_STATUS",
};

// NOTE(amine): commands are defined in manifest.json
export const commands = {
  directSave: "direct-save",
};

export const savingStates = {
  start: "start",
  done: "done",
  duplicate: "duplicate",
  failed: "failed",
};

export const savingSources = {
  command: "command",
  app: "app",
};

export const viewerInitialState = {
  isAuthenticated: false,
  shouldSync: false,
  initialView: views.initialView,
  windows: {
    data: { currentWindow: [], allOpen: [] },
  },
  // NOTE(amine):if there is one tab is open,populate the recent view
};
