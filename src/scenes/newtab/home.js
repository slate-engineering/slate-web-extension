import * as React from "react";
import * as Styles from "~/common/styles";
import * as Views from "~/components/Views";
import * as Navigation from "~/core/navigation/app/newTab";
import * as Search from "~/components/Search";
import * as Jumper from "~/components/jumper";
import * as EditSlates from "~/components/EditSlates";
import * as EditSettings from "~/components/EditSettings";

import Logo from "~/components/Logo";

import { useHistory, useWindows } from "~/core/browser/app/newTab";
import { useViews, useHistorySearch } from "~/core/views/app/newTab";
import { Divider } from "~/components/Divider";
import { Switch, Match } from "~/components/Switch";
import { getExtensionURL } from "~/common/utilities";
import { useViewer } from "~/core/viewer/app/newTab";
import { useViewsContext, useViewsMenuContext } from "~/components/Views";
import { css } from "@emotion/react";
import { ShortcutsTooltip } from "~/components/Tooltip";
import { useEscapeKey } from "~/common/hooks";

/* -------------------------------------------------------------------------------------------------
 * EditSlatesJumper
 * -----------------------------------------------------------------------------------------------*/

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
 * EditSettingsJumper
 * -----------------------------------------------------------------------------------------------*/

const useSettingsJumper = () => {
  const [isSettingsJumperOpen, setSettingsJumperState] = React.useState(false);

  const closeSettingsJumper = () => setSettingsJumperState(false);

  const openSettingsJumper = () => setSettingsJumperState(true);

  return { isSettingsJumperOpen, closeSettingsJumper, openSettingsJumper };
};

function EditSettingsJumper({ onClose }) {
  const viewer = useViewer();

  useEscapeKey(onClose);

  return (
    <Jumper.Root onClose={onClose}>
      <EditSettings.Provider viewer={viewer}>
        <Jumper.Header style={{ paddingLeft: "20px" }}>
          <EditSettings.Input />
        </Jumper.Header>
        <Jumper.Divider />
        <Jumper.Body>
          <EditSettings.Body />
        </Jumper.Body>
      </EditSettings.Provider>
    </Jumper.Root>
  );
}

/* -------------------------------------------------------------------------------------------------
 * CreateViewMenuSidePanel
 * -----------------------------------------------------------------------------------------------*/

const STYLES_VIEWS_CREATE_MENU_LEFT_POSITION = css`
  position: absolute;
  top: 44px;
  right: 40px;
  transform: translateX(100%);
`;

const STYLES_VIEWS_CREATE_MENU_RIGHT_POSITION = css`
  position: absolute;
  top: 44px;
  right: 8px;
`;

const STYLES_VIEWS_CREATE_MENU_WRAPPER = (theme) => css`
  height: fit-content;
  z-index: 1;
  border: 1px solid ${theme.semantic.borderGrayLight4};
  border-radius: 12px;
  width: 240px;
  max-height: 320px;
  background-color: ${theme.semantic.bgLight};
  box-shadow: ${theme.shadow.lightLarge};
`;

const CreateViewMenuSidePanel = (props) => {
  const { isCreateMenuOpen } = useViewsContext();
  const { isMenuOverflowingFrom } = useViewsMenuContext();

  if (!isCreateMenuOpen) return null;

  return (
    <Views.CreateMenu
      css={[
        STYLES_VIEWS_CREATE_MENU_WRAPPER,
        isMenuOverflowingFrom.right || isMenuOverflowingFrom.left
          ? STYLES_VIEWS_CREATE_MENU_RIGHT_POSITION
          : STYLES_VIEWS_CREATE_MENU_LEFT_POSITION,
      ]}
      {...props}
    />
  );
};

const Feeds = React.forwardRef(
  (
    {
      openSlatesJumper,
      sessionsFeed,
      sessionsFeedKeys,
      loadMoreHistory,
      isFetchingHistoryFirstBatch,
      windowsFeeds,
      activeTabId,
      viewer,
      search,
      focusFirstItemInFeedOrInputIfEmpty,
    },
    feedRef
  ) => {
    return (
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
          onRestoreFocus={focusFirstItemInFeedOrInputIfEmpty}
        />
        <Match
          when={!search.isSearching}
          component={Views.Feed}
          historyFeed={sessionsFeed}
          historyFeedKeys={sessionsFeedKeys}
          loadMoreHistory={loadMoreHistory}
          isFetchingHistoryFirstBatch={isFetchingHistoryFirstBatch}
          windowsFeed={windowsFeeds.allOpenFeed}
          windowsFeedKeys={windowsFeeds.allOpenFeedKeys}
          activeTabId={activeTabId}
          onCloseTabs={Navigation.closeTabs}
          onGroupURLs={Navigation.createGroupFromUrls}
        />
      </Switch>
    );
  }
);

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
  z-index: 1;
  padding-bottom: 48px;
  @supports (
    (-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(35px))
  ) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurLight6OP};
  }
`;

const STYLES_HISTORY_SCENE_VIEWS_MENU = css`
  ${STYLES_HISTORY_SCENE_ITEM_MAX_WIDTH};
  width: 100%;
  position: relative;
  padding: 8px;
  padding-left: 0px;
  margin-left: 16px;
  margin-right: 16px;
