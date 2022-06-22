import * as React from "react";
import * as Typography from "../Components/system/Typography";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";

import { css } from "@emotion/react";
import {
  ComboboxNavigation,
  useComboboxNavigation,
} from "./ComboboxNavigation";

/* -------------------------------------------------------------------------------------------------
 * ListView Root
 * -----------------------------------------------------------------------------------------------*/

const STYLES_LIST_VIEW_ROOT = css`
  height: 100%;
  flex: 1;
  padding: 0px 8px 8px;
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

const Section = React.forwardRef(({ children, css, ...props }, ref) => (
  <ul ref={ref} css={[STYLES_LIST_VIEW_SECTION, css]} {...props}>
    {children}
  </ul>
));

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

const STYLES_OBJECT_SELECTED = (theme) => css`
  background-color: ${theme.semantic.bgGrayLight};
`;

const STYLES_OBJECT_HOVER_AND_FOCUS_STATE = (theme) => css`
  &:hover {
    background-color: ${theme.semantic.bgGrayLight};
  }
  &:focus {
    background-color: ${theme.semantic.bgGrayLight};
  }
`;

const STYLES_OBJECT = css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
`;

const STYLES_RELATED_LINKS_TOTAL = (theme) => css`
  ${Styles.CONTAINER_CENTERED};
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: ${theme.semantic.bgGrayLight};
`;

const STYLES_COLOR_SYSTEM_GREEN = (theme) => css`
  color: ${theme.system.green};
`;

const Object = React.forwardRef(
  (
    {
      Favicon,
      title,
      css,
      isSelected,
      withActions = false,
      relatedVisits,
      isSaved,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        css={[
          STYLES_OBJECT,
          isSelected && STYLES_OBJECT_SELECTED,
          // NOTE(amine): if the 'isSelected' prop is set, don't show the hover styles
          typeof isSelected === "undefined" &&
            STYLES_OBJECT_HOVER_AND_FOCUS_STATE,
          css,
        ]}
        {...props}
      >
        <Favicon style={{ margin: 2, flexShrink: 0 }} />
        <Typography.H5
          style={{ maxWidth: 384, marginLeft: 12 }}
          color="textBlack"
          nbrOflines={1}
        >
          {title}
        </Typography.H5>
        {relatedVisits?.length ? (
          <Typography.H5 color="textGray" style={{ marginLeft: 12 }}>
            {relatedVisits.length + 1}
          </Typography.H5>
        ) : null}
        {withActions && (
          <div style={{ marginLeft: "auto" }}>
            {isSaved && (
              <div css={STYLES_COLOR_SYSTEM_GREEN} style={{ margin: 2 }}>
                <SVG.CheckCircle />
              </div>
            )}
          </div>
        )}
      </button>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * ListView ComboboxButton
 * Supports for ./Combobox component
 * -----------------------------------------------------------------------------------------------*/

const ComboboxObject = ({ onSelect, onSubmit, index, key, ...props }) => {
  const { checkIfIndexSelected } = useComboboxNavigation();

  return (
    <ComboboxNavigation.MenuButton
      key={key}
      index={index}
      onSelect={onSelect}
      onSubmit={onSubmit}
    >
      <Object isSelected={checkIfIndexSelected(index)} {...props} />
    </ComboboxNavigation.MenuButton>
  );
};

export { Root, Section, Title, Object, ComboboxObject };
