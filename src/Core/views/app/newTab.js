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
    setViewsParams({ type, query, label });
    if (
      (type === viewsType.relatedLinks && query) ||
      type === viewsType.savedFiles
    ) {
      chrome.runtime.sendMessage(
        { type: messages.viewByTypeRequest, viewType: type, query },
        (response) => setViewsFeed(response.result)
      );
    }
  };

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

export const useHistorySearch = ({
  inputRef,
  viewType,
  viewQuery,
  viewLabel,
}) => {
  const searchByQuery = (query) => {
    if (query.length === 0) return;

    chrome.runtime.sendMessage(
      {
        type: messages.searchQueryRequest,
        query: query,
        viewType,
        viewQuery,
        viewLabel,
      },
      (response) => {
        if (response.query === inputRef.current.value)
          setSearch((prev) => ({ ...prev, ...response }));
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

  return [
    { ...search, isSearching: search.query.length > 0 && search.searchFeed },
    { handleInputChange, clearSearch },
  ];
};
