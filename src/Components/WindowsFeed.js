import * as React from "react";
import * as ListView from "./ListView";
import * as RovingTabIndex from "./RovingTabIndex";
import * as MultiSelection from "./MultiSelection";

import { getFavicon } from "../Common/favicons";

const WindowsFeed = React.forwardRef(
  (
    {
      windowsFeed,
      activeTabId,
      onObjectHover,
      onOpenUrl,
      onCloseTab,
      css,
      style,
      ...props
    },
    ref
  ) => {
    const rovingIndexRef = React.useRef();

    return (
      <RovingTabIndex.Provider
        key={windowsFeed}
        ref={rovingIndexRef}
        withFocusOnHover
      >
        <RovingTabIndex.List>
          <ListView.Root
            ref={ref}
            style={{ paddingTop: "8px", ...style }}
            css={css}
            {...props}
          >
            <MultiSelection.Provider totalSelectableItems={windowsFeed.length}>
              <ListView.Section>
                {windowsFeed.map((tab, i) => (
                  <ListView.RovingTabIndexWithMultiSelectObject
                    key={tab.id}
                    isTab
                    withActions
                    withMultiSelection
                    isActiveTab={tab.id === activeTabId}
                    index={i}
                    title={tab.title}
                    url={tab.url}
                    Favicon={getFavicon(tab.rootDomain)}
                    isSaved={tab.isSaved}
                    onCloseTab={() => onCloseTab(tab.id)}
                    onClick={() =>
                      onOpenUrl({
                        query: { tabId: tab.id, windowId: tab.windowId },
                      })
                    }
                    onMouseEnter={() =>
                      onObjectHover?.({ url: tab.url, title: tab.title })
                    }
                  />
                ))}
              </ListView.Section>
            </MultiSelection.Provider>
          </ListView.Root>
        </RovingTabIndex.List>
      </RovingTabIndex.Provider>
    );
  }
);

export default WindowsFeed;
