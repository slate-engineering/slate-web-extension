import * as React from "react";
import * as Styles from "../Common/styles";
import * as Views from "../Components/Views";
import * as Navigation from "../Core/navigation/app/newTab";
import * as Search from "../Components/Search";
import * as Jumper from "../Components/jumper";
import * as EditSlates from "../Components/EditSlates";

import Logo from "../Components/Logo";

import { useHistory, useWindows } from "../Core/browser/app/newTab";
import { useViews, useHistorySearch } from "../Core/views/app/newTab";
import { Divider } from "../Components/Divider";
import { Switch, Match } from "../Components/Switch";
import { getExtensionURL } from "../Common/utilities";
import { useViewer } from "../Core/viewer/app/newTab";
import { css } from "@emotion/react";

const useSlatesJumper = () => {
  const [slatesJumperState, setSlatesJumperState] = React.useState({
    isOpen: false,
    objects: undefined,
  });

  const closeSlatesJumper = () => setSlatesJumperState({ isOpen: false });

  const openSlatesJumper = (objects) => {
    setSlatesJumperState({ isOpen: true, objects: [...objects] });
  };

  return { slatesJumperState, closeSlatesJumper, openSlatesJumper };
};

function EditSlatesJumper({ objects, onClose }) {
  const viewer = useViewer();

  const checkIfSlateIsApplied = (slate) => {
    return objects.every((object) => object.url in viewer.slatesLookup[slate]);
  };

  return (
    <Jumper.Root onClose={onClose}>
      <EditSlates.Provider
        objects={objects}
        slates={viewer.slates}
        checkIfSlateIsApplied={checkIfSlateIsApplied}
        onCreateSlate={viewer.createSlate}
        onAddObjectsToSlate={viewer.addObjectsToSlate}
        onRemoveObjectsFromSlate={viewer.removeObjectsFromSlate}
      >
        <Jumper.TopPanel>
          <EditSlates.TopPanel />
        </Jumper.TopPanel>
        <Jumper.Header style={{ paddingLeft: "20px" }}>
          <EditSlates.Input />
        </Jumper.Header>
        <Jumper.Divider />
        <Jumper.Body>
          <EditSlates.Body />
        </Jumper.Body>
      </EditSlates.Provider>
    </Jumper.Root>
  );
}

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

  const { windowsFeeds, activeTabId } = useWindows();

  const { viewsFeed, appliedView, isLoadingViewFeed, viewsType, getViewsFeed } =
    useViews();

  const inputRef = React.useRef();
  const [search, { handleInputChange, clearSearch }] = useHistorySearch({
    inputRef,
    view: appliedView,
  });

  const focusSearchInput = () => inputRef.current.focus();

  const feedRef = React.useRef();

  const viewer = useViewer();

  const { slatesJumperState, closeSlatesJumper, openSlatesJumper } =
    useSlatesJumper();

  const handleOnInputKeyUp = (e) => {
    if (e.code === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      feedRef.rovingTabIndexRef.focus();
    }
  };

  return (
    <>
      {slatesJumperState.isOpen && (
        <EditSlatesJumper
          objects={slatesJumperState.objects}
          onClose={closeSlatesJumper}
        />
      )}
      <div css={STYLES_HISTORY_SCENE_WRAPPER}>
        <div css={STYLES_HISTORY_SCENE_BACKGROUND} />

        <Search.Provider
          onInputChange={handleInputChange}
          search={search}
          clearSearch={clearSearch}
        >
          <Views.Provider
            viewer={viewer}
            viewsFeed={viewsFeed}
            appliedView={appliedView}
            viewsType={viewsType}
            getViewsFeed={getViewsFeed}
            isLoadingViewFeed={isLoadingViewFeed}
            onRestoreFocus={focusSearchInput}
          >
            <section css={STYLES_HISTORY_TOP_POPUP}>
              <Views.Menu css={STYLES_HISTORY_SCENE_VIEWS_MENU} />
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
                onKeyDown={handleOnInputKeyUp}
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
                <Switch
                  onOpenSlatesJumper={openSlatesJumper}
                  onOpenUrl={Navigation.openUrls}
                  onSaveObjects={viewer.saveLink}
                  ref={feedRef}
                  css={STYLES_HISTORY_SCENE_FEED}
                >
                  <Match
                    when={search.isSearching}
                    component={Search.Feed}
                    searchFeed={search.searchFeed}
                    searchFeedKeys={search.searchFeedKeys}
                    slates={search.slates}
                    onGroupURLs={Navigation.createGroupFromUrls}
                  />
                  <Match
                    when={!search.isSearching}
                    component={Views.Feed}
                    historyFeed={sessionsFeed}
                    historyFeedKeys={sessionsFeedKeys}
                    loadMoreHistory={loadMoreHistory}
                    windowsFeed={windowsFeeds.allOpenFeed}
                    windowsFeedKeys={windowsFeeds.allOpenFeedKeys}
                    activeTabId={activeTabId}
                    onCloseTabs={Navigation.closeTabs}
                    onGroupURLs={Navigation.createGroupFromUrls}
                  />
                </Switch>
              </div>
            </section>
          </Views.Provider>
        </Search.Provider>
      </div>
    </>
  );
}
