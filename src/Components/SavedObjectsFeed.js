import * as React from "react";
import * as MultiSelection from "./MultiSelection";
import * as Styles from "~/common/styles";
import * as ListView from "~/components/ListView";
import * as RovingTabIndex from "~/components/RovingTabIndex";
import * as Constants from "~/common/constants";
import * as Typography from "~/components/system/Typography";
import * as SVG from "~/common/SVG";

import { css } from "@emotion/react";
import { getRootDomain, isNewTab } from "~/common/utilities";
import { useViewsContext } from "~/components/Views";
import { Divider } from "~/components/Divider";
import { SavingKeyboardShortcut } from "~/components/SavingKeyboardShortcut";

import ObjectPreview from "~/components/ObjectPreview";

const STYLES_SAVED_OBJECTS_FEED = (theme) => css`
  ${Styles.OBJECTS_PREVIEW_GRID(theme)};
  padding: 40px 0px;
`;

/* -------------------------------------------------------------------------------------------------
 * FeedListView
 * -----------------------------------------------------------------------------------------------*/

const STYLES_FEED_LIST_VIEW_ROW = {
  width: "100%",
};

const FeedListViewRow = React.memo(({ index, data, style }) => {
  if (!data.feed[index]) return null;

  const { rovingTabIndex, title, object } = data.feed[index];
  const { onOpenUrl, onOpenSlatesJumper } = data.props;

  if (title) {
    return (
      <ListView.Title style={{ ...style, ...STYLES_FEED_LIST_VIEW_ROW }}>
        {title}
      </ListView.Title>
    );
  }

  return (
    <ListView.RovingTabIndexWithMultiSelectObject
      key={object.url}
      withActions
      withMultiSelection
      style={{ ...style, ...STYLES_FEED_LIST_VIEW_ROW }}
      index={rovingTabIndex}
      title={object.title}
      url={object.url}
      favicon={object.favicon}
      rootDomain={object.rootDomain}
      relatedVisits={object.relatedVisits}
      onClick={() => onOpenUrl({ urls: [object.url] })}
      onOpenSlatesJumper={() =>
        onOpenSlatesJumper([
          {
            title: object.title,
            url: object.url,
            rootDomain: getRootDomain(object.url),
          },
        ])
      }
    />
  );
});

/* -----------------------------------------------------------------------------------------------*/

