import * as React from "react";
import * as Typography from "../Components/system/Typography";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";
import * as ListView from "../Components/ListView";
import * as Navigation from "../Core/navigation/app";

import HistoryFeed from "../Components/HistoryFeed";

import { Divider } from "../Components/Divider";
import { css } from "@emotion/react";
import {
  useGetRelatedLinks,
  useHistorySearch,
  useViews,
} from "../Core/history/app";
import { useHistory } from "../Core/history/app/jumper";
import { getFavicon } from "../Common/favicons";

/* -------------------------------------------------------------------------------------------------
 * Object and Session previews
 * -----------------------------------------------------------------------------------------------*/

const STYLES_OBJECT_PREVIEW_LIST_WRAPPER = css`
  padding: 0px 8px 24px;
  @keyframes object-preview-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  animation: object-preview-fade-in 250ms ease;
`;

function ObjectPreview({ url, ...props }) {
  const relatedLinks = useGetRelatedLinks(url);
  return (
    relatedLinks && (
      <ListView.Section {...props}>
        <ListView.Title
          css={STYLES_RELATED_LINKS_POPUP_HEADER}
          count={relatedLinks.length}
        >
          Related
        </ListView.Title>
        <div css={STYLES_OBJECT_PREVIEW_LIST_WRAPPER}>
          {relatedLinks
            .flatMap(({ item: session }) => session.visits)
            .map((visit, i) => (
              <ListView.Object
                key={visit.id + i}
                title={visit.title}
                Favicon={getFavicon(visit.rootDomain)}
                onClick={() => Navigation.openUrls({ urls: [visit.url] })}
                onMouseEnter={(e) => e.target.focus()}
              />
            ))}
        </div>
      </ListView.Section>
    )
  );
}

const STYLES_SESSION_PREVIEW_WRAPPER = css`
  padding: 120px 24px;
`;

const STYLES_SESSION_PREVIEW_LIST_ICON = (theme) => css`
  ${Styles.CONTAINER_CENTERED};
  flex-shrink: 0;
  height: 52px;
  width: 52px;
  border-radius: 16px;
  background-color: ${theme.semantic.bgGrayLight};
  color: ${theme.semantic.textBlack};
`;

const STYLES_SESSION_PREVIEW_HEADER = css`
  ${Styles.HORIZONTAL_CONTAINER};
`;

// const STYLES_SESSION_PREVIEW_TAGS = css``;

const STYLES_SESSION_PREVIEW_ACTION = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  color: ${theme.semantic.textBlack};
`;

function SessionPreview({ session }) {
  const handleOpenAllLinks = ({ newWindow = false } = { newWindow: false }) => {
    Navigation.openUrls({
      urls: session.visits.map((visit) => visit.url),
      query: { newWindow },
    });
  };

  return (
    <div css={STYLES_SESSION_PREVIEW_WRAPPER}>
      <div css={STYLES_SESSION_PREVIEW_HEADER}>
        <div css={STYLES_SESSION_PREVIEW_LIST_ICON}>
          <SVG.List width={16} height={16} />
        </div>
        <div style={{ marginLeft: 16 }}>
          <Typography.H4 color="textBlack" as="p" nbrOflines={1}>
            {session.title}
          </Typography.H4>
          <Typography.H4 color="textGrayDark" as="p">
            {session.visits.length} session links
          </Typography.H4>
        </div>
      </div>

      <Divider
        color="borderGrayLight"
        style={{ marginTop: 20, marginBottom: 20 }}
      />

      <div>
        <button
          css={STYLES_SESSION_PREVIEW_ACTION}
          onClick={handleOpenAllLinks}
        >
          <SVG.ExternalLink width={16} height={16} />
          <Typography.H4 color="textGrayDark" style={{ marginLeft: 12 }}>
            Open All Links
          </Typography.H4>
        </button>
        <button
          css={STYLES_SESSION_PREVIEW_ACTION}
          style={{ marginTop: 12 }}
          onClick={() => handleOpenAllLinks({ newWindow: true })}
        >
          <SVG.ExternalLink width={16} height={16} />
          <Typography.H4 color="textGrayDark" style={{ marginLeft: 12 }}>
            Open In a New Window
          </Typography.H4>
        </button>
      </div>
      <Divider color="borderGrayLight" style={{ marginTop: 20 }} />
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * History Scene
 * -----------------------------------------------------------------------------------------------*/

const jumperFadeInAnimation = css`
  @keyframes jumper-fade-in {
    0% {
      opacity: 0;
      transform: translateY(100px);
    }
    57% {
      opacity: 0;
      transform: translateY(100px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  animation: jumper-fade-in 350ms ease;
`;

const MODALS_WIDTH = 696;
const STYLES_APP_MODAL_POSITION = css`
  height: 432px;
  width: ${MODALS_WIDTH}px;
  position: fixed;
  z-index: 23423423432;
  top: 50%;
  left: 50%;
  margin-left: calc(-696px / 2);
  margin-top: calc(-548px / 2);
`;

const STYLES_APP_MODAL = (theme) => css`
  ${Styles.VERTICAL_CONTAINER};
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px solid ${theme.semantic.borderGrayLight};
  box-shadow: ${theme.shadow.darkLarge};
  //NOTE(amine): when changing border-radius, change it also in STYLES_MARBLE_WRAPPER and STYLES_APP_MODAL_BACKGROUND
  border-radius: 24px;
  overflow: hidden;

  ${jumperFadeInAnimation};
`;

const STYLES_MARBLE_WRAPPER = css`
  position: absolute;
  top: 0%;
  left: 0%;
  height: 100%;
  width: 100%;
  overflow: hidden;
  border-radius: 24px;
  z-index: -1;

  ${jumperFadeInAnimation};
`;

const STYLES_APP_MODAL_BACKGROUND = (theme) => css`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: ${theme.semantic.white};
  border-radius: 24px;
  @supports (
    (-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))
  ) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhite};
  }

  ${jumperFadeInAnimation};
