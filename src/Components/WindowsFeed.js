import * as React from "react";
import * as ListView from "./ListView";

import { getFavicon } from "../Common/favicons";
import { ComboboxNavigation } from "./ComboboxNavigation";

export default function WindowsFeed({
  windowsFeed,
  onObjectHover,
  onOpenUrl,
  displayAllOpen,
  css,
  style,
  ...props
}) {
  return (
    <ComboboxNavigation.Menu>
      <ListView.Root
        style={{ paddingTop: "8px", ...style }}
        css={css}
        {...props}
      >
        {!displayAllOpen && windowsFeed.currentWindow.length ? (
          <ListView.Section>
            {windowsFeed.currentWindow.map((tab, i) => (
              <ListView.ComboboxObject
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
                onSelect={() =>
                  onObjectHover?.({ url: tab.url, title: tab.title })
                }
                onSubmit={() =>
                  onOpenUrl({
                    query: { tabId: tab.id, windowId: tab.windowId },
                  })
                }
              />
            ))}
          </ListView.Section>
        ) : null}
        {displayAllOpen && windowsFeed.allOpen.length ? (
          <ListView.Section>
            {windowsFeed.allOpen.map((tab, i) => {
              const comboxboxItemIndex = windowsFeed.currentWindow.length + i;
              return (
                <ListView.ComboboxObject
                  key={tab.id}
                  index={comboxboxItemIndex}
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
                  onSelect={() =>
                    onObjectHover?.({ url: tab.url, title: tab.title })
                  }
                  onSubmit={() =>
                    onOpenUrl({
                      query: { tabId: tab.id, windowId: tab.windowId },
                    })
                  }
                />
              );
            })}
          </ListView.Section>
        ) : null}
      </ListView.Root>
    </ComboboxNavigation.Menu>
  );
}
