import { messages } from "./";
import { viewer } from "../viewer/background";

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

const removeDuplicatesFromSearchResults = (result) => {
  const isAlreadyAdded = {};

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
  for (let { item } of result) {
    for (let visit of item.visits) {
      if (cleanedResult.length > MAX_SEARCH_RESULT) {
        return cleanedResult;
      }

      if (visit.url in isAlreadyAdded) continue;

      isAlreadyAdded[visit.url] = true;

      if (doesVisitExistWithSameTitle(visit)) {
        addVisitToDuplicateList(visit);
        continue;
      }

      cleanedResult.push({
        ...visit,
        relatedVisits: createVisitDuplicate(visit),
      });
    }
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

let BROWSER_HISTORY_INTERNAL_STORAGE;
const HISTORY_LOCAL_STORAGE_KEY = "history_backup";

class BrowserHistory {
  _set(history) {
    BROWSER_HISTORY_INTERNAL_STORAGE = history;
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

  async get() {
    if (BROWSER_HISTORY_INTERNAL_STORAGE) {
      return BROWSER_HISTORY_INTERNAL_STORAGE;
    }
    const localHistory = await this._getFromLocalStorage();
    if (localHistory) {
      return this._set(localHistory);
    }
    const history = await this._buildHistory();
    this._set(history);
    await this._updateLocalStorage();
    return history;
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
    const options = {
      findAllMatches: true,
      includeMatches: true,
      minMatchCharLength: query.length,
      keys: ["visits.url", "visits.title"],
    };

    const history = await this.get();
    const fuse = new Fuse(history, options);

    const cleanedResult = removeDuplicatesFromSearchResults(fuse.search(query));

    return await Promise.all(
      cleanedResult.map(async (item) => ({
        ...item,
        isSaved: await viewer.checkIfLinkIsSaved(item.url),
      }))
    );
  }

  async getRelatedLinks(url) {
    const options = {
      findAllMatches: true,
      threshold: 0.0,
      keys: ["visits.url"],
    };

    const history = await this.get();
    const fuse = new Fuse(history, options);

    const cleanedResult = removeDuplicatesFromSearchResults(fuse.search(url));
    return await Promise.all(
      cleanedResult.map(async (item) => ({
        ...item,
        isSaved: await viewer.checkIfLinkIsSaved(item.url),
      }))
    );
  }

  async getChunk(startIndex = 0, endIndex) {
    const history = await browserHistory.get();

    const historyChunk = history.slice(startIndex, endIndex);

    for (let session of historyChunk) {
      session.visits = await Promise.all(
        session.visits.map(async (visit) => ({
          ...visit,
          isSaved: await viewer.checkIfLinkIsSaved(visit.url),
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

const Tabs = {
  create: async (tab) => ({
    id: tab.id,
    windowId: tab.windowId,
    title: tab.title,
    favicon: tab.favIconUrl,
    url: tab.url,
    rootDomain: getRootDomain(tab.url),
    isSaved: await viewer.checkIfLinkIsSaved(tab.url),
  }),
  getActive: async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  },
};

export const Windows = {
  getAllTabsInWindow: async (windowId) => {
    const window = await chrome.windows.get(windowId, { populate: true });
    const tabs = await Promise.all(window.tabs.map(Tabs.create));
    return tabs;
  },
  getAllTabs: async () => {
    const windows = await chrome.windows.getAll({ populate: true });
    const tabs = windows.flatMap((window) => window.tabs.map(Tabs.create));
    return await Promise.all(tabs);
  },
  getAll: async () => {
    const windows = await chrome.windows.getAll({ populate: true });
    return await Promise.all(
      windows.map(async (window) => ({
        id: window.id,
        tabs: await Promise.all(window.tabs.map(Tabs.create)),
      }))
    );
  },
  search: async (query, { windowId }) => {
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

    return fuse.search(query);
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
    chrome.tabs.sendMessage(parseInt(activeTab.id), {
      type: messages.windowsUpdate,
      data: { openTabs: await Windows.getAll() },
    });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status == "complete") {
    const activeTab = await Tabs.getActive();
    if (activeTab) {
      chrome.tabs.sendMessage(parseInt(activeTab.id), {
        type: messages.windowsUpdate,
        data: { openTabs: await Windows.getAll() },
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
