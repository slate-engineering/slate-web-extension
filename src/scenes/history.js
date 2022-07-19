import * as React from "react";
import * as Styles from "../Common/styles";
import * as Navigation from "../Core/navigation/app/jumper";
import * as Views from "../Components/Views";
import * as Search from "../Components/Search";
// import * as RovingTabIndex from "../Components/RovingTabIndex";
import * as Jumper from "../Components/jumper";

import HistoryFeed from "../Components/HistoryFeed";
import WindowsFeed from "../Components/WindowsFeed";
// import RelatedLinksFeed from "../Components/RelatedLinksFeed";
import Logo from "../Components/Logo";

import { useHistory, useWindows } from "../Core/browser/app/jumper";
import { useViews, useHistorySearch } from "../Core/views/app/jumper";
// import { useMediaQuery } from "../Common/hooks";
import { Switch, Match } from "../Components/Switch";
// import { useGetRelatedLinks } from "../Core/browser/app/jumper";
import { css } from "@emotion/react";

/* -------------------------------------------------------------------------------------------------
 * Related Links Panel
 * -----------------------------------------------------------------------------------------------*/

// function RelatedLinksSidePanel({ preview, isEnabled, ...props }) {
//   const isMatchingQuery = useMediaQuery((sizes) => sizes.desktopM);

//   const relatedLinksFeed = useGetRelatedLinks(
//     isMatchingQuery ? null : preview?.url
//   );

//   if (isMatchingQuery || !preview || !isEnabled) return null;

//   return (
//     <Jumper.SidePanel>
//       <RelatedLinksFeed feed={relatedLinksFeed} {...props} />
//     </Jumper.SidePanel>
//   );
// }

/* -------------------------------------------------------------------------------------------------
 * History Scene
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_INPUT_WRAPPER = css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  padding-left: 16px;
`;

export default function History() {
  const { viewsFeed, currentViewQuery, viewsType, getViewsFeed, currentView } =
    useViews();

  const inputRef = React.useRef();
  const [search, { handleInputChange, clearSearch }] = useHistorySearch({
    inputRef,
    viewType: currentView,
  });

  const { sessionsFeed, sessionsFeedKeys, loadMoreHistory } = useHistory();

  const { windowsFeed, totalWindows } = useWindows();

  const feedRef = React.useRef();

  const focusSearchInput = () => inputRef.current.focus();
  const onInputKeyDownHandler = (e) => {
    if (e.key === "ArrowDown") {
      console.log("down", feedRef);
    }
  };

  // const [preview, setPreview] = React.useState();
  // const handleOnObjectHover = React.useCallback(
  //   ({ url }) => setPreview({ type: "link", url }),
  //   []
  // );

  // NOTE(amine): Navigate between the jumper and the related links feed
  // via the the left and right arrow keys
  // const relatedLinksFeedRovingTabRef = React.useRef();
  // const focusRelatedLinksFeedObject = () =>
  //   relatedLinksFeedRovingTabRef.current.focusSelectedElement();
  // const onRelatedLinksFeedKeyDownHandler = (e) => {
  //   if (e.key === "ArrowLeft") {
  //     focusSearchInput();
  //     e.preventDefault();
  //   }
  // };

  const { closeTheJumper } = Navigation.useNavigation();

  return (
    <Jumper.Root onClose={closeTheJumper}>
      <Views.Provider
        viewsFeed={viewsFeed}
        currentView={currentView}
        currentViewQuery={currentViewQuery}
        viewsType={viewsType}
        getViewsFeed={getViewsFeed}
        onChange={() => (clearSearch(), focusSearchInput())}
      >
        <Jumper.TopPanel>
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
            <Switch ref={feedRef}>
              <Match
                when={search.isSearching}
                component={Search.Feed}
                onOpenUrl={Navigation.openUrls}
              />
              <Match
                when={currentView === viewsType.recent}
                component={HistoryFeed}
                sessionsFeed={sessionsFeed}
                sessionsFeedKeys={sessionsFeedKeys}
                onLoadMore={loadMoreHistory}
                // onObjectHover={handleOnObjectHover}
                onOpenUrl={Navigation.openUrls}
              />
              <Match
                when={currentView === viewsType.currentWindow}
                component={WindowsFeed}
                windowsFeed={windowsFeed.currentWindow}
                // onObjectHover={handleOnObjectHover}
                onOpenUrl={Navigation.openUrls}
              />
              <Match
                when={currentView === viewsType.allOpen}
                component={WindowsFeed}
                windowsFeed={windowsFeed.allOpen}
                // onObjectHover={handleOnObjectHover}
                onOpenUrl={Navigation.openUrls}
              />
              <Match
                when={
                  currentView === viewsType.relatedLinks ||
                  currentView === viewsType.savedFiles
                }
                component={Views.Feed}
                onOpenUrl={Navigation.openUrls}
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
    </Jumper.Root>
  );
}
