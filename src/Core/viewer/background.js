import * as Actions from "../../Common/actions";
import * as Constants from "../../Common/constants";

import { Windows, Tabs } from "../browser/background";
import {
  messages,
  commands,
  viewerInitialState,
  savingStates,
  savingSources,
} from ".";
import { constructWindowsFeed } from "../../Extension_common/utilities";
import { capitalize } from "../../Common/strings";
import { viewsType } from "../views";
import { v4 as uuid } from "uuid";

import Fuse from "fuse.js";

const getRootDomain = (url) => {
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    hostname = "";
  }
  const hostnameParts = hostname.split(".");
  return hostnameParts.slice(-(hostnameParts.length === 4 ? 3 : 2)).join(".");
};

const getFileUrl = (object) =>
  object.isLink ? object.url : `${Constants.gateways.ipfs}/${object.cid}`;

/** ----------------------------------------- */

const VIEWER_INITIAL_STATE = {
  objects: [],
  objectsMetadata: {},
  // NOTE(amine): { key: URL, value: id || 'savingStates.start' when saving an object (will be updated with the id when it's saved)}
  savedObjectsLookup: {},

  savedObjectsSlates: {},
  slatesLookup: {},
  slates: [],

  viewsSourcesLookup: {},
  viewsSlatesLookup: {},
  views: [],

  sources: {},

  lastFetched: null,
  isAuthenticated: false,
};

let VIEWER_INTERNAL_STORAGE;
const VIEWER_LOCAL_STORAGE_KEY = "viewer_backup";

class ViewerHandler {
  constructor() {
    this.observers = [];
    this.runningActions = [];
  }

  onChange(callback) {
    this.observers.push(callback);
  }

  notifyChange(viewer) {
    this.observers.forEach((callback) => callback(viewer));
  }

  async _getFromLocalStorage() {
    const result = await chrome.storage.local.get([VIEWER_LOCAL_STORAGE_KEY]);
    return result[VIEWER_LOCAL_STORAGE_KEY];
  }

  async _updateStorage(viewer) {
    chrome.storage.local.set({
      [VIEWER_LOCAL_STORAGE_KEY]: viewer,
    });
  }

  async _getObjectIdFromUrl(url) {
    const viewer = await this.get();
    return viewer.savedObjectsLookup[url];
  }

  _serialize(viewer) {
    const defaultViews = [
      {
        id: "test-youtube",
        name: "Youtube",
        createdAt: "",
        updatedAt: "",
        order: 1,
        filters: { domain: "https://www.youtube.com/" },
        metadata: {},
      },
      {
        id: "test-hacker",
        name: "Hacker News",
        createdAt: "",
        updatedAt: "",
        order: 2,
        filters: { domain: "https://news.ycombinator.com/" },
        metadata: {},
      },
      {
        id: "test-rust",
        name: "Rust",
        createdAt: "",
        updatedAt: "",
        order: 3,
        filters: { slateId: "63ce1767-9ab0-4677-9233-d6e372e37c5e" },
        metadata: {},
      },
    ];

    const serializedViewer = {
      objects: [],
      objectsMetadata: {},
      savedObjectsLookup: {},

      savedObjectsSlates: {},
      slatesLookup: {},
      slates: viewer.slates.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),

      viewsSourcesLookup: {},
      viewsSlatesLookup: {},
      views: defaultViews,

      sources: {},
    };

    serializedViewer.views.forEach((view) => {
      const { domain, slateId } = view.filters;
      if (domain) {
        serializedViewer.viewsSourcesLookup[domain] = true;
        return;
      }

      const slate = viewer.slates.find((slate) => slate.id === slateId);
      if (slate) {
        serializedViewer.viewsSlatesLookup[slate.slatename] = true;
      }
    });

    serializedViewer.objects = viewer.library.map((object) => {
      serializedViewer.objectsMetadata[getFileUrl(object)] = {
        id: object.id,
        cid: object.cid,
      };

      if (object.isLink) {
        serializedViewer.savedObjectsLookup[object.url] = true;
      }

      const fileUrl = getFileUrl(object);
      serializedViewer.savedObjectsLookup[fileUrl] = true;

      return this._serializeObject(object);
    });

