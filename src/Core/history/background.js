import Fuse from "fuse.js";

import { messages } from "./";

/** ----------------------------------------- */

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

const HISTORY_LOCAL_STORAGE_KEY = "history_backup";
const historyInLocalStorage = {
  update: () => {
    chrome.storage.local.set({
      [HISTORY_LOCAL_STORAGE_KEY]: browserHistory.getInternalDB(),
    });
  },
  get: async () => {
    const results = await chrome.storage.local.get([HISTORY_LOCAL_STORAGE_KEY]);
    return results[HISTORY_LOCAL_STORAGE_KEY];
  },
};

/** ----------------------------------------- */

let BROWSER_HISTORY_INTERNAL_STORAGE;
const browserHistory = {
  addVisit: async (visit) => {
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
    historyInLocalStorage.update();
  },
  set: (history) => {
    BROWSER_HISTORY_INTERNAL_STORAGE = history;
    return BROWSER_HISTORY_INTERNAL_STORAGE;
  },
  getInternalDB: () => BROWSER_HISTORY_INTERNAL_STORAGE,
  get: async () => {
    if (BROWSER_HISTORY_INTERNAL_STORAGE) {
      return BROWSER_HISTORY_INTERNAL_STORAGE;
    }
    const localHistory = await historyInLocalStorage.get();
    if (localHistory) {
      return browserHistory.set(localHistory);
    }
    const history = await buildHistoryDBAndSaveItToStorage();
    return browserHistory.set(history);
  },
  removeSessionsOlderThanOneMonth: () => {
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
    historyInLocalStorage.update();
  },
  search: (query) => {
    const options = {
      findAllMatches: true,
      includeMatches: true,
      minMatchCharLength: query.length,
      // Search in `author` and in `tags` array
      keys: ["visits.url", "visits.title"],
    };

    const fuse = new Fuse(BROWSER_HISTORY_INTERNAL_STORAGE, options);

    return fuse.search(query);
  },
};

const buildHistoryDBAndSaveItToStorage = async () => {
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

  historyInLocalStorage.update();

  return sessions;
};

/** ----------------------------------------- */

const Tabs = {
  create: (tab) => ({
    url: tab.url,
    rootDomain: getRootDomain(tab.url),
    id: tab.id,
    title: tab.title,
    favicon: tab.favIconUrl,
    windowId: tab.windowId,
  }),
  getActive: async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  },
};

const Windows = {
  getAll: async () => {
    const windows = await chrome.windows.getAll({ populate: true });
    return windows.map((window) => ({
      id: window.id,
      tabs: window.tabs.map(Tabs.create),
    }));
  },
};

/** ------------ listeners ------------- */

chrome.runtime.onStartup.addListener(() => {
  const ADaysInMs = 24 * 60 * 60 * 1000;
  setInterval(browserHistory.removeSessionsOlderThanOneMonth, ADaysInMs);
});

chrome.tabs.onRemoved.addListener(async () => {
  const activeTab = await Tabs.getActive();
  if (activeTab) {
    chrome.tabs.sendMessage(parseInt(activeTab.id), {
      data: {
        windows: await Windows.getAll(),
        activeWindowId: activeTab.windowId,
      },
      type: messages.windowsUpdate,
    });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status == "complete") {
    const activeTab = await Tabs.getActive();
    if (activeTab) {
      chrome.tabs.sendMessage(parseInt(activeTab.id), {
        data: {
          windows: await Windows.getAll(),
          activeWindowId: activeTab.windowId,
        },
        type: messages.windowsUpdate,
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

chrome.runtime.onMessage.addListener(async (request, sender) => {
  if (request.type === messages.requestHistoryDataByChunk) {
    const response = {};
    const history = await browserHistory.get();
    response.history = history.slice(
      request.startIndex,
      request.startIndex + 1000
    );
    response.canFetchMore =
      request.startIndex + response.history.length !== history.length;

    if (request.startIndex === 0) {
      response.activeWindowId = sender.tab.windowId;
      response.windows = await Windows.getAll();
    }

    chrome.tabs.sendMessage(parseInt(sender.tab.id), {
      data: response,
      type: messages.historyChunk,
    });
  }

  if (request.type === messages.requestSearchQuery) {
    chrome.tabs.sendMessage(parseInt(sender.tab.id), {
      type: messages.searchResults,
      data: {
        result: browserHistory.search(request.query),
        query: request.query,
      },
    });
  }
});
