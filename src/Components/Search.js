import * as React from "react";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";
import * as ListView from "../Components/ListView";
import * as Navigation from "../Core/navigation/app/jumper";

import { css } from "@emotion/react";
import { getFavicon } from "../Common/favicons";
import { ComboboxNavigation } from "Components/ComboboxNavigation";
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
  top: 50%;
  transform: translateY(-50%);
  height: 54px;
  right: 0px;
  padding-right: 16px;
  display: block;
  color: ${theme.semantic.textGray};
`;

function Dismiss({ css, ...props }) {
  return (
    <button css={[STYLES_DISMISS_BUTTON, css]} {...props}>
      <SVG.Dismiss
        style={{ display: "block", marginLeft: 12 }}
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
        <ComboboxNavigation.Input>
          <input
            css={[STYLES_SEARCH_INPUT, css]}
            ref={ref}
            placeholder="Search by keywords, filters, tags"
            name="search"
            onChange={onInputChange}
            autoComplete="off"
            {...props}
          />
        </ComboboxNavigation.Input>
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

const Feed = React.memo(({ onOpenUrl, ...props }) => {
  const {
    search: { result: feeds },
  } = useSearchContext();
  return (
    <ComboboxNavigation.Menu>
      <ListView.Root {...props}>
        <div key={feeds}>
          {feeds.map(({ title: view, result: feed }, feedIndex) => (
            <>
              <ListView.Title count={feed.length}>
                {getTitleFromView(view)}
              </ListView.Title>
              {feed.map((item, i) => {
                if (view === "currentWindow" || view === "allOpen") {
                  const tab = item.item;
                  return (
                    <ListView.ComboboxObject
                      key={tab.id}
                      index={i}
                      title={tab.title}
                      url={tab.url}
                      Favicon={getFavicon(getRootDomain(tab.url))}
                      withActions
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
                  <ListView.ComboboxObject
                    key={visit.url}
                    index={i + (feeds[feedIndex - 1]?.result?.length || 0)}
                    title={visit.title}
                    url={visit.url}
                    relatedVisits={visit.relatedVisits}
                    Favicon={getFavicon(visit.rootDomain)}
                    withActions
                    isSaved={visit.isSaved}
                    onClick={() => Navigation.openUrls({ urls: [visit.url] })}
                    onSubmit={() => Navigation.openUrls({ urls: [visit.url] })}
                  />
                );
              })}
            </>
          ))}
        </div>
      </ListView.Root>
    </ComboboxNavigation.Menu>
  );
});

export { Provider, Input, Feed };
