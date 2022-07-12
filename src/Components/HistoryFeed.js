import * as React from "react";
import * as ListView from "./ListView";
import { ComboboxNavigation } from "./ComboboxNavigation";

import { getFavicon } from "../Common/favicons";
import { useEventListener } from "../Common/hooks";

const useHistoryInfiniteScroll = ({
  historyWrapperRef,
  onLoadMore,
  sessionsFeed,
}) => {
  const shouldFetchMore = React.useRef(true);
  const handleScroll = () => {
    if (!shouldFetchMore.current) return;
    const OFFSET = 300;
    const element = historyWrapperRef.current;

    if (
      element.scrollTop + element.offsetHeight + OFFSET >=
      element.scrollHeight
    ) {
      onLoadMore();
      shouldFetchMore.current = false;
    }
  };
  useEventListener({
    type: "scroll",
    ref: historyWrapperRef,
    handler: handleScroll,
  });

  React.useEffect(() => {
    shouldFetchMore.current = true;
  }, [sessionsFeed]);
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
  useHistoryInfiniteScroll({
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

  return (
    <ComboboxNavigation.Menu>
      <ListView.Root ref={historyWrapperRef} css={css} {...props}>
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
                  <ListView.ComboboxObject
                    key={visit.url}
                    index={comboxboxItemIndex}
                    title={visit.title}
                    url={visit.url}
                    relatedVisits={visit.relatedVisits}
                    Favicon={getFavicon(visit.rootDomain)}
                    withActions
                    isSaved={visit.isSaved}
                    onSelect={() =>
                      onObjectHover?.({ url: visit.url, title: visit.title })
                    }
                    onSubmit={() => onOpenUrl({ urls: [visit.url] })}
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
    </ComboboxNavigation.Menu>
  );
};

export default React.memo(HistoryFeed);
