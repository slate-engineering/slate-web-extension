import * as React from "react";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";
import * as ListView from "../Components/ListView";
import * as RovingTabIndex from "./RovingTabIndex";
import * as MultiSelection from "./MultiSelection";

import { css } from "@emotion/react";
import { getFavicon } from "../Common/favicons";
import { getRootDomain } from "../Common/utilities";

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

/* -----------------------------------------------------------------------------------------------*/

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

/* -----------------------------------------------------------------------------------------------*/

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
  ({ css, containerCss, containerStyle, ...props }, ref) => {
    const { onInputChange, clearSearch, search } = useSearchContext();
    return (
      <section
        css={[STYLES_SEARCH_WRAPPER, containerCss]}
        style={containerStyle}
      >
        <input
          css={[STYLES_SEARCH_INPUT, css]}
          ref={ref}
          placeholder="Search by keywords, filters, tags"
          name="search"
          onChange={onInputChange}
          autoComplete="off"
          {...props}
        />

        {search.query.length > 0 ? <Dismiss onClick={clearSearch} /> : null}
      </section>
    );
  }
);

/* -----------------------------------------------------------------------------------------------*/

const getTitleFromView = (view) => {
  const titles = {
    currentWindow: "Current Window",
    allOpen: "All Open",
    recent: "Recent",
  };
  return titles[view];
};

const Feed = React.memo(({ onOpenUrl, onGroupURLs, ...props }) => {
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
    <RovingTabIndex.Provider key={feeds} withFocusOnHover>
      <RovingTabIndex.List>
        <ListView.Root {...props}>
          <MultiSelection.Provider
            totalSelectableItems={searchFeedLength}
            onSubmitSelectedItem={handleOnSubmitSelectedItem}
          >
            <div>
              {feeds.map(({ title: view, result: feed }, feedIndex) => (
                <>
                  <ListView.Title count={feed.length}>
                    {getTitleFromView(view)}
                  </ListView.Title>
                  {feed.map((item, i) => {
                    if (view === "currentWindow" || view === "allOpen") {
                      const tab = item.item;
                      return (
                        <ListView.RovingTabIndexWithMultiSelectObject
                          key={tab.id}
                          withActions
                          withMultiSelection
                          index={i}
                          title={tab.title}
                          url={tab.url}
                          favicon={tab.favicon}
                          Favicon={getFavicon(getRootDomain(tab.url))}
                          isSaved={tab.isSaved}
                          onClick={() =>
                            onOpenUrl({
                              query: { tabId: tab.id, windowId: tab.windowId },
                            })
                          }
                          onSubmit={() =>
                            onOpenUrl({
                              query: { tabId: tab.id, windowId: tab.windowId },
                            })
                          }
                        />
                      );
                    }

                    const visit = item;
                    return (
                      <ListView.RovingTabIndexWithMultiSelectObject
                        key={visit.url}
                        withActions
                        withMultiSelection
                        index={i + (feeds[feedIndex - 1]?.result?.length || 0)}
                        title={visit.title}
                        url={visit.url}
                        relatedVisits={visit.relatedVisits}
                        Favicon={getFavicon(visit.rootDomain)}
                        isSaved={visit.isSaved}
                        onClick={() => onOpenUrl({ urls: [visit.url] })}
                        onSubmit={() => onOpenUrl({ urls: [visit.url] })}
                      />
                    );
                  })}
                </>
              ))}
            </div>

            <MultiSelection.ActionsMenu
              onOpenURLs={(urls) => onOpenUrl({ urls })}
              onGroupURLs={(urls) => onGroupURLs({ urls, title: searchQuery })}
            />
          </MultiSelection.Provider>
        </ListView.Root>
      </RovingTabIndex.List>
    </RovingTabIndex.Provider>
  );
});

export { Provider, Input, Feed };
