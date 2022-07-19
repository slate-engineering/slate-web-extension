import * as React from "react";
import { useHistoryState, useWindowsState } from ".";
import { messages } from "..";
import { useViewer } from "../../viewer/app/jumper";

/* -------------------------------------------------------------------------------------------------
 * useHistory
 * -----------------------------------------------------------------------------------------------*/

export const useHistory = () => {
  const { sessionsFeed, sessionsFeedKeys, setSessionsFeed } = useHistoryState();

  const paramsRef = React.useRef({ startIndex: 0, canFetchMore: true });

  const loadMoreHistory = React.useCallback(() => {
    if (!paramsRef.current.canFetchMore) return;

    window.postMessage(
      {
        type: messages.historyChunkRequest,
        startIndex: paramsRef.current.startIndex,
      },
      "*"
    );
  }, []);

  React.useEffect(() => {
    const handleMessage = (event) => {
      let { data, type } = event.data;
      if (type === messages.historyChunkResponse) {
        if (data.canFetchMore) {
          paramsRef.current.startIndex += data.history.length;
        } else {
          paramsRef.current.canFetchMore = false;
        }
        setSessionsFeed(data.history);

        return;
      }
    };
    window.addEventListener("message", handleMessage);

    loadMoreHistory();
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return { sessionsFeed, sessionsFeedKeys, loadMoreHistory };
};

/* -------------------------------------------------------------------------------------------------
 * useWindows
 * -----------------------------------------------------------------------------------------------*/

export const useWindows = () => {
  // NOTE(amine): currentWindow and allOpen are created in the background (We can access the sender's window id)
  const preloadedWindowsData = useViewer().windows;
  const initialState = preloadedWindowsData.data;

  const paramsRef = React.useRef(preloadedWindowsData.params);

  const { windowsFeed, setWindowsFeed } = useWindowsState({
    initialState,
    // NOTE(amine): creating currentWindow view requires this current tab's windowId
    activeWindowId: paramsRef.current.windowId,
  });

  React.useEffect(() => {
    const handleMessage = (event) => {
      let { data, type } = event.data;
      if (type === messages.windowsUpdate) {
        setWindowsFeed(data.openTabs);

        paramsRef.current.totalWindows = data.totalWindows;
        paramsRef.current.activeTabId = data.activeTabId;
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return {
    windowsFeed,
    totalWindows: paramsRef.current.totalWindows,
    activeTabId: paramsRef.current.activeTabId,
  };
};

/* -------------------------------------------------------------------------------------------------
 * useGetRelatedLinks
 * -----------------------------------------------------------------------------------------------*/

export const useGetRelatedLinks = (url) => {
  const [relatedLinks, setRelatedLinks] = React.useState(null);

  const timeoutRef = React.useRef();
  React.useEffect(() => {
    const getRelatedLinks = () => {
      if (!url) return;
      window.postMessage({ type: messages.relatedLinksRequest, url }, "*");
    };

    timeoutRef.current = setTimeout(getRelatedLinks, 300);
    return () => clearTimeout(timeoutRef.current);
  }, [url]);

  const urlRef = React.useRef();
  urlRef.current = url;
  React.useEffect(() => {
    const handleMessage = (event) => {
      let { data, type } = event.data;

      if (
        type === messages.relatedLinksResponse &&
        data.url === urlRef.current
      ) {
        setRelatedLinks(data.result);
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return relatedLinks;
};
