import * as React from "react";
import * as Typography from "../Components/system/Typography";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";

import { css } from "@emotion/react";
import { useHistory } from "../Core/history/app";
import { useModalContext } from "../Contexts/ModalProvider";
import { sendOpenUrlsRequest } from "../Utilities/navigation";

/* -------------------------------------------------------------------------------------------------
 * History List
 * -----------------------------------------------------------------------------------------------*/

const STYLES_OBJECT = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  width: 100%;
  padding: 10px 16px;
  border-radius: 12px;
  &:hover {
    background-color: ${theme.semantic.bgGrayLight};
  }
`;

const Object = ({ favicon, title, onHover, ...props }) => {
  return (
    <button css={STYLES_OBJECT} onMouseEnter={onHover} {...props}>
      <img
        alt="url favicon"
        height={16}
        width={16}
        style={{ margin: 2 }}
        src={favicon}
      />
      <Typography.H4
        style={{ width: 384, marginLeft: 16 }}
        color="textBlack"
        nbrOflines={1}
      >
        {title}
      </Typography.H4>
    </button>
  );
};

/** ------------------------- */

const STYLES_SESSION_OBJECTS_COUNT = (theme) => css`
  background-color: ${theme.semantic.bgGrayLight};
  height: 20px;
  width: 20px;
  text-align: center;
  border-radius: 4px;
`;

const STYLES_SESSION_TITLE_WRAPPER = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  border-radius: 12px;
  padding: 10px 16px;

  &:hover {
    background-color: ${theme.semantic.bgGrayLight};
  }
`;

const STYLES_SESSION_OBJECTS_WRAPPER = (theme) => css`
  margin-left: 26px;
  padding-left: 10px;
  border-left: 1px solid ${theme.semantic.borderGrayLight};
`;

const STYLES_SESSION_OBJECT = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  width: 100%;
  border-radius: 12px;
  padding: 10px 10px 10px 16px;

  &:hover {
    background-color: ${theme.semantic.bgGrayLight};
  }
`;

const STYLES_SESSION_VIEW_MORE = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  color: ${theme.system.blue};
  padding: 10px 16px;
  &:hover {
    color: ${theme.system.blue};
  }
`;

const Session = ({ session, onObjectHover, onSessionHover }) => {
  const [isExpanded, setisExpanded] = React.useState(
    session.visits.length < 5 ? true : false
  );
  const showMoreVisits = () => setisExpanded(true);

  return (
    <div>
      <div
        css={STYLES_SESSION_TITLE_WRAPPER}
        onMouseEnter={() => onSessionHover()}
      >
        <div css={STYLES_SESSION_OBJECTS_COUNT}>
          <Typography.H6 as="p" style={{ textAlign: "center" }}>
            {session.visits.length}
          </Typography.H6>
        </div>
        <Typography.H4
          color="textBlack"
          nbrOflines={1}
          style={{ marginLeft: 16 }}
        >
          {session.title}
        </Typography.H4>
      </div>
      <div css={STYLES_SESSION_OBJECTS_WRAPPER}>
        {(isExpanded ? session.visits : session.visits.slice(0, 4)).map(
          (visit, i) => (
            <button
              css={STYLES_SESSION_OBJECT}
              key={i}
              onMouseEnter={() => onObjectHover(visit.url)}
              onClick={() => sendOpenUrlsRequest({ urls: [visit.url] })}
            >
              <img
                alt="url favicon"
                height={16}
                width={16}
                style={{ margin: 2 }}
                src={visit.favicon}
              />
              <Typography.H4
                style={{ width: 384, marginLeft: 16 }}
                color="textBlack"
                nbrOflines={1}
              >
                {visit.title}
              </Typography.H4>
            </button>
          )
        )}
      </div>
      {!isExpanded && (
        <div>
          <button css={STYLES_SESSION_VIEW_MORE} onClick={showMoreVisits}>
            <SVG.Expand style={{ margin: 2 }} />
            <span style={{ marginLeft: 16 }}>View more session links</span>
          </button>
        </div>
      )}
    </div>
  );
};

const STYLES_LINKS_CONTAINER = css`
  height: 100%;
  flex: 1;
  padding: 0px 24px;
  overflow-y: auto;
`;

const Wrapper = ({ children, ...props }) => {
  return (
    <ul css={STYLES_LINKS_CONTAINER} {...props}>
      {children}
    </ul>
  );
};

const STYLES_SESSION_TITLE = css`
  padding: 14px 0px;
`;

const Title = ({ children, ...props }) => {
  return (
    <Typography.H4
      css={STYLES_SESSION_TITLE}
      color="textGray"
      as="p"
      nbrOflines={1}
      {...props}
    >
      {children}
    </Typography.H4>
  );
};

const HistoryList = {
  Wrapper,
  Title,
  Object,
  Session,
};

/* -------------------------------------------------------------------------------------------------
 * Object and Session previews
 * -----------------------------------------------------------------------------------------------*/

function ObjectPreview({ url }) {
  return (
    <object
      data={url}
      style={{ width: "100%", height: "100%" }}
      title="preview"
    />
  );
}

const STYLES_SESSION_PREVIEW_WRAPPER = css`
  padding: 120px 24px;
`;

const STYLES_SESSION_PREVIEW_HEADER = css``;

// const STYLES_SESSION_PREVIEW_TAGS = css``;

const STYLES_SESSION_PREVIEW_ACTIONS = css``;

