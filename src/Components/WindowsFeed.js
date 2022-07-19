import * as React from "react";
import * as ListView from "./ListView";
import * as RovingTabIndex from "./RovingTabIndex";

import { getFavicon } from "../Common/favicons";

const WindowsFeed = React.forwardRef(
  (
    {
      windowsFeed,
      activeTabId,
      onObjectHover,
      onOpenUrl,
      onCloseTab,
      displayAllOpen,
      css,
      style,
      ...props
    },
    ref
  ) => {
    const rovingIndexRef = React.useRef();

    return (
      <RovingTabIndex.Provider key={displayAllOpen} ref={rovingIndexRef}>
        <RovingTabIndex.List>
          <ListView.Root
            ref={ref}
            style={{ paddingTop: "8px", ...style }}
            css={css}
            {...props}
          >
            <ListView.Section>
              {windowsFeed.map((tab, i) => (
                <ListView.RovingTabIndexObject
                  key={tab.id}
                  isTab
                  isActiveTab={tab.id === activeTabId}
                  index={i}
                  title={tab.title}
                  url={tab.url}
                  Favicon={getFavicon(tab.rootDomain)}
                  withActions
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
          </ListView.Root>
        </RovingTabIndex.List>
      </RovingTabIndex.Provider>
    );
  }
);

export default WindowsFeed;
