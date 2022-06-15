import * as React from "react";

import { isToday, isYesterday, getRootDomain } from "../../../Common/utilities";

const filterSessionsFeed = ({ sessionsFeed, sessionsFeedKeys, history }) => {
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

  const visitWithSameTitle = sessionsFeedKeys.reduce((acc, time) => {
    sessionsFeed[time].forEach((visit) => {
      if (visit.relatedVisits) {
        acc[`${time}-${getRootDomain(visit.url)}-${visit.title}`] =
          visit.relatedVisits;
      }
    });
    return acc;
  }, {});

  const doesVisitExistWithSameTitle = (time, visit) =>
    `${time}-${getRootDomain(visit.url)}-${visit.title}` in visitWithSameTitle;
  const addVisitToDuplicateList = (time, visit) =>
    visitWithSameTitle[
      `${time}-${getRootDomain(visit.url)}-${visit.title}`
    ].push(visit);
  const createVisitDuplicate = (time, visit) => {
    visitWithSameTitle[`${time}-${getRootDomain(visit.url)}-${visit.title}`] =
      [];
    return visitWithSameTitle[
      `${time}-${getRootDomain(visit.url)}-${visit.title}`
    ];
  };

  history.forEach((session) => {
    if (isToday(new Date(session.visitTime))) {
      session.visits.forEach((visit) => {
        if (isUrlAlreadyAddedToFeedTimeline("Today", visit.url)) {
          return;
        }

        if (doesVisitExistWithSameTitle("Today", visit)) {
          addVisitToDuplicateList("Today", visit);
          return;
        }

        ifKeyExistAppendValueElseCreate({
          object: sessionsFeed,
          key: "Today",
          value: {
            ...visit,
            relatedVisits: createVisitDuplicate("Today", visit),
          },
        });
      });
      return;
    }

    if (isYesterday(new Date(session.visitTime))) {
      session.visits.forEach((visit) => {
        if (isUrlAlreadyAddedToFeedTimeline("Yesterday", visit.url)) {
          return;
        }

        if (doesVisitExistWithSameTitle("Yesterday", visit)) {
          addVisitToDuplicateList("Yesterday", visit);
          return;
        }

        ifKeyExistAppendValueElseCreate({
          object: sessionsFeed,
          key: "Yesterday",
          value: {
            ...visit,
            relatedVisits: createVisitDuplicate("Yesterday", visit),
          },
        });
      });
      return;
    }

    const sessionVisitDate = new Date(session.visitTime);
    const formattedDate = `${sessionVisitDate.toLocaleDateString("en-EN", {
      weekday: "long",
    })}, ${sessionVisitDate.toLocaleDateString("en-EN", {
      month: "short",
    })} ${sessionVisitDate.getDate()} `;
    session.visits.forEach((visit) => {
      if (isUrlAlreadyAddedToFeedTimeline(formattedDate, visit.url)) {
        return;
      }

      if (doesVisitExistWithSameTitle(formattedDate, visit)) {
        addVisitToDuplicateList(formattedDate, visit);
        return;
      }

      ifKeyExistAppendValueElseCreate({
        object: sessionsFeed,
        key: formattedDate,
        value: {
          ...visit,
          relatedVisits: createVisitDuplicate(formattedDate, visit),
        },
      });
    });
  });

  return sessionsFeed;
};

/* -------------------------------------------------------------------------------------------------
 * useOpenWindowsState
 * -----------------------------------------------------------------------------------------------*/

export const useOpenWindowsState = () => {
  const initiateWindowsFeed = () => ({
    currentWindow: [],
    allOpen: [],
  });
  const [feed, setFeed] = React.useState(initiateWindowsFeed());

  const setWindowsFeed = ({ windows, activeWindowId }) => {
    const windowsFeed = initiateWindowsFeed();
    windows.forEach((window) => {
      if (window.id === activeWindowId) {
        windowsFeed.currentWindow = window.tabs;
        return;
      }
      windowsFeed.allOpen.push(...window.tabs);
    });
    setFeed(windowsFeed);
  };

  return { windowsFeed: feed, setWindowsFeed };
};

/* -------------------------------------------------------------------------------------------------
 * useHistoryState
 * -----------------------------------------------------------------------------------------------*/

export const useHistoryState = () => {
  const [feed, setFeed] = React.useState({});
  const sessionsFeedKeys = React.useMemo(() => Object.keys(feed), [feed]);

  const setSessionsFeed = (history) => {
    setFeed((prevFeed) => {
      const newFeed = filterSessionsFeed({
        sessionsFeed: { ...prevFeed },
        sessionsFeedKeys,
        history: history,
      });
      return newFeed;
    });
  };

  return { sessionsFeed: feed, sessionsFeedKeys, setSessionsFeed };
};