    viewer.slates.forEach((slate) => {
      const { savedObjectsSlates, slatesLookup } = serializedViewer;
      if (!slatesLookup[slate.name]) slatesLookup[slate.name] = {};

      slate.objects.forEach((object) => {
        const objectUrl = getFileUrl(object);
        slatesLookup[slate.name][objectUrl] = true;

        if (!savedObjectsSlates[objectUrl]) savedObjectsSlates[objectUrl] = [];
        savedObjectsSlates[objectUrl].push(slate.name);
      });
    });

    return serializedViewer;
  }

  _serializeObject(object) {
    if (object.isLink) {
      return {
        title: object.linkName,
        favicon: object.linkFavicon,
        url: object.url,
        rootDomain: getRootDomain(object.url),
        cid: object.cid,
        isSaved: true,
      };
    }

    const fileUrl = getFileUrl(object);

    return {
      title: object.name,
      rootDomain: Constants.uri.domain,
      url: fileUrl,
      cid: object.cid,
      isSaved: true,
    };
  }

  _set(viewer) {
    this._updateStorage(viewer);
    VIEWER_INTERNAL_STORAGE = viewer;

    this.notifyChange(viewer);
    return VIEWER_INTERNAL_STORAGE;
  }

  async get() {
    if (VIEWER_INTERNAL_STORAGE) return VIEWER_INTERNAL_STORAGE;

    const localViewer = await this._getFromLocalStorage();
    if (localViewer) {
      VIEWER_INTERNAL_STORAGE = localViewer;
      return localViewer;
    }

    VIEWER_INTERNAL_STORAGE = VIEWER_INITIAL_STATE;
    return VIEWER_INTERNAL_STORAGE;
  }

  async checkIfAuthenticated() {
    return (await this.get()).isAuthenticated;
  }

  async checkIfLinkIsSaved(url) {
    const viewer = await this.get();
    return !!viewer.savedObjectsLookup[url];
  }

  async reset() {
    this._set(VIEWER_INITIAL_STATE);
  }

  async sync() {
    //NOTE(amine): only sync when there are no running actions

    const viewer = await Actions.hydrateAuthenticatedUser();

    if (viewer.data) {
      const serializedViewer = this._serialize(viewer.data);
      const prevViewer = await this.get();
      this._set({
        ...prevViewer,
        ...serializedViewer,
        lastFetched: new Date().toString(),
        isAuthenticated: true,
      });
      return;
    }

    this.reset(VIEWER_INITIAL_STATE);
  }
}

export const Viewer = new ViewerHandler();

class ViewerActionsHandler {
  constructor() {
    this.runningActions = [];
  }

  _registerRunningAction() {
    this.runningActions.push("");
  }

  _cleanupCleanupAction() {
    this.runningActions.pop();
    setTimeout(() => {
      if (!this.runningActions.length) Viewer.sync();
    }, 200);
  }

  _addObjectsToViewer({ viewer, objects }) {
    objects.forEach((object) => {
      if (object.url in viewer.savedObjectsLookup) {
        return;
      }
      viewer.savedObjectsLookup[object.url] = savingStates.start;
      viewer.objects.push({
        title: object.title,
        url: object.title,
        favicon: object.favicon,
        rootDomain: getRootDomain(object.url),
        isSaved: true,
      });
    });
    return viewer;
  }

  async _removeObjectsFromViewer({ viewer, objects }) {
    objects.forEach(({ url }) => {
      delete viewer.savedObjectsLookup[url];
      viewer.objects = objects.filter((object) => object.url !== url);
    });

    return viewer;
  }

  _addSlateToViewer({ viewer, slateName }) {
    viewer.slatesLookup[slateName] = {};
    viewer.slates.push({
      slatename: slateName,
      name: slateName,
      createAt: new Date().toDateString(),
    });
    return viewer;
  }

  _removeSlateFromViewer({ viewer, slateName }) {
    delete viewer.slatesLookup[slateName];

    viewer.slates = viewer.slates.filter(
      (slate) => slate.slatename !== slateName
    );
    return viewer;
  }

  _addObjectsToViewerSlate({ viewer, objects, slateName }) {
    objects.forEach(({ url }) => {
      viewer.slatesLookup[slateName][url] = true;
    });

    objects.forEach(({ url }) => {
      if (!(url in viewer.savedObjectsSlates))
        viewer.savedObjectsSlates[url] = [];
      viewer.savedObjectsSlates[url].push(slateName);
    });

    return viewer;
  }

