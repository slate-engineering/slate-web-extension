import * as React from "react";
import * as ListView from "./ListView";

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
  sessionsFeed,
  sessionsFeedKeys,
  onLoadMore,
  onObjectHover,
  onOpenUrl,
  css,
  ...props
}) {
  const historyWrapperRef = React.useRef();
  useHistoryInfiniteScroll({
    onLoadMore,
    historyWrapperRef,
    sessionsFeed,
  });

  return (
    <ListView.Root ref={historyWrapperRef} css={css} {...props}>
      {sessionsFeedKeys.map((key) => {
        if (!sessionsFeed[key].length) return null;

        return (
          <ListView.Section key={key}>
            <ListView.Title>{key}</ListView.Title>
            {sessionsFeed[key].map((session) => {
              return session.visits.map((visit) => (
                <ListView.Object
                  key={visit.session + visit.id}
                  title={visit.title}
                  Favicon={getFavicon(visit.rootDomain)}
                  onClick={() => onOpenUrl({ urls: [visit.url] })}
                  onMouseEnter={() =>
                    onObjectHover({ url: visit.url, title: visit.title })
                  }
                />
              ));
            })}
          </ListView.Section>
        );
      })}
    </ListView.Root>
  );
}
