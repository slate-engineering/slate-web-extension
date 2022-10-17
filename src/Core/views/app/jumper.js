import * as React from "react";
import { useViewsState, useHistorySearchState } from "./";
import { messages, viewsType } from "../";

/* -------------------------------------------------------------------------------------------------
 * useViews
 * -----------------------------------------------------------------------------------------------*/

export const useViews = () => {
  const [{ viewsFeed, appliedView, isLoadingFeed }, setViewsState] =
    useViewsState();

  const getViewsFeed = React.useCallback(
    (view) => {
      if (
        view.type === viewsType.custom ||
        view.type === viewsType.saved ||
        view.type === viewsType.files
      ) {
        window.postMessage({ type: messages.viewFeedRequest, view }, "*");
        setViewsState({ isLoadingFeed: true });
      }
      setViewsState({ appliedView: view });
    },
    [setViewsState]
  );

  const appliedViewRef = React.useRef();
  appliedViewRef.current = appliedView;
  React.useEffect(() => {
    let handleMessage = (event) => {
      let { data, type } = event.data;
      if (type === messages.viewFeedResponse) {
        if (
          data.view.type === viewsType.saved ||
          data.view.type === viewsType.files
        ) {
          setViewsState({ isLoadingFeed: false, feed: data.result });
          return;
        }
        if (data.view.id === appliedViewRef.current.id) {
          setViewsState({ isLoadingFeed: false, feed: data.result });
        }
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const createViewByTag = React.useCallback((slateName) => {
    window.postMessage({ type: messages.createViewByTag, slateName });
  }, []);

  const createViewBySource = React.useCallback((source) => {
    window.postMessage({ type: messages.createViewBySource, source });
  }, []);

  const removeView = React.useCallback((id) => {
    window.postMessage({ type: messages.removeView, id });
  }, []);

  return {
    viewsFeed,
    appliedView,
    isLoadingViewFeed: isLoadingFeed,
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
    window.postMessage(
      {
        type: messages.searchQueryRequest,
        query: query,
        view,
      },
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
        if (data.query === inputRef.current.value) {
          setSearch((prev) => ({ ...prev, ...data }));
        }
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
    {
      ...search,
      isSearching: !!search.query.length > 0 && !!search.searchFeed,
    },
    { handleInputChange, clearSearch },
  ];
};
