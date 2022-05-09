import * as React from "react";
import * as Typography from "../Components/system/Typography";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";

import HistoryFeed from "../Components/HistoryFeed";

import { useHistory } from "../Core/history/app/newTab";
import { Divider } from "../Components/Divider";
import { css } from "@emotion/react";

/* -------------------------------------------------------------------------------------------------
 * History Scene
 * -----------------------------------------------------------------------------------------------*/

const STYLES_APP_MODAL = (theme) => css`
  ${Styles.VERTICAL_CONTAINER};
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px solid ${theme.semantic.borderGrayLight};
  box-shadow: ${theme.shadow.darkLarge};
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
  width: 100%;
  height: 56px;

  padding: 12px 24px;
  background-color: ${theme.semantic.bgWhite};
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

const STYLES_FILTERS_MENU = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER};
  width: 100%;

  padding: 12px 24px;
  background-color: ${theme.semantic.bgWhite};
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

export default function HistoryScene() {
  const { windowsFeed, sessionsFeed, sessionsFeedKeys, loadMoreHistory } =
    useHistory();

  return (
    <div css={STYLES_APP_MODAL}>
      <section css={STYLES_SEARCH_WRAPPER}>
        <input
          css={STYLES_SEARCH_INPUT}
          placeholder="Search by keywords, filters, tags"
          name="search"
          autoComplete="off"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />

        <button css={STYLES_FILTER_TOGGLE_BUTTON}>
          <SVG.Filter width={16} height={16} />
        </button>
      </section>

      <Divider color="borderGrayLight" />

      <section css={STYLES_VIEWS_MENU}>
        <Typography.H5
          css={[STYLES_VIEWS_BUTTON, STYLES_VIEWS_BUTTON_ACTIVE]}
          as="button"
        >
          Recent
        </Typography.H5>

        <Typography.H5
          css={[STYLES_VIEWS_BUTTON]}
          as="button"
          style={{ marginLeft: 12 }}
        >
          Twitter
        </Typography.H5>

        <Typography.H5
          css={[STYLES_VIEWS_BUTTON]}
          as="button"
          style={{ marginLeft: 12 }}
        >
          Youtube
        </Typography.H5>

        <Typography.H5
          css={[STYLES_VIEWS_BUTTON]}
          as="button"
          style={{ marginLeft: 12 }}
        >
          Hacker news
        </Typography.H5>

        <Typography.H5
          css={[STYLES_VIEWS_BUTTON]}
          as="button"
          style={{ marginLeft: 12 }}
        >
          Google Searches
        </Typography.H5>

        <button css={STYLES_VIEWS_ADD_BUTTON}>
          <SVG.Plus width={16} height={16} />
        </button>
      </section>

      <Divider color="borderGrayLight" />

      <section
        css={Styles.HORIZONTAL_CONTAINER}
        style={{ height: "100%", flex: 1, overflow: "hidden" }}
      >
        <div style={{ flexGrow: 1 }}>
          <section css={STYLES_FILTERS_MENU}>
            <button css={STYLES_FILTER_BUTTON}>
              <SVG.Plus width={16} height={16} />
              <Typography.H5 as="span">Filter</Typography.H5>
            </button>
          </section>
          <HistoryFeed
            windowsFeed={windowsFeed}
            sessionsFeed={sessionsFeed}
            sessionsFeedKeys={sessionsFeedKeys}
            onLoadMore={loadMoreHistory}
            onObjectHover={() => {}}
            style={{ padding: "0px 16px 32px" }}
          />
        </div>
        <Divider width="1px" height="100%" color="borderGrayLight" />
        <div style={{ width: 480 }}></div>
      </section>
    </div>
  );
}