  _removeObjectsFromViewerSlate({ viewer, objects, slateName }) {
    objects.forEach(({ url }) => {
      if (slateName in viewer.slatesLookup) {
        delete viewer.slatesLookup[slateName][url];
      }
    });

    objects.forEach(({ url }) => {
      const filterOutSlateName = (slate) => slate !== slateName;
      viewer.savedObjectsSlates[url] =
        viewer.savedObjectsSlates[url].filter(filterOutSlateName);
    });

    return viewer;
  }

  /**
   * @description save a link and send saving status to new tab and the jumper
   *
   * @param {Object} Arguments
   * @param {string} Arguments.objects - objects to save
   * @param {Chrome.tab} Arguments.tab - tab to which we'll send saving status
   * @param {string} [Arguments.source="app"] - which source triggered saving, either via command or the app
   */

  async saveLink({ objects, slateName, tab, source = savingSources.app }) {
    this._registerRunningAction();

    let viewer = await Viewer.get();
    const areObjectsBeingSaved = objects.every(
      ({ url }) => viewer.savedObjectsLookup[url] === savingStates.start
    );

    if (areObjectsBeingSaved) return;

    const sendStatusUpdate = (status) => {
      if (source === savingSources.command) {
        // NOTE(amine): you can only save one object via command
        const { url, title, favicon } = objects[0];
        chrome.tabs.sendMessage(parseInt(tab.id), {
          type: messages.savingStatus,
          data: { savingStatus: status, url, title, favicon, source },
        });
      }
    };

    sendStatusUpdate(savingStates.start);

    const objectsToBeSaved = objects.filter(
      ({ url }) => !(url in viewer.savedObjectsLookup)
    );

    viewer = this._addObjectsToViewer({
      viewer,
      objects: objectsToBeSaved,
    });

    if (slateName) {
      viewer = this._addObjectsToViewerSlate({
        viewer,
        objects: objectsToBeSaved,
        slateName,
      });
    }
    Viewer._set(viewer);

    let payload = {};
    payload.urls = objectsToBeSaved.map(({ url }) => url);
    if (slateName) {
      const slatePayload = viewer.slates.find(
        (slate) => slate.name === slateName
      );
      payload.slate = slatePayload;
    }

    const response = await Actions.createLink(payload);

    if (!response || response.error) {
      sendStatusUpdate(savingStates.failed);
      let viewer = await Viewer.get();
      if (slateName) {
        viewer = this._removeObjectsFromViewerSlate({
          viewer,
          objects: objectsToBeSaved,
          slateName,
        });
      }
      viewer = this._removeObjectsFromViewer({
        viewer: viewer,
        objects: objectsToBeSaved,
      });
      Viewer._set(viewer);
      return;
    }

    sendStatusUpdate(savingStates.done);

    this._cleanupCleanupAction();
  }

  async addObjectsToSlate({ slateName, objects }) {
    let viewer = await Viewer.get();
    if (!(slateName in viewer.slatesLookup)) {
      return;
    }

    viewer = this._addObjectsToViewerSlate({
      viewer,
      objects,
      slateName,
    });
    Viewer._set(viewer);

    const filesPayload = objects.map(({ url }) => ({
      id: viewer.objectsMetadata[url].id,
      cid: viewer.objectsMetadata[url].cid,
    }));

    const slatePayload = viewer.slates.find(
      (slate) => slate.name === slateName
    );

    const response = await Actions.saveCopy({
      files: filesPayload,
      slate: slatePayload,
    });

    if (!response || response.error) {
      viewer = await Viewer.get();
      viewer = this._removeObjectsFromViewerSlate({
        viewer,
        objects,
        slateName,
      });
      Viewer._set(viewer);
    }

    return;
  }

