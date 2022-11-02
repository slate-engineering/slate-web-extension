import * as React from "react";
import { useEventListener } from "~/common/hooks";
import { useHistoryState, useWindowsState } from ".";
import { messages } from "..";
import { useViewer } from "../../viewer/app/jumper";

/* -------------------------------------------------------------------------------------------------
 * useHistory
 * -----------------------------------------------------------------------------------------------*/

export const useHistory = () => {
  const {
    isFetchingHistoryFirstBatch,
    sessionsFeed,
    sessionsFeedKeys,
    setHistoryState,
    removeObjectsFromRecentFeed,
  } = useHistoryState();

  const paramsRef = React.useRef({ startIndex: 0, canFetchMore: true });

  const viewer = useViewer();
  const loadMoreHistory = React.useCallback(() => {
    if (
      !viewer.settings.isRecentViewActivated ||
      !paramsRef.current.canFetchMore
    )
      return;

    window.postMessage(
      {
        type: messages.historyChunkRequest,
        startIndex: paramsRef.current.startIndex,
      },
      "*"
    );
  }, [viewer.settings.isRecentViewActivated]);

  React.useEffect(() => {
    loadMoreHistory();
  }, [loadMoreHistory]);

  const handleMessage = (event) => {
    let { data, type } = event.data;
    if (type === messages.historyChunkResponse) {
      if (data.canFetchMore) {
        paramsRef.current.startIndex += data.history.length;
      } else {
        paramsRef.current.canFetchMore = false;
      }

      setHistoryState({
        history: data.history,
        isFetchingHistoryFirstBatch: false,
      });

      return;
    }
  };
  useEventListener({ type: "message", handler: handleMessage });

  return {
    isFetchingHistoryFirstBatch,
    sessionsFeed,
    sessionsFeedKeys,
    loadMoreHistory,
    removeObjectsFromRecentFeed,
  };
};

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
    const handleMessage = (event) => {
      let { data, type } = event.data;
      if (type === messages.windowsUpdate) {
        paramsRef.current.activeTabId = data.activeTabId;

        setWindowsFeed({
          tabs: data.openTabs,
          activeWindowId: paramsRef.current.activeWindowId,
          activeTabId: paramsRef.current.activeTabId,
        });
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return {
    windowsFeeds,
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