`;

const STYLES_SEARCH_WRAPPER = css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  position: relative;
  height: 56px;
`;

const STYLES_SEARCH_INPUT = (theme) => css`
  ${Styles.H3};

  font-family: ${theme.font.text};
  -webkit-appearance: none;
  width: 100%;
  height: 100%;
  padding: 0px 24px;
  padding-left: ${DISMISS_BUTTON_WIDTH + 24}px;
  background-color: transparent;
  outline: 0;
  border: none;
  box-sizing: border-box;

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${theme.semantic.textGrayLight};
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${theme.semantic.textGrayLight};
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${theme.semantic.textGrayLight};
  }
`;

const STYLES_VIEWS_MENU = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER};
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 56px;
  left: 0%;
  top: -17px;
  transform: translateY(-100%);
  padding: 12px 24px;
  border-radius: 24px;
  background-color: white;
  border: 1px solid ${theme.semantic.borderGrayLight4};
  box-shadow: ${theme.shadow.darkLarge};

  @supports (
    (-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))
  ) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhiteOP};
  }

  @keyframes views-menu-fade-in {
    from {
      opacity: 0;
      transform: translateY(calc(-100% + 16px));
    }
    to {
      opacity: 1;
      transform: translateY(-100%);
    }
  }

  animation: views-menu-fade-in 200ms ease;
`;

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

const STYLES_RELATED_LINKS_POPUP_HEADER = css`
  ${Styles.HORIZONTAL_CONTAINER};
  padding: 13px 16px 11px;
`;

const STYLES_RELATED_LINKS_POPUP = (theme) => css`
  position: absolute;
  height: 376px;
  width: calc(((100vw - ${MODALS_WIDTH}px) / 2) - 24px * 2);
  max-width: 348px;
  bottom: 0%;
  right: -16px;
  transform: translateX(100%);
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  border-radius: 24px;
  background-color: ${theme.semantic.bgWhite};
  box-shadow: ${theme.shadow.darkLarge};
`;

const STYLES_FILTER_TOGGLE_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 16px;

  width: 32px;
  height: 32px;
  border-radius: 8px;
  padding: 8px;
  background-color: ${theme.semantic.bgGrayLight};
  color: ${theme.system.blue};
`;

const STYLES_FILTER_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  border-radius: 12px;
  padding: 5px 12px 7px;
  width: 78px;
  border: 1px solid ${theme.semantic.borderGrayLight};
  color: ${theme.system.blue};
`;

const DISMISS_BUTTON_WIDTH = 16;
const STYLES_DISMISS_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 24px;
  display: block;
  color: ${theme.semantic.textGray};
`;

function SearchDismiss({ css, ...props }) {
  return (
    <button css={[STYLES_DISMISS_BUTTON, css]} {...props}>
      <SVG.Dismiss
        style={{ display: "block", marginLeft: 12 }}
        height={DISMISS_BUTTON_WIDTH}
        width={DISMISS_BUTTON_WIDTH}
      />
    </button>
  );
}