  async removeObjectsFromSlate({ slateName, objects }) {
    let viewer = await Viewer.get();
    if (!(slateName in viewer.slatesLookup)) {
      return;
    }

    const filesIdsPayload = objects.map(
      ({ url }) => viewer.objectsMetadata[url].id
    );

    const slatePayload = viewer.slates.find(
      (slate) => slate.name === slateName
    );

    viewer = await this._removeObjectsFromViewerSlate({
      viewer,
      objects,
      slateName,
    });

    const isSlateEmpty =
      Object.keys(viewer.slatesLookup[slateName]).length === 0;
    // NOTE(amine): if the request fails, we'll use oldSlate to add that slate back
    let oldSlate;
    if (isSlateEmpty) {
      oldSlate = viewer.slates.find((slate) => slate.slatename === slateName);
      viewer = this._removeSlateFromViewer({ viewer, slateName });
    }

    Viewer._set(viewer);

    const response = await Actions.removeFileFromSlate({
      ids: filesIdsPayload,
      slateId: slatePayload.id,
    });

    if (!response || response.error) {
      viewer = await this.get();
      if (isSlateEmpty) {
        viewer.slates.push(oldSlate);
        oldSlate.objects.forEach((object) => {
          const objectUrl = getFileUrl(object);
          viewer.slatesLookup[slateName][objectUrl] = true;
        });
      }
      viewer = this._addObjectsToViewerSlate({
        viewer,
        objects,
        slateName,
      });
      Viewer._set(viewer);
    }

    return;
  }

  async createSlate({ slateName, objects }) {
    let viewer = await Viewer.get();
    if (slateName in viewer.slatesLookup) return;

    this._registerRunningAction();

    viewer = this._addSlateToViewer({ viewer, slateName });
    viewer = this._addObjectsToViewerSlate({
      viewer,
      objects,
      slateName,
    });
    Viewer._set(viewer);

    const response = await Actions.createSlate({
      name: slateName,
      isPublic: false,
    });

    if (!response || response.error) {
      let viewer = await Viewer.get();
      viewer = this._removeObjectsFromViewerSlate({
        viewer,
        objects,
        slateName,
      });
      viewer = this._removeSlateFromViewer({ viewer, slateName });
      Viewer._set(viewer);
      return;
    } else {
      const viewer = await Viewer.get();
      viewer.slates = viewer.slates.filter(
        (slate) => slate.slatename !== slateName
      );
      viewer.slates.unshift(response.slate);
      Viewer._set(viewer);
    }

    const savedObjects = [];
    const unsavedObjects = [];
    for (let object of objects) {
      if (await Viewer.checkIfLinkIsSaved(object.url)) {
        savedObjects.push(object);
        continue;
      }
      unsavedObjects.push(object);
    }

    this._cleanupCleanupAction();

    Promise.all([
      ViewerActions.addObjectsToSlate({
        objects: savedObjects,
        slateName: slateName,
      }),
      ViewerActions.saveLink({
        objects: unsavedObjects,
        slateName,
      }),
    ]);
  }

  _addViewToViewer({ viewer, slateName, domain }) {
    const newView = {
      id: uuid(),
      createdAt: "",
      updatedAt: "",
      order: viewer.views.length,
      metadata: {},
    };
    if (slateName) {
      const slate = viewer.slates.find(
        (slate) => slate.slateName === slateName
      );
      viewer.viewsSlatesLookup[slateName] = true;
      viewer.views.push({
        ...newView,
        name: slateName,
        filters: { slateId: slate.id },
      });
      return viewer;
    }

    viewer.viewsSourcesLookup[domain] = true;
    viewer.views.push({ ...newView, name: "Source", filters: { domain } });
    return viewer;
  }

  async createView({ slateName, domain }) {
    let viewer = await Viewer.get();

    this._registerRunningAction();

    viewer = this._addViewToViewer({ viewer, slateName, domain });
    Viewer._set(viewer);

    this._cleanupCleanupAction();
  }

  async search(query) {
    const response = await Actions.search({
      types: ["FILE", "SLATE"],
      query,
      grouped: true,
    });

    if (!response || response.error) {
      return;
    }

    const { slates, files: objects } = response.results;
    const serializedObjects = [];
    const duplicates = {};

    for (let object of objects) {
      // NOTE(amine): due to a bug (when deleting a file, we didn't delete it from search index)
      //              we get duplicates and deleted files in search result
      const url = getFileUrl(object);
      const isSaved = await Viewer.checkIfLinkIsSaved(object.url);
      if (url in duplicates || !isSaved) {
        continue;
      }
      duplicates[object.url] = true;
      serializedObjects.push(Viewer._serializeObject(object));
    }
    return { slates: slates || [], files: serializedObjects };
  }

  async searchSlates(query) {
    const viewer = await Viewer.get(query);
    const options = {
      findAllMatches: true,
      shouldSort: true,
      threshold: 0.5,
      keys: ["slatename", "name"],
    };

    const fuse = new Fuse(viewer.slates, options);
    const results = fuse.search(query);

    return results.map(({ item: { slatename, name } }) => name || slatename);
  }
}

