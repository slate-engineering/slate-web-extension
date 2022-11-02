import * as React from "react";

import { useViewsState, useHistorySearchState } from "./";
import { messages, viewsType } from "../";

/* -------------------------------------------------------------------------------------------------
 * useViews
 * -----------------------------------------------------------------------------------------------*/

export const useViews = () => {
  const [
    { viewsFeed, viewsFeedKeys, appliedView, isLoadingFeed },
    { setViewsState, removeObjectsFromViewsFeed },
  ] = useViewsState();

  const getViewsFeed = React.useCallback(
    (view) => {
      if (
        view.type === viewsType.custom ||
        view.type === viewsType.saved ||
        view.type === viewsType.files
      ) {
        setViewsState({ isLoadingFeed: true });
        chrome.runtime.sendMessage(
          { type: messages.viewFeedRequest, view },
          (response) => {
            setViewsState({
              feed: response.feed,
              feedKeys: response.feedKeys,
              isLoadingFeed: false,
            });
          }
        );
      }
      setViewsState({ appliedView: view });
    },
    [setViewsState]
  );

  React.useLayoutEffect(() => {
    getViewsFeed(appliedView);
  }, []);

  const updateAppliedViewFeed = React.useCallback(
    () => getViewsFeed(appliedView),
    [appliedView, getViewsFeed]
  );

  const createViewByTag = React.useCallback((slateName) => {
    chrome.runtime.sendMessage({ type: messages.createViewByTag, slateName });
  }, []);

  const createViewBySource = React.useCallback((source) => {
    chrome.runtime.sendMessage({ type: messages.createViewBySource, source });
  }, []);

  const removeView = React.useCallback((id) => {
    chrome.runtime.sendMessage({ type: messages.removeView, id });
  }, []);

  return {
    viewsFeed,
    viewsFeedKeys,
    isLoadingViewFeed: isLoadingFeed,
    appliedView,
    updateAppliedViewFeed,
    viewsType,
    getViewsFeed,
    createViewByTag,
    createViewBySource,
    removeObjectsFromViewsFeed,
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
    {
      ...search,
      isSearching: !!search.query.length > 0 && !!search.searchFeed,
    },
    { handleInputChange, clearSearch },
  ];
};
