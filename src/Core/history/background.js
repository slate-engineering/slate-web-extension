import { messages } from "./";

const Session = {
  createVisit: (historyItem, visit) => ({
    ...visit,
    title: historyItem.title,
    url: historyItem.url,
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
    id: tab.id,
    title: tab.title,
    favicon: tab.favIconUrl,
    windowId: tab.windowId,
  }),
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

/** ------------ Listen for new visits ------------- */

chrome.history.onVisited.addListener(async (historyItem) => {
  const visits = await chrome.history.getVisits({
    url: historyItem.url,
  });

  for (let i = visits.length - 1; i >= 0; i--) {
    let currentVisit = visits[i];
    if (currentVisit.visitTime === historyItem.lastVisitTime) {
      const visit = Session.createVisit(historyItem, currentVisit);
      await browserHistory.addVisit(visit);
      break;
    }
  }
});

chrome.runtime.onMessage.addListener(async (request, sender) => {
  if (request.type === messages.requestHistoryDataByChunk) {
    const response = {};
    response.history = await browserHistory.get();
    response.activeWindowId = sender.tab.windowId;
    response.windows = await Windows.getAll();

    chrome.tabs.sendMessage(parseInt(sender.tab.id), {
      data: response,
      type: messages.historyChunk,
    });
  }
});
