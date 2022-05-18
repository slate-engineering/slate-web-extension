import * as React from "react";
import * as Typography from "../Components/system/Typography";
import * as Styles from "../Common/styles";
import * as ListView from "../Components/ListView";
import * as SVG from "../Common/SVG";

import { css } from "@emotion/react";
import { getFavicon } from "../Common/favicons";
import { viewsType } from "../Core/history";
import { Divider } from "./Divider";

const ViewsContext = React.createContext();
const useViewsContext = () => React.useContext(ViewsContext);

function Provider({
  children,
  viewsFeed,
  currentView,
  currentViewQuery,
  viewsType,
  getViewsFeed,
}) {
  const value = React.useMemo(
    () => ({
      viewsFeed,
      currentView,
      currentViewQuery,
      viewsType,
      getViewsFeed,
    }),
    [viewsFeed, currentView, currentViewQuery, viewsType, getViewsFeed]
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
  padding: 8px;
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

const VIEWS_ACTIONS = [
  { label: "Recent", data: { type: viewsType.recent } },
  { label: "Current Window", data: { type: viewsType.currentWindow } },
  { label: "All Open", data: { type: viewsType.allOpen } },
];

const CUSTON_VIEWS_ACTIONS = [
  {
    label: "Twitter",
    data: { type: viewsType.relatedLinks, query: "https://twitter.com/" },
  },
  {
    label: "Youtube",
    data: { type: viewsType.relatedLinks, query: "https://www.youtube.com/" },
  },
  {
    label: "Google Searches",
    data: {
      type: viewsType.relatedLinks,
      query: "https://www.google.com/search?",
    },
  },
];

function Menu({ css, ...props }) {
  const { currentView, currentViewQuery, getViewsFeed } = useViewsContext();

  return (
    <section css={[STYLES_VIEWS_MENU, css]} {...props}>
      {VIEWS_ACTIONS.map((viewAction, i) => (
        <Typography.H5
          key={viewAction.label}
          css={[
            STYLES_VIEWS_BUTTON,
            currentView === viewAction.data.type && STYLES_VIEWS_BUTTON_ACTIVE,
          ]}
          style={{ marginLeft: i > 0 ? 4 : 0 }}
          as="button"
          onClick={() => getViewsFeed({ type: viewAction.data.type })}
        >
          {viewAction.label}
        </Typography.H5>
      ))}

      <Divider height="none" width="1px" style={{ margin: "0px 4px" }} />

      {CUSTON_VIEWS_ACTIONS.map((viewAction) => (
        <Typography.H5
          key={viewAction.label}
          css={[
            STYLES_VIEWS_BUTTON,
            currentView === viewAction.data.type &&
              currentViewQuery === viewAction.data.query &&
              STYLES_VIEWS_BUTTON_ACTIVE,
          ]}
          style={{ marginLeft: 4 }}
          as="button"
          onClick={() =>
            getViewsFeed({
              type: viewAction.data.type,
              query: viewAction.data.query,
            })
          }
        >
          {viewAction.label}
        </Typography.H5>
      ))}

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
