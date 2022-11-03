import * as React from "react";
import * as Styles from "~/common/styles";
import * as Navigation from "~/core/navigation/app/jumper";
import * as Views from "~/components/Views";
import * as Search from "~/components/Search";
import * as Jumper from "~/components/jumper";

import Logo from "~/components/Logo";

import { useHistory, useWindows } from "~/core/browser/app/jumper";
import { useViews, useHistorySearch } from "~/core/views/app/jumper";
import { Switch, Match } from "~/components/Switch";
import { css } from "@emotion/react";
import { useNavigation } from "~/core/navigation/app/jumper";
import { useViewer } from "~/core/viewer/app/jumper";
import { useViewsContext } from "~/components/Views";
import { ShortcutsTooltip } from "~/components/Tooltip";

const STYLES_VIEWS_CREATE_MENU_WRAPPER = (theme) => css`
  position: absolute;
  height: fit-content;
  top: calc(-52px + -10px);
  right: -10px;
  transform: translateX(100%);
  border: 1px solid ${theme.semantic.borderGrayLight4};
  border-radius: 12px;
  width: 240px;
  max-height: 320px;
`;

const CreateViewMenuSidePanel = (props) => {
  const { isCreateMenuOpen } = useViewsContext();

  if (!isCreateMenuOpen) return null;

  return (
    <Jumper.SidePanel css={STYLES_VIEWS_CREATE_MENU_WRAPPER} {...props}>
      <Views.CreateMenu />
    </Jumper.SidePanel>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Home Scene
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_INPUT_WRAPPER = css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  padding-left: 8px;
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

export default function Home() {
  const viewer = useViewer();

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
    removeObjectsFromViewsFeed,
  } = useViews();

  const inputRef = React.useRef();
  const [
    search,
    { handleInputChange, clearSearch, removeObjectsFromSearchFeed },
  ] = useHistorySearch({
    inputRef,
    view: appliedView,
  });

  const {
    isFetchingHistoryFirstBatch,
    sessionsFeed,
    sessionsFeedKeys,
    loadMoreHistory,
    removeObjectsFromRecentFeed,
  } = useHistory();

  const { windowsFeeds, activeTabId } = useWindows();

  const feedRef = React.useRef();

  const focusSearchInput = () => inputRef.current?.focus?.();

  const focusFirstItemInFeedOrInputIfEmpty = React.useCallback(() => {
    clearSearch();
    if (!feedRef.rovingTabIndexRef) {
      focusSearchInput();
      return;
    }
    feedRef.rovingTabIndexRef.focus(focusSearchInput);
  }, [clearSearch]);

  const handleOnInputKeyUp = (e) => {
    if (e.code === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      feedRef.rovingTabIndexRef.focus();
    }
  };

  const { navigateToSlatesJumper, navigateToSettingsJumper } = useNavigation();

  const handleRemoveObjectsFromViewsFeed = React.useCallback(
    ({ objects }) => {
      removeObjectsFromViewsFeed({ objects });
      viewer.removeObjects({ objects });
    },
    [removeObjectsFromViewsFeed, viewer]
  );

  const handleRemoveObjectsFromSearchFeed = React.useCallback(
    ({ objects }) => {
      removeObjectsFromSearchFeed({ objects });
      viewer.removeObjects({ objects });
    },
    [removeObjectsFromSearchFeed, viewer]
  );

  const handleRemoveObjectsFromRecentFeed = React.useCallback(
    ({ objects }) => {
      removeObjectsFromRecentFeed({ objects });
      viewer.removeObjects({ objects });
    },
    [removeObjectsFromRecentFeed, viewer]
  );

  const handleRemoveObjectsFromWindowsFeed = React.useCallback(
    ({ objects }) => {
      viewer.removeObjects({ objects });
    },
    [viewer]
  );

  return (
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
      onRestoreFocus={focusSearchInput}
      isLoadingViewFeed={isLoadingViewFeed}
    >
      <Views.MenuProvider>
        <Jumper.TopPanel containerStyle={{ width: "100%" }}>
          <Views.Menu />
        </Jumper.TopPanel>

        <CreateViewMenuSidePanel />
      </Views.MenuProvider>

      <Search.Provider
        onInputChange={handleInputChange}
        search={search}
        clearSearch={clearSearch}
      >
        <Jumper.Header css={STYLES_JUMPER_INPUT_WRAPPER}>
          <ShortcutsTooltip vertical="above" label="Slate Settings">
            <button
              css={STYLES_SETTINGS_BUTTON}
              onClick={navigateToSettingsJumper}
              style={{ marginRight: 4 }}
            >
              <Logo width={20} height={20} />
            </button>
          </ShortcutsTooltip>
          <Search.Input ref={inputRef} onKeyDown={handleOnInputKeyUp} />
        </Jumper.Header>

        <Jumper.Divider color="borderGrayLight" />
        <Jumper.Body
          css={Styles.HORIZONTAL_CONTAINER}
          style={{ height: "100%", flex: 1, overflow: "hidden" }}
        >
          <Switch
            onOpenUrl={Navigation.openUrls}
            onOpenSlatesJumper={navigateToSlatesJumper}
            onSaveObjects={viewer.saveLink}
            ref={feedRef}
          >
            <Match
              when={search.isSearching}
              component={Search.Feed}
              searchFeed={search.searchFeed}
              searchFeedKeys={search.searchFeedKeys}
              onGroupURLs={Navigation.createGroupFromUrls}
              onRestoreFocus={focusFirstItemInFeedOrInputIfEmpty}
              onRemoveObjects={handleRemoveObjectsFromSearchFeed}
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
              isFetchingHistoryFirstBatch={isFetchingHistoryFirstBatch}
              onRemoveObjects={handleRemoveObjectsFromViewsFeed}
              onRemoveObjectsFromRecentFeed={handleRemoveObjectsFromRecentFeed}
              onRemoveObjectsFromWindowsFeed={
                handleRemoveObjectsFromWindowsFeed
              }
            />
          </Switch>
        </Jumper.Body>
      </Search.Provider>

      {/* <RovingTabIndex.Provider ref={relatedLinksFeedRovingTabRef}>
          <RelatedLinksSidePanel
            preview={preview}
            isEnabled={!search.isSearching}
            onKeyDown={onRelatedLinksFeedKeyDownHandler}
          />
        </RovingTabIndex.Provider> */}
    </Views.Provider>
  );
}
