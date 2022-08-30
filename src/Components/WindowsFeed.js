import * as React from "react";
import * as ListView from "./ListView";
import * as RovingTabIndex from "./RovingTabIndex";
import * as MultiSelection from "./MultiSelection";
import * as Constants from "../Common/constants";

import { getFavicon } from "../Common/favicons";
import { getRootDomain, isNewTab } from "../Common/utilities";

/* -----------------------------------------------------------------------------------------------*/

const STYLES_WINDOWS_FEED_ROW = {
  width: "100%",
};

const WindowsFeedRow = ({
  index,
  data,
  onOpenUrl,
  onCloseTabs,
  onObjectHover,
  onOpenSlatesJumper,
  style,
}) => {
  if (!data[index]) return null;

  const { rovingTabIndex, title, tab, isTabActive } = data[index];

  if (title) {
    return (
      <ListView.Title style={{ ...style, ...STYLES_WINDOWS_FEED_ROW }}>
        {title}
      </ListView.Title>
    );
  }

  return (
    <div style={{ ...style, ...STYLES_WINDOWS_FEED_ROW }}>
      <ListView.RovingTabIndexWithMultiSelectObject
        key={tab.id}
        isTab
        isTabActive={isTabActive}
        withActions
        withMultiSelection
        index={rovingTabIndex}
        title={tab.title}
        url={tab.url}
        Favicon={getFavicon(tab.rootDomain)}
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
        onMouseEnter={() => onObjectHover?.({ url: tab.url, title: tab.title })}
      />
    </div>
  );
};

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
        <ListView.FixedSizeListRoot
          height={listHeight}
          ref={forwardedRef}
          {...props}
        >
          {children}
        </ListView.FixedSizeListRoot>
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
      onObjectHover,
      onOpenUrl,
      onCloseTabs,
      onOpenSlatesJumper,
      onSaveObjects,
      activeTabId,
      ...props
    },
    ref
  ) => {
    const virtualizedFeed = React.useMemo(() => {
      let rovingTabIndex = 0;
      let virtualizedFeed = [];

      for (let key of windowsFeedKeys) {
        windowsFeed[key].forEach((tab, index) => {
          if (index === 0) {
            virtualizedFeed.push({ title: key });
          }

          virtualizedFeed.push({
            rovingTabIndex,
            isTabActive: activeTabId === tab.id,
            tab,
          });

          rovingTabIndex++;
        });
      }

      return virtualizedFeed;
    }, [windowsFeed, windowsFeedKeys, activeTabId]);

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

    return (
      <RovingTabIndex.Provider
        key={windowsFeed}
        ref={(node) => (ref.rovingTabIndexRef = node)}
        isInfiniteList
        withFocusOnHover
      >
        <RovingTabIndex.List>
          <MultiSelection.Provider
            totalSelectableItems={windowsFeed.length}
            onSubmitSelectedItem={handleOnSubmitSelectedItem}
          >
            <WindowsFeedList
              itemCount={virtualizedFeed.length}
              itemData={virtualizedFeed}
              itemSize={Constants.sizes.jumperFeedItem}
              ref={ref}
              {...props}
            >
              {(props) =>
                WindowsFeedRow({
                  ...props,
                  onCloseTabs,
                  onObjectHover,
                  onOpenSlatesJumper,
                  onOpenUrl,
                })
              }
            </WindowsFeedList>

            <MultiSelection.ActionsMenu
              onCloseTabs={onCloseTabs}
              onOpenSlatesJumper={onOpenSlatesJumper}
              onSaveObjects={onSaveObjects}
            />
          </MultiSelection.Provider>
        </RovingTabIndex.List>
      </RovingTabIndex.Provider>
    );
  }
);

export default WindowsFeed;
