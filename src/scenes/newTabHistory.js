import * as React from "react";
import * as Styles from "../Common/styles";
// import * as SVG from "../Common/SVG";
// import * as Typography from "../Components/system/Typography";
import * as Views from "../Components/Views";
import * as Navigation from "../Core/navigation/app/newTab";
import * as Search from "../Components/Search";

import HistoryFeed from "../Components/HistoryFeed";
import WindowsFeed from "../Components/WindowsFeed";
import Logo from "../Components/Logo";

import { useHistory, useWindows } from "../Core/browser/app/newTab";
import { useViews, useHistorySearch } from "../Core/views/app/newTab";
import { Divider } from "../Components/Divider";
import { Switch, Match } from "../Components/Switch";
import { getExtensionURL } from "../Common/utilities";
import { css } from "@emotion/react";

/* -------------------------------------------------------------------------------------------------
 * History Scene
 * -----------------------------------------------------------------------------------------------*/

const STYLES_HISTORY_SCENE_ITEM_MAX_WIDTH = css`
  max-width: 1080px;
  margin-right: 16px;
  margin-left: 16px;
`;

const STYLES_HISTORY_SCENE_BACKGROUND = css`
  position: fixed;
  left: 0;
  top: 0;

  width: 100%;
  height: 100vh;
  background-image: url("${getExtensionURL("/images/bg-new-tab.png")}");
  background-size: contain;
`;

const STYLES_HISTORY_SCENE_WRAPPER = css`
  ${Styles.VERTICAL_CONTAINER};
  position: relative;
  height: 100vh;
  width: 100%;
`;

const STYLES_HISTORY_TOP_POPUP = (theme) => css`
  ${Styles.VERTICAL_CONTAINER_CENTERED};
  position: relative;
  padding-bottom: 48px;
  @supports (
    (-webkit-backdrop-filter: blur(35px)) or (backdrop-filter: blur(35px))
  ) {
    -webkit-backdrop-filter: blur(35px);
    backdrop-filter: blur(35px);
    background-color: ${theme.semantic.bgBlurLight6OP};
  }
`;

const STYLES_HISTORY_SCENE_VIEWS_MENU = css`
  ${STYLES_HISTORY_SCENE_ITEM_MAX_WIDTH};
  padding: 16px 8px 16px 0px;
  margin-left: 16px;
  margin-right: 16px;
`;

const STYLES_HISTORY_SCENE_INPUT = (theme) => css`
  ${STYLES_HISTORY_SCENE_ITEM_MAX_WIDTH};
  border-bottom: 1px solid ${theme.semantic.borderGrayLight};
`;

const STYLES_HISTORY_SCENE_FEED_WRAPPER = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER};
  @supports (
    (-webkit-backdrop-filter: blur(45px)) or (backdrop-filter: blur(45px))
  ) {
    -webkit-backdrop-filter: blur(45px);
    backdrop-filter: blur(45px);
    background-color: ${theme.semantic.bgBlurWhiteOP};
  }
`;

const STYLES_HISTORY_SCENE_FEED = css`
  ${STYLES_HISTORY_SCENE_ITEM_MAX_WIDTH};
  position: relative;
  margin: 0 auto;
`;

// const STYLES_FILTER_TOGGLE_BUTTON = (theme) => css`
//   ${Styles.BUTTON_RESET};
//   position: absolute;
//   top: 50%;
//   transform: translateY(-50%);
//   right: 16px;

//   width: 32px;
//   height: 32px;
//   border-radius: 8px;
//   padding: 8px;
//   background-color: ${theme.semantic.bgGrayLight};
//   color: ${theme.system.blue};
// `;

// const STYLES_FILTERS_MENU = (theme) => css`
//   ${Styles.HORIZONTAL_CONTAINER};
//   width: 100%;

//   padding: 12px 24px;
//   background-color: ${theme.semantic.bgWhite};
// `;

