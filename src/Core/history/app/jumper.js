import * as React from "react";
import { useHistoryState, useOpenWindowsState, useViewsState } from "./";
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

export const useViews = () => {
  const [
    { viewsFeed, currentView, currentViewQuery, viewsType },
    { setViewsFeed, setViewsParams },
  ] = useViewsState();

  const getViewsFeed = ({ type, query }) => {
    setViewsParams({ type, query });
    if (type === viewsType.relatedLinks && query) {
      window.postMessage({ type: messages.viewByTypeRequest, query }, "*");
    }
  };

  const paramsRef = React.useRef();
  paramsRef.current = { type: currentView, query: currentViewQuery };
  React.useEffect(() => {
    let handleMessage = (event) => {
      if (paramsRef.current.type === viewsType.recent) return;
      let { data, type } = event.data;
      if (type === messages.viewByTypeResponse) {
        if (data.query === paramsRef.current.query) setViewsFeed(data.result);
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return { viewsFeed, currentView, currentViewQuery, viewsType, getViewsFeed };
};
