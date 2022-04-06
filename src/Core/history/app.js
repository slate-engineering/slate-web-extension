import * as React from "react";

import { isToday, isYesterday } from "../../Common/utilities";
import { messages } from "./";

const updateSessionFeed = ({ sessionFeed, history }) => {
  const ifKeyExistAppendValueElseCreate = ({ object, key, value }) =>
    key in object ? sessionFeed[key].push(value) : (sessionFeed[key] = [value]);

  history.forEach((session) => {
    if (isToday(new Date(session.visitTime))) {
      ifKeyExistAppendValueElseCreate({
        object: sessionFeed,
        key: "Today",
        value: session,
      });
      return;
    }

    if (isYesterday(new Date(session.visitTime))) {
      ifKeyExistAppendValueElseCreate({
        object: sessionFeed,
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
      object: sessionFeed,
      key: formattedDate,
      value: session,
    });
  });

  return sessionFeed;
};

export const useHistory = () => {
  const [sessionFeed, setSessionFeed] = React.useState({});
  const sessionFeedKeys = React.useMemo(
    () => Object.keys(sessionFeed),
    [sessionFeed]
  );

  const loadMoreHistory = () => {
    window.postMessage(
      { type: messages.requestHistoryDataByChunk, id: history.length },
      "*"
    );
  };

  React.useEffect(() => {
    let handleMessage = (event) => {
      let { data, type } = event.data;
      if (type !== messages.historyChunk) return;
      setSessionFeed((prevFeed) => {
        const newFeed = updateSessionFeed({
          sessionFeed: { ...prevFeed },
          history: data.history,
        });
        return newFeed;
      });
    };
    window.addEventListener("message", handleMessage);

    loadMoreHistory();
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return [sessionFeed, sessionFeedKeys, loadMoreHistory];
};
