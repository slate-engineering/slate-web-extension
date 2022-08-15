import * as React from "react";
import { useViewsState, useHistorySearchState } from "./";
import { messages } from "../";

/* -------------------------------------------------------------------------------------------------
 * useViews
 * -----------------------------------------------------------------------------------------------*/

export const useViews = () => {
  const [
    { viewsFeed, currentView, currentViewLabel, currentViewQuery, viewsType },
    { setViewsFeed, setViewsParams },
  ] = useViewsState();

  const getViewsFeed = ({ type, label, query }) => {
    setViewsParams({ type, label, query });
    if (
      (type === viewsType.relatedLinks && query) ||
      type === viewsType.savedFiles
    ) {
      window.postMessage(
        { type: messages.viewByTypeRequest, viewType: type, query },
        "*"
      );
    }
  };

  const paramsRef = React.useRef();
  paramsRef.current = { type: currentView, query: currentViewQuery };
  React.useEffect(() => {
    let handleMessage = (event) => {
      if (paramsRef.current.type === viewsType.recent) return;
      let { data, type } = event.data;
      if (type === messages.viewByTypeResponse) {
        if (data.viewType === viewsType.savedFiles) {
          setViewsFeed(data.result);
          return;
        }
        if (data.query === paramsRef.current.query) {
          setViewsFeed(data.result);
        }
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return {
    viewsFeed,
    currentView,
    currentViewLabel,
    currentViewQuery,
    viewsType,
    getViewsFeed,
  };
};

/* -------------------------------------------------------------------------------------------------
 * useHistorySearch
 * -----------------------------------------------------------------------------------------------*/

export const useHistorySearch = ({ inputRef, viewType }) => {
  const searchByQuery = (query) => {
    if (query.length === 0) return;
    window.postMessage(
      { type: messages.searchQueryRequest, query: query, viewType },
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

  return [
    { ...search, isSearching: search.query.length > 0 && search.result },
    { handleInputChange, clearSearch },
  ];
};
