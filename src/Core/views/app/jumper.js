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
    if (view.type === viewsType.custom || view.type === viewsType.savedFiles) {
      window.postMessage({ type: messages.viewFeedRequest, view }, "*");
      setLoadingState(true);
    }
    setAppliedView(view);
  };

  const appliedViewRef = React.useRef();
  appliedViewRef.current = appliedView;
  React.useEffect(() => {
    let handleMessage = (event) => {
      let { data, type } = event.data;
      if (type === messages.viewFeedResponse) {
        if (data.view.type === viewsType.savedFiles) {
          setViewsFeed(data.result);
          setLoadingState(false);
          return;
        }
        if (data.view.id === appliedViewRef.current.id) {
          setViewsFeed(data.result);
          setLoadingState(false);
        }
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const createViewByTag = (slateName) => {
    window.postMessage({ type: messages.createViewByTag, slateName });
  };

  return {
    viewsFeed,
    appliedView,
    isLoadingViewFeed: isLoadingFeed,
    viewsType,
    getViewsFeed,
    createViewByTag,
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
    { ...search, isSearching: search.query.length > 0 && search.searchFeed },
    { handleInputChange, clearSearch },
  ];
};
