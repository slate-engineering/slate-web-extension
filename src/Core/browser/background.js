import { messages } from ".";
import { savingSources } from "../viewer";
import { Viewer, ViewerActions } from "../viewer/background";

import Fuse from "fuse.js";
import { removeItemFromArrayInPlace } from "~/extension_common/utilities";

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

const removeDuplicatesFromSearchResults = (result) => {
  const visitWithSameTitle = {};
  const doesVisitExistWithSameTitle = (visit) =>
    `${getRootDomain(visit.url)}-${visit.title}` in visitWithSameTitle;
  const addVisitToDuplicateList = (visit) =>
    visitWithSameTitle[`${getRootDomain(visit.url)}-${visit.title}`].push(
      visit
    );
  const createVisitDuplicate = (visit) => {
    visitWithSameTitle[`${getRootDomain(visit.url)}-${visit.title}`] = [];
    return visitWithSameTitle[`${getRootDomain(visit.url)}-${visit.title}`];
  };

  const MAX_SEARCH_RESULT = 300;
  const cleanedResult = [];
  for (let visit of result) {
    if (cleanedResult.length > MAX_SEARCH_RESULT) {
      return cleanedResult;
    }
    if (doesVisitExistWithSameTitle(visit)) {
      addVisitToDuplicateList(visit);
      continue;
    }

    cleanedResult.push({
      ...visit,
      relatedVisits: createVisitDuplicate(visit),
    });
  }
  return cleanedResult;
};

/** ----------------------------------------- */

const Session = {
  createVisit: (historyItem, visit) => ({
    ...visit,
    title: historyItem.title,
    url: historyItem.url,
    rootDomain: getRootDomain(historyItem.url),
    favicon:
      "https://s2.googleusercontent.com/s2/favicons?domain_url=" +
      historyItem.url,
  }),
  create: (visit) => ({
    id: Math.round(new Date().getTime()),
    title: visit.title,
    visitTime: visit.visitTime,
    visits: [visit],
  }),
  addVisitToSession: ({ session, visit }) => {
    session.visits.unshift(visit);
    session.visitTime = visit.visitTime;
  },
};

/** ----------------------------------------- */

let BROWSER_HISTORY_INTERNAL_STORAGE = { isBuilt: false, history: undefined };
const HISTORY_LOCAL_STORAGE_KEY = "history_backup";

class BrowserHistory {
  _set({ isBuilt, history }) {
    BROWSER_HISTORY_INTERNAL_STORAGE = {
      ...BROWSER_HISTORY_INTERNAL_STORAGE,
      isBuilt,
      history,
    };
    return BROWSER_HISTORY_INTERNAL_STORAGE;
  }

  async _buildHistory() {
    const getHistoryItems = async () => {
      const microsecondsPerMonth = 1000 * 60 * 60 * 24 * 31;
      const twoMonthsAgo = new Date().getTime() - microsecondsPerMonth * 2;
      return await chrome.history.search({
        text: "",
        startTime: twoMonthsAgo,
        maxResults: 2_147_483_647,
      });
    };

    const getHistoryVisits = async (historyItems) => {
      const visits = [];
      for (const historyItem of historyItems) {
        const urlVisits = await chrome.history.getVisits({
          url: historyItem.url,
        });

        for (const item of urlVisits) {
          visits.push(Session.createVisit(historyItem, item));
        }
      }

      return visits.sort((a, b) => a.visitTime - b.visitTime);
    };

    const createSessionsList = (visits) => {
      const sessions = [];
      const microsecondsPerMonth = 1000 * 60 * 60 * 24 * 31;
      const isVisitedInTheCurrentMonth = (visit) =>
        +visit.visitTime > new Date().getTime() - microsecondsPerMonth;

      for (let currentVisit of visits) {
        if (currentVisit.referringVisitId === "0") {
          if (isVisitedInTheCurrentMonth(currentVisit)) {
            sessions.push(Session.create(currentVisit));
          }
        } else {
          let isFound = false;
          for (let i = 0; i < sessions.length; i++) {
            for (let j = 0; j < sessions[i].visits.length; j++) {
              // If there is a session with the same referral id
              // append the current visit to that session
              if (
                currentVisit.referringVisitId === sessions[i].visits[j].visitId
              ) {
                Session.addVisitToSession({
                  session: sessions[i],
                  visit: currentVisit,
                });
                isFound = true;
                break;
              }
            }
            if (isFound) break;
          }

          if (!isFound && isVisitedInTheCurrentMonth(currentVisit))
            sessions.push(Session.create(currentVisit));
        }
      }

      return sessions.sort((a, b) => b.visitTime - a.visitTime);
    };

    const historyItems = await getHistoryItems();
    const visits = await getHistoryVisits(historyItems);
    const sessions = createSessionsList(visits);

    return sessions;
  }

