import * as React from "react";

import { useHistoryState, useWindowsState } from ".";
import { useViewer } from "../../viewer/app/newTab";
import { messages } from "..";

/* -------------------------------------------------------------------------------------------------
 * useWindows
 * -----------------------------------------------------------------------------------------------*/

export const useWindows = () => {
  // NOTE(amine): allOpen is created in the background (We can access the sender's window id)
  const preloadedWindowsData = useViewer().windows;
  const initialState = preloadedWindowsData.data;

  const paramsRef = React.useRef(preloadedWindowsData.params);

  const { windowsFeeds, setWindowsFeed } = useWindowsState({
    initialState,
  });

  React.useEffect(() => {
    const handleMessage = (request) => {
      let { data, type } = request;
      if (type === messages.windowsUpdate) {
        paramsRef.current.activeTabId = data.activeTabId;

        setWindowsFeed({
          tabs: data.openTabs,
          activeWindowId: paramsRef.current.activeWindowId,
          activeTabId: paramsRef.current.activeTabId,
        });
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);

    return () => chrome.runtime.onMessage.addListener(handleMessage);
  }, []);
  return {
    windowsFeeds,
    activeTabId: paramsRef.current.activeTabId,
  };
};

/* -------------------------------------------------------------------------------------------------
 * useHistory
 * -----------------------------------------------------------------------------------------------*/

export const useHistory = () => {
  const {
    isFetchingHistoryFirstBatch,
    sessionsFeed,
    sessionsFeedKeys,
    setHistoryState,
  } = useHistoryState();

  const paramsRef = React.useRef({ startIndex: 0, canFetchMore: true });

  const viewer = useViewer();

  const loadMoreHistory = React.useCallback(() => {
    if (
      !viewer.settings.isRecentViewActivated ||
      !paramsRef.current.canFetchMore
    )
      return;

    const handleResponse = (response) => {
      if (response.canFetchMore) {
        paramsRef.current.startIndex += response.history.length;
      } else {
        paramsRef.current.canFetchMore = false;
      }
      setHistoryState({
        history: response.history,
        isFetchingHistoryFirstBatch: false,
      });
    };

    chrome.runtime.sendMessage(
      {
        type: messages.historyChunkRequest,
        startIndex: paramsRef.current.startIndex,
      },
      handleResponse
    );
  }, [viewer.settings.isRecentViewActivated]);

  React.useEffect(loadMoreHistory, [loadMoreHistory]);

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

  return {
    isFetchingHistoryFirstBatch,
    sessionsFeed,
    sessionsFeedKeys,
    loadMoreHistory,
  };
};
