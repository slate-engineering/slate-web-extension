import * as React from "react";
import {
  useHistoryState,
  useOpenWindowsState,
  useViewsState,
  useHistorySearchState,
} from "./";
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

/* -------------------------------------------------------------------------------------------------
 * useViews
 * -----------------------------------------------------------------------------------------------*/

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

/* -------------------------------------------------------------------------------------------------
 * useGetRelatedLinks
 * -----------------------------------------------------------------------------------------------*/

export const useGetRelatedLinks = (url) => {
  const [relatedLinks, setRelatedLinks] = React.useState(null);

  const timeoutRef = React.useRef();
  React.useEffect(() => {
    const getRelatedLinks = () => {
      if (!url) return;
      setRelatedLinks(null);
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

/* -------------------------------------------------------------------------------------------------
 * useHistorySearch
 * -----------------------------------------------------------------------------------------------*/

export const useHistorySearch = ({ inputRef }) => {
  const searchByQuery = (query) => {
    if (query.length === 0) return;
    window.postMessage(
      { type: messages.searchQueryRequest, query: query },
      "*"
    );
  };

  const [
    { search, initialState },
    { handleInputChange, setSearch, clearSearch },
  ] = useHistorySearchState({ inputRef, onSearch: searchByQuery });

  React.useEffect(() => {
    let handleMessage = (event) => {
      let { data, type } = event.data;

      if (type === messages.searchQueryResponse) {
        if (data.query === inputRef.current.value)
          setSearch((prev) => ({ ...prev, result: [...data.result] }));
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  React.useEffect(() => {
    if (search.query.length === 0) {
      setSearch(initialState);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [search.query]);

  return [search, { handleInputChange, clearSearch }];
};
