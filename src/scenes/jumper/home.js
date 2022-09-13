import * as React from "react";
import * as Styles from "../../Common/styles";
import * as Navigation from "../../Core/navigation/app/jumper";
import * as Views from "../../Components/Views";
import * as Search from "../../Components/Search";
import * as Jumper from "../../Components/jumper";

import Logo from "../../Components/Logo";

import { useHistory, useWindows } from "../../Core/browser/app/jumper";
import { useViews, useHistorySearch } from "../../Core/views/app/jumper";
import { Switch, Match } from "../../Components/Switch";
import { css } from "@emotion/react";
import { useNavigation } from "../../Core/navigation/app/jumper";
import { useViewer } from "../../Core/viewer/app/jumper";
import { useViewsContext } from "../../Components/Views";
import { ShortcutsTooltip } from "../../Components/Tooltip";

const STYLES_VIEWS_CREATE_MENU_WRAPPER = (theme) => css`
  position: absolute;
  height: fit-content;
  top: calc(-52px + -10px);
  right: -10px;
  transform: translateX(100%);
  border: 1px solid ${theme.semantic.borderGrayLight4};
  border-radius: 12px;
  max-width: 240px;
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
  padding-left: 16px;
`;

export default function Home() {
  const {
    viewsFeed,
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
  const viewer = useViewer();

  const { sessionsFeed, sessionsFeedKeys, loadMoreHistory } = useHistory();

  const { windowsFeeds, activeTabId } = useWindows();

  const feedRef = React.useRef();

  const focusSearchInput = () => inputRef.current.focus();

  // const focusFirstItemInFeedOrInputIfEmpty = () => {
  //   clearSearch();
  //   feedRef.rovingTabIndexRef.focus(focusSearchInput);
  // };

  const handleOnInputKeyUp = (e) => {
    if (e.code === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      feedRef.rovingTabIndexRef.focus();
    }
  };

  const { navigateToSlatesJumper } = useNavigation();

  return (
    <Views.Provider
      viewer={viewer}
      viewsFeed={viewsFeed}
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
            <Logo width={20} height={20} style={{ marginRight: 12 }} />
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
