import * as Actions from "~/common/actions";
import * as Constants from "~/extension_common/constants";

import { Windows, Tabs } from "../browser/background";
import {
  messages,
  commands,
  viewerInitialState,
  savingStates,
  savingSources,
} from ".";
import {
  constructWindowsFeed,
  removeItemFromArrayInPlace,
  isTabNewTab,
} from "~/extension_common/utilities";
import { capitalize } from "~/common/strings";
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

const getTitleFromRootDomain = (rootDomain) => {
  let title = Constants.popularDomainsTitles[rootDomain];
  if (title) return title;

  const domainsPart = rootDomain.split(".");
  if (domainsPart.length === 2) return capitalize(domainsPart[0]);

  return capitalize(rootDomain);
};

const getDomainOrigin = (url) => {
  let origin;
  try {
    origin = new URL(url).origin;
  } catch (e) {
    origin = "";
  }
  return origin + "/";
};

const getFileUrl = (object) =>
  object.isLink ? object.url : `${Constants.gateways.ipfs}/${object.cid}`;

// NOTE(amine): custom id to make sure app don't rerender when we replace optimistic data with the server's data
const createViewCustomId = ({ name, source, slatename }) => {
  if (source) return name + source;
  return name + slatename;
};

const getViewId = ({ viewer, customId }) => {
  return viewer.viewsIdsLookup[customId];
};

/** ----------------------------------------- */

export const SlateObject = {
  serialize: (object) => {
    const primitiveProperties = {
      filename: object.filename,
      createdAt: object.createdAt,
      body: object.body,
      cid: object.cid,
      type: object.type,
      coverImage: object.coverImage,
      blurhash: object.blurhash,
    };

    if (object.isLink) {
      return {
        ...primitiveProperties,
        title: object.name || object.title || object.linkName,
        favicon: object.favicon || object.linkFavicon,
        url: object.url,
        rootDomain: object.rootDomain || getRootDomain(object.url),
        linkImage: object.linkImage,
        linkFavicon: object.linkFavicon,
        linkSource: object.linkSource,
        isLink: true,
        isSaved: true,
      };
    }

    const fileUrl = getFileUrl(object);

    return {
      ...primitiveProperties,
      title: object.name || object.filename,
      rootDomain: Constants.uri.domain,
      url: fileUrl,
      isLink: false,
      isSaved: true,
    };
  },
  create: ({ url, title, favicon }) => {
    return {
      filename: title,
      createdAt: new Date().toISOString(),
      title,
      url,
      // NOTE(amine): for now all the created objects are links
      isLink: true,
      linkSource: url,
      linkFavicon: favicon,
    };
  },
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

  viewsSourcesLookup: {},
  viewsSlatesLookup: {},
  viewsIdsLookup: {},
  views: [],

  settings: { isRecentViewActivated: false, isFilesViewActivated: false },

  lastFetched: null,
  isAuthenticated: false,
};

let VIEWER_INTERNAL_STORAGE;
const VIEWER_LOCAL_STORAGE_KEY = "viewer_backup";

class ViewerHandler {
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

  async getObjectMetadataByUrl(url) {
    const viewer = await this.get();
    return viewer.objectsMetadata[url];
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

      viewsSourcesLookup: {},
      viewsSlatesLookup: {},
      viewsIdsLookup: {},
      views: viewer.views,
      settings: viewer.settings || VIEWER_INITIAL_STATE.settings,
    };

    serializedViewer.views = serializedViewer.views.map((view) => {
      const { filterBySource, filterBySlateId } = view;

      if (filterBySource) {
        const viewCustomId = createViewCustomId({
          name: view.name,
          source: filterBySource,
        });
        serializedViewer.viewsIdsLookup[viewCustomId] = view.id;
        serializedViewer.viewsSourcesLookup[filterBySource] =
          this.serializeView(view);
      } else {
        const slate = viewer.slates.find(
          (slate) => slate.id === filterBySlateId
        );
        if (slate) {
          const viewCustomId = createViewCustomId({
            name: view.name,
            slatename: slate.slatename,
          });
          serializedViewer.viewsIdsLookup[viewCustomId] = view.id;
          serializedViewer.viewsSlatesLookup[slate.slatename] =
            this.serializeView(view);
        }
      }

      return this.serializeView(view);
    });