export const ViewerActions = new ViewerActionsHandler();

/** ------------ Event listeners ------------- */

Viewer.onChange(async (viewerData) => {
  const activeTab = await Tabs.getActive();
  if (!activeTab) return;
  const slates = viewerData.slates.map(({ name }) => name);
  const { savedObjectsLookup, savedObjectsSlates, slatesLookup } = viewerData;

  chrome.tabs.sendMessage(parseInt(activeTab.id), {
    type: messages.updateViewer,
    data: { slates, savedObjectsLookup, savedObjectsSlates, slatesLookup },
  });
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command == commands.directSave) {
    if (await Viewer.checkIfAuthenticated()) {
      Viewer.saveLink({
        objects: [{ url: tab.url, title: tab.title, favicon: tab.favIconUrl }],
        tab,
        source: savingSources.command,
      });
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  Viewer.sync();
});

chrome.cookies.onChanged.addListener((e) => {
  if (e.cookie.domain !== Constants.uri.domain) return;

  if (e.removed && (e.cause === "expired_overwrite" || e.cause === "expired")) {
    Viewer.reset();
  }

  if (!e.removed && e.cause === "explicit") {
    Viewer.sync();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === messages.saveLink) {
    ViewerActions.saveLink({
      objects: request.objects,
      tab: sender.tab,
      source: request.source,
    }).then(sendResponse);
    return true;
  }

  if (request.type === messages.addObjectsToSlate) {
    const handleAddObjectsToSlate = async ({ objects, slateName }) => {
      const savedObjects = [];
      const unsavedObjects = [];
      for (let object of objects) {
        if (await Viewer.checkIfLinkIsSaved(object.url)) {
          savedObjects.push(object);
          continue;
        }
        unsavedObjects.push(object);
      }

      Promise.all([
        ViewerActions.addObjectsToSlate({
          objects: savedObjects,
          slateName: slateName,
        }),
        ViewerActions.saveLink({
          objects: unsavedObjects,
          slateName,
        }),
      ]);
    };

    handleAddObjectsToSlate({
      objects: request.objects,
      slateName: request.slateName,
    }).then(sendResponse);

    return true;
  }

  if (request.type === messages.createSlate) {
    ViewerActions.createSlate({
      objects: request.objects,
      slateName: request.slateName,
    }).then(sendResponse);
    return true;
  }

  if (request.type === messages.removeObjectsFromSlate) {
    ViewerActions.removeObjectsFromSlate({
      objects: request.objects,
      slateName: request.slateName,
    }).then(sendResponse);
    return true;
  }

  if (request.type === messages.loadViewerDataRequest) {
    const getInitialData = async () => {
      const isAuthenticated = await Viewer.checkIfAuthenticated();

      if (!isAuthenticated) {
        return { isAuthenticated };
      }

      const openTabs = await Windows.getAllTabs();

      const { allOpenFeedKeys, allOpenFeed } = constructWindowsFeed({
        tabs: openTabs,
        activeTabId: sender.tab.id,
        activeWindowId: sender.tab.windowId,
      });

      const viewerData = await Viewer.get();

      const slates = viewerData.slates.map(({ name }) => name);

      const views = viewerData.views.map(({ id, name, filters, order }) => ({
        id,
        name,
        type: viewsType.custom,
        filters: {
          slate: !!filters.slateId,
          domain: filters.domain,
        },
        order,
      }));

      const {
        savedObjectsLookup,
        savedObjectsSlates,
        slatesLookup,
        viewsSourcesLookup,
        viewsSlatesLookup,
      } = viewerData;

      Viewer.sync();

      const response = {
        ...viewerInitialState,
        isAuthenticated,

        slates,
        savedObjectsLookup,
        savedObjectsSlates,
        slatesLookup,

        views,
        viewsSourcesLookup,
        viewsSlatesLookup,

        windows: {
          data: {
            allOpenFeedKeys,
            allOpenFeed,
          },
          params: {
            activeWindowId: sender.tab.windowId,
            activeTabId: sender.tab.id,
          },
        },
      };

      // NOTE(amine): if there is only one tab open, preload recent view
      // if (response.windows.data.allOpen.length === 1) {
      //   response.recent = await browserHistory.getChunk();
      //   response.initialView = viewsType.recent;
      // }

      return response;
    };

    getInitialData().then(sendResponse);
    return true;
  }
});
