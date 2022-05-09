import * as React from "react";

import { isToday, isYesterday } from "../../Common/utilities";
import { messages, viewsType } from "./";

const removeSessionDuplicateVisits = (session) => {
  const isAlreadyAdded = {};
  session.visits = session.visits.filter(({ url }) => {
    if (url in isAlreadyAdded) return false;
    isAlreadyAdded[url] = true;
    return true;
  });
  return session;
};

const removeViewsDuplicateSession = (sessions) => {
  const isAlreadyAdded = {};
  return sessions.filter(({ item: session }) => {
    if (session.visits.length > 1) return true;
    const visitUrl = session.visits[0].url;
    if (visitUrl in isAlreadyAdded) {
      return false;
    } else {
      isAlreadyAdded[visitUrl] = true;
      return true;
    }
  });
};

const updateSessionsFeed = ({ sessionsFeed, history }) => {
  const ifKeyExistAppendValueElseCreate = ({ object, key, value }) =>
    key in object ? object[key].push(value) : (object[key] = [value]);

  const urlFeedCheck = {};
  const isUrlAlreadyAddedToFeedTimeline = (time, url) => {
    if (!urlFeedCheck[time]) {
      urlFeedCheck[time] = { [url]: true };
      return false;
    }
    if (urlFeedCheck[time][url]) return true;
    urlFeedCheck[time][url] = true;
    return false;
  };

  history.forEach((session) => {
    const cleanedSession = removeSessionDuplicateVisits(session);

    if (isToday(new Date(cleanedSession.visitTime))) {
      if (
        isUrlAlreadyAddedToFeedTimeline(
          "Today",
          cleanedSession.visits.map((visit) => visit.url).join("")
        )
      ) {
        return;
      }

      ifKeyExistAppendValueElseCreate({
        object: sessionsFeed,
        key: "Today",
        value: cleanedSession,
      });
      return;
    }

    if (isYesterday(new Date(cleanedSession.visitTime))) {
      if (
        isUrlAlreadyAddedToFeedTimeline(
          "Yesterday",
          cleanedSession.visits.map((visit) => visit.url).join("")
        )
      ) {
        return;
      }

      ifKeyExistAppendValueElseCreate({
        object: sessionsFeed,
        key: "Yesterday",
        value: cleanedSession,
      });
      return;
    }

    const sessionVisitDate = new Date(cleanedSession.visitTime);
    const formattedDate = `${sessionVisitDate.toLocaleDateString("en-EN", {
      weekday: "long",
    })}, ${sessionVisitDate.toLocaleDateString("en-EN", {
      month: "short",
    })} ${sessionVisitDate.getDate()} `;

    if (
      isUrlAlreadyAddedToFeedTimeline(
        formattedDate,
        cleanedSession.visits.map((visit) => visit.url).join("")
      )
    ) {
      return;
    }

    ifKeyExistAppendValueElseCreate({
      object: sessionsFeed,
      key: formattedDate,
      value: cleanedSession,
    });
  });

  return sessionsFeed;
};

export const useHistory = () => {
  const paramsRef = React.useRef({ startIndex: 0, canFetchMore: true });

  const initiateWindowsFeed = () => ({
    thisWindow: [],
    currentlyOpen: [],
  });
  const [windowsFeed, setWindowsFeed] = React.useState(initiateWindowsFeed());
  const createWindowsFeed = ({ windows, activeWindowId }) => {
    const windowsFeed = initiateWindowsFeed();
    windows.forEach((window) => {
      if (window.id === activeWindowId) {
        windowsFeed.thisWindow = window.tabs;
        return;
      }
      windowsFeed.currentlyOpen.push(...window.tabs);
    });
    return windowsFeed;
  };

  const [sessionsFeed, setSessionsFeed] = React.useState({});
  const sessionsFeedKeys = React.useMemo(
    () => Object.keys(sessionsFeed),
    [sessionsFeed]
  );

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
        setSessionsFeed((prevFeed) => {
          const newFeed = updateSessionsFeed({
            sessionsFeed: { ...prevFeed },
            history: data.history,
          });
          return newFeed;
        });

        if (data.windows) {
          setWindowsFeed(
            createWindowsFeed({
              windows: data.windows,
              activeWindowId: data.activeWindowId,
            })
          );
        }
        return;
      }

      if (type === messages.windowsUpdate) {
        setWindowsFeed(
          createWindowsFeed({
            windows: data.windows,
            activeWindowId: data.activeWindowId,
          })
        );
      }
    };
    window.addEventListener("message", handleMessage);

    loadMoreHistory();
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return { windowsFeed, sessionsFeed, sessionsFeedKeys, loadMoreHistory };
};

const useDebouncedOnChange = ({ setQuery, handleSearch }) => {
  const timeRef = React.useRef();
  const handleChange = (e) => {
    clearTimeout(timeRef.current);
    const { value } = e.target;
    timeRef.current = setTimeout(
      () => (setQuery(value), handleSearch(value)),
      300
    );
  };
  return handleChange;
};

export const useHistorySearch = ({ inputRef }) => {
  const SEARCH_DEFAULT_STATE = {
    query: "",
    result: null,
  };
  const [search, setSearch] = React.useState(SEARCH_DEFAULT_STATE);

  const clearSearch = () => setSearch(SEARCH_DEFAULT_STATE);
  const searchByQuery = (query) => {
    if (query.length === 0) return;
    window.postMessage(
      { type: messages.searchQueryRequest, query: query },
      "*"
    );
  };

  const handleInputChange = useDebouncedOnChange({
    setQuery: (query) => setSearch((prev) => ({ ...prev, query })),
    handleSearch: searchByQuery,
  });

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
      setSearch(SEARCH_DEFAULT_STATE);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [search.query]);

  return [search, { handleInputChange, searchByQuery, clearSearch }];
};

export const useGetRelatedLinks = (url) => {
  const [relatedLinks, setRelatedLinks] = React.useState(null);

  const getRelatedLinks = () => {
    if (!url) return;
    setRelatedLinks(null);
    window.postMessage({ type: messages.relatedLinksRequest, url }, "*");
  };
  React.useEffect(() => {
    getRelatedLinks();
  }, [url]);

  const urlRef = React.useRef();
  urlRef.current = url;
  React.useEffect(() => {
    let handleMessage = (event) => {
      let { data, type } = event.data;

      if (type === messages.relatedLinksResponse) {
        if (data.url === urlRef.current) {
          setRelatedLinks(data.result);
        }
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return relatedLinks;
};

export const useViews = () => {
  const [views, setViews] = React.useState({
    feed: [],
    type: viewsType.recent,
    query: "",
  });

  const getViewsFeed = ({ type, query }) => {
    setViews((prev) => ({ ...prev, type, query }));
    if (type === viewsType.relatedLinks && query) {
      window.postMessage({ type: messages.viewByTypeRequest, query }, "*");
    }
  };

  const paramsRef = React.useRef();
  paramsRef.current = { type: views.type, query: views.query };
  React.useEffect(() => {
    let handleMessage = (event) => {
      if (paramsRef.current.type === viewsType.recent) return;
      let { data, type } = event.data;
      if (type === messages.viewByTypeResponse) {
        if (data.query === paramsRef.current.query)
          setViews((prev) => ({
            ...prev,
            feed: removeViewsDuplicateSession(data.result),
          }));
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return {
    viewsFeed: views.feed,
    getViewsFeed,
    currentView: views.type,
    viewQuery: views.query,
    viewsType,
  };
};