    serializedViewer.objects = viewer.library.map((object) => {
      serializedViewer.objectsMetadata[getFileUrl(object)] = {
        id: object.id,
        cid: object.cid,
        isLink: object.isLink,
      };

      if (object.isLink) {
        serializedViewer.savedObjectsLookup[object.url] = object.id;
      }

      const fileUrl = getFileUrl(object);
      serializedViewer.savedObjectsLookup[fileUrl] = object.id;

      return SlateObject.serialize(object);
    });

    viewer.slates.forEach((slate) => {
      const { savedObjectsSlates, slatesLookup } = serializedViewer;
      if (!slatesLookup[slate.slatename]) slatesLookup[slate.slatename] = {};

      slate.objects.forEach((object) => {
        const objectUrl = getFileUrl(object);
        slatesLookup[slate.slatename][objectUrl] = true;

        if (!savedObjectsSlates[objectUrl]) savedObjectsSlates[objectUrl] = [];
        savedObjectsSlates[objectUrl].push(slate.slatename);
      });
    });

    serializedViewer.settings.isBookmarkSyncActivated =
      viewer.isBookmarkSyncActivated;
    serializedViewer.settings.isRecentViewActivated =
      viewer.isRecentViewActivated;
    serializedViewer.settings.isFilesViewActivated =
      viewer.isFilesViewActivated;

    // NOTE(amine): onboarding steps
    serializedViewer.settings.hasCompletedExtensionOBFirstStep =
      viewer.hasCompletedExtensionOBFirstStep;
    serializedViewer.settings.hasCompletedExtensionOBSecondStep =
      viewer.hasCompletedExtensionOBSecondStep;
    serializedViewer.settings.hasCompletedExtensionOBThirdStep =
      viewer.hasCompletedExtensionOBThirdStep;

