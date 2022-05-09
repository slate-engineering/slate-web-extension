import * as React from "react";

import { isToday, isYesterday } from "../../../Common/utilities";
import { viewsType } from "../";

const removeSessionDuplicateVisits = (session) => {
  const isAlreadyAdded = {};
  session.visits = session.visits.filter(({ url }) => {
    if (url in isAlreadyAdded) return false;
    isAlreadyAdded[url] = true;
    return true;
  });
  return session;
};

const removeViewsDuplicateSession = (sessions) => {
  const isAlreadyAdded = {};
  return sessions.filter(({ item: session }) => {
    if (session.visits.length > 1) return true;
    const visitUrl = session.visits[0].url;
    if (visitUrl in isAlreadyAdded) {
      return false;
    } else {
      isAlreadyAdded[visitUrl] = true;
      return true;
    }
  });
};

const filterSessionsFeed = ({ sessionsFeed, history }) => {
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

export const useOpenWindowsState = () => {
  const initiateWindowsFeed = () => ({
    thisWindow: [],
    currentlyOpen: [],
  });
  const [feed, setFeed] = React.useState(initiateWindowsFeed());

  const setWindowsFeed = ({ windows, activeWindowId }) => {
    const windowsFeed = initiateWindowsFeed();
    windows.forEach((window) => {
      if (window.id === activeWindowId) {
        windowsFeed.thisWindow = window.tabs;
        return;
      }
      windowsFeed.currentlyOpen.push(...window.tabs);
    });
    setFeed(windowsFeed);
  };

  return { windowsFeed: feed, setWindowsFeed };
};

export const useHistoryState = () => {
  const [feed, setFeed] = React.useState({});
  const sessionsFeedKeys = React.useMemo(() => Object.keys(feed), [feed]);

  const setSessionsFeed = (history) => {
    setFeed((prevFeed) => {
      const newFeed = filterSessionsFeed({
        sessionsFeed: { ...prevFeed },
        history: history,
      });
      return newFeed;
    });
  };

  return { sessionsFeed: feed, sessionsFeedKeys, setSessionsFeed };
};

export const useViewsState = () => {
  const [views, setViewsState] = React.useState({
    feed: [],
    type: viewsType.recent,
    query: "",
  });

  const setViewsParams = ({ type, query }) => {
    setViewsState((prev) => ({ ...prev, type, query }));
  };

  const setViewsFeed = (result) => {
    setViewsState((prev) => ({
      ...prev,
      feed: removeViewsDuplicateSession(result),
    }));
  };

  return [
    {
      viewsFeed: views.feed,
      currentView: views.type,
      viewQuery: views.query,
      viewsType,
    },
    { setViewsFeed, setViewsParams },
  ];
};