import * as React from "react";
import { useHistoryState, useOpenWindowsState } from "./";
import { messages } from "../";

/* -------------------------------------------------------------------------------------------------
 * useHistory
 * -----------------------------------------------------------------------------------------------*/

export const useHistory = () => {
  const { sessionsFeed, sessionsFeedKeys, setSessionsFeed } = useHistoryState();
  const { windowsFeed, setWindowsFeed } = useOpenWindowsState();

  const paramsRef = React.useRef({ startIndex: 0, canFetchMore: true });

  const loadMoreHistory = () => {
    if (!paramsRef.current.canFetchMore) return;

    const handleResponse = (response) => {
      if (response.canFetchMore) {
        paramsRef.current.startIndex += response.history.length;
      } else {
        paramsRef.current.canFetchMore = false;
      }
      setSessionsFeed(response.history);

      if (response.windows) {
        setWindowsFeed({
          windows: response.windows,
          activeWindowId: response.activeWindowId,
        });
      }
    };

    chrome.runtime.sendMessage(
      {
        type: messages.historyChunkRequest,
        startIndex: paramsRef.current.startIndex,
      },
      handleResponse
    );
  };

  React.useEffect(loadMoreHistory, []);

  React.useEffect(() => {
    const handleWindowsUpdate = (request) => {
      if (request.type === messages.windowsUpdate) {
        window.postMessage(
          { type: messages.windowsUpdate, data: request.data },
          "*"
        );
      }
    };
    chrome.runtime.onMessage.addListener(handleWindowsUpdate);
    return () => chrome.runtime.onMessage.removeListener(handleWindowsUpdate);
  }, []);

  return { sessionsFeed, sessionsFeedKeys, loadMoreHistory, windowsFeed };
};
