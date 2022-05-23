import * as React from "react";
import {
  useHistoryState,
  useOpenWindowsState,
  useViewsState,
  useHistorySearchState,
} from "./";
import { messages } from "../";

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

export const useViews = () => {
  const [
    { viewsFeed, currentView, currentViewQuery, viewsType },
    { setViewsFeed, setViewsParams },
  ] = useViewsState();

  const getViewsFeed = ({ type, query }) => {
    setViewsParams({ type, query });
    if (type === viewsType.relatedLinks && query) {
      chrome.runtime.sendMessage(
        { type: messages.viewByTypeRequest, query },
        (response) => {
          setViewsFeed(response.result);
        }
      );
    }
  };

  return { viewsFeed, currentView, currentViewQuery, viewsType, getViewsFeed };
};

export const useHistorySearch = ({ inputRef }) => {
  const searchByQuery = (query) => {
    if (query.length === 0) return;
    chrome.runtime.sendMessage(
      { type: messages.searchQueryRequest, query: query },
      (response) => {
        if (response.query === inputRef.current.value)
          setSearch((prev) => ({ ...prev, result: [...response.result] }));
      }
    );
  };

  const [
    { search, initialState },
    { handleInputChange, setSearch, clearSearch },
  ] = useHistorySearchState({ inputRef, onSearch: searchByQuery });

  React.useEffect(() => {
    if (search.query.length === 0) {
      setSearch(initialState);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [search.query]);

  return [search, { handleInputChange, clearSearch }];
};
