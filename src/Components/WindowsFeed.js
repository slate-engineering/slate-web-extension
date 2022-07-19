import * as React from "react";
import * as ListView from "./ListView";
import * as RovingTabIndex from "./RovingTabIndex";

import { getFavicon } from "../Common/favicons";

const WindowsFeed = React.forwardRef(
  (
    {
      windowsFeed,
      onObjectHover,
      onOpenUrl,
      displayAllOpen,
      css,
      style,
      ...props
    },
    ref
  ) => {
    const rovingIndexRef = React.useRef();

    return (
      <RovingTabIndex.Provider ref={rovingIndexRef}>
        <RovingTabIndex.List>
          <ListView.Root
            ref={ref}
            style={{ paddingTop: "8px", ...style }}
            css={css}
            {...props}
          >
            {!displayAllOpen && windowsFeed.currentWindow.length ? (
              <ListView.Section>
                {windowsFeed.currentWindow.map((tab, i) => (
                  <ListView.RovingTabIndexObject
                    key={tab.id}
                    index={i}
                    title={tab.title}
                    url={tab.url}
                    Favicon={getFavicon(tab.rootDomain)}
                    withActions
                    isSaved={tab.isSaved}
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
            ) : null}
            {displayAllOpen && windowsFeed.allOpen.length ? (
              <ListView.Section>
                {windowsFeed.allOpen.map((tab, i) => {
                  const comboxboxItemIndex =
                    windowsFeed.currentWindow.length + i;
                  return (
                    <ListView.RovingTabIndexObject
                      key={tab.id}
                      index={comboxboxItemIndex}
                      title={tab.title}
                      url={tab.url}
                      favicon={tab.favicon}
                      Favicon={getFavicon(tab.rootDomain)}
                      withActions
                      isSaved={tab.isSaved}
                      onClick={() =>
                        onOpenUrl({
                          query: { tabId: tab.id, windowId: tab.windowId },
                        })
                      }
                      onMouseEnter={() =>
                        onObjectHover?.({ url: tab.url, title: tab.title })
                      }
                    />
                  );
                })}
              </ListView.Section>
            ) : null}
          </ListView.Root>
        </RovingTabIndex.List>
      </RovingTabIndex.Provider>
    );
  }
);

export default WindowsFeed;
