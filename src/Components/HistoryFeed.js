import * as React from "react";
import * as ListView from "./ListView";
import * as Navigation from "../Core/navigation/app";

import { Divider } from "./Divider";
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

export default function HistoryFeed({
  windowsFeed,
  sessionsFeed,
  sessionsFeedKeys,
  onLoadMore,
  onObjectHover,
  css,
  ...props
}) {
  const isSessionOpenInTheBrowser = (session) => {
    if (session.visits.length !== 1) return false;

    for (let tab of windowsFeed.thisWindow) {
      if (tab.url === session.visits[0].url) {
        return true;
      }
    }
    for (let tab of windowsFeed.currentlyOpen) {
      if (tab.url === session.visits[0].url) {
        return true;
      }
    }
    return false;
  };

  const historyWrapperRef = React.useRef();
  useHistoryInfiniteScroll({
    onLoadMore,
    historyWrapperRef,
    sessionsFeed,
  });

  return (
    <ListView.Root ref={historyWrapperRef} css={css} {...props}>
      {windowsFeed.thisWindow.length || windowsFeed.currentlyOpen.length ? (
        <>
          {windowsFeed.thisWindow.length ? (
            <ListView.Section>
              <ListView.Title count={windowsFeed.thisWindow.length}>
                This Window
              </ListView.Title>
              {windowsFeed.thisWindow.map((tab) => (
                <ListView.Object
                  key={tab.id}
                  title={tab.title}
                  Favicon={getFavicon(tab.rootDomain)}
                  onClick={() =>
                    Navigation.openUrls({
                      query: { tabId: tab.id, windowId: tab.windowId },
                    })
                  }
                  onMouseEnter={onObjectHover}
                />
              ))}
            </ListView.Section>
          ) : null}

          {windowsFeed.currentlyOpen.length ? (
            <ListView.Section>
              <ListView.Title count={windowsFeed.currentlyOpen.length}>
                Currently Open
              </ListView.Title>
              {windowsFeed.currentlyOpen.map((tab) => (
                <ListView.Object
                  key={tab.id}
                  title={tab.title}
                  Favicon={getFavicon(tab.rootDomain)}
                  onClick={() =>
                    Navigation.openUrls({
                      query: { tabId: tab.id, windowId: tab.windowId },
                    })
                  }
                  onMouseEnter={onObjectHover}
                />
              ))}
            </ListView.Section>
          ) : null}
          <Divider color="borderGrayLight" style={{ margin: "4px 12px" }} />
        </>
      ) : null}
      {sessionsFeedKeys.map((key) => {
        if (!sessionsFeed[key].length) return null;

        return (
          <ListView.Section key={key}>
            <ListView.Title>{key}</ListView.Title>
            {sessionsFeed[key].map((session) => {
              if (key === "Today" && isSessionOpenInTheBrowser(session))
                return null;

              return session.visits.map((visit) => (
                <ListView.Object
                  key={visit.session + visit.id}
                  title={visit.title}
                  Favicon={getFavicon(visit.rootDomain)}
                  onClick={() => Navigation.openUrls({ urls: [visit.url] })}
                  onMouseEnter={onObjectHover}
                />
              ));
            })}
          </ListView.Section>
        );
      })}
    </ListView.Root>
  );
}