const FeedListViewContainer = React.forwardRef(
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

/* -----------------------------------------------------------------------------------------------*/

const FeedListView = React.forwardRef(
  (
    {
      feed,
      feedKeys,
      onOpenUrl,
      onOpenSlatesJumper,
      onGroupURLs,
      onRestoreFocus,
      ...props
    },
    ref
  ) => {
    const { appliedView } = useViewsContext();

    const feedItemsData = React.useMemo(() => {
      let rovingTabIndex = 0;
      let virtualizedFeed = [];
      let totalSelectableItems = 0;

      for (let key of feedKeys) {
        feed[key].forEach((object, index) => {
          if (index === 0) {
            virtualizedFeed.push({ title: key, height: 40 });
          }
          virtualizedFeed.push({
            rovingTabIndex,
            object,
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
          onOpenSlatesJumper,
        },
      };
    }, [feed, feedKeys, onOpenUrl, onOpenSlatesJumper]);

    const handleOnSubmitSelectedItem = (index) => {
      let currentLength = 0;

      for (let feedKey of feedKeys) {
        const objects = feed[feedKey];
        const nextLength = currentLength + objects.length;
        if (index < nextLength) {
          return objects[index - currentLength];
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
          <FeedListViewContainer
            itemCount={feedItemsData.feed.length}
            itemData={feedItemsData}
            itemSize={getFeedItemHeight}
            ref={ref}
            {...props}
          >
            {FeedListViewRow}
          </FeedListViewContainer>

          <MultiSelection.ActionsMenu
            onOpenSlatesJumper={onOpenSlatesJumper}
            onOpenURLs={(urls) => onOpenUrl({ urls })}
            onGroupURLs={(urls) =>
              onGroupURLs({ urls, title: appliedView.name })
            }
          />
        </MultiSelection.Provider>
      </RovingTabIndex.Provider>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * FeedGridView
 * -----------------------------------------------------------------------------------------------*/

const FeedGridView = (
  {
    onOpenUrl,
    onOpenSlatesJumper,
    onGroupURLs,
    onRestoreFocus,
    feed,
    ...props
  },
  ref
) => {
  const handleOnSubmitSelectedItem = (index) => feed[index];

  return (
    <MultiSelection.Provider
      totalSelectableItems={feed.length}
      onSubmitSelectedItem={handleOnSubmitSelectedItem}
      onRestoreFocus={onRestoreFocus}
    >
      <section ref={ref} css={[css, STYLES_SAVED_OBJECTS_FEED]} {...props}>
        {feed.map((object) => (
          <ObjectPreview
            key={object.cid}
            onOpenUrl={onOpenUrl}
            onOpenSlatesJumper={onOpenSlatesJumper}
            file={object}
          />
        ))}
      </section>
      <MultiSelection.ActionsMenu
        onOpenURLs={(urls) => onOpenUrl({ urls })}
        onGroupURLs={(urls) => onGroupURLs({ urls, title: "Saved" })}
        onOpenSlatesJumper={onOpenSlatesJumper}
      />
    </MultiSelection.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * SavedObjectsFeed
 * -----------------------------------------------------------------------------------------------*/
const STYLES_OPEN_SLATE_WEB_APP_LINK = (theme) => css`
  color: ${theme.system.blue};
  text-decoration: none;
`;

function OpenSlateWebAppLink(props) {
  return (
    <Typography.H4
      as="a"
      css={STYLES_OPEN_SLATE_WEB_APP_LINK}
      href={Constants.uri.hostname}
      rel="noreferrer"
      target="_blank"
      {...props}
    >
      Slate web app
      <SVG.ArrowUpRight
        style={{ display: "inline", position: "relative", top: "2px" }}
      />
    </Typography.H4>
  );
}

function ViewsSavedEmptyState() {
  return (
    <section css={Styles.VERTICAL_CONTAINER_CENTERED} style={{ width: "100%" }}>
      <Typography.H4 as="p" color="textBlack" style={{ marginTop: 80 }}>
        You don’t have anything saved to Slate yet.{" "}
      </Typography.H4>
      <Divider style={{ marginTop: 24, marginBottom: 24 }} width={80} />
      <Typography.H4 as="p" color="textBlack">
        Start saving links to Slate with
      </Typography.H4>
      <SavingKeyboardShortcut style={{ marginTop: 8 }} />
      <div css={Styles.HORIZONTAL_CONTAINER_CENTERED} style={{ marginTop: 24 }}>
        <Typography.H4
          as="p"
          color="textBlack"
          href={Constants.uri.hostname}
          target="_blank"
        >
          or uploading files with
        </Typography.H4>
        <OpenSlateWebAppLink style={{ marginLeft: 4 }} />
      </div>
    </section>
  );
}

function ViewsFilesEmptyState() {
  return (
    <section css={Styles.VERTICAL_CONTAINER_CENTERED} style={{ width: "100%" }}>
      <Typography.H4 as="p" color="textBlack" style={{ marginTop: 80 }}>
        You don’t have any file uploaded to Slate yet.
      </Typography.H4>
      <Divider style={{ marginTop: 24, marginBottom: 24 }} width={80} />
      <div css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
        <Typography.H4 as="p" color="textBlack">
          Start uploading files with
        </Typography.H4>
        <OpenSlateWebAppLink style={{ marginLeft: 4 }} />
      </div>
    </section>
  );
}

const SavedObjectsFeed = React.memo(
  React.forwardRef(
    (
      {
        onOpenUrl,
        onOpenSlatesJumper,
        onGroupURLs,
        onRestoreFocus,
        feed,
        feedKeys,
        ...props
      },
      ref
    ) => {
      const { appliedView, viewsType } = useViewsContext();

      if (feed.length === 0) {
        if (appliedView.type === viewsType.saved) {
          return <ViewsSavedEmptyState />;
        } else {
          return <ViewsFilesEmptyState />;
        }
      }

      return (
        <FeedListView
          feed={feed}
          feedKeys={feedKeys}
          onOpenUrl={onOpenUrl}
          onOpenSlatesJumper={onOpenSlatesJumper}
          onGroupURLs={onGroupURLs}
          onRestoreFocus={onRestoreFocus}
          ref={ref}
          {...props}
        />
      );
    }
  )
);

export { SavedObjectsFeed };