    return serializedViewer;
  }

  serializeView({ name, filterBySource, filterBySlateId, metadata }) {
    let customId = createViewCustomId({
      name,
      source: filterBySource,
      slatename: name,
    });
    return {
      id: customId,
      name,
      type: viewsType.custom,
      filterBySource: filterBySource,
      filterBySlateId: filterBySlateId,
      metadata,
    };
  }

  _set(viewer) {
    VIEWER_INTERNAL_STORAGE = viewer;
    this._updateStorage(viewer);

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

  async getObjectAppLink(url) {
    const objectId = await this._getObjectIdFromUrl(url);
    return `${Constants.uri.hostname}/_/data?id=${objectId}`;
  }

  async getSavedLinksSources() {
    const createSource = (object) => {
      const rootDomain = getRootDomain(object.url);
      return {
        rootDomain,
        favicon: object.favicon,
        title: getTitleFromRootDomain(rootDomain),
        source: getDomainOrigin(object.url),
      };
    };

    const removeDuplicates = (sources) => {
      const duplicates = {};
      const newSources = [];
      for (let source of sources) {
        if (source.rootDomain in duplicates) continue;
        duplicates[source.rootDomain] = true;
        newSources.push(source);
      }

      return newSources;
    };

    const viewer = await this.get();
    const sources = viewer.objects.map(createSource);
    return removeDuplicates(sources);
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

  async sync({ shouldSync } = {}) {
    //NOTE(amine): only sync when there are no running actions

    if (shouldSync && !shouldSync()) return;
    const viewer = await Actions.hydrateAuthenticatedUser();
    if (shouldSync && !shouldSync()) return;
    if (viewer.data) {
      const prevViewer = await this.get();
      if (shouldSync && !shouldSync()) return;
      const serializedViewer = this._serialize({
        ...prevViewer,
        ...viewer.data,
      });
      if (shouldSync && !shouldSync()) return;
      this._set({
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
    this.timeoutRef = null;
    this.syncsTracker = {};
  }

  _registerRunningAction() {
    clearTimeout(this.timeoutRef);
    this.syncsTracker = {};
    this.runningActions.push("");
  }

  _cleanupCleanupAction() {
    this.runningActions.pop();
    if (this.runningActions.length === 0) {
      this.timeoutRef = setTimeout(async () => {
        const id = uuid();
        this.syncsTracker[id] = true;

        const shouldSync = () => {
          return this.syncsTracker[id] && this.runningActions.length === 0;
        };
        await Viewer.sync({ shouldSync });

        if (id in this.syncsTracker) {
          delete this.syncsTracker[id];
        }
      }, 150);
    }
  }

  _addObjectsToViewer({ viewer, objects }) {
    objects.forEach((object) => {
      const isObjectAlreadySaved = object.url in viewer.savedObjectsLookup;
      if (isObjectAlreadySaved) {
        return;
      }

      const temporaryId = uuid();

      viewer.savedObjectsLookup[object.url] = temporaryId;
      viewer.objectsMetadata[object.url] = {
        id: temporaryId,
        isLink: true,
      };
      viewer.objects.unshift(SlateObject.serialize(object));
    });
    return viewer;
  }

  _removeObjectsFromViewer({ viewer, objects }) {
    //NOTE(amine): used to efficiently remove objects from viewer.slates
    let appliedSlates = {};
    const storeAppliedSlate = ({ url, slatename }) => {
      const objectId = viewer.objectsMetadata[url].id;
      if (slatename in appliedSlates) {
        appliedSlates[slatename].push(objectId);
      } else {
        appliedSlates[slatename] = [objectId];
      }
    };

    objects.forEach(({ url }) => {
      const isObjectInASlate = url in viewer.savedObjectsSlates;
      if (isObjectInASlate) {
        viewer.savedObjectsSlates[url].forEach((slatename) => {
          storeAppliedSlate({ url, slatename });

          //NOTE(amine): cleanup viewer.slatesLookup
          delete viewer.slatesLookup[slatename][url];
        });

        //NOTE(amine): cleanup viewer.savedObjectsSlates
        delete viewer.savedObjectsSlates[url];
      }

      delete viewer.savedObjectsLookup[url];
      delete viewer.objectsMetadata[url];
      removeItemFromArrayInPlace(
        viewer.objects,
        (object) => object.url === url
      );
    });

    //NOTE(amine): cleanup viewer.slates
    viewer.slates.forEach((slate, index) => {
      if (!appliedSlates[slate.slatename]) return;

      const objectIds = appliedSlates[slate.slatename];
      removeItemFromArrayInPlace(viewer.slates[index].objects, (object) =>
        objectIds.includes(object.id)
      );

      const isSlateEmpty = slate.objects.length === 0;
      if (isSlateEmpty) {
        viewer = this._removeSlateFromViewer({
          viewer,
          slateName: slate.slatename,
        });
      }
    });

    return viewer;
  }

  _addSlateToViewer({ viewer, slateName }) {
    viewer.slatesLookup[slateName] = {};
    viewer.slates.push({
      slatename: slateName,
      name: slateName,
      createAt: new Date().toDateString(),
      objects: [],
    });
    return viewer;
  }

  _removeSlateFromViewer({ viewer, slateName }) {
    //NOTE(amine): cleanup viewer.slatesLookup
    delete viewer.slatesLookup[slateName];

    //NOTE(amine): cleanup viewer.savedObjectsSlates
    for (let url in viewer.savedObjectsSlates) {
      removeItemFromArrayInPlace(
        viewer.savedObjectsSlates[url],
        (name) => name === slateName
      );
    }

    //NOTE(amine): cleanup viewer.slates
    removeItemFromArrayInPlace(
      viewer.slates,
      (slate) => slate.slatename === slateName
    );

    return viewer;
  }

  _addObjectsToViewerSlate({ viewer, objects, slateName }) {
    const slate = viewer.slates.find((slate) => slate.slatename === slateName);
    if (!slate) return viewer;

    objects.forEach((object) => {
      const slateAppliedToThisObject =
        object.url in viewer.slatesLookup[slateName];
      if (!slateAppliedToThisObject) {
        viewer.slatesLookup[slateName][object.url] = true;
        slate.objects.push(object);
      }

      const isObjectInASlate = object.url in viewer.savedObjectsSlates;
      if (!isObjectInASlate) {
        viewer.savedObjectsSlates[object.url] = [];
      }
      viewer.savedObjectsSlates[object.url].push(slateName);
    });

    return viewer;
  }

  _removeObjectsFromViewerSlate({ viewer, objects, slateName }) {
    //NOTE(amine): used to efficiently remove objects from viewer.slates
    let appliedSlates = {};
    const storeAppliedSlate = ({ url }) => {
      const objectId = viewer.objectsMetadata[url].id;
      if (slateName in appliedSlates) {
        appliedSlates[slateName].push(objectId);
      } else {
        appliedSlates[slateName] = [objectId];
      }
    };

    objects.forEach(({ url }) => {
      storeAppliedSlate({ url });

      if (slateName in viewer.slatesLookup) {
        //NOTE(amine):cleanup viewer.slatesLookup
        delete viewer.slatesLookup[slateName][url];
      }

      //NOTE(amine):cleanup viewer.savedObjectsSlates
      const filterOutSlateName = (slate) => slate === slateName;
      removeItemFromArrayInPlace(
        viewer.savedObjectsSlates[url],
        filterOutSlateName
      );
    });

    //NOTE(amine): cleanup viewer.slates
    viewer.slates.forEach((slate, index) => {
      if (!appliedSlates[slate.slatename]) return;

      const objectIds = appliedSlates[slate.slatename];
      removeItemFromArrayInPlace(viewer.slates[index].objects, (object) =>
        objectIds.includes(object.id)
      );

      const isSlateEmpty = slate.objects.length === 0;
      if (isSlateEmpty) {
        viewer = this._removeSlateFromViewer({
          viewer,
          slateName: slate.slatename,
        });
      }
    });

    return viewer;
  }

  async updateViewerSettings({
    isBookmarkSyncActivated,
    isRecentViewActivated,
    isFilesViewActivated,
    hasCompletedExtensionOBFirstStep,
    hasCompletedExtensionOBSecondStep,
    hasCompletedExtensionOBThirdStep,
  }) {
    this._registerRunningAction();

    let viewer = await Viewer.get();

    let userRequest = {};

    if (typeof isBookmarkSyncActivated === "boolean") {
      viewer.settings.isBookmarkSyncActivated = isBookmarkSyncActivated;
      userRequest["isBookmarkSyncActivated "] = isBookmarkSyncActivated;
    }

    if (typeof isRecentViewActivated === "boolean") {
      viewer.settings.isRecentViewActivated = isRecentViewActivated;
      userRequest["isRecentViewActivated"] = isRecentViewActivated;
    }

    if (typeof isFilesViewActivated === "boolean") {
      viewer.settings.isFilesViewActivated = isFilesViewActivated;
      userRequest["isFilesViewActivated "] = isFilesViewActivated;
    }

    if (typeof hasCompletedExtensionOBFirstStep === "boolean") {
      viewer.settings.hasCompletedExtensionOBFirstStep =
        hasCompletedExtensionOBFirstStep;
      userRequest["hasCompletedExtensionOBFirstStep "] =
        hasCompletedExtensionOBFirstStep;
    }

    if (typeof hasCompletedExtensionOBSecondStep === "boolean") {
      viewer.settings.hasCompletedExtensionOBSecondStep =
        hasCompletedExtensionOBSecondStep;
      userRequest["hasCompletedExtensionOBSecondStep "] =
        hasCompletedExtensionOBSecondStep;
    }

    if (typeof hasCompletedExtensionOBThirdStep === "boolean") {
      viewer.settings.hasCompletedExtensionOBThirdStep =
        hasCompletedExtensionOBThirdStep;
      userRequest["hasCompletedExtensionOBThirdStep "] =
        hasCompletedExtensionOBThirdStep;
    }

    Viewer._set(viewer);

    const response = await Actions.updateViewer({ user: userRequest });

    if (!response || response.error) {
      // TODO(amine): handle errors
    }

    this._cleanupCleanupAction();
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
    if (objects.length === 0) return;

    this._registerRunningAction();

    let viewer = await Viewer.get();

    if (!viewer.isAuthenticated) return;

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

    const objectsToBeSaved = objects
      .filter(({ url }) => !(url in viewer.savedObjectsLookup))
      .map(SlateObject.create);

    if (objectsToBeSaved.length === 0) {
      return;
    }

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
        (slate) => slate.slatename === slateName
      );
      payload.slate = slatePayload;
    }

    const response = await Actions.createLink(payload);

    if (!response || response.error) {
      sendStatusUpdate(savingStates.failed);
      // let viewer = await Viewer.get();
      // if (slateName) {
      //   viewer = this._removeObjectsFromViewerSlate({
      //     viewer,
      //     objects: objectsToBeSaved,
      //     slateName,
      //   });
      // }
      // viewer = this._removeObjectsFromViewer({
      //   viewer: viewer,
      //   objects: objectsToBeSaved,
      // });
      // Viewer._set(viewer);
      // TODO: handle errors
    } else {
      if (response.data.added > 0) {
        viewer = await Viewer.get();
        const addedLinks = response.data.links;
        const linksLookup = {};

        addedLinks.forEach((linkObject) => {
          linksLookup[linkObject.url] = linkObject;
          viewer.objectsMetadata[linkObject.url] = {
            id: linkObject.id,
            isLink: true,
          };
        });

        for (let i = 0; i < viewer.objects.length; i++) {
          const currentObject = viewer.objects[i];
          if (currentObject.url in linksLookup) {
            viewer.objects[i] = SlateObject.serialize(
              linksLookup[currentObject.url]
            );
          }
        }
      }

      Viewer._set(viewer);
    }

    sendStatusUpdate(savingStates.done);

    this._cleanupCleanupAction();
  }

  async removeObjects({ objects }) {
    this._registerRunningAction();

    let viewer = await Viewer.get();

    const filesIds = objects.map(({ url }) => viewer.objectsMetadata[url].id);

    viewer = this._removeObjectsFromViewer({ viewer, objects });
    Viewer._set(viewer);

    const response = await Actions.removeFiles({ ids: filesIds });
    if (!response || response.error) {
      // TODO(amine): handle errors
    }

    this._cleanupCleanupAction();
  }

  async addObjectsToSlate({ slateName, objects }) {
    if (objects.length === 0) return;

    this._registerRunningAction();
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
      (slate) => slate.slatename === slateName
    );

    const response = await Actions.saveCopy({
      files: filesPayload,
      slate: slatePayload,
    });

    if (!response || response.error) {
      // viewer = await Viewer.get();
      // viewer = this._removeObjectsFromViewerSlate({
      //   viewer,
      //   objects,
      //   slateName,
      // });
      // Viewer._set(viewer);
      // TODO: handle errors
    }

    this._cleanupCleanupAction();
  }

  async removeObjectsFromSlate({ slateName, objects }) {
    let viewer = await Viewer.get();
    if (!(slateName in viewer.slatesLookup)) {
      return;
    }

    this._registerRunningAction();

    const filesIdsPayload = objects.map(
      ({ url }) => viewer.objectsMetadata[url].id
    );

    const slatePayload = viewer.slates.find(
      (slate) => slate.slatename === slateName
    );

    viewer = await this._removeObjectsFromViewerSlate({
      viewer,
      objects,
      slateName,
    });

    const isSlateEmpty =
      Object.keys(viewer.slatesLookup[slateName]).length === 0;
    // NOTE(amine): if the request fails, we'll use oldSlate to add that slate back
    if (isSlateEmpty) {
      viewer = this._removeSlateFromViewer({ viewer, slateName });
    }

    Viewer._set(viewer);

    const response = await Actions.removeFileFromSlate({
      ids: filesIdsPayload,
      slateId: slatePayload.id,
    });

    if (!response || response.error) {
      // viewer = await Viewer.get();
      // if (isSlateEmpty) {
      //   viewer.slates.push(oldSlate);
      //   oldSlate.objects.forEach((object) => {
      //     const objectUrl = getFileUrl(object);
      //     viewer.slatesLookup[slateName][objectUrl] = true;
      //   });
      // }
      // viewer = this._addObjectsToViewerSlate({
      //   viewer,
      //   objects,
      //   slateName,
      // });
      // Viewer._set(viewer);
      // TODO: handles errors;
    }

    this._cleanupCleanupAction();
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
      // let viewer = await Viewer.get();
      // viewer = this._removeObjectsFromViewerSlate({
      //   viewer,
      //   objects,
      //   slateName,
      // });
      // viewer = this._removeSlateFromViewer({ viewer, slateName });
      // Viewer._set(viewer);
      //TODO handle errors
    } else {
      const viewer = await Viewer.get();
      removeItemFromArrayInPlace(
        viewer.slates,
        (slate) => slate.slatename === slateName
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

  _addViewToViewer({ viewer, name, filterBySource, filterBySlateId, favicon }) {
    const newView = {
      id: uuid() + "custom",
      createdAt: "",
      updatedAt: "",
      metadata: {},
    };

    if (filterBySlateId) {
      const customId = createViewCustomId({ name, slatename: name });
      viewer.viewsIdsLookup[customId] = newView.id;
      const serializedView = Viewer.serializeView({
        ...newView,
        name,
        filterBySlateId: filterBySlateId,
      });

      viewer.viewsSlatesLookup[name] = serializedView;
      viewer.views.push(serializedView);
      return viewer;
    }

    const customId = createViewCustomId({ name, source: filterBySource });
    viewer.viewsIdsLookup[customId] = newView.id;

    const rootDomain = getRootDomain(filterBySource);
    const serializedView = Viewer.serializeView({
      ...newView,
      name: getTitleFromRootDomain(rootDomain),
      filterBySource: filterBySource,
      metadata: { favicon },
    });
    viewer.viewsSourcesLookup[filterBySource] = serializedView;
    viewer.views.push(serializedView);

    return viewer;
  }

  _removeViewFromViewer({ viewer, customId }) {
    const view = viewer.views.find((view) => view.id === customId);
    if (!view) return viewer;

    if (view.filterBySource) {
      delete viewer.viewsSourcesLookup[view.filterBySource];
    } else {
      delete viewer.viewsSlatesLookup[view.filterBySlateId];
    }

    delete viewer.viewsIdsLookup[customId];

    removeItemFromArrayInPlace(viewer.views, (item) => item.id === view.id);

    return viewer;
  }

  async createView({ slateName, source }) {
    this._registerRunningAction();
    let viewer = await Viewer.get();

    let name;
    let filterBySlateId;
    let filterBySource;
    let metadata = {};
    let customId;

    if (slateName) {
      name = slateName;
      const slate = viewer.slates.find(
        (slate) => slate.slatename === slateName
      );
      customId = createViewCustomId({
        name,
        source: filterBySource,
        slatename: slate.slatename,
      });
      filterBySlateId = slate.id;
    } else {
      const rootDomain = getRootDomain(source);
      name = getTitleFromRootDomain(rootDomain);
      filterBySource = source;
      customId = createViewCustomId({ name, source: filterBySource });

      const sources = await Viewer.getSavedLinksSources();
      const favicon =
        sources.find((sourceData) => sourceData.source === source)?.favicon ||
        undefined;
      metadata = { favicon };
    }

    viewer = this._addViewToViewer({
      viewer,
      name,
      filterBySource,
      filterBySlateId,
      favicon: metadata.favicon,
    });
    Viewer._set(viewer);

    const response = await Actions.createView({
      name,
      metadata: metadata,
      filterBySlateId,
      filterBySource,
    });

    if (!response || response.error) {
      // TODO: handle errors
    } else {
      const newView = response.data;
      if (newView) {
        viewer = await Viewer.get();
        viewer.viewsIdsLookup[customId] = newView.id;
        Viewer._set(viewer);
      }
    }

    this._cleanupCleanupAction();
  }

  async removeView({ customId }) {
    this._registerRunningAction();

    let viewer = await Viewer.get();

    const viewId = getViewId({ viewer, customId });

    const deletedView = viewer.views.find((view) => view.id === customId);
    if (!deletedView) {
      this._cleanupCleanupAction();
      return;
    }

    viewer = this._removeViewFromViewer({ viewer, customId });
    Viewer._set(viewer);

    const response = await Actions.removeView({
      id: viewId,
    });

    if (!response || response.error) {
      // TODO: handle errors
    }

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
      serializedObjects.push(SlateObject.serialize(object));
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

    return results.map(({ item: { slatename } }) => slatename);
  }

  async getInitialData({ sender }) {
    const viewer = await Viewer.get();

    if (!viewer.isAuthenticated) {
      return { isAuthenticated: false };
    }

    this._registerRunningAction();

    const openTabs = await Windows.getAllTabs();

    const { allOpenFeedKeys, allOpenFeed } = constructWindowsFeed({
      tabs: openTabs,
      activeTabId: sender.tab.id,
      activeWindowId: sender.tab.windowId,
    });

    const slates = viewer.slates.map(({ slatename }) => slatename);

    const {
      savedObjectsLookup,
      savedObjectsSlates,
      slatesLookup,
      viewsSourcesLookup,
      viewsSlatesLookup,
      settings,
    } = viewer;

    const response = {
      ...viewerInitialState,
      isAuthenticated: true,
      settings,

      slates,
      savedObjectsLookup,
      savedObjectsSlates,
      slatesLookup,

      views: viewer.views,
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

    this._cleanupCleanupAction();
    return response;
  }
}

export const ViewerActions = new ViewerActionsHandler();

/** ------------ Event listeners ------------- */

Viewer.onChange(async (viewerData) => {
  const slates = viewerData.slates.map(({ slatename }) => slatename);

  const {
    savedObjectsLookup,
    savedObjectsSlates,
    slatesLookup,
    viewsSlatesLookup,
    viewsSourcesLookup,
    settings,
  } = viewerData;

  const response = {
    type: messages.updateViewer,
    data: {
      slates,
      settings,
      savedObjectsLookup,
      savedObjectsSlates,
      slatesLookup,
      views: viewerData.views,
      viewsSlatesLookup,
      viewsSourcesLookup,
    },
  };

  //NOTE(amine): notify active tab and all open new tabs
  const newTabTabs = await Tabs.getNewTabTabs();
  const tabsToBeUpdated = newTabTabs;

  const activeTab = await Tabs.getActive();
  if (activeTab && !isTabNewTab(activeTab)) {
    tabsToBeUpdated.push(activeTab);
  }

  tabsToBeUpdated.forEach((tab) => {
    chrome.tabs.sendMessage(parseInt(tab.id), response);
  });
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === commands.directSave) {
    ViewerActions.saveLink({
      objects: [{ url: tab.url, title: tab.title, favicon: tab.favIconUrl }],
      tab,
      source: savingSources.command,
    });
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  await Viewer.sync();
  const viewer = await Viewer.get();
  if (viewer.isAuthenticated) {
    if (!viewer.settings.hasCompletedExtensionOBFirstStep) {
      chrome.tabs.create({ url: Constants.links.extensionOnboarding });
      ViewerActions.updateViewerSettings({
        hasCompletedExtensionOBFirstStep: true,
      });
    } else {
      return;
    }
  } else {
    chrome.tabs.create({ url: Constants.links.extensionOnboarding });
  }
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
  if (request.type === messages.updateViewerSettings) {
    ViewerActions.updateViewerSettings({
      isBookmarkSyncActivated: request.isBookmarkSyncActivated,
      isRecentViewActivated: request.isRecentViewActivated,
      isFilesViewActivated: request.isFilesViewActivated,
      hasCompletedExtensionOBFirstStep:
        request.hasCompletedExtensionOBFirstStep,
      hasCompletedExtensionOBSecondStep:
        request.hasCompletedExtensionOBSecondStep,
      hasCompletedExtensionOBThirdStep:
        request.hasCompletedExtensionOBThirdStep,
    }).then(sendResponse);
    return true;
  }

  if (request.type === messages.getSavedLinksSourcesRequest) {
    Viewer.getSavedLinksSources().then(sendResponse);
    return true;
  }

  if (request.type === messages.removeObjects) {
    ViewerActions.removeObjects({ objects: request.objects }).then(
      sendResponse
    );
    return true;
  }

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
    ViewerActions.getInitialData({ sender }).then(sendResponse);
    return true;
  }
});
