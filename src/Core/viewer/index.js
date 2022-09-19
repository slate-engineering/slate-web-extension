export const messages = {
  loadViewerDataRequest: "LOAD_VIEWER_DATA_REQUEST",
  loadViewerDataResponse: "LOAD_VIEWER_DATA_RESPONSE",

  updateViewer: "UPDATE_VIEWER",

  saveLink: "SAVE_LINK",
  savingStatus: "SAVING_STATUS",

  addObjectsToSlate: "ADD_OBJECTS_TO_SLATE",
  removeObjectsFromSlate: "REMOVE_OBJECTS_FROM_SLATE",
  createSlate: "CREATE_SLATE",

  getSavedLinksSourcesRequest: "GET_SAVED_LINKS_SOURCES_REQUEST",
  getSavedLinksSourcesResponse: "GET_SAVED_LINKS_SOURCES_RESPONSE",

  updateViewerSettings: "UPDATE_VIEWER_SETTINGS",
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
  windows: {
    data: { currentWindow: [], allOpen: [] },
  },
  // NOTE(amine):if there is one tab is open,populate the recent view
};
