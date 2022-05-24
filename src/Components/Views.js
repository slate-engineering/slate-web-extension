import * as React from "react";
import * as Typography from "../Components/system/Typography";
import * as Styles from "../Common/styles";
import * as ListView from "../Components/ListView";
import * as RovingTabIndex from "../Components/RovingTabIndex";
import * as SVG from "../Common/SVG";
import * as Favicons from "../Common/favicons";

import { css } from "@emotion/react";
import { getFavicon } from "../Common/favicons";
import { viewsType } from "../Core/history";
import { Divider } from "./Divider";
import { ComboboxNavigation } from "./ComboboxNavigation";

const ViewsContext = React.createContext();
const useViewsContext = () => React.useContext(ViewsContext);

function Provider({
  children,
  viewsFeed,
  currentView,
  currentViewQuery,
  viewsType,
  getViewsFeed,
  onChange,
}) {
  const value = React.useMemo(
    () => ({
      viewsFeed,
      currentView,
      currentViewQuery,
      viewsType,
      getViewsFeed,
      onChange,
    }),
    [
      viewsFeed,
      currentView,
      currentViewQuery,
      viewsType,
      onChange,
      getViewsFeed,
    ]
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
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  border-radius: 12px;
  padding: 5px 12px 7px;
  color: ${theme.semantic.textGray};

  &:hover {
    ${STYLES_VIEWS_BUTTON_ACTIVE(theme)}
  }

  &:focus {
    outline: 2px solid ${theme.system.blue};
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

  &:focus {
    outline: 2px solid ${theme.system.blue};
  }
`;

const VIEWS_ACTIONS = [
  { label: "Recent", data: { type: viewsType.recent } },
  { label: "Current Window", data: { type: viewsType.currentWindow } },
  { label: "All Open", data: { type: viewsType.allOpen } },
];

const CUSTOM_VIEWS_ACTIONS = [
  {
    label: "Twitter",
    data: { type: viewsType.relatedLinks, query: "https://twitter.com/" },
    Favicon: Favicons.getFavicon("twitter.com"),
  },
  {
    label: "Hacker News",
    data: {
      type: viewsType.relatedLinks,
      query: "https://www.hackernews.com",
    },
    Favicon: Favicons.getFavicon("hackernews.com"),
  },
  {
    label: "Youtube",
    data: { type: viewsType.relatedLinks, query: "https://www.youtube.com/" },
    Favicon: Favicons.getFavicon("youtube.com"),
  },
];

function Menu({ css, ...props }) {
  const { currentView, currentViewQuery, getViewsFeed, onChange } =
    useViewsContext();

  const createOnClickHandler =
    ({ type, query }) =>
    () => {
      getViewsFeed({ type, query });
      if (onChange) onChange();
    };

  return (
    <RovingTabIndex.Provider axis="horizontal">
      <RovingTabIndex.List>
        <section css={[STYLES_VIEWS_MENU, css]} {...props}>
          {VIEWS_ACTIONS.map((viewAction, i) => (
            <RovingTabIndex.Item key={viewAction.label} index={i}>
              <Typography.H5
                css={[
                  STYLES_VIEWS_BUTTON,
                  currentView === viewAction.data.type &&
                    STYLES_VIEWS_BUTTON_ACTIVE,
                ]}
                style={{ marginLeft: i > 0 ? 4 : 0 }}
                as="button"
                onClick={createOnClickHandler({ type: viewAction.data.type })}
              >
                {viewAction.label}
              </Typography.H5>
            </RovingTabIndex.Item>
          ))}

          <Divider height="none" width="1px" style={{ margin: "0px 4px" }} />

          {CUSTOM_VIEWS_ACTIONS.map((viewAction, i) => {
            const { Favicon } = viewAction;
            const isApplied =
              currentView === viewAction.data.type &&
              currentViewQuery === viewAction.data.query;
            return (
              <RovingTabIndex.Item
                key={viewAction.label}
                index={VIEWS_ACTIONS.length + i}
              >
                <Typography.H5
                  css={[
                    STYLES_VIEWS_BUTTON,
                    isApplied && STYLES_VIEWS_BUTTON_ACTIVE,
                  ]}
                  style={{ marginLeft: 4 }}
                  as="button"
                  onClick={createOnClickHandler({
                    type: viewAction.data.type,
                    query: viewAction.data.query,
                  })}
                >
                  <Favicon
                    style={{ marginRight: 4, opacity: isApplied ? 1 : 0.5 }}
                  />
                  {viewAction.label}
                </Typography.H5>
              </RovingTabIndex.Item>
            );
          })}

          <RovingTabIndex.Item
            index={VIEWS_ACTIONS.length + CUSTOM_VIEWS_ACTIONS.length}
          >
            <button css={STYLES_VIEWS_ADD_BUTTON}>
              <SVG.Plus width={16} height={16} />
            </button>
          </RovingTabIndex.Item>
        </section>
      </RovingTabIndex.List>
    </RovingTabIndex.Provider>
  );
}

function Feed({ onObjectHover, onOpenUrl }) {
  const { viewsFeed } = useViewsContext();
  return (
    <ComboboxNavigation.Menu>
      <ListView.Root>
        <ListView.Title count={viewsFeed.length}>Result</ListView.Title>
        <div key={viewsFeed.length}>
          {viewsFeed.map((visit, i) => (
            <ListView.ComboboxObject
              key={visit.id}
              index={i}
              title={visit.title}
              Favicon={getFavicon(visit.rootDomain)}
              onClick={() => onOpenUrl({ urls: [visit.url] })}
              onMouseEnter={() => onObjectHover({ url: visit.url })}
              onSubmit={() => onOpenUrl({ urls: [visit.url] })}
              onSelect={() => onObjectHover({ url: visit.url })}
            />
          ))}
        </div>
      </ListView.Root>
    </ComboboxNavigation.Menu>
  );
}

export { Provider, Menu, Feed };