`;

const STYLES_HISTORY_SCENE_INPUT = (theme) => css`
  ${STYLES_HISTORY_SCENE_ITEM_MAX_WIDTH};
  border-bottom: 1px solid ${theme.semantic.borderGrayLight};
`;

const STYLES_HISTORY_SCENE_FEED_WRAPPER = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER};
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }

  @supports (
    (-webkit-backdrop-filter: blur(45px)) or (backdrop-filter: blur(45px))
  ) {
    -webkit-backdrop-filter: blur(45px);
    backdrop-filter: blur(45px);
    background-color: ${theme.semantic.bgBlurWhiteOP};
  }
`;

//NOTE(amine): used as fix for overflow hidden caused by setting overflow-y to auto in the feed's styles
const STYLES_HISTORY_SCENE_FEED = css`
  padding-left: calc((100vw - 1080px) / 2);
  padding-right: calc((100vw - 1080px) / 2);

  & > div {
    position: relative;
  }
`;

const STYLES_SETTINGS_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  border-radius: 8px;
  padding: 8px;
  &:hover,
  &:focus {
    background-color: ${theme.semantic.bgGrayLight};
  }
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
  const {
    isFetchingHistoryFirstBatch,
    sessionsFeed,
    sessionsFeedKeys,
    loadMoreHistory,
  } = useHistory();

  const { windowsFeeds, activeTabId } = useWindows();

  const {
    viewsFeed,
    viewsFeedKeys,
    appliedView,
    isLoadingViewFeed,
    viewsType,
    getViewsFeed,
    createViewByTag,
    createViewBySource,
    removeView,
  } = useViews();

  const inputRef = React.useRef();
  const [search, { handleInputChange, clearSearch }] = useHistorySearch({
    inputRef,
    view: appliedView,
  });

  const focusSearchInput = () => inputRef.current?.focus?.();

  const feedRef = React.useRef();

  const viewer = useViewer();

  const { slatesJumperState, closeSlatesJumper, openSlatesJumper } =
    useSlatesJumper();

  const { isSettingsJumperOpen, closeSettingsJumper, openSettingsJumper } =
    useSettingsJumper();

  const focusFirstItemInFeedOrInputIfEmpty = React.useCallback(() => {
    clearSearch();
    if (!feedRef.rovingTabIndexRef) {
      focusSearchInput();
      return;
    }
    feedRef.rovingTabIndexRef.focus(focusSearchInput);
  }, [clearTimeout]);

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

      {isSettingsJumperOpen && (
        <EditSettingsJumper onClose={closeSettingsJumper} />
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
            viewsFeedKeys={viewsFeedKeys}
            appliedView={appliedView}
            viewsType={viewsType}
            getViewsFeed={getViewsFeed}
            createViewByTag={createViewByTag}
            createViewBySource={createViewBySource}
            removeView={removeView}
            isLoadingViewFeed={isLoadingViewFeed}
            onRestoreFocus={focusSearchInput}
          >
            <section css={STYLES_HISTORY_TOP_POPUP}>
              <div css={STYLES_HISTORY_SCENE_VIEWS_MENU}>
                <div
                  style={{
                    position: "relative",
                    width: "fit-content",
                    maxWidth: "100%",
                  }}
                >
                  <Views.MenuProvider>
                    <Views.Menu
                      actionsWrapperStyle={{ width: "auto", paddingRight: 0 }}
                    />

                    <CreateViewMenuSidePanel />
                  </Views.MenuProvider>
                </div>
              </div>
              <Divider style={{ width: "100%" }} color="borderGrayLight" />
              <ShortcutsTooltip vertical="above" label="Slate Settings">
                <button
                  css={STYLES_SETTINGS_BUTTON}
                  style={{ marginTop: 48, marginBottom: 24 }}
                  onClick={openSettingsJumper}
                >
                  <Logo
                    style={{
                      width: "24.78px",
                      height: "24px",
                    }}
                  />
                </button>
              </ShortcutsTooltip>
              <Search.Input
                ref={inputRef}
                containerCss={STYLES_HISTORY_SCENE_INPUT}
                onKeyDown={handleOnInputKeyUp}
              />
            </section>

            <section
              css={STYLES_HISTORY_SCENE_FEED_WRAPPER}
              style={{ height: "100%", flex: 1 }}
            >
              <div style={{ flexGrow: 1 }}>
                <Feeds
                  ref={feedRef}
                  openSlatesJumper={openSlatesJumper}
                  sessionsFeed={sessionsFeed}
                  sessionsFeedKeys={sessionsFeedKeys}
                  loadMoreHistory={loadMoreHistory}
                  isFetchingHistoryFirstBatch={isFetchingHistoryFirstBatch}
                  windowsFeeds={windowsFeeds}
                  activeTabId={activeTabId}
                  viewer={viewer}
                  search={search}
                  focusFirstItemInFeedOrInputIfEmpty={
                    focusFirstItemInFeedOrInputIfEmpty
                  }
                />
              </div>
            </section>
          </Views.Provider>
        </Search.Provider>
      </div>
    </>
  );
}
