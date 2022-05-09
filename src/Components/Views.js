import * as React from "react";
import * as Typography from "../Components/system/Typography";
import * as Styles from "../Common/styles";
import * as ListView from "../Components/ListView";
import * as SVG from "../Common/SVG";

import { css } from "@emotion/react";
import { getFavicon } from "../Common/favicons";

const ViewsContext = React.createContext();
const useViewsContext = () => React.useContext(ViewsContext);

function Provider({
  children,
  viewsFeed,
  currentView,
  viewQuery,
  viewsType,
  getViewsFeed,
}) {
  const value = React.useMemo(
    () => ({ viewsFeed, currentView, viewQuery, viewsType, getViewsFeed }),
    [viewsFeed, currentView, viewQuery, viewsType, getViewsFeed]
  );

  return (
    <ViewsContext.Provider value={value}>{children}</ViewsContext.Provider>
  );
}

const STYLES_VIEWS_BUTTON_ACTIVE = (theme) => css`
  background-color: ${theme.semantic.bgGrayLight};
  color: ${theme.semantic.textBlack};
`;

const STYLES_VIEWS_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  border-radius: 12px;
  padding: 5px 12px 7px;
  color: ${theme.semantic.textGray};

  &:hover {
    ${STYLES_VIEWS_BUTTON_ACTIVE(theme)}
  }
`;

const STYLES_VIEWS_MENU = css`
  ${Styles.HORIZONTAL_CONTAINER};
  width: 100%;
  height: 56px;
  padding: 12px 24px;
`;

const STYLES_VIEWS_ADD_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  margin-left: auto;
  border-radius: 8px;
  padding: 8px;
  height: 32px;
  width: 32px;

  &:hover {
    ${STYLES_VIEWS_BUTTON_ACTIVE(theme)}
  }
`;

function Menu({ css, ...props }) {
  const { currentView, viewQuery, viewsType, getViewsFeed } = useViewsContext();

  return (
    <section css={[STYLES_VIEWS_MENU, css]} {...props}>
      <Typography.H5
        css={[
          STYLES_VIEWS_BUTTON,
          currentView === viewsType.recent && STYLES_VIEWS_BUTTON_ACTIVE,
        ]}
        as="button"
        onClick={() => getViewsFeed({ type: viewsType.recent })}
      >
        Recent
      </Typography.H5>

      <Typography.H5
        css={[
          STYLES_VIEWS_BUTTON,
          currentView === viewsType.relatedLinks &&
            viewQuery === "https://twitter.com/" &&
            STYLES_VIEWS_BUTTON_ACTIVE,
        ]}
        as="button"
        style={{ marginLeft: 12 }}
        onClick={() => {
          console.log("TESTS");
          getViewsFeed({
            type: viewsType.relatedLinks,
            query: "https://twitter.com/",
          });
        }}
      >
        Twitter
      </Typography.H5>

      <Typography.H5
        css={[
          STYLES_VIEWS_BUTTON,
          currentView === viewsType.relatedLinks &&
            viewQuery === "https://www.youtube.com/" &&
            STYLES_VIEWS_BUTTON_ACTIVE,
        ]}
        as="button"
        style={{ marginLeft: 12 }}
        onClick={() =>
          getViewsFeed({
            type: viewsType.relatedLinks,
            query: "https://www.youtube.com/",
          })
        }
      >
        Youtube
      </Typography.H5>

      <Typography.H5
        css={[
          STYLES_VIEWS_BUTTON,
          currentView === viewsType.relatedLinks &&
            viewQuery === "https://news.ycombinator.com/" &&
            STYLES_VIEWS_BUTTON_ACTIVE,
        ]}
        as="button"
        style={{ marginLeft: 12 }}
        onClick={() =>
          getViewsFeed({
            type: viewsType.relatedLinks,
            query: "https://news.ycombinator.com/",
          })
        }
      >
        Hacker news
      </Typography.H5>

      <Typography.H5
        css={[
          STYLES_VIEWS_BUTTON,
          currentView === viewsType.relatedLinks &&
            viewQuery === "https://developer.chrome.com/" &&
            STYLES_VIEWS_BUTTON_ACTIVE,
        ]}
        as="button"
        style={{ marginLeft: 12 }}
        onClick={() =>
          getViewsFeed({
            type: viewsType.relatedLinks,
            query: "https://www.google.com/search?",
          })
        }
      >
        Google Searches
      </Typography.H5>

      <button css={STYLES_VIEWS_ADD_BUTTON}>
        <SVG.Plus width={16} height={16} />
      </button>
    </section>
  );
}

function Feed({ onObjectHover, onOpenUrl }) {
  const { viewsFeed } = useViewsContext();
  return (
    <ListView.Root>
      <ListView.Title count={viewsFeed.length}>Result</ListView.Title>
      <div key={viewsFeed.length}>
        {viewsFeed.map(({ item: session }) => {
          return session.visits.map((visit) => (
            <ListView.Object
              key={session.id + visit.id}
              title={visit.title}
              Favicon={getFavicon(visit.rootDomain)}
              onClick={() => onOpenUrl({ urls: [visit.url] })}
              onMouseEnter={() => onObjectHover({ url: visit.url })}
            />
          ));
        })}
      </div>
    </ListView.Root>
  );
}

export { Provider, Menu, Feed };
