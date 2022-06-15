import * as React from "react";
import { useViewsState, useHistorySearchState } from "./";
import { messages } from "../";

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
      chrome.runtime.sendMessage(
        { type: messages.viewByTypeRequest, viewType: type, query },
        (response) => setViewsFeed(response.result)
      );
    }
  };

  return { viewsFeed, currentView, currentViewQuery, viewsType, getViewsFeed };
};

/* -------------------------------------------------------------------------------------------------
 * useHistorySearch
 * -----------------------------------------------------------------------------------------------*/

export const useHistorySearch = ({ inputRef, viewType }) => {
  const searchByQuery = (query) => {
    if (query.length === 0) return;
    chrome.runtime.sendMessage(
      { type: messages.searchQueryRequest, query: query, viewType },
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
