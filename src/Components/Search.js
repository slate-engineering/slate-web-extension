import * as React from "react";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";
import * as ListView from "../Components/ListView";
import * as RovingTabIndex from "./RovingTabIndex";
import * as MultiSelection from "./MultiSelection";
import * as Constants from "../Common/constants";

import { css } from "@emotion/react";
import { getFavicon } from "../Common/favicons";
import {
  getRootDomain,
  isNewTab,
  mergeRefs,
  mergeEvents,
} from "../Common/utilities";

/* -------------------------------------------------------------------------------------------------
 * Search Provider
 * -----------------------------------------------------------------------------------------------*/

const SearchContext = React.createContext();
const useSearchContext = () => React.useContext(SearchContext);

function Provider({ onInputChange, clearSearch, search, feed, children }) {
  const value = React.useMemo(
    () => ({
      onInputChange,
      clearSearch,
      search,
      feed,
    }),
    [onInputChange, clearSearch, search, feed]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Search Dismiss
 * -----------------------------------------------------------------------------------------------*/

const DISMISS_BUTTON_WIDTH = 16;
const STYLES_DISMISS_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  height: 32px;
  width: 32px;
  padding: 8px;
  border-radius: 8px;
  color: ${theme.semantic.textGray};

  &:hover {
    background-color: ${theme.semantic.bgGrayLight};
    color: ${theme.semantic.textBlack};
  }

  &:focus {
    background-color: ${theme.semantic.bgGrayLight};
    color: ${theme.semantic.textBlack};
  }
`;

function Dismiss({ css, ...props }) {
  return (
    <button css={[STYLES_DISMISS_BUTTON, css]} {...props}>
      <SVG.Dismiss
        style={{ display: "block" }}
        height={DISMISS_BUTTON_WIDTH}
        width={DISMISS_BUTTON_WIDTH}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Search Input
 * -----------------------------------------------------------------------------------------------*/

const STYLES_SEARCH_WRAPPER = css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  position: relative;
  width: 100%;
`;

const STYLES_SEARCH_INPUT = (theme) => css`
  ${Styles.H3};

  font-family: ${theme.font.text};
  -webkit-appearance: none;
  width: 100%;
  height: 56px;
  padding-right: ${DISMISS_BUTTON_WIDTH + 24}px;
  background-color: transparent;
  outline: 0;
  border: none;
  box-sizing: border-box;
  color: ${theme.semantic.textBlack};

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${theme.semantic.textGrayLight};
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${theme.semantic.textGrayLight};
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${theme.semantic.textGrayLight};
  }
`;

const Input = React.forwardRef(
  (
    { css, containerCss, containerStyle, onKeyDown, onKeyUp, ...props },
    forwardedRef
  ) => {
    const { onInputChange, clearSearch, search } = useSearchContext();

    const inputRef = React.useRef();
    const focusInput = () => inputRef.current.focus();

    React.useEffect(() => {
      const inputElement = inputRef.current;
      if (!inputElement) return;

      const rootNode = inputElement.getRootNode();
      const handleFocusWhenSlashUp = (e) => {
        if (e.key === "/") {
          e.stopPropagation();
          inputElement.focus();
        }
      };
      const handleFocusWhenSlashDown = (e) => {
        if (e.key === "/") {
          e.stopPropagation();
        }
      };
      rootNode.addEventListener("keyup", handleFocusWhenSlashUp);
      rootNode.addEventListener("keydown", handleFocusWhenSlashDown);
      return () => {
        rootNode.removeEventListener("keyup", handleFocusWhenSlashUp);
        rootNode.addEventListener("keydown", handleFocusWhenSlashDown);
      };
    }, []);

    // NOTE(amine): to prevent conflicts with global hotkeys
    const preventPropagation = (e) => {
      if (e.keyCode > 46 && !(e.shiftKey || e.altKey)) {
        e.stopPropagation();
      }
    };

    return (
      <section
        css={[STYLES_SEARCH_WRAPPER, containerCss]}
        style={containerStyle}
      >
        <input
          css={[STYLES_SEARCH_INPUT, css]}
          ref={mergeRefs([inputRef, forwardedRef])}
          placeholder="Search by keywords, #tags"
          name="search"
          onChange={onInputChange}
          autoComplete="off"
          onKeyDown={mergeEvents(preventPropagation, onKeyDown)}
          onKeyUp={mergeEvents(preventPropagation, onKeyUp)}
          {...props}
        />

        {search.query.length > 0 ? (
          <Dismiss onClick={() => (focusInput(), clearSearch())} />
        ) : null}
      </section>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * Search Feed
 * -----------------------------------------------------------------------------------------------*/

const STYLES_SEARCH_FEED_ROW = {
  width: "calc(100% - 16px)",
  left: "8px",
};

const SearchFeedRow = ({ index, data, style }) => {
  if (!data.feed[index]) return null;

  const { rovingTabIndex, title, slates, viewType, item } = data.feed[index];
  const { onOpenUrl, onOpenSlatesJumper } = data.props;

  const createOnOpenSlatesHandler = (object) => () => {
    onOpenSlatesJumper([
      {
        url: object.url,
        title: object.title,
        rootDomain: getRootDomain(object.url),
      },
    ]);
  };

  if (slates) {
    return (
      <ListView.SlatesItem
        slates={slates}
        style={{ ...style, ...STYLES_SEARCH_FEED_ROW }}
      />
    );
  }

  if (title) {
    return (
      <ListView.Title style={{ ...style, ...STYLES_SEARCH_FEED_ROW }}>
        {title}
      </ListView.Title>
    );
  }

  if (viewType === "allOpen") {
    return (
      <ListView.RovingTabIndexWithMultiSelectObject
        key={item.id}
        withActions
        withMultiSelection
        style={{ ...style, ...STYLES_SEARCH_FEED_ROW }}
        index={rovingTabIndex}
        title={item.title}
        url={item.url}
        favicon={item.favicon}
        Favicon={getFavicon(getRootDomain(item.url))}
        isSaved={item.isSaved}
        onClick={() =>
          onOpenUrl({
            query: { tabId: item.id, windowId: item.windowId },
          })
        }
        onSubmit={() =>
          onOpenUrl({
            query: { tabId: item.id, windowId: item.windowId },
          })
        }
        onOpenSlatesJumper={createOnOpenSlatesHandler(item)}
      />
    );
  }

  return (
    <ListView.RovingTabIndexWithMultiSelectObject
      key={item.url}
      withActions
      withMultiSelection
      style={{ ...style, ...STYLES_SEARCH_FEED_ROW }}
      index={rovingTabIndex}
      title={item.title}
      url={item.url}
      relatedVisits={item.relatedVisits}
      Favicon={getFavicon(item.rootDomain)}
      isSaved={item.isSaved}
      onClick={() => onOpenUrl({ urls: [item.url] })}
      onSubmit={() => onOpenUrl({ urls: [item.url] })}
      onOpenSlatesJumper={createOnOpenSlatesHandler(item)}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

const SearchFeedList = React.forwardRef(
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

const Feed = React.memo(
  React.forwardRef(
    (
      {
        onOpenUrl,
        onGroupURLs,
        onOpenSlatesJumper,
        onSaveObjects,
        searchFeed,
        searchFeedKeys,
        slates,
        ...props
      },
      ref
    ) => {
      const {
        search: { query: searchQuery },
      } = useSearchContext();

      const searchFeedLength = React.useMemo(() => {
        let length = 0;
        searchFeedKeys.forEach((key) => {
          length += searchFeed[key].length;
        });
        return length;
      }, [searchFeed, searchFeedKeys]);

      const feedItemsData = React.useMemo(() => {
        let rovingTabIndex = 0;
        let virtualizedFeed = [];

        if (slates?.length) {
          virtualizedFeed.push({
            slates,
            height: Constants.sizes.jumperFeedItem,
          });
        }

        for (let key of searchFeedKeys) {
          searchFeed[key].forEach((item, index) => {
            if (index === 0) {
              virtualizedFeed.push({ title: key, height: 40 });
            }

            virtualizedFeed.push({
              rovingTabIndex,
              item,
              height: Constants.sizes.jumperFeedItem,
            });

            rovingTabIndex++;
          });
        }

        return {
          feed: virtualizedFeed,
          props: { onOpenUrl, onOpenSlatesJumper },
        };
      }, [slates, searchFeed, searchFeedKeys, onOpenUrl, onOpenSlatesJumper]);

      const handleOnSubmitSelectedItem = (index) => {
        let currentLength = 0;

        for (let feedKey of searchFeedKeys) {
          const feed = searchFeed[feedKey];
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
          key={searchFeed}
          ref={(node) => (ref.rovingTabIndexRef = node)}
          isInfiniteList
          withFocusOnHover
        >
          <MultiSelection.Provider
            totalSelectableItems={searchFeedLength}
            onSubmitSelectedItem={handleOnSubmitSelectedItem}
          >
            <SearchFeedList
              itemCount={feedItemsData.feed.length}
              itemData={feedItemsData}
              itemSize={getFeedItemHeight}
              css={css}
              {...props}
            >
              {SearchFeedRow}
            </SearchFeedList>
            <MultiSelection.ActionsMenu
              onOpenURLs={(urls) => onOpenUrl({ urls })}
              onGroupURLs={(urls) => onGroupURLs({ urls, title: searchQuery })}
              onSaveObjects={onSaveObjects}
              onOpenSlatesJumper={onOpenSlatesJumper}
            />
          </MultiSelection.Provider>
        </RovingTabIndex.Provider>
      );
    }
  )
);

export { Provider, Input, Feed };
