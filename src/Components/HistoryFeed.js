import * as React from "react";
import * as ListView from "./ListView";
import * as RovingTabIndex from "./RovingTabIndex";

import { getFavicon } from "../Common/favicons";

const useHistoryInfiniteScroll = ({ onLoadMore, sessionsFeed }) => {
  const shouldFetchMore = React.useRef(true);

  React.useEffect(() => {
    shouldFetchMore.current = true;
  }, [sessionsFeed]);

  const handleInfiniteScroll = (e) => {
    const OFFSET = 300;
    const element = e.target;

    if (
      element.scrollTop + element.offsetHeight + OFFSET >=
      element.scrollHeight
    ) {
      onLoadMore();
      shouldFetchMore.current = false;
    }
  };

  return handleInfiniteScroll;
};

const HistoryFeed = ({
  sessionsFeed,
  sessionsFeedKeys,
  onLoadMore,
  onObjectHover,
  onOpenUrl,
  css,

  ...props
}) => {
  const historyWrapperRef = React.useRef();
  const handleInfiniteScroll = useHistoryInfiniteScroll({
    onLoadMore,
    historyWrapperRef,
    sessionsFeed,
  });

  const getVisitComoboboxIndex = (feedIndex, visitIndex) => {
    let startingIndex = 0;
    for (let i = 0; i < feedIndex; i++) {
      let sessionKey = sessionsFeedKeys[i];
      startingIndex += sessionsFeed[sessionKey].length;
    }

    return startingIndex + visitIndex;
  };

  const sessionsFeedLength = React.useMemo(() => {
    let length = 0;
    sessionsFeedKeys.forEach((key) => {
      length += sessionsFeed[key].length;
    });
    return length;
  }, [sessionsFeed, sessionsFeedKeys]);

  return (
    <RovingTabIndex.Provider isInfiniteList withFocusOnHover>
      <RovingTabIndex.List>
        <ListView.Root
          css={css}
          onScroll={handleInfiniteScroll}
          totalSelectableItems={sessionsFeedLength}
          {...props}
        >
          {sessionsFeedKeys.map((key, feedIndex) => {
            if (!sessionsFeed[key].length) return null;

            return (
              <ListView.Section key={key}>
                <ListView.Title>{key}</ListView.Title>
                {sessionsFeed[key].map((visit, visitIndex) => {
                  const comboxboxItemIndex = getVisitComoboboxIndex(
                    feedIndex,
                    visitIndex
                  );

                  return (
                    <ListView.RovingTabIndexObject
                      key={visit.url}
                      withActions
                      withMultiSelection
                      index={comboxboxItemIndex}
                      title={visit.title}
                      url={visit.url}
                      favicon={visit.favicon}
                      relatedVisits={visit.relatedVisits}
                      Favicon={getFavicon(visit.rootDomain)}
                      isSaved={visit.isSaved}
                      onClick={() => onOpenUrl({ urls: [visit.url] })}
                      onMouseEnter={() =>
                        onObjectHover?.({ url: visit.url, title: visit.title })
                      }
                    />
                  );
                })}
              </ListView.Section>
            );
          })}
        </ListView.Root>
      </RovingTabIndex.List>
    </RovingTabIndex.Provider>
  );
};

export default React.memo(HistoryFeed);