// const STYLES_FILTER_BUTTON = (theme) => css`
//   ${Styles.BUTTON_RESET};
//   ${Styles.HORIZONTAL_CONTAINER_CENTERED};
//   border-radius: 12px;
//   padding: 5px 12px 7px;
//   width: 78px;
//   border: 1px solid ${theme.semantic.borderGrayLight};
//   color: ${theme.system.blue};
// `;

export default function HistoryScene() {
  const { sessionsFeed, sessionsFeedKeys, loadMoreHistory } = useHistory();

  const { windowsFeed, totalWindows, activeTabId } = useWindows();

  const { viewsFeed, currentView, currentViewQuery, viewsType, getViewsFeed } =
    useViews();

  const inputRef = React.useRef();
  const [search, { handleInputChange, clearSearch }] = useHistorySearch({
    inputRef,
    viewType: currentView,
  });
  const isSearching = search.query.length > 0 && search.result;

  const focusSearchInput = () => inputRef.current.focus();

  return (
    <div css={STYLES_HISTORY_SCENE_WRAPPER}>
      <div css={STYLES_HISTORY_SCENE_BACKGROUND} />

      <Search.Provider
        onInputChange={handleInputChange}
        search={search}
        clearSearch={clearSearch}
      >
        <Views.Provider
          viewsFeed={viewsFeed}
          currentView={currentView}
          currentViewQuery={currentViewQuery}
          viewsType={viewsType}
          getViewsFeed={getViewsFeed}
          onChange={() => (clearSearch(), focusSearchInput())}
        >
          <section css={STYLES_HISTORY_TOP_POPUP}>
            <Views.Menu
              showAllOpenAction={totalWindows > 1}
              css={STYLES_HISTORY_SCENE_VIEWS_MENU}
            />
            <Divider style={{ width: "100%" }} color="borderGrayLight" />
            <Logo
              style={{
                width: "24.78px",
                height: "24px",
                marginTop: 48,
                marginBottom: 24,
              }}
            />
            <Search.Input
              ref={inputRef}
              containerCss={STYLES_HISTORY_SCENE_INPUT}
            />
          </section>

          <section
            css={STYLES_HISTORY_SCENE_FEED_WRAPPER}
            style={{ height: "100%", flex: 1, overflow: "hidden" }}
          >
            <div style={{ flexGrow: 1 }}>
              {/* <section css={STYLES_FILTERS_MENU}>
                  <button css={STYLES_FILTER_BUTTON}>
                    <SVG.Plus width={16} height={16} />
                    <Typography.H5 as="span">Filter</Typography.H5>
                  </button>
                </section> */}

              <Switch css={STYLES_HISTORY_SCENE_FEED}>
                <Match when={isSearching} component={Search.Feed} />
                <Match
                  when={currentView === viewsType.recent}
                  component={HistoryFeed}
                  sessionsFeed={sessionsFeed}
                  sessionsFeedKeys={sessionsFeedKeys}
                  onLoadMore={loadMoreHistory}
                  onOpenUrl={Navigation.openUrls}
                />
                <Match
                  when={currentView === viewsType.currentWindow}
                  component={WindowsFeed}
                  windowsFeed={windowsFeed.currentWindow}
                  activeTabId={activeTabId}
                  onCloseTab={Navigation.closeTab}
                  onOpenUrl={Navigation.openUrls}
                />
                <Match
                  when={currentView === viewsType.allOpen}
                  component={WindowsFeed}
                  windowsFeed={windowsFeed.allOpen}
                  activeTabId={activeTabId}
                  onCloseTab={Navigation.closeTab}
                  onOpenUrl={Navigation.openUrls}
                />
                <Match
                  when={
                    currentView === viewsType.relatedLinks ||
                    currentView === viewsType.savedFiles
                  }
                  component={Views.Feed}
                  onOpenUrl={Navigation.openUrls}
                />
              </Switch>
            </div>
          </section>
        </Views.Provider>
      </Search.Provider>
    </div>
  );
}
