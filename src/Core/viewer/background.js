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

/** ----------------------------------------- */

const VIEWER_INITIAL_STATE = {
  objects: [],
  objectsMetadata: {},
  // NOTE(amine): { key: URL, value: id || 'savingStates.start' when saving an object (will be updated with the id when it's saved)}
  savedObjectsLookup: {},

  savedObjectsSlates: {},
  slatesLookup: {},
  slates: [],

  lastFetched: null,
  isAuthenticated: false,
};

let VIEWER_INTERNAL_STORAGE;
const VIEWER_LOCAL_STORAGE_KEY = "viewer_backup";

class Viewer {
  constructor() {
    this.observers = [];
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
    const serializedViewer = {
      objects: [],
      objectsMetadata: {},
      savedObjectsLookup: {},

      savedObjectsSlates: {},
      slatesLookup: {},
      slates: viewer.slates.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    };

    const getFileUrl = (object) =>
      object.isLink ? object.url : `${Constants.gateways.ipfs}/${object.cid}`;

    serializedViewer.objects = viewer.library.map((object) => {
      serializedViewer.objectsMetadata[getFileUrl(object)] = {
        id: object.id,
        cid: object.cid,
      };

      if (object.isLink) {
        serializedViewer.savedObjectsLookup[object.url] = true;

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
      serializedViewer.savedObjectsLookup[fileUrl] = true;

      return {
        title: object.name,
        rootDomain: Constants.uri.domain,
        url: fileUrl,
        cid: object.cid,
        isSaved: true,
      };
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
    const viewer = await Actions.hydrateAuthenticatedUser();
    if (viewer.data) {
      const serializedViewer = this._serialize(viewer.data);
      this._set({
        ...serializedViewer,
        lastFetched: new Date().toString(),
        isAuthenticated: true,
      });

      return;
    }

    this.reset(VIEWER_INITIAL_STATE);
  }

  async _addFileToViewer({ viewer, url, title, favicon }) {
    let newObjects;
    if (url in viewer.savedObjectsLookup) {
      newObjects = viewer.objects;
    } else {
      newObjects = [
        { title, url, favicon, rootDomain: getRootDomain(url), isSaved: true },
        ...viewer.objects,
      ];
    }

    return {
      ...viewer,
      savedObjectsLookup: {
        ...viewer.savedObjectsLookup,
        [url]: savingStates.start,
      },
      objects: newObjects,
    };
  }

  async _removeFileFromViewer({ viewer, url }) {
    const savedObjectsLookup = { ...viewer.savedObjectsLookup };
    delete savedObjectsLookup[url];
    const objects = objects.filter((object) => object.url !== url);

    return { ...viewer, savedObjectsLookup, objects };
  }

  async _addSlateToViewer({ viewer, slateName }) {
    return {
      ...viewer,
      slatesLookup: { ...viewer.slatesLookup, [slateName]: {} },
      slates: [
        {
          slatename: slateName,
          name: slateName,
          createAt: new Date().toDateString(),
        },
        ...viewer.slates,
      ],
    };
  }

  async _removeSlateFromViewer({ viewer, slateName }) {
    const newSlatesLookup = { ...viewer.slatesLookup };
    delete newSlatesLookup[slateName];

    const newSlates = viewer.slates.filter(
      (slate) => slate.slatename !== slateName
    );
    return { ...viewer, slatesLookup: newSlatesLookup, slates: newSlates };
  }

  async _addObjectsToViewerSlate({ viewer, objects, slateName }) {
    const newSlatesLookup = { ...viewer.slatesLookup };
    objects.forEach(({ url }) => {
      newSlatesLookup[slateName][url] = true;
    });

    const newSavedObjectsSlates = { ...viewer.savedObjectsSlates };
    objects.forEach(({ url }) => {
      if (!(url in newSavedObjectsSlates)) newSavedObjectsSlates[url] = [];
      newSavedObjectsSlates[url].push(slateName);
    });

    return {
      ...viewer,
      slatesLookup: newSlatesLookup,
      savedObjectsSlates: newSavedObjectsSlates,
    };
  }

  async _removeObjectsFromViewerSlate({ viewer, objects, slateName }) {
    const newSlatesLookup = { ...viewer.slatesLookup };
    objects.forEach(({ url }) => {
      if (slateName in newSlatesLookup) {
        delete newSlatesLookup[slateName][url];
      }
    });

    const newSavedObjectsSlates = { ...viewer.savedObjectsSlates };
    objects.forEach(({ url }) => {
      const filterOutSlateName = (slate) => slate !== slateName;
      newSavedObjectsSlates[url] =
        newSavedObjectsSlates[url].filter(filterOutSlateName);
    });

    return {
      ...viewer,
      slatesLookup: newSlatesLookup,
      savedObjectsSlates: newSavedObjectsSlates,
    };
  }

  /**
   * @description save a link and send saving status to new tab and the jumper
   *
   * @param {Object} Arguments
   * @param {string} Arguments.url - the url to save
   * @param {Chrome.tab} Arguments.tab - tab to which we'll send saving status
   * @param {string} [Arguments.source="app"] - which source triggered saving, either via command or the app
   */

  async saveLink({
    url,
    title,
    favicon,
    tab,
    slateName,
    source = savingSources.app,
  }) {
    const viewer = await this.get();
    if (viewer.savedObjectsLookup[url] === savingStates.start) return;

    const sendStatusUpdate = (status) => {
      if (source === savingSources.command) {
        chrome.tabs.sendMessage(parseInt(tab.id), {
          type: messages.savingStatus,
          data: { savingStatus: status, url, title, favicon, source },
        });
      }
    };

    sendStatusUpdate(savingStates.start);

    if (!(url in viewer.savedObjectsLookup)) {
      let newViewer = await this._addFileToViewer({
        viewer,
        url,
        title,
        favicon,
      });
      if (slateName) {
        newViewer = await this._addObjectsToViewerSlate({
          viewer: newViewer,
          objects: [{ url, title, favicon }],
          slateName,
        });
      }
      this._set(newViewer);
    }

    let payload = { url };
    if (slateName) {
      const slatePayload = viewer.slates.find(
        (slate) => slate.name === slateName
      );
      payload.slate = slatePayload;
    }

    const response = await Actions.createLink(payload);

    if (!response || response.error) {
      sendStatusUpdate(savingStates.failed);
      const viewer = await this.get();
      let newViewer = viewer;
      if (slateName) {
        newViewer = this._removeObjectsFromViewerSlate({
          viewer,
          objects: [{ url, title, favicon }],
          slateName,
        });
      }
      newViewer = this._removeFileFromViewer({ viewer: newViewer, url });
      this._set(newViewer);
      return;
    }

    sendStatusUpdate(savingStates.done);
    this.sync();
  }

  async addObjectsToSlate({ slateName, objects }) {
    const viewer = await this.get();
    if (!(slateName in viewer.slatesLookup)) {
      return;
    }

    const newViewer = await this._addObjectsToViewerSlate({
      viewer,
      objects,
      slateName,
    });
    this._set(newViewer);

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

    console.log({ response });

    if (!response || response.error) {
      const viewer = await this.get();
      const newViewer = await this._removeObjectsFromViewerSlate({
        viewer,
        objects,
        slateName,
      });
      this._set(newViewer);
    }

    this.sync();

    return;
  }

  async removeObjectFromSlate({ slateName, objects }) {
    const viewer = await this.get();
    if (!(slateName in viewer.slatesLookup)) {
      return;
    }

    const newViewer = await this._removeObjectsFromViewerSlate({
      viewer,
      objects,
      slateName,
    });
    this._set(newViewer);

    const filesIdsPayload = objects.map(
      ({ url }) => viewer.objectsMetadata[url].id
    );

    const slatePayload = viewer.slates.find(
      (slate) => slate.name === slateName
    );

    const response = await Actions.removeFileFromSlate({
      ids: filesIdsPayload,
      slateId: slatePayload.id,
    });

    console.log({ response });

    if (!response || response.error) {
      const viewer = await this.get();
      const newViewer = await this._addObjectsToViewerSlate({
        viewer,
        objects,
        slateName,
      });
      this._set(newViewer);
    }

    this.sync();

    return;
  }

  async createSlate({ slateName, objects }) {
    const viewer = await this.get();
    if (slateName in viewer.slatesLookup) return;

    let newViewer = await this._addSlateToViewer({ viewer, slateName });
    newViewer = await this._addObjectsToViewerSlate({
      viewer: newViewer,
      objects,
      slateName,
    });
    this._set(newViewer);

    const response = await Actions.createSlate({
      name: slateName,
      isPublic: false,
    });

    console.log("create slate", response);

    if (!response || response.error) {
      const viewer = await this.get();
      let newViewer = this._removeObjectsFromViewerSlate({
        viewer,
        objects,
        slateName,
      });
      newViewer = this._removeSlateFromViewer({ viewer: newViewer, slateName });
      this._set(newViewer);
      return;
    } else {
      const viewer = await this.get();
      const newSlates = viewer.slates.filter(
        (slate) => slate.slatename !== slateName
      );
      newSlates.unshift(response.slate);
      this._set({ ...viewer, slates: newSlates });
    }

    const object = objects[0];
    const isObjectSaved = await this.checkIfLinkIsSaved(object.url);
    if (isObjectSaved) {
      if (isObjectSaved) {
        await this.addObjectsToSlate({
          objects: objects,
          slateName: slateName,
        });
      } else {
        await this.saveLink({
          url: object.url,
          title: object.title,
          favicon: object.favicon,
          slateName,
        });
      }
    }
  }
}

export const viewer = new Viewer();

/** ------------ Event listeners ------------- */

viewer.onChange(async (viewerData) => {
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
    if (await viewer.checkIfAuthenticated()) {
      viewer.saveLink({
        url: tab.url,
        title: tab.title,
        favicon: tab.favIconUrl,
        tab,
        source: savingSources.command,
      });
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  viewer.sync();
});

chrome.cookies.onChanged.addListener((e) => {
  if (e.cookie.domain !== Constants.uri.domain) return;

  if (e.removed && (e.cause === "expired_overwrite" || e.cause === "expired")) {
    viewer.reset();
  }

  if (!e.removed && e.cause === "explicit") {
    viewer.sync();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === messages.saveLink) {
    viewer
      .saveLink({
        url: request.url,
        title: request.title,
        favicon: request.favicon,
        tab: sender.tab,
        source: request.source,
      })
      .then(sendResponse);
    return true;
  }

  if (request.type === messages.addObjectsToSlate) {
    const handleAddObjectsToSlate = async ({ objects, slateName }) => {
      // let savedObjects = [];
      // let unsavedObjects = [];
      // for (let object of objects) {
      //   if (await viewer.checkIfLinkIsSaved(object.url)) {
      //     savedObjects.push(object);
      //     continue;
      //   }
      //   unsavedObjects.push(object);
      // }
      const object = objects[0];
      const isObjectSaved = await viewer.checkIfLinkIsSaved(object.url);
      if (isObjectSaved) {
        await viewer.addObjectsToSlate({
          objects: request.objects,
          slateName: request.slateName,
        });
      } else {
        await viewer.saveLink({
          url: object.url,
          title: object.title,
          favicon: object.favicon,
          slateName,
        });
      }
    };

    handleAddObjectsToSlate({
      objects: request.objects,
      slateName: request.slateName,
    }).then(sendResponse);

    return true;
  }

  if (request.type === messages.createSlate) {
    viewer
      .createSlate({
        objects: request.objects,
        slateName: request.slateName,
      })
      .then(sendResponse);
    return true;
  }

  if (request.type === messages.removeObjectsFromSlate) {
    viewer
      .removeObjectFromSlate({
        objects: request.objects,
        slateName: request.slateName,
      })
      .then(sendResponse);
    return true;
  }

  if (request.type === messages.loadViewerDataRequest) {
    const getInitialData = async () => {
      const isAuthenticated = await viewer.checkIfAuthenticated();

      viewer.sync();

      if (!isAuthenticated) {
        return { isAuthenticated };
      }

      const openTabs = await Windows.getAllTabs();
      const totalWindows = new Set(openTabs.map((tab) => tab.windowId)).size;

      const {
        currentWindowFeedKeys,
        currentWindowFeed,
        allOpenFeedKeys,
        allOpenFeed,
      } = constructWindowsFeed({
        tabs: openTabs,
        activeWindowId: sender.tab.windowId,
        activeTabId: sender.tab.id,
      });

      const viewerData = await viewer.get();

      const slates = viewerData.slates.map(({ name }) => name);
      const { savedObjectsLookup, savedObjectsSlates, slatesLookup } =
        viewerData;

      const response = {
        ...viewerInitialState,
        isAuthenticated,

        slates,
        savedObjectsLookup,
        savedObjectsSlates,
        slatesLookup,

        windows: {
          data: {
            currentWindowFeedKeys,
            currentWindowFeed,
            allOpenFeedKeys,
            allOpenFeed,
          },
          params: {
            activeWindowId: sender.tab.windowId,
            totalWindows,
            activeTabId: sender.tab.id,
          },
        },
      };

      // NOTE(amine): if there is only one tab open, preload recent view
      // if (response.windows.data.allOpen.length === 1) {
      //   response.recent = await browserHistory.getChunk();
      //   response.initialView = viewsType.recent;
      // }

      viewer.sync();

      return response;
    };

    getInitialData().then(sendResponse);
    return true;
  }
});
