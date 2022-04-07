import * as React from "react";

import { isToday, isYesterday } from "../../Common/utilities";
import { messages } from "./";

const updateSessionsFeed = ({ sessionsFeed, history }) => {
  const ifKeyExistAppendValueElseCreate = ({ object, key, value }) =>
    key in object ? object[key].push(value) : (object[key] = [value]);

  history.forEach((session) => {
    if (isToday(new Date(session.visitTime))) {
      ifKeyExistAppendValueElseCreate({
        object: sessionsFeed,
        key: "Today",
        value: session,
      });
      return;
    }

    if (isYesterday(new Date(session.visitTime))) {
      ifKeyExistAppendValueElseCreate({
        object: sessionsFeed,
        key: "Yesterday",
        value: session,
      });
      return;
    }

    const sessionVisitDate = new Date(session.visitTime);
    const formattedDate = `${sessionVisitDate.toLocaleDateString("en-EN", {
      weekday: "long",
    })}, ${sessionVisitDate.toLocaleDateString("en-EN", {
      month: "short",
    })} ${sessionVisitDate.getDate()} `;

    ifKeyExistAppendValueElseCreate({
      object: sessionsFeed,
      key: formattedDate,
      value: session,
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
