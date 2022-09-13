import * as React from "react";
import * as Typography from "../Components/system/Typography";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";
import * as RovingTabIndex from "./RovingTabIndex";
import * as MultiSelection from "./MultiSelection";

import { css } from "@emotion/react";
import { Combobox, useComboboxNavigation } from "./ComboboxNavigation";
import { isNewTab, copyToClipboard, mergeEvents } from "../Common/utilities";
import { Checkbox } from "./system";
import { FixedSizeList, VariableSizeList } from "react-window";
// NOTE(amine): hacky way to resolve shared hook between jumper and new tab
import { useViewer as useJumperViewer } from "../Core/viewer/app/jumper";
import { useViewer as useNewTabViewer } from "../Core/viewer/app/newTab";
import { ShortcutsTooltip } from "../Components/Tooltip";
import { Favicon } from "../Components/Favicon";

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
 * ListView FixedSizeList Root
 * -----------------------------------------------------------------------------------------------*/

const STYLES_LIST_VIEW_FIXED_SIZE_ROOT = css`
  height: 100%;
  flex: 1;
  padding: 0px 8px 8px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FixedSizeListRoot = React.forwardRef(
  ({ children, css, ...props }, ref) => {
    return (
      <FixedSizeList
        outerRef={ref}
        css={[STYLES_LIST_VIEW_FIXED_SIZE_ROOT, css]}
        {...props}
      >
        {children}
      </FixedSizeList>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * ListView VariableSizeList Root
 * -----------------------------------------------------------------------------------------------*/

const STYLES_LIST_VIEW_VARIABLE_SIZE_ROOT = css`
  height: 100%;
  flex: 1;
  padding: 0px 8px 8px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const VariableSizeListRoot = React.forwardRef(
  ({ children, css, ...props }, ref) => {
    return (
      <VariableSizeList
        outerRef={ref}
        css={[STYLES_LIST_VIEW_VARIABLE_SIZE_ROOT, css]}
        {...props}
      >
        {children}
      </VariableSizeList>
    );
  }
);

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
  padding: 13px 8px 7px;
`;

const Title = ({ children, count, css, ...props }) => {
  return (
    <Typography.H5
      css={[STYLES_SESSION_TITLE, css]}
      color="textGray"
      as="p"
      nbrOflines={1}
      {...props}
    >
      {children}
      {count && (
        <Typography.H5 as="span" color="textGray">
          &nbsp;&nbsp;{count}
        </Typography.H5>
      )}
    </Typography.H5>
  );
};

/* -------------------------------------------------------------------------------------------------
 * ListView SlatesItem
 * -----------------------------------------------------------------------------------------------*/

const SLATE_WRAPPER = (theme) => css`
  border-radius: 8px;
  padding: 1px 8px;
  max-width: 150px;
  background-color: ${theme.semantic.bgWhite};
  border: 1px solid ${theme.semantic.borderGrayLight};
  box-shadow: ${theme.shadow.lightSmall};
`;

const Slate = ({ children, as = "span", ...props }) => {
  return (
    <Typography.H6
      as={as}
      nbrOflines={1}
      css={SLATE_WRAPPER}
      color="textBlack"
      {...props}
    >
      {children}
    </Typography.H6>
  );
};

const STYLES_SLATES_ITEM_WRAPPER = (theme) => css`
  position: relative;
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  height: ${theme.sizes.jumperFeedItem};

  & > * + * {
    margin-left: 6px;
  }
`;

const SlatesItem = ({ slates, ...props }) => {
  return (
    <div css={STYLES_SLATES_ITEM_WRAPPER} {...props}>
      {slates.map((slate) => (
        <Slate key={slate}>{slate}</Slate>
      ))}
    </div>
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
  position: relative;
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
    <ShortcutsTooltip label="Copy" keyTrigger="C">
      <button css={STYLES_OBJECT_ACTION_BUTTON} {...props}>
        {isCopied ? (
          <SVG.Check width={16} height={16} />
        ) : (
          <SVG.CopyAndPaste width={16} height={16} />
        )}
      </button>
    </ShortcutsTooltip>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const OBJECT_ACTION_SIZE = 20;

const STYLES_ACTIONS_WRAPPER = (theme) => css`
  position: absolute;
  top: 12px;
  // NOTE(amine): saving action's width + object's right padding
  right: calc(${OBJECT_ACTION_SIZE}px + 12px);

  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  padding-left: calc(${OBJECT_ACTION_SIZE}px + 8px);
  padding-right: 8px;
  background: linear-gradient(
    269.88deg,
    ${theme.system.grayLight5} 84.95%,
    rgba(229, 232, 234, 0) 103.84%
  );

  & > * + * {
    margin-left: 8px !important;
  }
`;

const STYLES_TAB_INDICATOR = (theme) => css`
  position: absolute;
  top: 19px;
  left: 4px;

  border-radius: 50%;
  height: 6px;
  width: 6px;
  background-color: ${theme.semantic.bgGrayLight4};
`;

const STYLES_SYSTEM_GREEN = (theme) => css`
  background-color: ${theme.system.green};
