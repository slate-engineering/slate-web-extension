import * as React from "react";
import * as ListView from "./ListView";
import * as RovingTabIndex from "./RovingTabIndex";
import * as MultiSelection from "./MultiSelection";
import * as Constants from "../Common/constants";

import InfiniteLoader from "react-window-infinite-loader";

import { getFavicon } from "../Common/favicons";
import { getRootDomain, isNewTab } from "../Common/utilities";

const useHistoryInfiniteScroll = ({ onLoadMore, sessionsFeed }) => {
  const shouldFetchMore = React.useRef(true);

  React.useEffect(() => {
    shouldFetchMore.current = true;
  }, [sessionsFeed]);

  const handleInfiniteScroll = () => {
    if (shouldFetchMore.current) {
      onLoadMore();
      shouldFetchMore.current = false;
    }
  };

  return handleInfiniteScroll;
};

/* -----------------------------------------------------------------------------------------------*/

const STYLES_HISTORY_FEED_ROW = {
  width: "100%",
};

const HistoryFeedRow = React.memo(({ index, data, style }) => {
  if (!data.feed[index]) return null;

  const { rovingTabIndex, title, visit } = data.feed[index];
  const { onOpenUrl, onOpenSlatesJumper } = data.props;

  if (title) {
    return (
      <ListView.Title style={{ ...style, ...STYLES_HISTORY_FEED_ROW }}>
        {title}
      </ListView.Title>
    );
  }

  return (
    <ListView.RovingTabIndexWithMultiSelectObject
      key={visit.url}
      withActions
      withMultiSelection
      style={{ ...style, ...STYLES_HISTORY_FEED_ROW }}
      index={rovingTabIndex}
      title={visit.title}
      url={visit.url}
      favicon={visit.favicon}
      relatedVisits={visit.relatedVisits}
      Favicon={getFavicon(visit.rootDomain)}
      isSaved={visit.isSaved}
      onClick={() => onOpenUrl({ urls: [visit.url] })}
      onOpenSlatesJumper={() =>
        onOpenSlatesJumper([
          {
            title: visit.title,
            url: visit.url,
            rootDomain: getRootDomain(visit.url),
          },
        ])
      }
      autoFocus={rovingTabIndex === 0}
    />
  );
});

/* -----------------------------------------------------------------------------------------------*/

const HistoryFeedList = React.forwardRef(
  ({ children, ...props }, forwardedRef) => {
    const [listHeight, setListHeight] = React.useState(
      isNewTab ? null : Constants.sizes.jumperFeedWrapper
    );

    const ref = React.useRef();
    React.useEffect(() => {
      if (ref.current) {
        setListHeight(ref.current.offsetHeight);
      }
    }, []);

    if (!listHeight) {
      return <div style={{ height: "100%" }} ref={ref} />;
    }

    return (
      <RovingTabIndex.List>
        <ListView.VariableSizeListRoot
          height={listHeight}
          ref={forwardedRef}
          {...props}
        >
          {children}
        </ListView.VariableSizeListRoot>
      </RovingTabIndex.List>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * HistoryFeed
 * -----------------------------------------------------------------------------------------------*/

const HistoryFeed = React.forwardRef(
  (
    {
      sessionsFeed,
      sessionsFeedKeys,
      onLoadMore,
      onOpenUrl,
      onOpenSlatesJumper,
      onGroupURLs,
      onSaveObjects,
      css,
      ...props
    },
    ref
  ) => {
    const historyWrapperRef = React.useRef();
    const handleInfiniteScroll = useHistoryInfiniteScroll({
      onLoadMore,
      historyWrapperRef,
      sessionsFeed,
    });

    const sessionsFeedLength = React.useMemo(() => {
      let length = 0;
      sessionsFeedKeys.forEach((key) => {
        length += sessionsFeed[key].length;
      });
      return length;
    }, [sessionsFeed, sessionsFeedKeys]);

    const feedItemsData = React.useMemo(() => {
      let rovingTabIndex = 0;
      let virtualizedFeed = [];

      for (let key of sessionsFeedKeys) {
        sessionsFeed[key].forEach((visit, index) => {
          if (index === 0) {
            virtualizedFeed.push({ title: key, height: 40 });
          }

          virtualizedFeed.push({
            rovingTabIndex,
            visit,
            height: Constants.sizes.jumperFeedItem,
          });

          rovingTabIndex++;
        });
      }

      return {
        feed: virtualizedFeed,
        props: {
          onOpenUrl,
          onOpenSlatesJumper,
        },
      };
    }, [sessionsFeed, sessionsFeedKeys, onOpenUrl, onOpenSlatesJumper]);

    const isItemLoaded = (index) => index < feedItemsData.feed.length;

    const handleOnSubmitSelectedItem = (index) => {
      let currentLength = 0;

      for (let feedKey of sessionsFeedKeys) {
        const feed = sessionsFeed[feedKey];
        const nextLength = currentLength + feed.length;
        if (index < nextLength) {
          return feed[index - currentLength];
        }
        currentLength = nextLength;
      }
    };

    const getFeedItemHeight = (index) => feedItemsData.feed[index].height;

    return (
      <RovingTabIndex.Provider
        ref={(node) => (ref.rovingTabIndexRef = node)}
        isInfiniteList
        withFocusOnHover
      >
        <MultiSelection.Provider
          totalSelectableItems={sessionsFeedLength}
          onSubmitSelectedItem={handleOnSubmitSelectedItem}
        >
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={feedItemsData.feed.length + 1}
            loadMoreItems={handleInfiniteScroll}
          >
            {({ onItemsRendered, ref }) => (
              <HistoryFeedList
                itemCount={feedItemsData.feed.length + 1}
                itemData={feedItemsData}
                itemSize={getFeedItemHeight}
                onItemsRendered={onItemsRendered}
                css={css}
                ref={ref}
                {...props}
              >
                {HistoryFeedRow}
              </HistoryFeedList>
            )}
          </InfiniteLoader>
          <MultiSelection.ActionsMenu
            onOpenURLs={(urls) => onOpenUrl({ urls })}
            onGroupURLs={(urls) => onGroupURLs({ urls, title: "recent" })}
            onSaveObjects={onSaveObjects}
            onOpenSlatesJumper={onOpenSlatesJumper}
          />
        </MultiSelection.Provider>
      </RovingTabIndex.Provider>
    );
  }
);

export default React.memo(HistoryFeed);
