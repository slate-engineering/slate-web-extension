import * as React from "react";

import { useViewsState, useHistorySearchState } from "./";
import { messages, viewsType } from "../";

/* -------------------------------------------------------------------------------------------------
 * useViews
 * -----------------------------------------------------------------------------------------------*/

export const useViews = () => {
  const [
    { viewsFeed, appliedView, isLoadingFeed },
    { setViewsFeed, setAppliedView, setLoadingState },
  ] = useViewsState();

  const getViewsFeed = (view) => {
    if (
      view.type === viewsType.custom ||
      view.type === viewsType.saved ||
      view.type === viewsType.files
    ) {
      setLoadingState(true);
      chrome.runtime.sendMessage(
        { type: messages.viewFeedRequest, view },
        (response) => {
          setViewsFeed(response.result);
          setLoadingState(false);
        }
      );
    }
    setAppliedView(view);
  };

  const createViewByTag = (slateName) => {
    chrome.runtime.sendMessage({ type: messages.createViewByTag, slateName });
  };

  const createViewBySource = (source) => {
    chrome.runtime.sendMessage({ type: messages.createViewBySource, source });
  };

  const removeView = (id) => {
    chrome.runtime.sendMessage({ type: messages.removeView, id });
  };

  return {
    viewsFeed,
    isLoadingViewFeed: isLoadingFeed,
    appliedView,
    viewsType,
    getViewsFeed,
    createViewByTag,
    createViewBySource,
    removeView,
  };
};

/* -------------------------------------------------------------------------------------------------
 * useHistorySearch
 * -----------------------------------------------------------------------------------------------*/

export const useHistorySearch = ({ inputRef, view }) => {
  const searchByQuery = (query) => {
    if (query.length === 0) return;

    chrome.runtime.sendMessage(
      {
        type: messages.searchQueryRequest,
        query: query,
        view,
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
