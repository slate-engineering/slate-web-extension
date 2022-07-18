import * as Actions from "../../Common/actions";
import * as Constants from "../../Common/constants";

import { browserHistory, Windows } from "../browser/background";
import { viewsType } from "../views";
import {
  messages,
  commands,
  viewerInitialState,
  savingStates,
  savingSources,
} from ".";

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
  // NOTE(amine): { key: URL, value: id || 'savingStates.start' when saving an object (will be updated with the id when it's saved)}
  savedLinks: {},
  lastFetched: null,
  isAuthenticated: false,
};

let VIEWER_INTERNAL_STORAGE;
const VIEWER_LOCAL_STORAGE_KEY = "viewer_backup";

class Viewer {
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
    return viewer.savedLinks[url];
  }

  _serialize(viewer) {
    const serializedViewer = { objects: [], savedLinks: {} };
    serializedViewer.objects = viewer.library.map((object) => {
      if (object.isLink) {
        serializedViewer.savedLinks[object.url] = object.id;

        return {
          title: object.linkName,
          favicon: object.linkFavicon,
          url: object.url,
          rootDomain: getRootDomain(object.url),
          isSaved: true,
        };
      }

      const fileUrl = `${Constants.gateways.ipfs}/${object.cid}`;
      serializedViewer.savedLinks[fileUrl] = object.id;

      return {
        title: object.name,
        rootDomain: Constants.uri.domain,
        url: fileUrl,
        isSaved: true,
      };
    });
    return serializedViewer;
  }

  _set(viewer) {
    this._updateStorage(viewer);
    VIEWER_INTERNAL_STORAGE = viewer;
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

  async checkIfShouldSync() {
    // NOTE(amine): if the session cookie is not set, don't sync
    const SLATE_COOKIE_NAME = "WEB_SERVICE_SESSION_KEY";
    const cookie = await chrome.cookies.get({
      name: SLATE_COOKIE_NAME,
      url: Constants.uri.hostname,
    });

    if (!cookie) return false;

    // NOTE(amine): if 10 mins is passed since last update return true (should sync)
    const viewer = await this.get();
    const lastUpdated = viewer.lastFetched;
    if (!lastUpdated) return true;

    const TEN_MINUTES_IN_MS = 10 * 60 * 1000;
    const lastUpdatedInMs = new Date(lastUpdated).getTime();
    const nowInMs = new Date().getTime();

    return nowInMs > lastUpdatedInMs + TEN_MINUTES_IN_MS;
  }

  async checkIfAuthenticated() {
    return (await this.get()).isAuthenticated;
  }

  async checkIfLinkIsSaved(url) {
    const viewer = await this.get();
    return !!viewer.savedLinks[url];
  }

  async reset() {
    this._set(VIEWER_INITIAL_STATE);
  }

  async sync() {
    const viewer = await Actions.hydrateAuthenticatedUser();
    if (viewer.data) {
      const serializedViewer = this._serialize(viewer.data);
      this._set({
        objects: serializedViewer.objects,
        savedLinks: serializedViewer.savedLinks,
        lastFetched: new Date().toString(),
        isAuthenticated: true,
      });

      return;
    }

    this.reset(VIEWER_INITIAL_STATE);
  }

  async lazySync() {
    const shouldSync = await this.checkIfShouldSync();
    if (!shouldSync) return;

    const viewer = await Actions.hydrateAuthenticatedUser();
    if (viewer.data) {
      const serializedViewer = this._serialize(viewer.data);
      this._set({
        objects: serializedViewer.objects,
        savedLinks: serializedViewer.savedLinks,
        lastFetched: new Date().toString(),
        isAuthenticated: true,
      });

      return;
    }

    this.reset(VIEWER_INITIAL_STATE);
  }

  /**
   * @description save a link and send saving status to new tab and the jumper
   *
   * @param {Object} Arguments
   * @param {string} Arguments.url - the url to save
   * @param {Chrome.tab} Arguments.tab - tab to which we'll send saving status
   * @param {string} [Arguments.source="app"] - which source triggered saving, either via command or the app
   */

  async saveLink({ url, title, favicon, tab, source = savingSources.app }) {
    const viewer = await this.get();
    if (viewer.savedLinks[url] === savingStates.start) return;

    const sendStatusUpdate = (status) => {
      chrome.tabs.sendMessage(parseInt(tab.id), {
        type: messages.savingStatus,
        data: { savingStatus: status, url, title, favicon, source },
      });
    };

    sendStatusUpdate(savingStates.start);

    if (!(url in viewer.savedLinks)) {
      this._set({
        ...viewer,
        savedLinks: { ...viewer.savedLinks, [url]: savingStates.start },
        objects: [
          {
            title,
            url,
            favicon,
            rootDomain: getRootDomain(url),
            isSaved: true,
          },
          ...viewer.objects,
        ],
      });
    }

    const response = await Actions.createLink({ url });

    if (!response || response.error) {
      sendStatusUpdate(savingStates.failed);
      const viewer = await this.get();
      const savedLinks = { ...viewer.savedLinks };
      delete savedLinks[url];
      const objects = objects.filter((object) => object.url !== url);

      this._set({ ...viewer, savedLinks, objects });
      return;
    }

    sendStatusUpdate(savingStates.done);
    this.sync();
  }
}

export const viewer = new Viewer();

/** ------------ Event listeners ------------- */

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
  viewer.lazySync();
});

chrome.cookies.onChanged.addListener((e) => {
  viewer.checkIfShouldSync();
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
  }

  if (request.type === messages.loadViewerDataRequest) {
    const getInitialData = async () => {
      const isAuthenticated = await viewer.checkIfAuthenticated();
      const shouldSync = await viewer.checkIfShouldSync();

      if (shouldSync) viewer.lazySync();

      if (!isAuthenticated) {
        return { isAuthenticated };
      }

      const response = {
        ...viewerInitialState,
        isAuthenticated,
        shouldSync,
        windows: {
          data: {
            currentWindow: await Windows.getAllTabsInWindow(
              sender.tab.windowId
            ),
            allOpen: await Windows.getAllTabs(),
          },
          params: { windowId: sender.tab.windowId },
        },
      };

      // NOTE(amine): if there is only one tab open, preload recent view
      if (response.windows.data.allOpen.length === 1) {
        response.recent = await browserHistory.getChunk();
        response.initialView = viewsType.recent;
      }

      return response;
    };

    getInitialData().then(sendResponse);
    return true;
  }
});
