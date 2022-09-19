import * as React from "react";
import * as Styles from "../Common/styles";
import * as Typography from "./system/Typography";
import * as SVG from "../Common/SVG";
import * as Jumper from "./jumper";
import * as RovingTabIndex from "./RovingTabIndex";

import NewTabActionsMenuPopup from "./newTab/ActionsMenuPopup";

import {
  isObjectEmpty,
  removeKeyFromObject,
  isNewTab,
  copyToClipboard,
  getRootDomain,
  mergeRefs,
} from "../Common/utilities";
import {
  useEscapeKey,
  useEventListener,
  usePreviousValue,
  useRestoreFocus,
} from "../Common/hooks";
import { Checkbox } from "./system";
import { ShortcutsTooltip } from "./Tooltip";
import { useViewer as useJumperViewer } from "../Core/viewer/app/jumper";
import { useViewer as useNewTabViewer } from "../Core/viewer/app/newTab";
import { css } from "@emotion/react";

const multiSelectionContext = React.createContext({});

const useMultiSelectionContext = () => {
  return React.useContext(multiSelectionContext);
};

/* -------------------------------------------------------------------------------------------------
 * Provider
 * -----------------------------------------------------------------------------------------------*/

const useMultiSelectionState = ({ totalSelectableItems }) => {
  const [checkedIndexes, setCheckedIndexes] = React.useState({});

  const isIndexChecked = (index) => index in checkedIndexes;

  const toggleCheckIndex = (index) => {
    setCheckedIndexes((prev) => {
      if (isIndexChecked(index)) return removeKeyFromObject(index, prev);
      return { ...prev, [index]: true };
    });
  };

  const checkIndexesInRange = (start, end) => {
    const checkedIndexes = {};
    for (let i = start; i <= end; i++) {
      checkedIndexes[i] = true;
    }
    setCheckedIndexes((prev) => ({ ...prev, ...checkedIndexes }));
  };

  const checkAll = () => {
    checkIndexesInRange(0, totalSelectableItems - 1);
  };

  const totalSelectedItems = React.useMemo(
    () => Object.keys(checkedIndexes).length,
    [checkedIndexes]
  );

  const isAllChecked = React.useMemo(() => {
    return totalSelectedItems === totalSelectableItems;
  }, [totalSelectedItems, totalSelectableItems]);

  const toggleCheckAll = () => {
    const nextState = !isAllChecked;
    if (nextState) {
      checkIndexesInRange(0, totalSelectableItems - 1);
      return;
    }
    setCheckedIndexes({});
  };

  const prevIsAllChecked = usePreviousValue(isAllChecked);

  React.useLayoutEffect(() => {
    if (prevIsAllChecked) {
      checkAll();
    }
  }, [totalSelectableItems]);

  const existSelectionMode = () => setCheckedIndexes({});

  const isMultiSelectMode = React.useMemo(() => {
    if (!isObjectEmpty(checkedIndexes)) {
      return true;
    } else {
      return false;
    }
  }, [checkedIndexes]);

  return {
    checkedIndexes,
    isIndexChecked,
    toggleCheckIndex,
    checkIndexesInRange,
    totalSelectedItems,
    isAllChecked,

    toggleCheckAll,

    isMultiSelectMode,
    existSelectionMode,
  };
};

/* -----------------------------------------------------------------------------------------------*/

const useMultiSelectionHandlers = ({
  checkedIndexes,

  checkIndexesInRange,
  toggleCheckAll,
  toggleCheckIndex,
}) => {
  const isShiftKeyPressedRef = React.useRef(false);

  const findRecentlySelectedIndex = (index) => {
    let difference = Infinity;
    let recentIndex = 0;
    for (let checkedIndexString in checkedIndexes) {
      const checkedIndex = +checkedIndexString;
      if (checkedIndex === index) continue;
      if (checkedIndex > index) continue;

      const currentDifference = index - checkedIndex;
      if (currentDifference < difference) {
        recentIndex = checkedIndex;
        difference = currentDifference;
      }
    }
    return recentIndex;
  };

  const createHandleKeyDownNavigation = (index) => (e) => {
    if (e.shiftKey) isShiftKeyPressedRef.current = true;

    switch (true) {
      case e.ctrlKey && e.code === "KeyA":
        e.stopPropagation();
        toggleCheckAll();
        break;

      case e.shiftKey && e.code === "Space":
        e.preventDefault();
        e.stopPropagation();
        checkIndexesInRange(findRecentlySelectedIndex(index), index);
        break;

      case e.code === "Space":
        e.preventDefault();
        e.stopPropagation();
        toggleCheckIndex(index);
        break;
    }
  };

  const createHandleOnIndexCheckChange = (index) => () => {
    if (isShiftKeyPressedRef.current) {
      checkIndexesInRange(findRecentlySelectedIndex(index), index);
      return;
    }

    toggleCheckIndex(index);
  };

  const handleKeyUpNavigation = () => (isShiftKeyPressedRef.current = false);
  useEventListener({ type: "keyup", handler: handleKeyUpNavigation });

  return {
    createHandleKeyDownNavigation,
    createHandleOnIndexCheckChange,
  };
};