  async _updateLocalStorage() {
    chrome.storage.local.set({
      [HISTORY_LOCAL_STORAGE_KEY]: await browserHistory.get(),
    });
  }

  async _getFromLocalStorage() {
    const result = await chrome.storage.local.get([HISTORY_LOCAL_STORAGE_KEY]);
    return result[HISTORY_LOCAL_STORAGE_KEY];
  }

  async addVisit(visit) {
    const isBuilt = await this._getIsBuilt();
    if (!isBuilt) return;

    const history = await browserHistory.get();

    if (visit.referringVisitId === "0") {
      history.unshift(Session.create(visit));
    } else {
      let isFound = false;
      for (let i = 0; i < history.length; i++) {
        for (let j = 0; j < history[i].visits.length; j++) {
          // If there is a visit im the current session with the same referral id
          // append the current visit to that session's visits
          if (visit.referringVisitId === history[i].visits[j].visitId) {
            Session.addVisitToSession({ session: history[i], visit });
            isFound = true;
            break;
          }
        }
        if (isFound) break;
      }

      if (!isFound) history.unshift(Session.create(visit));
    }

    history.sort((a, b) => b.visitTime - a.visitTime);
    await this._updateLocalStorage();
  }

  async _getIsBuilt() {
    if (BROWSER_HISTORY_INTERNAL_STORAGE.history) {
      return BROWSER_HISTORY_INTERNAL_STORAGE.isBuilt;
    }
    const localHistory = await this._getFromLocalStorage();
    if (localHistory) {
      return this._set({ history: localHistory }).isBuilt;
    }

    return false;
  }

  async get() {
    if (BROWSER_HISTORY_INTERNAL_STORAGE.history) {
      let viewer = await Viewer.get();
      if (!viewer.settings.isRecentViewActivated) return [];
      return BROWSER_HISTORY_INTERNAL_STORAGE.history;
    }
    const localHistory = await this._getFromLocalStorage();
    if (localHistory) {
      const viewer = await Viewer.get();
      if (!viewer.settings.isRecentViewActivated) return [];
      return this._set({ history: localHistory }).history;
    }
    const history = await this._buildHistory();
    this._set({ history, isBuilt: true });
    await this._updateLocalStorage();

    const viewer = await Viewer.get();
    if (!viewer.settings.isRecentViewActivated) return [];
    return history;
  }

  async removeObjects({ objects }) {
    const history = await this.get();
    if (!history) return;
    const objectsLookup = {};
    objects.forEach(({ url }) => {
      objectsLookup[url] = true;
    });

    for (let i = 0; i < history.length; i++) {
      removeItemFromArrayInPlace(
        history[i].visits,
        (visit) => objectsLookup[visit.url]
      );
    }

    removeItemFromArrayInPlace(history, (item) => item.visits.length === 0);
  }

