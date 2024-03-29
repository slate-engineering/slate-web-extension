import * as React from "react";
import * as ListView from "./ListView";
import * as RovingTabIndex from "./RovingTabIndex";
import * as MultiSelection from "./MultiSelection";
import * as Constants from "~/common/constants";

import { getRootDomain, isNewTab } from "~/common/utilities";

/* -----------------------------------------------------------------------------------------------*/

const STYLES_WINDOWS_FEED_ROW = {
  width: "100%",
};

const WindowsFeedRow = React.memo(({ index, data, style }) => {
  if (!data.feed[index]) return null;

  const { rovingTabIndex, title, tab, isTabActive } = data.feed[index];
  const { onOpenUrl, onCloseTabs, onOpenSlatesJumper, onRemoveObjects } =
    data.props;

  if (title) {
    return (
      <ListView.Title style={{ ...style, ...STYLES_WINDOWS_FEED_ROW }}>
        {title}
      </ListView.Title>
    );
  }

  return (
    <ListView.RovingTabIndexWithMultiSelectObject
      key={tab.id}
      isTab
      isTabActive={isTabActive}
      withActions
      withMultiSelection
      style={{ ...style, ...STYLES_WINDOWS_FEED_ROW }}
      index={rovingTabIndex}
      title={tab.title}
      url={tab.url}
      rootDomain={tab.rootDomain}
      favicon={tab.favicon}
      isSaved={tab.isSaved}
      onCloseTab={() => onCloseTabs([tab.id])}
      onClick={() =>
        onOpenUrl({
          query: { tabId: tab.id, windowId: tab.windowId },
        })
      }
      onOpenSlatesJumper={() =>
        onOpenSlatesJumper([
          {
            title: tab.title,
            url: tab.url,
            rootDomain: getRootDomain(tab.url),
          },
        ])
      }
      onRemoveObject={() => onRemoveObjects({ objects: [tab] })}
    />
  );
});

/* -----------------------------------------------------------------------------------------------*/

const WindowsFeedList = React.forwardRef(
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
 * WindowsFeed
 * -----------------------------------------------------------------------------------------------*/

const WindowsFeed = React.forwardRef(
  (
    {
      windowsFeed,
      windowsFeedKeys,
      onOpenUrl,
      onCloseTabs,
      onOpenSlatesJumper,
      onSaveObjects,
      onRestoreFocus,
      onRemoveObjects,
      activeTabId,
      ...props
    },
    ref
  ) => {
    const feedItemsData = React.useMemo(() => {
      let rovingTabIndex = 0;
      let virtualizedFeed = [];
      let totalSelectableItems = 0;

      for (let key of windowsFeedKeys) {
        windowsFeed[key].forEach((tab, index) => {
          if (index === 0) {
            virtualizedFeed.push({ title: key, height: 40 });
          }
          virtualizedFeed.push({
            rovingTabIndex,
            isTabActive: activeTabId === tab.id,
            tab,
            height: Constants.sizes.jumperFeedItem,
          });

          totalSelectableItems++;
          rovingTabIndex++;
        });
      }

      return {
        feed: virtualizedFeed,
        totalSelectableItems,
        props: {
          onOpenUrl,
          onCloseTabs,
          onOpenSlatesJumper,
          onRemoveObjects,
        },
      };
    }, [
      windowsFeed,
      windowsFeedKeys,
      activeTabId,
      onOpenUrl,
      onCloseTabs,
      onRemoveObjects,
      onOpenSlatesJumper,
    ]);

    const handleOnSubmitSelectedItem = (index) => {
      let currentLength = 0;

      for (let feedKey of windowsFeedKeys) {
        const feed = windowsFeed[feedKey];
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
          totalSelectableItems={feedItemsData.totalSelectableItems}
          onSubmitSelectedItem={handleOnSubmitSelectedItem}
          onRestoreFocus={onRestoreFocus}
        >
          <WindowsFeedList
            itemCount={feedItemsData.feed.length}
            itemData={feedItemsData}
            itemSize={getFeedItemHeight}
            ref={ref}
            {...props}
          >
            {WindowsFeedRow}
          </WindowsFeedList>

          <MultiSelection.ActionsMenu
            onCloseTabs={onCloseTabs}
            onOpenSlatesJumper={onOpenSlatesJumper}
            onSaveObjects={onSaveObjects}
            onRemoveObjects={({ objects }) => {
              onRemoveObjects({ objects });

              const tabsId = objects.map(({ id }) => id);
              onCloseTabs(tabsId);
            }}
          />
        </MultiSelection.Provider>
      </RovingTabIndex.Provider>
    );
  }
);

export default WindowsFeed;