`;

const Object = React.forwardRef(
  (
    {
      title,
      css,
      isSelected,
      withActions = false,
      relatedVisits,
      rootDomain,
      favicon,

      onCloseTab,

      onOpenSlatesJumper,

      withMultiSelection,
      isChecked,
      onCheck,

      isTab,
      isTabActive,

      url,
      onKeyDown,
      onKeyUp,
      ...props
    },
    ref
  ) => {
    const { savedObjectsLookup, saveLink, savedObjectsSlates } = useViewer();
    const isSaved = url in savedObjectsLookup;

    const handleLinkSaving = (e) => (
      e.stopPropagation(),
      e.preventDefault(),
      saveLink({ objects: [{ url, title, favicon }] })
    );

    const handleOnChecking = (e) => onCheck(e.target.checked);

    const { isCopied, handleCopying } = useCopyState(url);

    const preventFocus = (e) => e.preventDefault();

    const handleKeyboardActions = (e) => {
      if (e.code === "KeyS") {
        e.stopPropagation();
        handleLinkSaving(e);
        return;
      }

      if (e.code === "KeyT") {
        e.stopPropagation();
        onOpenSlatesJumper();
        return;
      }

      if (e.code === "KeyC") {
        e.stopPropagation();
        handleCopying();
        return;
      }

      if (onCloseTab && e.code === "KeyX") {
        e.stopPropagation();
        onCloseTab();
        return;
      }
    };

    const preventKeyboardActionsPropagation = (e) => {
      if (
        e.code === "KeyS" ||
        e.code === "KeyT" ||
        e.code === "KeyC" ||
        (onCloseTab && e.code === "KeyX")
      ) {
        e.stopPropagation();
        return;
      }
    };

    const firstAppliedSlate = savedObjectsSlates[url]?.[0];

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
        onKeyUp={mergeEvents(
          handleKeyboardActions,
          preventKeyboardActionsPropagation,
          onKeyUp
        )}
        onKeyDown={mergeEvents(preventKeyboardActionsPropagation, onKeyDown)}
        {...props}
      >
        {isTab && (
          <ShortcutsTooltip
            label={isTabActive ? "Current open tab" : "Open tab"}
          >
            <div
              css={[STYLES_TAB_INDICATOR, isTabActive && STYLES_SYSTEM_GREEN]}
            />
          </ShortcutsTooltip>
        )}
        {withMultiSelection && (
          <Checkbox
            className="object_checkbox"
            checked={isChecked}
            onChange={handleOnChecking}
            style={{ display: isChecked && "block", flexShrink: 0 }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.preventDefault()}
          />
        )}
        <Favicon
          className="object_favicon"
          css={STYLES_TEXT_BLACK}
          style={{ margin: 2, flexShrink: 0, display: isChecked && "none" }}
          rootDomain={rootDomain}
          src={favicon}
        />
        <div
          css={Styles.HORIZONTAL_CONTAINER_CENTERED}
          style={{ marginLeft: 6 }}
        >
          {firstAppliedSlate && (
            <Slate style={{ flexShrink: 0 }}>{firstAppliedSlate}</Slate>
          )}
          <Typography.H5
            style={{ marginLeft: 6, padding: "3px 0px 1px" }}
            color="textBlack"
            nbrOflines={1}
          >
            {title}
          </Typography.H5>
        </div>
        {relatedVisits?.length ? (
          <Typography.H5 color="textGray" style={{ marginLeft: 12 }}>
            {relatedVisits.length + 1}
          </Typography.H5>
        ) : null}

        {withActions && (typeof isSelected === "undefined" || isSelected) && (
          <div css={STYLES_ACTIONS_WRAPPER}>
            <ShortcutsTooltip label="Tag" keyTrigger="T / ⌥T">
              <button
                className="object_action_button"
                css={STYLES_OBJECT_ACTION_BUTTON}
                onMouseDown={preventFocus}
                onClick={(e) => (
                  e.stopPropagation(), e.preventDefault(), onOpenSlatesJumper()
                )}
              >
                <SVG.Hash width={16} height={16} />
              </button>
            </ShortcutsTooltip>
            <CopyAction
              className="object_action_button"
              isCopied={isCopied}
              onClick={(e) => (
                e.stopPropagation(), e.preventDefault(), handleCopying()
              )}
              onMouseDown={preventFocus}
              url={url}
            />
            <ShortcutsTooltip label="Delete" keyTrigger="delete">
              <button
                className="object_action_button"
                css={STYLES_OBJECT_ACTION_BUTTON}
                onMouseDown={preventFocus}
              >
                <SVG.Trash width={16} height={16} />
              </button>
            </ShortcutsTooltip>
            {onCloseTab && (
              <ShortcutsTooltip label="Close" keyTrigger="X">
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
              </ShortcutsTooltip>
            )}
          </div>
        )}

        <div
          style={{
            height: OBJECT_ACTION_SIZE,
            width: OBJECT_ACTION_SIZE,
            marginLeft: "auto",
            flexShrink: 0,
          }}
        >
          {(typeof isSelected === "undefined" || isSelected) && !isSaved && (
            <ShortcutsTooltip vertical="above" label="Save" keyTrigger="S / ⌥S">
              <button
                className="object_action_button"
                css={STYLES_OBJECT_ACTION_BUTTON}
                onClick={handleLinkSaving}
                onMouseDown={preventFocus}
              >
                <SVG.Plus width={16} height={16} />
              </button>
            </ShortcutsTooltip>
          )}

          {isSaved && (
            <ShortcutsTooltip label="Saved">
              <div css={STYLES_COLOR_SYSTEM_GREEN} style={{ padding: 2 }}>
                <SVG.CheckCircle />
              </div>
            </ShortcutsTooltip>
          )}
        </div>
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
    <Combobox.MenuButton
      key={key}
      index={index}
      onSelect={onSelect}
      onSubmit={onSubmit}
    >
      <Object isSelected={checkIfIndexSelected(index)} {...props} />
    </Combobox.MenuButton>
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
  FixedSizeListRoot,
  VariableSizeListRoot,
  Section,
  Title,
  Object,
  ComboboxObject,
  RovingTabIndexWithMultiSelectObject,
  SlatesItem,
};