export default function History() {
  const [preview, setPreview] = React.useState();

  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") Navigation.closeExtensionJumper();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const inputRef = React.useRef();
  const [search, { handleInputChange, clearSearch }] = useHistorySearch({
    inputRef,
  });
  const { sessionsFeed, sessionsFeedKeys, windowsFeed, loadMoreHistory } =
    useHistory();

  const { viewsFeed, viewQuery, viewsType, getViewsFeed, currentView } =
    useViews();

  // NOTE(amine) don't render the app when history isn't available
  if (sessionsFeedKeys.length === 0) return null;

  return (
    <div css={STYLES_APP_MODAL_POSITION}>
      <section css={STYLES_VIEWS_MENU}>
        <Typography.H5
          css={[
            STYLES_VIEWS_BUTTON,
            currentView === viewsType.recent && STYLES_VIEWS_BUTTON_ACTIVE,
          ]}
          as="button"
          onClick={() => getViewsFeed({ type: viewsType.recent })}
        >
          Recent
        </Typography.H5>

        <Typography.H5
          css={[
            STYLES_VIEWS_BUTTON,
            currentView === viewsType.relatedLinks &&
              viewQuery === "https://twitter.com/" &&
              STYLES_VIEWS_BUTTON_ACTIVE,
          ]}
          as="button"
          style={{ marginLeft: 12 }}
          onClick={() =>
            getViewsFeed({
              type: viewsType.relatedLinks,
              query: "https://twitter.com/",
            })
          }
        >
          Twitter
        </Typography.H5>

        <Typography.H5
          css={[
            STYLES_VIEWS_BUTTON,
            currentView === viewsType.relatedLinks &&
              viewQuery === "https://www.youtube.com/" &&
              STYLES_VIEWS_BUTTON_ACTIVE,
          ]}
          as="button"
          style={{ marginLeft: 12 }}
          onClick={() =>
            getViewsFeed({
              type: viewsType.relatedLinks,
              query: "https://www.youtube.com/",
            })
          }
        >
          Youtube
        </Typography.H5>

        <Typography.H5
          css={[
            STYLES_VIEWS_BUTTON,
            currentView === viewsType.relatedLinks &&
              viewQuery === "https://news.ycombinator.com/" &&
              STYLES_VIEWS_BUTTON_ACTIVE,
          ]}
          as="button"
          style={{ marginLeft: 12 }}
          onClick={() =>
            getViewsFeed({
              type: viewsType.relatedLinks,
              query: "https://news.ycombinator.com/",
            })
          }
        >
          Hacker news
        </Typography.H5>

        <Typography.H5
          css={[
            STYLES_VIEWS_BUTTON,
            currentView === viewsType.relatedLinks &&
              viewQuery === "https://developer.chrome.com/" &&
              STYLES_VIEWS_BUTTON_ACTIVE,
          ]}
          as="button"
          style={{ marginLeft: 12 }}
          onClick={() =>
            getViewsFeed({
              type: viewsType.relatedLinks,
              query: "https://www.google.com/search?",
            })
          }
        >
          Google Searches
        </Typography.H5>

        <button css={STYLES_VIEWS_ADD_BUTTON}>
          <SVG.Plus width={16} height={16} />
        </button>
      </section>

      {preview && currentView === viewsType.recent && (
        <div css={STYLES_RELATED_LINKS_POPUP}>
          {preview.type === "session" ? (
            <SessionPreview session={preview.session} />
          ) : (
            <ObjectPreview url={preview.url} />
          )}
        </div>
      )}

      <div css={STYLES_APP_MODAL}>
        <section css={STYLES_SEARCH_WRAPPER}>
          <input
            css={STYLES_SEARCH_INPUT}
            ref={inputRef}
            placeholder="Search by keywords, filters, tags"
            name="search"
            onChange={handleInputChange}
            autoComplete="off"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          {search.query.length > 0 ? (
            <SearchDismiss onClick={clearSearch} />
          ) : (
            <button css={STYLES_FILTER_TOGGLE_BUTTON}>
              <SVG.Filter width={16} height={16} />
            </button>
          )}
        </section>
        <Divider color="borderGrayLight" />
        <button css={STYLES_FILTER_BUTTON} style={{ margin: "8px 16px" }}>
          <SVG.Plus width={16} height={16} />
          <Typography.H5 as="span">Filter</Typography.H5>
        </button>
        <Divider color="borderGrayLight" />
        <section
          css={Styles.HORIZONTAL_CONTAINER}
          style={{ height: "100%", flex: 1, overflow: "hidden" }}
        >
          {search.query.length > 0 && search.result ? (
            <SearchFeed sessions={search.result} setPreview={setPreview} />
          ) : currentView === viewsType.recent ? (
            <HistoryFeed
              sessionsFeed={sessionsFeed}
              sessionsFeedKeys={sessionsFeedKeys}
              windowsFeed={windowsFeed}
              loadMoreHistory={loadMoreHistory}
              setPreview={setPreview}
            />
          ) : (
            <SearchFeed sessions={viewsFeed} setPreview={setPreview} />
          )}
        </section>
      </div>
      <div css={STYLES_MARBLE_WRAPPER}>
        <SVG.Marble />
      </div>
      <div css={STYLES_APP_MODAL_BACKGROUND} />
    </div>
  );
}

const SearchFeed = React.memo(({ sessions, setPreview }) => {
  return (
    <ListView.Root>
      <ListView.Title count={sessions.length}>Result</ListView.Title>
      <div key={sessions.length}>
        {sessions.map(({ item: session }) => {
          return session.visits.map((visit) => (
            <ListView.Object
              key={session.id + visit.id}
              title={visit.title}
              Favicon={getFavicon(visit.rootDomain)}
              onClick={() => Navigation.openUrls({ urls: [visit.url] })}
              onMouseEnter={() => setPreview({ type: "link", url: visit.url })}
            />
          ));
        })}
      </div>
    </ListView.Root>
  );
});