  async removeSessionsOlderThanOneMonth() {
    const history = BROWSER_HISTORY_INTERNAL_STORAGE;
    if (!history) return;

    const isMonthOld = (date) => {
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

      const now = new Date();
      const timeDiffInMs = now.getTime() - date.getTime();

      if (timeDiffInMs >= thirtyDaysInMs) {
        return true;
      } else {
        return false;
      }
    };

    for (let i = history.length - 1; i >= 0; i--) {
      const currentSession = history[i];
      if (isMonthOld(currentSession.visitTime)) {
        history.pop();
      } else {
        break;
      }
    }
    await this._updateLocalStorage();
  }

  async search(query) {
    const microsecondsPerMonth = 1000 * 60 * 60 * 24 * 31;
    const twoMonthsAgo = new Date().getTime() - microsecondsPerMonth * 2;
    const chromeHistorySearch = await chrome.history.search({
      text: query,
      startTime: twoMonthsAgo,
      maxResults: 2_147_483_647,
    });

    let result = [];
    for (let historyItem of chromeHistorySearch) {
      const sessionItem = Session.createVisit(historyItem);

      if (sessionItem.title && sessionItem.title.length > 0) {
        result.push({
          title: sessionItem.title,
          favicon: sessionItem.favicon,
          url: sessionItem.url,
          rootDomain: sessionItem.rootDomain,
        });
      }
    }

    const cleanedResult = removeDuplicatesFromSearchResults(result);

    return cleanedResult;
  }

  async getRelatedLinks(url) {
    const getVisitsFromSearchResult = (searchResult) => {
      const result = [];

      for (let { item, matches } of searchResult) {
        const { visits } = item;
        matches.forEach(({ refIndex }) => {
          result.push(visits[refIndex]);
        });
      }

      return result;
    };

    const removeDuplicatesFromVisits = (visits) => {
      const duplicates = {};

      const cleanedVisits = [];
      for (let visit of visits) {
        if (visit.url in duplicates) continue;
        duplicates[visit.url] = true;
        cleanedVisits.push(visit);
      }

      const result = [];
      const visitsWithSameTitle = {};
      for (let item of cleanedVisits) {
        if (item.title in visitsWithSameTitle) {
          visitsWithSameTitle[item.title].push({
            title: item.title,
            favicon: item?.favIconUrl || item.favicon,
            url: item.url,
            rootDomain: item.rootDomain,
          });
          continue;
        } else {
          visitsWithSameTitle[item.title] = [];
        }

        result.push({
          ...item,
          relatedVisits: visitsWithSameTitle[item.title],
        });
      }

      return result;
    };

    const options = {
      findAllMatches: true,
      threshold: 0.0,
      includeMatches: true,
      keys: ["visits.url"],
    };
    const history = await this.get();
    const historyFuse = new Fuse(history, options);
    const historySearchResult = historyFuse.search(url);
    const visitsResult = getVisitsFromSearchResult(historySearchResult);

    const savedFilesFuseOptions = {
      findAllMatches: true,
      threshold: 0.0,
      keys: ["url"],
    };
    const savedFiles = await Viewer.get();
    const savedFilesFuse = new Fuse(savedFiles.objects, savedFilesFuseOptions);
    const savedFilesSearchResult = savedFilesFuse.search(url);

    const cleanedVisits = removeDuplicatesFromVisits([
      ...savedFilesSearchResult.map(({ item }) => item),
      ...visitsResult,
    ]);

    return cleanedVisits.map((item) => ({
      title: item.title,
      favicon: item?.favIconUrl || item.favicon,
      url: item.url,
      rootDomain: item.rootDomain,
      relatedVisits: item.relatedVisits,
    }));
  }

  async getChunk(startIndex = 0, endIndex) {
    const history = await browserHistory.get();

    const historyChunk = history.slice(startIndex, endIndex);

    for (let session of historyChunk) {
      session.visits = await Promise.all(
        session.visits.map(async (visit) => ({
          ...visit,
          isSaved: await Viewer.checkIfLinkIsSaved(visit.url),
        }))
      );
    }

    return {
      history: historyChunk,
      canFetchMore: startIndex + historyChunk.length !== history.length,
    };
  }
}

export const browserHistory = new BrowserHistory();

