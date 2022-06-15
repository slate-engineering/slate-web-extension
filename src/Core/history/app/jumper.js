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
