import * as Actions from "../../Common/actions";
import * as Constants from "../../Common/constants";

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
  // NOTE(amine): { key: URL, value: id }
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

  _serialize(viewer) {
    const serializedViewer = { objects: [], savedLinks: {} };
    serializedViewer.objects = viewer.library.map((object) => {
      if (object.isLink) {
        serializedViewer.savedLinks[object.url] = object.id;

        return {
          id: object.id,
          title: object.linkName,
          favicon: object.linkFavicon,
          url: object.url,
          rootDomain: getRootDomain(object.url),
        };
      }

      return {
        id: object.id,
        title: object.name,
        rootDomain: Constants.uri.domain,
        url: `${Constants.gateways.ipfs}/${object.cid}`,
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
}

export const viewer = new Viewer();

/** ------------ Event listeners ------------- */

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
