import * as React from "react";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";
import * as ListView from "../Components/ListView";
import * as RovingTabIndex from "./RovingTabIndex";
import * as MultiSelection from "./MultiSelection";
import * as Constants from "../Common/constants";

import { css } from "@emotion/react";
import { getFavicon } from "../Common/favicons";
import { getRootDomain, isNewTab, mergeRefs } from "../Common/utilities";

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
  ({ css, containerCss, containerStyle, ...props }, forwardedRef) => {
    const { onInputChange, clearSearch, search } = useSearchContext();

    const inputRef = React.useRef();
    const focusInput = () => inputRef.current.focus();

    React.useEffect(() => {
      const inputElement = inputRef.current;
      if (!inputElement) return;

      const rootNode = inputElement.getRootNode();
      const handleFocusWhenPressingSlash = (e) => {
        if (e.key === "/") {
          inputElement.focus();
        }
      };
      rootNode.addEventListener("keyup", handleFocusWhenPressingSlash);
      return () =>
        rootNode.removeEventListener("keyup", handleFocusWhenPressingSlash);
    }, []);

    return (
      <section
        css={[STYLES_SEARCH_WRAPPER, containerCss]}
        style={containerStyle}
      >
        <input
          css={[STYLES_SEARCH_INPUT, css]}
          ref={mergeRefs([inputRef, forwardedRef])}
          placeholder="Search by keywords, filters, tags"
          name="search"
          onChange={onInputChange}
          autoComplete="off"
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

const SearchFeedRow = ({
  index,
  data,
  onOpenUrl,
  onOpenSlatesJumper,
  style,
}) => {
  if (!data[index]) return null;

  const { rovingTabIndex, title, viewType, item } = data[index];

  const createOnOpenSlatesHandler = (object) => () => {
    onOpenSlatesJumper([
      {
        url: object.url,
        title: object.title,
        rootDomain: getRootDomain(object.url),
      },
    ]);
  };

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

/* -----------------------------------------------------------------------------------------------*/

const getTitleFromView = (view) => {
  const titles = {
    allOpen: "All Open",
    recent: "Recent",
  };
  return titles[view];
};

const Feed = React.memo(
  React.forwardRef(
    (
      { onOpenUrl, onGroupURLs, onOpenSlatesJumper, onSaveObjects, ...props },
      ref
    ) => {
      const {
        search: { result: feeds, query: searchQuery },
      } = useSearchContext();

      const searchFeedLength = React.useMemo(() => {
        let length = 0;
        for (let feed of feeds) {
          length += feed.result.length;
        }
        return length;
      }, [feeds]);

      const virtualizedFeed = React.useMemo(() => {
        let rovingTabIndex = 0;
        let virtualizedFeed = [];

        for (let feed of feeds) {
          const { title: view, result } = feed;
          result.forEach((item, index) => {
            if (index === 0) {
              virtualizedFeed.push({ title: getTitleFromView(view) });
            }

            virtualizedFeed.push({
              rovingTabIndex,
              viewType: view,
              item,
            });

            rovingTabIndex++;
          });
        }

        return virtualizedFeed;
      }, [feeds]);

      const handleOnSubmitSelectedItem = (index) => {
        let currentLength = 0;

        for (let feed of feeds) {
          const { result } = feed;
          const nextLength = currentLength + result.length;
          if (index < nextLength) {
            return result[index - currentLength];
          }
          currentLength = nextLength;
        }
      };

      return (
        <RovingTabIndex.Provider
          key={feeds}
          ref={(node) => (ref.rovingTabIndexRef = node)}
          isInfiniteList
          withFocusOnHover
        >
          <MultiSelection.Provider
            totalSelectableItems={searchFeedLength}
            onSubmitSelectedItem={handleOnSubmitSelectedItem}
          >
            <SearchFeedList
              itemCount={virtualizedFeed.length}
              itemData={virtualizedFeed}
              itemSize={Constants.sizes.jumperFeedItem}
              css={css}
              {...props}
            >
              {(props) =>
                SearchFeedRow({ ...props, onOpenUrl, onOpenSlatesJumper })
              }
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
