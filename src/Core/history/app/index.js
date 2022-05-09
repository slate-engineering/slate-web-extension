import * as React from "react";

import { isToday, isYesterday } from "../../../Common/utilities";

const removeSessionDuplicateVisits = (session) => {
  const isAlreadyAdded = {};
  session.visits = session.visits.filter(({ url }) => {
    if (url in isAlreadyAdded) return false;
    isAlreadyAdded[url] = true;
    return true;
  });
  return session;
};

// const removeViewsDuplicateSession = (sessions) => {
//   const isAlreadyAdded = {};
//   return sessions.filter(({ item: session }) => {
//     if (session.visits.length > 1) return true;
//     const visitUrl = session.visits[0].url;
//     if (visitUrl in isAlreadyAdded) {
//       return false;
//     } else {
//       isAlreadyAdded[visitUrl] = true;
//       return true;
//     }
//   });
// };

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

  //   const paramsRef = React.useRef({ startIndex: 0, canFetchMore: true });
  //   const loadMoreHistory = () => {
  //     if (!paramsRef.current.canFetchMore) return;

  //     window.postMessage(
  //       {
  //         type: messages.historyChunkRequest,
  //         startIndex: paramsRef.current.startIndex,
  //       },
  //       "*"
  //     );
  //   };

  //   // handle messaging

  //   React.useEffect(() => {
  //     let handleMessage = (event) => {
  //       let { data, type } = event.data;
  //       if (type === messages.historyChunkResponse) {
  //         if (data.canFetchMore) {
  //           paramsRef.current.startIndex += data.history.length;
  //         } else {
  //           paramsRef.current.canFetchMore = false;
  //         }
  //         setSessionsFeed((prevFeed) => {
  //           const newFeed = updateSessionsFeed({
  //             sessionsFeed: { ...prevFeed },
  //             history: data.history,
  //           });
  //           return newFeed;
  //         });

  //         if (data.windows) {
  //           setWindowsFeed(
  //             createWindowsFeed({
  //               windows: data.windows,
  //               activeWindowId: data.activeWindowId,
  //             })
  //           );
  //         }
  //         return;
  //       }

  //       if (type === messages.windowsUpdate) {
  //         setWindowsFeed(
  //           createWindowsFeed({
  //             windows: data.windows,
  //             activeWindowId: data.activeWindowId,
  //           })
  //         );
  //       }
  //     };
  //     window.addEventListener("message", handleMessage);

  //     loadMoreHistory();
  //     return () => window.removeEventListener("message", handleMessage);
  //   }, []);

  return { sessionsFeed: feed, sessionsFeedKeys, setSessionsFeed };
};
