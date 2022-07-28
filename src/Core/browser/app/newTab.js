import * as React from "react";

import { useHistoryState, useWindowsState } from ".";
import { useViewer } from "../../viewer/app/newTab";
import { messages } from "..";

/* -------------------------------------------------------------------------------------------------
 * useWindows
 * -----------------------------------------------------------------------------------------------*/

export const useWindows = () => {
  // NOTE(amine): currentWindow and allOpen are created in the background (We can access the sender's window id)
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
        paramsRef.current.totalWindows = data.totalWindows;
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
    totalWindows: paramsRef.current.totalWindows,
    activeTabId: paramsRef.current.activeTabId,
  };
};

/* -------------------------------------------------------------------------------------------------
 * useHistory
 * -----------------------------------------------------------------------------------------------*/

export const useHistory = () => {
  const { sessionsFeed, sessionsFeedKeys, setSessionsFeed } = useHistoryState();

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

  return { sessionsFeed, sessionsFeedKeys, loadMoreHistory };
};
