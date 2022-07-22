import * as React from "react";
import * as Typography from "../Components/system/Typography";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";
import * as RovingTabIndex from "./RovingTabIndex";
import * as MultiSelection from "./MultiSelection";

import { css } from "@emotion/react";
import {
  ComboboxNavigation,
  useComboboxNavigation,
} from "./ComboboxNavigation";
import { isNewTab, copyToClipboard, mergeEvents } from "../Common/utilities";
import { Checkbox } from "./system";
// NOTE(amine): hacky way to resolve shared hook between jumper and new tab
import { useViewer as useJumperViewer } from "../Core/viewer/app/jumper";
import { useViewer as useNewTabViewer } from "../Core/viewer/app/newTab";
const useViewer = isNewTab ? useNewTabViewer : useJumperViewer;

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
  &:focus {
    background-color: ${theme.semantic.bgGrayLight};
  }

  .object_action_button {
    display: none;
  }
  &:focus .object_action_button {
    display: block;
  }

  .object_favicon {
    display: block;
  }
  &:focus .object_favicon {
    display: none;
  }

  .object_checkbox {
    display: none;
  }
  &:focus .object_checkbox {
    display: block;
  }
`;

const STYLES_TEXT_BLACK = (theme) => css`
  color: ${theme.semantic.textBlack};
`;

const STYLES_COLOR_SYSTEM_GREEN = (theme) => css`
  color: ${theme.system.green};
`;

const STYLES_OBJECT = css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
`;

const STYLES_OBJECT_ACTION_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  padding: 2px;
  border-radius: 6px;
  color: ${theme.semantic.textBlack};
`;

const STYLES_OBJECT_ACTIONS_WRAPPER = css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  & > * + * {
    margin-left: 8px !important;
  }
`;

const useCopyState = (url) => {
  const [isCopied, setCopied] = React.useState(false);
  React.useEffect(() => {
    let timeout;
    if (isCopied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }

    return () => clearTimeout(timeout);
  }, [isCopied]);

  const handleCopying = () => {
    setCopied(true);
    copyToClipboard(url);
  };

  return { isCopied, handleCopying };
};

const CopyAction = ({ isCopied, ...props }) => {
  return (
    <button css={STYLES_OBJECT_ACTION_BUTTON} {...props}>
      {isCopied ? (
        <SVG.Check width={16} height={16} />
      ) : (
        <SVG.CopyAndPaste width={16} height={16} />
      )}
    </button>
  );
};

const Object = React.forwardRef(
  (
    {
      Favicon,
      title,
      css,
      isSelected,
      withActions = false,
      relatedVisits,
      favicon,

      isActiveTab,
      onCloseTab,

      withMultiSelection,
      isChecked,
      onCheck,

      url,
      isSaved: isSavedProp,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const { savedObjects, saveLink } = useViewer();
    const isSaved = url in savedObjects || isSavedProp;

    const handleLinkSaving = (e) => (
      e.stopPropagation(), e.preventDefault(), saveLink({ url, title, favicon })
    );
    const handleOnChecking = (e) => onCheck(e.target.checked);

    const { isCopied, handleCopying } = useCopyState(url);

    const preventFocus = (e) => e.preventDefault();

    const handleKeyboardActions = (e) => {
      if (e.code === "KeyS") {
        handleLinkSaving(e);
        return;
      }

      if (e.code === "KeyC") {
        handleCopying();
        return;
      }

      if (onCloseTab && e.code === "KeyX") {
        onCloseTab();
        return;
      }
    };

    return (
      <button
        ref={ref}
        css={[
          STYLES_OBJECT,
          isSelected && STYLES_OBJECT_SELECTED,
          // NOTE(amine): if the 'isSelected' prop isn't set, add hover and focus styles
          typeof isSelected === "undefined" &&
            STYLES_OBJECT_HOVER_AND_FOCUS_STATE,
          css,
        ]}
        onKeyDown={mergeEvents(handleKeyboardActions, onKeyDown)}
        {...props}
      >
        {withMultiSelection && (
          <Checkbox
            className="object_checkbox"
            checked={isChecked}
            onChange={handleOnChecking}
            style={{ display: isChecked && "block" }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.preventDefault()}
          />
        )}
        <Favicon
          className="object_favicon"
          css={STYLES_TEXT_BLACK}
          style={{ margin: 2, flexShrink: 0, display: isChecked && "none" }}
        />
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
          <div
            css={STYLES_OBJECT_ACTIONS_WRAPPER}
            style={{ marginLeft: "auto" }}
          >
            {(typeof isSelected === "undefined" || isSelected) && (
              <>
                <button
                  className="object_action_button"
                  css={STYLES_OBJECT_ACTION_BUTTON}
                  onMouseDown={preventFocus}
                >
                  <SVG.Hash width={16} height={16} />
                </button>
                <CopyAction
                  className="object_action_button"
                  isCopied={isCopied}
                  onClick={(e) => (
                    e.stopPropagation(), e.preventDefault(), handleCopying()
                  )}
                  onMouseDown={preventFocus}
                  url={url}
                />
                <button
                  className="object_action_button"
                  css={STYLES_OBJECT_ACTION_BUTTON}
                  onMouseDown={preventFocus}
                >
                  <SVG.Trash width={16} height={16} />
                </button>
                {onCloseTab && !isActiveTab && (
                  <button
                    className="object_action_button"
                    css={STYLES_OBJECT_ACTION_BUTTON}
                    onClick={(e) => (
                      e.stopPropagation(), e.preventDefault(), onCloseTab()
                    )}
                    onMouseDown={preventFocus}
                  >
                    <SVG.XCircle width={16} height={16} />
                  </button>
                )}
                {isActiveTab && (
                  <div style={{ padding: 2 }}>
                    <SVG.Star width={16} height={16} />
                  </div>
                )}
                {!isSaved && (
                  <button
                    className="object_action_button"
                    css={STYLES_OBJECT_ACTION_BUTTON}
                    onClick={handleLinkSaving}
                    onMouseDown={preventFocus}
                  >
                    <SVG.Plus width={16} height={16} />
                  </button>
                )}
              </>
            )}

            {isSaved && (
              <div css={STYLES_COLOR_SYSTEM_GREEN} style={{ padding: 2 }}>
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

/* -------------------------------------------------------------------------------------------------
 * ListView RovingTabIndexWithMultiSelectObject
 * Supports for ./RovingTabIndex component
 * Supports for ./MultiSelection component
 * -----------------------------------------------------------------------------------------------*/

const RovingTabIndexWithMultiSelectObject = ({ index, ...props }) => {
  const {
    isIndexChecked,

    createHandleOnIndexCheckChange,
    createHandleKeyDownNavigation,
  } = MultiSelection.useMultiSelectionContext();

  return (
    <RovingTabIndex.Item index={index}>
      <Object
        index={index}
        withMultiSelection
        isChecked={isIndexChecked(index)}
        onCheck={createHandleOnIndexCheckChange(index)}
        onKeyDown={createHandleKeyDownNavigation(index)}
        {...props}
      />
    </RovingTabIndex.Item>
  );
};

export {
  Root,
  Section,
  Title,
  Object,
  ComboboxObject,
  RovingTabIndexWithMultiSelectObject,
};