/* -----------------------------------------------------------------------------------------------*/

function Provider({
  children,
  totalSelectableItems,
  onSubmitSelectedItem,
  onRestoreFocus,
  ...props
}) {
  const {
    checkedIndexes,
    isIndexChecked,
    toggleCheckIndex,
    checkIndexesInRange,
    totalSelectedItems,

    isAllChecked,
    toggleCheckAll,

    isMultiSelectMode,
    existSelectionMode,
  } = useMultiSelectionState({ totalSelectableItems });

  const { createHandleKeyDownNavigation, createHandleOnIndexCheckChange } =
    useMultiSelectionHandlers({
      checkedIndexes,
      checkIndexesInRange,
      toggleCheckAll,
      toggleCheckIndex,
    });

  const constructSelectedItemsData = () => {
    // if (isAllChecked) {
    //   return { isAllChecked };
    // }

    const selectedItemsData = [];
    for (let index in checkedIndexes) {
      const dataForSelectedIndex = onSubmitSelectedItem(index);
      selectedItemsData.push(dataForSelectedIndex);
    }

    return { isAllChecked, selectedItemsData };
  };

  const value = React.useMemo(
    () => ({
      checkedIndexes,
      isAllChecked,
      isIndexChecked,
      isMultiSelectMode,
      totalSelectedItems,

      createHandleOnIndexCheckChange,
      createHandleKeyDownNavigation,
      toggleCheckAll,

      existSelectionMode,

      constructSelectedItemsData,

      onRestoreFocus,
    }),
    [
      isAllChecked,
      checkedIndexes,
      isMultiSelectMode,
      totalSelectedItems,
      onRestoreFocus,
    ]
  );

  return (
    <multiSelectionContext.Provider value={value} {...props}>
      {children}
    </multiSelectionContext.Provider>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Actions
 * -----------------------------------------------------------------------------------------------*/

const STYLES_ACTION_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  color: ${theme.semantic.textGrayDark};
  border-radius: 12px;
  padding: 5px 12px 7px;
  &:hover,
  &:focus {
    background-color: ${theme.semantic.bgGrayLight};
  }
`;

const STYLES_ACTION_BUTTON_NEW_TAB = (theme) => css`
  color: ${theme.semantic.textWhite};
  &:hover,
  &:focus {
    color: ${theme.semantic.textWhite};
    background-color: ${theme.semantic.bgLightDark};
  }
`;

const GroupingAction = React.forwardRef(({ css, onGroup, ...props }, ref) => {
  const { constructSelectedItemsData, existSelectionMode } =
    useMultiSelectionContext();

  const handleOnClick = () => {
    const { selectedItemsData } = constructSelectedItemsData();
    onGroup(selectedItemsData.map(({ url }) => url));
    existSelectionMode();
  };

  return (
    <button
      css={[STYLES_ACTION_BUTTON, css]}
      onClick={handleOnClick}
      ref={ref}
      {...props}
    >
      <SVG.SmileCircle height={16} width={16} />
      <Typography.H5 style={{ marginLeft: 4 }}>Group</Typography.H5>
    </button>
  );
});

const SavingAction = React.forwardRef(
  ({ css, onSaveObjects, ...props }, ref) => {
    const { constructSelectedItemsData, existSelectionMode } =
      useMultiSelectionContext();

    const handleOnClick = () => {
      const { selectedItemsData } = constructSelectedItemsData();
      const selectedObjects = selectedItemsData.map(
        ({ url, title, favicon }) => ({ url, title, favicon })
      );
      onSaveObjects({ objects: selectedObjects });
      existSelectionMode();
    };

    return (
      <button
        css={[STYLES_ACTION_BUTTON, css]}
        onClick={handleOnClick}
        ref={ref}
        {...props}
      >
        <SVG.Plus height={16} width={16} />
        <Typography.H5 style={{ marginLeft: 4 }}>Save</Typography.H5>
      </button>
    );
  }
);

const OpenURLsAction = React.forwardRef(
  ({ css, onOpenLinks, ...props }, ref) => {
    const { constructSelectedItemsData, existSelectionMode } =
      useMultiSelectionContext();

    const handleOnClick = () => {
      const { selectedItemsData } = constructSelectedItemsData();
      onOpenLinks(selectedItemsData.map(({ url }) => url));
      existSelectionMode();
    };
    return (
      <button
        css={[STYLES_ACTION_BUTTON, css]}
        onClick={handleOnClick}
        ref={ref}
        {...props}
      >
        <SVG.ExternalLink height={16} width={16} />
        <Typography.H5 style={{ marginLeft: 4 }}>Open</Typography.H5>
      </button>
    );
  }
);

const useCopyState = () => {
  const [isCopied, setCopied] = React.useState(false);
  React.useEffect(() => {
    let timeout;
    if (isCopied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }

    return () => clearTimeout(timeout);
  }, [isCopied]);

  const handleCopying = (string) => {
    setCopied(true);
    copyToClipboard(string);
  };

  return { isCopied, handleCopying };
};

const CopyURLsAction = React.forwardRef(({ css, ...props }, ref) => {
  const { isCopied, handleCopying } = useCopyState();

  const { constructSelectedItemsData, existSelectionMode } =
    useMultiSelectionContext();

  const handleOnClick = () => {
    const { selectedItemsData } = constructSelectedItemsData();
    const linksAsString = selectedItemsData.map(({ url }) => url).join("\n");
    handleCopying(linksAsString);
    existSelectionMode();
  };

  return (
    <button
      css={[STYLES_ACTION_BUTTON, css]}
      onClick={handleOnClick}
      ref={ref}
      {...props}
    >
      {isCopied ? (
        <SVG.Check width={16} height={16} />
      ) : (
        <SVG.CopyAndPaste height={16} width={16} />
      )}
      <Typography.H5 style={{ marginLeft: 4 }}>Copy</Typography.H5>
    </button>
  );
});

const CloseTabsAction = React.forwardRef(
  ({ css, onCloseTabs, ...props }, ref) => {
    const { constructSelectedItemsData, existSelectionMode } =
      useMultiSelectionContext();

    const handleOnClick = () => {
      const { selectedItemsData } = constructSelectedItemsData();

      const tabsId = selectedItemsData.map(({ id }) => id);
      onCloseTabs(tabsId);
      existSelectionMode();
    };

    return (
      <button
        css={[STYLES_ACTION_BUTTON, css]}
        onClick={handleOnClick}
        ref={ref}
        {...props}
      >
        <SVG.XCircle height={16} width={16} />
        <Typography.H5 style={{ marginLeft: 4 }}>Close</Typography.H5>
      </button>
    );
  }
);

const OpenSlatesJumperAction = React.forwardRef(
  ({ css, onOpenSlatesJumper, ...props }, ref) => {
    const { constructSelectedItemsData, existSelectionMode } =
      useMultiSelectionContext();

    const handleOnClick = () => {
      const { selectedItemsData } = constructSelectedItemsData();

      const objects = selectedItemsData.map(({ url, title }) => ({
        url,
        title,
        rootDomain: getRootDomain(url),
      }));
      onOpenSlatesJumper(objects);
      existSelectionMode();
    };

    return (
      <button
        css={[STYLES_ACTION_BUTTON, css]}
        onClick={handleOnClick}
        ref={ref}
        {...props}
      >
        <SVG.Hash height={16} width={16} />
        <Typography.H5 style={{ marginLeft: 4 }}>Tag</Typography.H5>
      </button>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 *  ActionsMenu
 * -----------------------------------------------------------------------------------------------*/

const STYLES_ACTIONS_MENU_WRAPPER = css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  position: relative;
  width: 100%;
  height: 48px;
  border-radius: 16px;
  padding: 0px 8px;
`;

const STYLES_ACTIONS_WRAPPER = css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  & > * + * {
    margin-left: 24px;
  }
`;

const STYLES_MULTI_SELECTION_DISMISS_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  position: absolute;
  top: 12px;
  left: -9px;
  transform: translateX(-100%);
  border-radius: 50%;
  padding: 4px;
`;

const STYLES_MULTI_SELECTION_DISMISS_BUTTON_JUMPER = (theme) => css`
  ${STYLES_MULTI_SELECTION_DISMISS_BUTTON(theme)};
  color: ${theme.semantic.textGrayDark};
  box-shadow: ${theme.shadow.jumperLight};
  border: 1px solid ${theme.semantic.borderGrayLight4};

  @supports (
    (-webkit-backdrop-filter: blur(45px)) or (backdrop-filter: blur(45px))
  ) {
    -webkit-backdrop-filter: blur(45px);
    backdrop-filter: blur(45px);
    background-color: ${theme.semantic.bgBlurLight6OP};
  }

  &:hover,
  &:focus {
    background-color: ${theme.semantic.bgGrayLight};
  }
`;

const STYLES_MULTI_SELECTION_DISMISS_BUTTON_NEW_TAB = (theme) => css`
  ${STYLES_MULTI_SELECTION_DISMISS_BUTTON(theme)};
  background-color: ${theme.system.black};
  color: ${theme.semantic.textWhite};
  box-shadow: ${theme.shadow.darkSmall};
  border: 1px solid ${theme.semantic.borderGrayLight4};

  &:hover,
  &:focus {
    color: ${theme.semantic.textWhite};
    background-color: ${theme.semantic.bgLightDark};
  }
`;

const ActionsMenuDismissButton = (props) => {
  return (
    <button {...props}>
      <SVG.Dismiss height={16} width={16} />
    </button>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const STYLES_MULTI_SELECTION_SELECT_ALL_NEW_TAB = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER};
  padding: 5px 12px 7px;
  border-radius: 12px;

  &:hover,
  &:focus-within {
    color: ${theme.semantic.textWhite};
    background-color: ${theme.semantic.bgLightDark};
  }
`;

const NewTabActionsMenu = React.forwardRef(
  (
    { onOpenURLs, onCloseTabs, onOpenSlatesJumper, onGroupURLs, onSaveObjects },
    forwardedRef
  ) => {
    const {
      toggleCheckAll,
      isAllChecked,
      totalSelectedItems,
      constructSelectedItemsData,
      existSelectionMode,
      onRestoreFocus,
    } = useMultiSelectionContext();

    const ref = React.useRef();

    useRestoreFocus({
      containerRef: ref,
      onRestoreFocusFallback: onRestoreFocus,
    });

    useEscapeKey(existSelectionMode);

    const { savedObjectsLookup } = useNewTabViewer();

    const areAllSelectedItemsSaved = React.useMemo(() => {
      const { selectedItemsData } = constructSelectedItemsData();

      return selectedItemsData.every(({ url }) => url in savedObjectsLookup);
    }, [savedObjectsLookup, constructSelectedItemsData]);

    const Actions = React.useMemo(() => {
      const actions = [];
      if (onOpenURLs) {
        actions.push({
          label: `Open ${totalSelectedItems} selected`,
          Component: React.forwardRef((props, ref) => (
            <OpenURLsAction
              onOpenLinks={onOpenURLs}
              css={STYLES_ACTION_BUTTON_NEW_TAB}
              ref={ref}
              {...props}
            />
          )),
        });
      }

      if (onCloseTabs) {
        actions.push({
          label: `Close ${totalSelectedItems} selected`,
          Component: React.forwardRef((props, ref) => (
            <CloseTabsAction
              onCloseTabs={onCloseTabs}
              css={STYLES_ACTION_BUTTON_NEW_TAB}
              ref={ref}
              {...props}
            />
          )),
        });
      }

      if (onOpenSlatesJumper) {
        actions.push({
          label: `Tag ${totalSelectedItems} selected`,
          Component: React.forwardRef((props, ref) => (
            <OpenSlatesJumperAction
              onOpenSlatesJumper={onOpenSlatesJumper}
              css={STYLES_ACTION_BUTTON_NEW_TAB}
              ref={ref}
              {...props}
            />
          )),
        });
      }

      actions.push({
        label: `Copy ${totalSelectedItems} selected`,
        Component: React.forwardRef((props, ref) => (
          <CopyURLsAction
            css={STYLES_ACTION_BUTTON_NEW_TAB}
            ref={ref}
            {...props}
          />
        )),
      });

      if (onGroupURLs) {
        actions.push({
          label: `Group ${totalSelectedItems} selected`,
          Component: React.forwardRef((props, ref) => (
            <GroupingAction
              onGroup={onGroupURLs}
              css={STYLES_ACTION_BUTTON_NEW_TAB}
              ref={ref}
              {...props}
            />
          )),
        });
      }

      if (onSaveObjects && !areAllSelectedItemsSaved) {
        actions.push({
          label: `Save ${totalSelectedItems} selected`,
          Component: React.forwardRef((props, ref) => (
            <SavingAction
              onSaveObjects={onSaveObjects}
              css={STYLES_ACTION_BUTTON_NEW_TAB}
              ref={ref}
              {...props}
            />
          )),
        });
      }

      return actions;
    }, [
      onOpenURLs,
      onCloseTabs,
      onOpenSlatesJumper,
      onGroupURLs,
      onSaveObjects,
      totalSelectedItems,
      areAllSelectedItemsSaved,
    ]);

    return (
      <NewTabActionsMenuPopup>
        <div
          css={STYLES_ACTIONS_MENU_WRAPPER}
          ref={mergeRefs([forwardedRef, ref])}
        >
          <ActionsMenuDismissButton
            css={STYLES_MULTI_SELECTION_DISMISS_BUTTON_NEW_TAB}
            onClick={existSelectionMode}
          />
          <ShortcutsTooltip label="Multi-select" keyTrigger="Ctrl A">
            <div css={STYLES_MULTI_SELECTION_SELECT_ALL_NEW_TAB}>
              <Checkbox
                id="select_all_checkbox"
                checked={isAllChecked}
                onChange={toggleCheckAll}
              />
              <Typography.H5
                as="label"
                for="select_all_checkbox"
                style={{ marginLeft: 12 }}
                color="textWhite"
              >
                Select All
              </Typography.H5>
            </div>
          </ShortcutsTooltip>
          <RovingTabIndex.Provider axis="horizontal">
            <RovingTabIndex.List>
              <div css={STYLES_ACTIONS_WRAPPER} style={{ marginLeft: "auto" }}>
                {Actions.map(({ Component, label }, i) => (
                  <ShortcutsTooltip label={label} key={label}>
                    <RovingTabIndex.Item index={i} key={i}>
                      <Component />
                    </RovingTabIndex.Item>
                  </ShortcutsTooltip>
                ))}
              </div>
            </RovingTabIndex.List>
          </RovingTabIndex.Provider>
        </div>
      </NewTabActionsMenuPopup>
    );
  }
);

/* -----------------------------------------------------------------------------------------------*/

const STYLES_MULTI_SELECTION_SELECT_ALL = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER};
  padding: 5px 12px 7px;
  border-radius: 12px;

  &:hover,
  &:focus-within {
    background-color: ${theme.semantic.bgGrayLight};
  }
`;

const JumperActionMenu = React.forwardRef(
  (
    { onOpenURLs, onCloseTabs, onOpenSlatesJumper, onGroupURLs, onSaveObjects },
    forwardedRef
  ) => {
    const {
      toggleCheckAll,
      isAllChecked,
      totalSelectedItems,
      constructSelectedItemsData,
      existSelectionMode,
      onRestoreFocus,
    } = useMultiSelectionContext();

    const ref = React.useRef();
    useRestoreFocus({
      containerRef: ref,
      onRestoreFocusFallback: onRestoreFocus,
    });

    useEscapeKey(existSelectionMode);

    const { savedObjectsLookup } = useJumperViewer();

    const areAllSelectedItemsSaved = React.useMemo(() => {
      const { selectedItemsData } = constructSelectedItemsData();

      return selectedItemsData.every(({ url }) => url in savedObjectsLookup);
    }, [savedObjectsLookup, constructSelectedItemsData]);

    const Actions = React.useMemo(() => {
      const actions = [];
      if (onOpenURLs) {
        actions.push({
          label: `Open ${totalSelectedItems} selected`,
          Component: React.forwardRef((props, ref) => (
            <OpenURLsAction onOpenLinks={onOpenURLs} ref={ref} {...props} />
          )),
        });
      }

      if (onCloseTabs) {
        actions.push({
          label: `Close ${totalSelectedItems} selected`,
          Component: React.forwardRef((props, ref) => (
            <CloseTabsAction onCloseTabs={onCloseTabs} ref={ref} {...props} />
          )),
        });
      }

      if (onOpenSlatesJumper) {
        actions.push({
          label: `Tag ${totalSelectedItems} selected`,
          Component: React.forwardRef((props, ref) => (
            <OpenSlatesJumperAction
              onOpenSlatesJumper={onOpenSlatesJumper}
              ref={ref}
              {...props}
            />
          )),
        });
      }

      actions.push({
        label: `Copy ${totalSelectedItems} selected`,
        Component: React.forwardRef((props, ref) => (
          <CopyURLsAction ref={ref} {...props} />
        )),
      });

      if (onGroupURLs) {
        actions.push({
          label: `Group ${totalSelectedItems} selected`,
          Component: React.forwardRef((props, ref) => (
            <GroupingAction onGroup={onGroupURLs} ref={ref} {...props} />
          )),
        });
      }

      if (onSaveObjects && !areAllSelectedItemsSaved) {
        actions.push({
          label: `Save ${totalSelectedItems} selected`,
          Component: React.forwardRef((props, ref) => (
            <SavingAction onSaveObjects={onSaveObjects} ref={ref} {...props} />
          )),
        });
      }

      return actions;
    }, [
      onOpenURLs,
      onCloseTabs,
      onOpenSlatesJumper,
      onGroupURLs,
      onSaveObjects,
      totalSelectedItems,
      areAllSelectedItemsSaved,
    ]);

    return (
      <Jumper.BottomPanel>
        <div
          css={STYLES_ACTIONS_MENU_WRAPPER}
          ref={mergeRefs([forwardedRef, ref])}
        >
          <ActionsMenuDismissButton
            css={STYLES_MULTI_SELECTION_DISMISS_BUTTON_JUMPER}
            onClick={existSelectionMode}
          />
          <ShortcutsTooltip label="Multi-select" keyTrigger="Ctrl A">
            <div css={STYLES_MULTI_SELECTION_SELECT_ALL}>
              <Checkbox
                id="select_all_checkbox"
                checked={isAllChecked}
                onChange={toggleCheckAll}
              />
              <Typography.H5
                as="label"
                for="select_all_checkbox"
                style={{ marginLeft: 12 }}
                color="textGrayDark"
              >
                Select All
              </Typography.H5>
            </div>
          </ShortcutsTooltip>
          <RovingTabIndex.Provider axis="horizontal">
            <RovingTabIndex.List>
              <div css={STYLES_ACTIONS_WRAPPER} style={{ marginLeft: "auto" }}>
                {Actions.map(({ label, Component }, i) => (
                  <ShortcutsTooltip label={label} key={label}>
                    <RovingTabIndex.Item index={i}>
                      <Component />
                    </RovingTabIndex.Item>
                  </ShortcutsTooltip>
                ))}
              </div>
            </RovingTabIndex.List>
          </RovingTabIndex.Provider>
        </div>
      </Jumper.BottomPanel>
    );
  }
);

/* -----------------------------------------------------------------------------------------------*/

function ActionsMenu({
  onGroupURLs,
  onOpenSlatesJumper,
  onCloseTabs,
  onOpenURLs,
  onSaveObjects,
}) {
  const { isMultiSelectMode } = useMultiSelectionContext();

  if (!isMultiSelectMode) return null;

  if (isNewTab) {
    return (
      <NewTabActionsMenu
        onOpenURLs={onOpenURLs}
        onCloseTabs={onCloseTabs}
        onOpenSlatesJumper={onOpenSlatesJumper}
        onGroupURLs={onGroupURLs}
        onSaveObjects={onSaveObjects}
      />
    );
  }

  return (
    <JumperActionMenu
      onOpenURLs={onOpenURLs}
      onCloseTabs={onCloseTabs}
      onOpenSlatesJumper={onOpenSlatesJumper}
      onGroupURLs={onGroupURLs}
      onSaveObjects={onSaveObjects}
    />
  );
}

export { useMultiSelectionContext, Provider, ActionsMenu };
