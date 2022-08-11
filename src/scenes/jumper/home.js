import * as React from "react";
import * as Styles from "../../Common/styles";
import * as Navigation from "../../Core/navigation/app/jumper";
import * as Views from "../../Components/Views";
import * as Search from "../../Components/Search";
import * as Jumper from "../../Components/jumper";

import HistoryFeed from "../../Components/HistoryFeed";
import WindowsFeed from "../../Components/WindowsFeed";
import Logo from "../../Components/Logo";

import { useHistory, useWindows } from "../../Core/browser/app/jumper";
import { useViews, useHistorySearch } from "../../Core/views/app/jumper";
import { Switch, Match } from "../../Components/Switch";
import { css } from "@emotion/react";
import { useNavigation } from "../../Core/navigation/app/jumper";
import { useViewer } from "../../Core/viewer/app/jumper";

/* -------------------------------------------------------------------------------------------------
 * History Scene
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_INPUT_WRAPPER = css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  padding-left: 16px;
`;

export default function Home() {
  const {
    viewsFeed,
    currentViewLabel,
    currentViewQuery,
    viewsType,
    getViewsFeed,
    currentView,
  } = useViews();

  const inputRef = React.useRef();
  const [search, { handleInputChange, clearSearch }] = useHistorySearch({
    inputRef,
    viewType: currentView,
  });
  const viewer = useViewer();

  const { sessionsFeed, sessionsFeedKeys, loadMoreHistory } = useHistory();

  const { windowsFeeds, totalWindows, activeTabId } = useWindows();

  const feedRef = React.useRef();

  const focusSearchInput = () => inputRef.current.focus();
  const onInputKeyDownHandler = (e) => {
    if (e.key === "ArrowDown") {
      console.log("down", feedRef);
    }
  };

  const { navigateToSlatesJumper } = useNavigation();

  return (
    <Views.Provider
      viewsFeed={viewsFeed}
      currentView={currentView}
      currentViewLabel={currentViewLabel}
      currentViewQuery={currentViewQuery}
      viewsType={viewsType}
      getViewsFeed={getViewsFeed}
      onChange={() => (clearSearch(), focusSearchInput())}
    >
      <Jumper.TopPanel containerStyle={{ width: "100%" }}>
        <Views.Menu showAllOpenAction={totalWindows > 1} />
      </Jumper.TopPanel>

      <Search.Provider
        onInputChange={handleInputChange}
        search={search}
        clearSearch={clearSearch}
      >
        <Jumper.Header css={STYLES_JUMPER_INPUT_WRAPPER}>
          <Logo width={20} height={20} style={{ marginRight: 12 }} />
          <Search.Input onKeyDown={onInputKeyDownHandler} ref={inputRef} />
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
              onGroupURLs={Navigation.createGroupFromUrls}
            />
            <Match
              when={currentView === viewsType.recent}
              component={HistoryFeed}
              sessionsFeed={sessionsFeed}
              sessionsFeedKeys={sessionsFeedKeys}
              onLoadMore={loadMoreHistory}
              // onObjectHover={handleOnObjectHover}
              onGroupURLs={Navigation.createGroupFromUrls}
            />
            <Match
              when={currentView === viewsType.currentWindow}
              component={WindowsFeed}
              windowsFeed={windowsFeeds.currentWindowFeed}
              windowsFeedKeys={windowsFeeds.currentWindowFeedKeys}
              activeTabId={activeTabId}
              // onObjectHover={handleOnObjectHover}
              onCloseTabs={Navigation.closeTabs}
            />
            <Match
              when={currentView === viewsType.allOpen}
              component={WindowsFeed}
              windowsFeed={windowsFeeds.allOpenFeed}
              windowsFeedKeys={windowsFeeds.allOpenFeedKeys}
              activeTabId={activeTabId}
              // onObjectHover={handleOnObjectHover}
              onCloseTabs={Navigation.closeTabs}
            />
            <Match
              when={
                currentView === viewsType.relatedLinks ||
                currentView === viewsType.savedFiles
              }
              component={Views.Feed}
              onGroupURLs={Navigation.createGroupFromUrls}
              // onObjectHover={handleOnObjectHover}
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