/** ----------------------------------------- */

export const Tabs = {
  create: (tab) => ({
    id: tab.id,
    windowId: tab.windowId,
    title: tab.title,
    favicon: tab.favIconUrl,
    url: tab.url,
    rootDomain: getRootDomain(tab.url),
  }),
  getActive: async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  },
  getNewTabTabs: async () => {
    const NEW_TAB_URL = "chrome://newtab/";
    const tabs = await chrome.tabs.query({ url: NEW_TAB_URL });
    return tabs;
  },
};

export const Windows = {
  getAllTabsInWindow: async (windowId) => {
    const window = await chrome.windows.get(windowId, { populate: true });
    const tabs = window.tabs.map(Tabs.create);
    return tabs;
  },
  getAllTabs: async () => {
    const windows = await chrome.windows.getAll({ populate: true });
    const tabs = windows.flatMap((window) => window.tabs.map(Tabs.create));
    return tabs;
  },
  getAll: async () => {
    const windows = await chrome.windows.getAll({ populate: true });
    return windows.map((window) => ({
      id: window.id,
      tabs: window.tabs.map(Tabs.create),
    }));
  },
  search: async (query, { windowId } = {}) => {
    const options = {
      findAllMatches: true,
      includeMatches: true,
      minMatchCharLength: query.length,
      keys: ["url", "title"],
    };

    const windows = await chrome.windows.getAll({ populate: true });
    let tabs = windows.flatMap(({ tabs }) => tabs);
    if (windowId) {
      tabs = tabs.filter((tab) => tab.windowId === windowId);
    }

    const fuse = new Fuse(tabs, options);
    const searchResult = fuse.search(query);
    return searchResult.map(({ item }) => Tabs.create(item));
  },
};

/** ------------ Event listeners ------------- */

chrome.runtime.onStartup.addListener(() => {
  const ADaysInMs = 24 * 60 * 60 * 1000;
  setInterval(browserHistory.removeSessionsOlderThanOneMonth, ADaysInMs);
});

chrome.tabs.onRemoved.addListener(async () => {
  const activeTab = await Tabs.getActive();

  if (activeTab) {
    const openTabs = await Windows.getAllTabs();

    chrome.tabs.sendMessage(parseInt(activeTab.id), {
      type: messages.windowsUpdate,
      data: { openTabs, activeTabId: activeTab.id },
    });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status == "complete") {
    const activeTab = await Tabs.getActive();
    if (activeTab) {
      const openTabs = await Windows.getAllTabs();

      chrome.tabs.sendMessage(parseInt(activeTab.id), {
        type: messages.windowsUpdate,
        data: { openTabs, activeTabId: activeTab.id },
      });
    }

    const historyItem = { url: tab.url, title: tab.title };
    const visits = await chrome.history.getVisits({
      url: historyItem.url,
    });
    if (visits.length === 0) return;

    const latestVisit = visits[visits.length - 1];

    const sessionVisit = Session.createVisit(historyItem, latestVisit);
    await browserHistory.addVisit(sessionVisit);
  }
});

chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
  if (!bookmark.url) return;

  const viewer = await Viewer.get();
  if (viewer.isAuthenticated && viewer.settings.isBookmarkSyncActivated) {
    const activeTab = await Tabs.getActive();
    ViewerActions.saveLink({
      objects: [{ url: bookmark.url, title: bookmark.title }],
      tab: activeTab,
      source: savingSources.command,
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === messages.historyChunkRequest) {
    browserHistory
      .getChunk(
        request.startIndex,
        request.startIndex + (request.startIndex === 0 ? 200 : 500)
      )
      .then(sendResponse);

    return true;
  }

  if (request.type === messages.relatedLinksRequest) {
    console.log(`RELATED LINKS FOR ${request.url}`);
    browserHistory.getRelatedLinks(request.url).then((result) => {
      sendResponse({
        result,
        url: request.url,
      });
    });
    return true;
  }
});
