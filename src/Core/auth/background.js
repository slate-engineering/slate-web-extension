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

let VIEWER_INTERNAL_STORAGE = {};
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
        url: `https://slate.textile.io/ipfs/${object.cid}`,
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
    if (VIEWER_INTERNAL_STORAGE && VIEWER_INTERNAL_STORAGE.isAuthenticated)
      return VIEWER_INTERNAL_STORAGE;

    const localViewer = await this._getFromLocalStorage();
    if (localViewer && localViewer.isAuthenticated) {
      VIEWER_INTERNAL_STORAGE = localViewer;
      return localViewer;
    }

    VIEWER_INTERNAL_STORAGE = VIEWER_INITIAL_STATE;
    return VIEWER_INTERNAL_STORAGE;
  }

  async checkIfShouldSync() {
    return false;
  }

  async checkIfAuthenticated() {
    return (await this.get()).isAuthenticated;
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

// NOTE(amine): update viewer when the background scripts fire
viewer.lazySync();

chrome.runtime.onInstalled.addListener(() => {
  viewer.lazySync();
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
