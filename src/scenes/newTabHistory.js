import * as React from "react";
import * as Styles from "../Common/styles";
// import * as SVG from "../Common/SVG";
// import * as Typography from "../Components/system/Typography";
import * as Views from "../Components/Views";
import * as Navigation from "../Core/navigation/app/newTab";
import * as Search from "../Components/Search";

import HistoryFeed from "../Components/HistoryFeed";
import WindowsFeed from "../Components/WindowsFeed";
import LinkPreview from "../Components/LinkPreview";

import {
  useHistory,
  useViews,
  useHistorySearch,
} from "../Core/history/app/newTab";
import { Divider } from "../Components/Divider";
import { css } from "@emotion/react";
import { ComboboxNavigation } from "Components/ComboboxNavigation";
import { Switch, Match } from "../Components/Switch";

/* -------------------------------------------------------------------------------------------------
 * History Scene
 * -----------------------------------------------------------------------------------------------*/

const STYLES_HISTORY_SCENE_WRAPPER = (theme) => css`
  ${Styles.VERTICAL_CONTAINER};
  position: relative;
  height: 100vh;
  width: 100%;
  border: 1px solid ${theme.semantic.borderGrayLight};
  box-shadow: ${theme.shadow.darkLarge};
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
  const { windowsFeed, sessionsFeed, sessionsFeedKeys, loadMoreHistory } =
    useHistory();

  const inputRef = React.useRef();
  const [search, { handleInputChange, clearSearch }] = useHistorySearch({
    inputRef,
  });
  const isSearching = search.query.length > 0 && search.result;

  const { viewsFeed, currentView, currentViewQuery, viewsType, getViewsFeed } =
    useViews();
  const focusInputOnViewChange = () => inputRef.current.focus();

  const [preview, setPreview] = React.useState({ url: "", title: "" });
  const handleOnObjectHover = React.useCallback(
    ({ url }) => setPreview({ type: "link", url }),
    []
  );

  return (
    <div css={STYLES_HISTORY_SCENE_WRAPPER}>
      <ComboboxNavigation.Provider
        isInfiniteList={currentView === viewsType.recent}
      >
        <Search.Provider
          onInputChange={handleInputChange}
          search={search}
          clearSearch={clearSearch}
        >
          <Search.Input ref={inputRef} />

          <Divider color="borderGrayLight" />

          <Views.Provider
            viewsFeed={viewsFeed}
            currentView={currentView}
            currentViewQuery={currentViewQuery}
            viewsType={viewsType}
            getViewsFeed={getViewsFeed}
            onChange={focusInputOnViewChange}
          >
            <Views.Menu />
            <Divider color="borderGrayLight" />
            <section
              css={Styles.HORIZONTAL_CONTAINER}
              style={{ height: "100%", flex: 1, overflow: "hidden" }}
            >
              <div style={{ flexGrow: 1 }}>
                {/* <section css={STYLES_FILTERS_MENU}>
                  <button css={STYLES_FILTER_BUTTON}>
                    <SVG.Plus width={16} height={16} />
                    <Typography.H5 as="span">Filter</Typography.H5>
                  </button>
                </section> */}

                <Switch>
                  <Match
                    when={isSearching}
                    component={Search.Feed}
                    setPreview={setPreview}
                  />
                  <Match
                    when={currentView === viewsType.recent}
                    component={HistoryFeed}
                    sessionsFeed={sessionsFeed}
                    sessionsFeedKeys={sessionsFeedKeys}
                    onLoadMore={loadMoreHistory}
                    onObjectHover={handleOnObjectHover}
                    onOpenUrl={Navigation.openUrls}
                  />
                  <Match
                    when={
                      currentView === viewsType.currentWindow ||
                      currentView === viewsType.allOpen
                    }
                    component={WindowsFeed}
                    windowsFeed={windowsFeed}
                    displayAllOpen={currentView === viewsType.allOpen}
                    onObjectHover={handleOnObjectHover}
                    onOpenUrl={Navigation.openUrls}
                  />
                  <Match
                    when={currentView === viewsType.relatedLinks}
                    component={Views.Feed}
                    onOpenUrl={Navigation.openUrls}
                    onObjectHover={handleOnObjectHover}
                  />
                </Switch>
              </div>
              <Divider width="1px" height="100%" color="borderGrayLight" />
              <div style={{ width: 480 }}>
                <LinkPreview
                  url={preview.url}
                  title={preview.title}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </section>
          </Views.Provider>
        </Search.Provider>
      </ComboboxNavigation.Provider>
    </div>
  );
}
