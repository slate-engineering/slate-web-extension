import * as React from "react";
import * as ListView from "./ListView";

import { getFavicon } from "../Common/favicons";

export default function WindowsFeed({
  windowsFeed,
  onObjectHover,
  onOpenUrl,
  displayAllOpen,
  css,
  ...props
}) {
  return (
    <ListView.Root css={css} {...props}>
      {windowsFeed.currentWindow.length ? (
        <ListView.Section>
          {windowsFeed.currentWindow.map((tab) => (
            <ListView.Object
              key={tab.id}
              title={tab.title}
              Favicon={getFavicon(tab.rootDomain)}
              onClick={() =>
                onOpenUrl({
                  query: { tabId: tab.id, windowId: tab.windowId },
                })
              }
              onMouseEnter={() =>
                onObjectHover({ url: tab.url, title: tab.title })
              }
            />
          ))}
        </ListView.Section>
      ) : null}
      {displayAllOpen && windowsFeed.allOpen.length ? (
        <ListView.Section>
          {windowsFeed.allOpen.map((tab) => (
            <ListView.Object
              key={tab.id}
              title={tab.title}
              Favicon={getFavicon(tab.rootDomain)}
              onClick={() =>
                onOpenUrl({
                  query: { tabId: tab.id, windowId: tab.windowId },
                })
              }
              onMouseEnter={() =>
                onObjectHover({ url: tab.url, title: tab.title })
              }
            />
          ))}
        </ListView.Section>
      ) : null}
    </ListView.Root>
  );
}
