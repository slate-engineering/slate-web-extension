import * as React from "react";
import { useHistoryState, useOpenWindowsState } from "./";
import { messages } from "../";

export const useHistory = () => {
  const { sessionsFeed, sessionsFeedKeys, setSessionsFeed } = useHistoryState();
  const { windowsFeed, setWindowsFeed } = useOpenWindowsState();

  const paramsRef = React.useRef({ startIndex: 0, canFetchMore: true });

  const loadMoreHistory = () => {
    if (!paramsRef.current.canFetchMore) return;

    window.postMessage(
      {
        type: messages.historyChunkRequest,
        startIndex: paramsRef.current.startIndex,
      },
      "*"
    );
  };

  React.useEffect(() => {
    let handleMessage = (event) => {
      let { data, type } = event.data;
      if (type === messages.historyChunkResponse) {
        if (data.canFetchMore) {
          paramsRef.current.startIndex += data.history.length;
        } else {
          paramsRef.current.canFetchMore = false;
        }
        setSessionsFeed(data.history);

        if (data.windows) {
          setWindowsFeed({
            windows: data.windows,
            activeWindowId: data.activeWindowId,
          });
        }
        return;
      }

      if (type === messages.windowsUpdate) {
        setWindowsFeed({
          windows: data.windows,
          activeWindowId: data.activeWindowId,
        });
      }
    };
    window.addEventListener("message", handleMessage);

    loadMoreHistory();
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return { sessionsFeed, sessionsFeedKeys, loadMoreHistory, windowsFeed };
};
