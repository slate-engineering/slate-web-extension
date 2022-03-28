const HISTORY_LOCAL_STORAGE_KEY = "history_backup";
const historyInLocalStorage = {
  update: () => {
    if (browserHistory.get())
      chrome.storage.local.set({
        [HISTORY_LOCAL_STORAGE_KEY]: browserHistory.get(),
      });
  },
  get: async () => {
    const results = await chrome.storage.local.get([HISTORY_LOCAL_STORAGE_KEY]);
    return results[HISTORY_LOCAL_STORAGE_KEY];
  },
};

/** ------------  ------------- */

let BROWSER_HISTORY_INTERNAL_STORAGE;
const browserHistory = {
  addVisit: () => {},
  set: (history) => {
    BROWSER_HISTORY_INTERNAL_STORAGE = history;
    return BROWSER_HISTORY_INTERNAL_STORAGE;
  },
  get: () => BROWSER_HISTORY_INTERNAL_STORAGE,
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
        visits.push({
          ...item,
          title: historyItem.title,
          url: historyItem.url,
          favicon:
            "https://s2.googleusercontent.com/s2/favicons?domain_url=" +
            historyItem.url,
        });
      }
    }

    return visits.sort((a, b) => a.visitTime - b.visitTime);
  };

  const createSessions = (visits) => {
    const sessions = [];
    const microsecondsPerMonth = 1000 * 60 * 60 * 24 * 31;
    const isVisitedInTheCurrentMonth = (visit) =>
      +visit.visitTime > new Date().getTime() - microsecondsPerMonth;

    for (let currentVisit of visits) {
      if (currentVisit.referringVisitId === "0") {
        if (isVisitedInTheCurrentMonth(currentVisit)) {
          sessions.push([currentVisit]);
        }
      } else {
        let isFound = false;
        for (let i = 0; i < sessions.length; i++) {
          for (let j = 0; j < sessions[i].length; j++) {
            // If there is a session with the same referral id
            // append the current visit to that session
            if (currentVisit.referringVisitId === sessions[i][j].visitId) {
              sessions[i].push(currentVisit);
              isFound = true;
              break;
            }
          }
          if (isFound) break;
        }

        if (!isFound && isVisitedInTheCurrentMonth(currentVisit))
          sessions.push([currentVisit]);
      }
    }

    return sessions.reverse();
  };

  const historyItems = await getHistoryItems();
  const visits = await getHistoryVisits(historyItems);
  const sessions = createSessions(visits);

  historyInLocalStorage.update();

  return sessions;
};

export const getBrowserHistory = async () => {
  let historyInMemory = browserHistory.get();
  if (historyInMemory) return historyInMemory;

  const localHistory = await historyInLocalStorage.get();
  if (localHistory) {
    return browserHistory.set(localHistory);
  }
  const history = await buildHistoryDBAndSaveItToStorage();
  return browserHistory.set(history);
};
