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

  const { windows, setWindowsFeed } = useWindowsState({
    initialState,
    // NOTE(amine): creating currentWindow view requires this current tab's windowId
    activeWindowId: preloadedWindowsData.params.windowId,
  });

  React.useEffect(() => {
    const handleMessage = (request) => {
      let { data, type } = request;
      if (type === messages.windowsUpdate) {
        setWindowsFeed(data.openTabs);
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);

    return () => chrome.runtime.onMessage.addListener(handleMessage);
  }, []);
  return windows;
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
