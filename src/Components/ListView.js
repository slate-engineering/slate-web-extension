import * as React from "react";
import * as Typography from "../Components/system/Typography";
import * as Styles from "../Common/styles";

import { css } from "@emotion/react";

/* -------------------------------------------------------------------------------------------------
 * ListView Root
 * -----------------------------------------------------------------------------------------------*/

const STYLES_LIST_VIEW_ROOT = css`
  height: 100%;
  flex: 1;
  padding: 0px 8px 32px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Root = React.forwardRef(({ children, css, ...props }, ref) => {
  return (
    <section ref={ref} css={[STYLES_LIST_VIEW_ROOT, css]} {...props}>
      {children}
    </section>
  );
});

/* -------------------------------------------------------------------------------------------------
 * ListView Section
 * -----------------------------------------------------------------------------------------------*/

const STYLES_LIST_VIEW_SECTION = css`
  list-style: none;
`;

const Section = ({ children, css, ...props }) => (
  <ul css={[STYLES_LIST_VIEW_SECTION, css]} {...props}>
    {children}
  </ul>
);

/* -------------------------------------------------------------------------------------------------
 * ListView Title
 * -----------------------------------------------------------------------------------------------*/

const STYLES_SESSION_TITLE = css`
  padding: 9px 8px 11px;
`;

const Title = ({ children, count, css, ...props }) => {
  return (
    <Typography.H5
      css={[STYLES_SESSION_TITLE, css]}
      color="textGrayDark"
      as="p"
      nbrOflines={1}
      {...props}
    >
      {children}
      {count && (
        <Typography.H5 as="span" color="textGrayLight">
          &nbsp;&nbsp;{count}
        </Typography.H5>
      )}
    </Typography.H5>
  );
};

/* -------------------------------------------------------------------------------------------------
 * ListView Object
 * -----------------------------------------------------------------------------------------------*/

const STYLES_OBJECT = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  &:hover {
    background-color: ${theme.semantic.bgGrayLight};
  }
`;

const Object = React.forwardRef(
  ({ Favicon, title, css, withActions = false, ...props }, ref) => {
    return (
      <li style={{ listStyle: "none" }}>
        <button ref={ref} css={[STYLES_OBJECT, css]} {...props}>
          <Favicon style={{ margin: 2, flexShrink: 0 }} />
          <Typography.H5
            style={{ width: 384, marginLeft: 12 }}
            color="textBlack"
            nbrOflines={1}
          >
            {title}
          </Typography.H5>
          {withActions && <div>actions...</div>}
        </button>
      </li>
    );
  }
);

export { Root, Section, Title, Object };