function SessionPreview({ session }) {
  const handleOpenAllLinks = () => {
    session.visits.forEach((visit) => {
      window.open(visit.url, "_blank");
    });
  };

  return (
    <div css={STYLES_SESSION_PREVIEW_WRAPPER}>
      <div css={STYLES_SESSION_PREVIEW_HEADER}>
        <div></div>
        <div>
          <Typography.H4 color="textBlack" as="p" nbrOflines={1}>
            {session.title}
          </Typography.H4>
          <Typography.H4 color="textGrayDark" as="p">
            {session.visits.length} session links
          </Typography.H4>
        </div>
      </div>
      {/* <div css={STYLES_SESSION_PREVIEW_TAGS}>

      </div> */}
      <div css={STYLES_SESSION_PREVIEW_ACTIONS}>
        <button onClick={handleOpenAllLinks}>
          <Typography.H4 color="textGrayDark">Open All Links</Typography.H4>
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * History Scene
 * -----------------------------------------------------------------------------------------------*/

const STYLES_APP_MODAL = (theme) => css`
  ${Styles.VERTICAL_CONTAINER};
  height: 90vh;
  width: 80%;
  position: fixed;
  z-index: 23423423432;
  top: 50%;
  left: 50%;
  margin-left: -40%;
  margin-top: -45vh;
  box-shadow: ${theme.shadow.darkLarge};
  border-radius: 12px;
  background-color: white;

  @keyframes app-modal-fade-in {
    from {
      transform: translateY(100px) scale(0.9);
      opacity: 0;
    }
    to {
      transform: translateY(0px) scale(1);
      opacity: 1;
    }
  }

  animation: app-modal-fade-in 250ms ease;
`;

const STYLES_SEARCH_WRAPPER = (theme) => css`
  height: 68px;
  border-bottom: 1px solid ${theme.semantic.borderGrayLight};
`;

const STYLES_VIEWS_MENU = (theme) => css`
  height: 56px;
  border-bottom: 1px solid ${theme.semantic.borderGrayLight};
`;

const STYLES_LINK_PREVIEW = (theme) => css`
  width: 480px;
  height: 100%;
  border-left: 1px solid ${theme.semantic.borderGrayLight};
`;

export default function History() {
  const { sessionsFeed, sessionsFeedKeys, windowsFeed, loadMoreHistory } =
    useHistory();

  const [preview, setPreview] = React.useState();

  const { closeModal } = useModalContext();

  React.useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div css={STYLES_APP_MODAL}>
      <section css={STYLES_SEARCH_WRAPPER} />

      <section css={STYLES_VIEWS_MENU} />

      <section
        css={Styles.HORIZONTAL_CONTAINER}
        style={{ flex: 1, height: "100px" }}
      >
        <HistoryList.Wrapper>
          {windowsFeed.thisWindow.length ? (
            <>
              <HistoryList.Title>
                This Window&nbsp;&nbsp;
                {windowsFeed.thisWindow.length}
              </HistoryList.Title>
              {windowsFeed.thisWindow.map((tab) => (
                <HistoryList.Object
                  key={tab.id}
                  title={tab.title}
                  favicon={tab.favicon}
                  onClick={() =>
                    sendOpenUrlsRequest({
                      query: { tabId: tab.id, windowId: tab.windowId },
                    })
                  }
                  onHover={() =>
                    setPreview({
                      type: "link",
                      url: tab.url,
                    })
                  }
                />
              ))}
            </>
          ) : null}

          {windowsFeed.currentlyOpen.length ? (
            <>
              <HistoryList.Title>
                Currently Open&nbsp;&nbsp;
                {windowsFeed.currentlyOpen.length}
              </HistoryList.Title>
              {windowsFeed.currentlyOpen.map((tab) => (
                <HistoryList.Object
                  key={tab.id}
                  title={tab.title}
                  favicon={tab.favicon}
                  onClick={() =>
                    sendOpenUrlsRequest({
                      query: { tabId: tab.id, windowId: tab.windowId },
                    })
                  }
                  onHover={() =>
                    setPreview({
                      type: "link",
                      url: tab.url,
                    })
                  }
                />
              ))}
            </>
          ) : null}

          {sessionsFeedKeys.map((key) => {
            return (
              <>
                <HistoryList.Title>{key}</HistoryList.Title>
                <div>
                  {sessionsFeed[key].map((session) =>
                    session.visits.length === 1 ? (
                      <HistoryList.Object
                        title={session.title}
                        favicon={session.visits[0].favicon}
                        onClick={() =>
                          sendOpenUrlsRequest({
                            urls: [session.visits[0].url],
                          })
                        }
                        onHover={() =>
                          setPreview({
                            type: "link",
                            url: session.visits[0].url,
                          })
                        }
                      />
                    ) : (
                      <HistoryList.Session
                        key={session.id}
                        onObjectHover={(url) =>
                          setPreview({
                            type: "link",
                            url,
                          })
                        }
                        onSessionHover={() =>
                          setPreview({
                            type: "session",
                            session: session,
                          })
                        }
                        session={session}
                      />
                    )
                  )}
                </div>
              </>
            );
          })}
        </HistoryList.Wrapper>
        <div css={STYLES_LINK_PREVIEW}>
          {preview &&
            (preview.type === "session" ? (
              <SessionPreview session={preview.session} />
            ) : (
              <ObjectPreview url={preview.url} />
            ))}
        </div>
      </section>
    </div>
  );
}
