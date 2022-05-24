import * as React from "react";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";
import * as ListView from "../Components/ListView";
import * as Navigation from "../Core/navigation/app/jumper";

import Logo from "../Components/Logo";

import { css } from "@emotion/react";
import { getFavicon } from "../Common/favicons";
import { ComboboxNavigation } from "Components/ComboboxNavigation";

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
  right: 24px;
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
  padding: 0px 16px;
  height: 56px;
`;

const STYLES_SEARCH_INPUT = (theme) => css`
  ${Styles.H3};

  font-family: ${theme.font.text};
  -webkit-appearance: none;
  width: 100%;
  height: 100%;
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

const Input = React.forwardRef(({ props }, ref) => {
  const { onInputChange, clearSearch, search } = useSearchContext();
  return (
    <section css={STYLES_SEARCH_WRAPPER}>
      <Logo />
      <ComboboxNavigation.Input>
        <input
          css={STYLES_SEARCH_INPUT}
          ref={ref}
          placeholder="Search by keywords, filters, tags"
          name="search"
          onChange={onInputChange}
          style={{ marginLeft: 12 }}
          autoComplete="off"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          {...props}
        />
      </ComboboxNavigation.Input>
      {search.query.length > 0 ? <Dismiss onClick={clearSearch} /> : null}
    </section>
  );
});

/* -----------------------------------------------------------------------------------------------*/

const Feed = React.memo(() => {
  const {
    search: { result: feed },
  } = useSearchContext();

  return (
    <ComboboxNavigation.Menu>
      <ListView.Root>
        <ListView.Title count={feed.length}>Result</ListView.Title>
        <div key={feed.length}>
          {feed.map((visit, i) => (
            <ListView.ComboboxObject
              key={visit.id}
              index={i}
              title={visit.title}
              Favicon={getFavicon(visit.rootDomain)}
              onClick={() => Navigation.openUrls({ urls: [visit.url] })}
              onSubmit={() => Navigation.openUrls({ urls: [visit.url] })}
            />
          ))}
        </div>
      </ListView.Root>
    </ComboboxNavigation.Menu>
  );
});

export { Provider, Input, Feed };
