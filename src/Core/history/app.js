import * as React from "react";

import { isToday, isYesterday } from "../../Common/utilities";
import { messages } from "./";

const removeSessionDuplicateVisits = (session) => {
  const isAlreadyAdded = {};
  session.visits = session.visits.filter(({ url }) => {
    if (url in isAlreadyAdded) return false;
    isAlreadyAdded[url] = true;
    return true;
  });
  return session;
};

const updateSessionsFeed = ({ sessionsFeed, history }) => {
  const ifKeyExistAppendValueElseCreate = ({ object, key, value }) =>
    key in object ? object[key].push(value) : (object[key] = [value]);

  const urlFeedCheck = {};
  const isUrlAlreadyAddedToFeedTimeline = (time, url) => {
    if (!urlFeedCheck[time]) {
      urlFeedCheck[time] = { [url]: true };
      return false;
    }
    if (urlFeedCheck[time][url]) return true;
    urlFeedCheck[time][url] = true;
    return false;
  };

  history.forEach((session) => {
    const cleanedSession = removeSessionDuplicateVisits(session);

    if (isToday(new Date(cleanedSession.visitTime))) {
      if (
        isUrlAlreadyAddedToFeedTimeline(
          "Today",
          cleanedSession.visits.map((visit) => visit.url).join("")
        )
      ) {
        return;
      }

      ifKeyExistAppendValueElseCreate({
        object: sessionsFeed,
        key: "Today",
        value: cleanedSession,
      });
      return;
    }

    if (isYesterday(new Date(cleanedSession.visitTime))) {
      if (
        isUrlAlreadyAddedToFeedTimeline(
          "Yesterday",
          cleanedSession.visits.map((visit) => visit.url).join("")
        )
      ) {
        return;
      }

      ifKeyExistAppendValueElseCreate({
        object: sessionsFeed,
        key: "Yesterday",
        value: cleanedSession,
      });
      return;
    }

    const sessionVisitDate = new Date(cleanedSession.visitTime);
    const formattedDate = `${sessionVisitDate.toLocaleDateString("en-EN", {
      weekday: "long",
    })}, ${sessionVisitDate.toLocaleDateString("en-EN", {
      month: "short",
    })} ${sessionVisitDate.getDate()} `;

    if (
      isUrlAlreadyAddedToFeedTimeline(
        formattedDate,
        cleanedSession.visits.map((visit) => visit.url).join("")
      )
    ) {
      return;
    }

    ifKeyExistAppendValueElseCreate({
      object: sessionsFeed,
      key: formattedDate,
      value: cleanedSession,
    });
  });

  return sessionsFeed;
};

export const useHistory = () => {
  const initiateWindowsFeed = () => ({
    thisWindow: [],
    currentlyOpen: [],
  });
  const [windowsFeed, setWindowsFeed] = React.useState(initiateWindowsFeed());
  const createWindowsFeed = ({ windows, activeWindowId }) => {
    const windowsFeed = initiateWindowsFeed();
    windows.forEach((window) => {
      if (window.id === activeWindowId) {
        windowsFeed.thisWindow = window.tabs;
        return;
      }
      windowsFeed.currentlyOpen.push(...window.tabs);
    });
    return windowsFeed;
  };

  const [sessionsFeed, setSessionsFeed] = React.useState({});
  const sessionsFeedKeys = React.useMemo(
    () => Object.keys(sessionsFeed),
    [sessionsFeed]
  );

  const loadMoreHistory = () => {
    window.postMessage({ type: messages.requestHistoryDataByChunk }, "*");
  };

  React.useEffect(() => {
    let handleMessage = (event) => {
      let { data, type } = event.data;
      if (type !== messages.historyChunk) return;

      setSessionsFeed((prevFeed) => {
        const newFeed = updateSessionsFeed({
          sessionsFeed: { ...prevFeed },
          history: data.history,
        });
        return newFeed;
      });

      if (data.windows) {
        setWindowsFeed(
          createWindowsFeed({
            windows: data.windows,
            activeWindowId: data.activeWindowId,
          })
        );
      }
    };
    window.addEventListener("message", handleMessage);

    loadMoreHistory();
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return { windowsFeed, sessionsFeed, sessionsFeedKeys, loadMoreHistory };
};
