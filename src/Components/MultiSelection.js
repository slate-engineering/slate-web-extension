import * as React from "react";
import * as Styles from "../Common/styles";
import * as Typography from "./system/Typography";
import * as SVG from "../Common/SVG";
import * as Jumper from "./jumper";

import NewTabActionsMenuPopup from "./newTab/ActionsMenuPopup";

import {
  isObjectEmpty,
  removeKeyFromObject,
  isNewTab,
  copyToClipboard,
  getRootDomain,
} from "../Common/utilities";
import { css } from "@emotion/react";
import { Checkbox } from "./system";
import {
  useEscapeKey,
  useEventListener,
  usePreviousValue,
} from "../Common/hooks";

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

  const isAllChecked = React.useMemo(() => {
    const checkedIndexesLength = Object.keys(checkedIndexes).length;
    return checkedIndexesLength === totalSelectableItems;
  }, [checkedIndexes, totalSelectableItems]);

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

  const [isMultiSelectMode, setMultiSelectionMode] = React.useState(false);

  const existSelectionMode = () => (
    setCheckedIndexes({}), setMultiSelectionMode(false)
  );

  React.useLayoutEffect(() => {
    if (!isObjectEmpty(checkedIndexes)) {
      setMultiSelectionMode(true);
    }
  }, [checkedIndexes]);

  return {
    checkedIndexes,
    isIndexChecked,
    toggleCheckIndex,
    checkIndexesInRange,
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
  ...props
}) {
  const {
    checkedIndexes,
    isIndexChecked,
    toggleCheckIndex,
    checkIndexesInRange,

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

      createHandleOnIndexCheckChange,
      createHandleKeyDownNavigation,
      toggleCheckAll,

      existSelectionMode,

      constructSelectedItemsData,
    }),
    [isAllChecked, checkedIndexes, isMultiSelectMode]
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

const GroupingAction = ({ css, onGroup, ...props }) => {
  const { constructSelectedItemsData } = useMultiSelectionContext();

  const handleOnClick = () => {
    const { selectedItemsData } = constructSelectedItemsData();
    onGroup(selectedItemsData.map(({ url }) => url));
  };

  return (
    <button
      css={[STYLES_ACTION_BUTTON, css]}
      onClick={handleOnClick}
      {...props}
    >
      <SVG.SmileCircle height={16} width={16} />
      <Typography.H5 style={{ marginLeft: 4 }}>Group</Typography.H5>
    </button>
  );
};

const SavingAction = ({ css, onSaveObjects, ...props }) => {
  const { constructSelectedItemsData } = useMultiSelectionContext();

  const handleOnClick = () => {
    const { selectedItemsData } = constructSelectedItemsData();
    const selectedObjects = selectedItemsData.map(
      ({ url, title, favicon }) => ({ url, title, favicon })
    );
    onSaveObjects({ objects: selectedObjects });
  };

  return (
    <button
      css={[STYLES_ACTION_BUTTON, css]}
      onClick={handleOnClick}
      {...props}
    >
      <SVG.Plus height={16} width={16} />
      <Typography.H5 style={{ marginLeft: 4 }}>Save</Typography.H5>
    </button>
  );
};

const OpenURLsAction = ({ css, onOpenLinks, ...props }) => {
  const { constructSelectedItemsData } = useMultiSelectionContext();

  const handleOnClick = () => {
    const { selectedItemsData } = constructSelectedItemsData();
    onOpenLinks(selectedItemsData.map(({ url }) => url));
  };
  return (
    <button
      css={[STYLES_ACTION_BUTTON, css]}
      onClick={handleOnClick}
      {...props}
    >
      <SVG.ExternalLink height={16} width={16} />
      <Typography.H5 style={{ marginLeft: 4 }}>Open</Typography.H5>
    </button>
  );
};

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

const CopyURLsAction = ({ css, ...props }) => {
  const { isCopied, handleCopying } = useCopyState();

  const { constructSelectedItemsData } = useMultiSelectionContext();

  const handleOnClick = () => {
    const { selectedItemsData } = constructSelectedItemsData();
    const linksAsString = selectedItemsData.map(({ url }) => url).join("\n");
    handleCopying(linksAsString);
  };

  return (
    <button
      css={[STYLES_ACTION_BUTTON, css]}
      onClick={handleOnClick}
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
};

const CloseTabsAction = ({ css, onCloseTabs, ...props }) => {
  const { constructSelectedItemsData } = useMultiSelectionContext();

  const handleOnClick = () => {
    const { selectedItemsData } = constructSelectedItemsData();

    const tabsId = selectedItemsData.map(({ id }) => id);
    onCloseTabs(tabsId);
  };

  return (
    <button
      css={[STYLES_ACTION_BUTTON, css]}
      onClick={handleOnClick}
      {...props}
    >
      <SVG.XCircle height={16} width={16} />
      <Typography.H5 style={{ marginLeft: 4 }}>Close</Typography.H5>
    </button>
  );
};

const OpenSlatesJumperAction = ({ css, onOpenSlatesJumper, ...props }) => {
  const { constructSelectedItemsData } = useMultiSelectionContext();

  const handleOnClick = () => {
    const { selectedItemsData } = constructSelectedItemsData();

    const objects = selectedItemsData.map(({ url, title }) => ({
      url,
      title,
      rootDomain: getRootDomain(url),
    }));
    onOpenSlatesJumper(objects);
  };

  return (
    <button
      css={[STYLES_ACTION_BUTTON, css]}
      onClick={handleOnClick}
      {...props}
    >
      <SVG.Hash height={16} width={16} />
      <Typography.H5 style={{ marginLeft: 4 }}>Tag</Typography.H5>
    </button>
  );
};

/* -------------------------------------------------------------------------------------------------
 *  ActionsMenu
 * -----------------------------------------------------------------------------------------------*/

const STYLES_ACTIONS_MENU_WRAPPER = css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  width: 100%;
  height: 48px;
  border-radius: 16px;
  padding: 0px 20px;
`;

const STYLES_ACTIONS_WRAPPER = css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  & > * + * {
    margin-left: 24px;
  }
`;

const CloseOnEscape = ({ onClose, children }) => {
  useEscapeKey(onClose);

  return children;
};

/* -----------------------------------------------------------------------------------------------*/

const NewTabActionsMenu = React.forwardRef(
  (
    { onOpenURLs, onCloseTabs, onOpenSlatesJumper, onGroupURLs, onSaveObjects },
    forwardedRef
  ) => {
    const { toggleCheckAll, isAllChecked, existSelectionMode } =
      useMultiSelectionContext();

    return (
      <CloseOnEscape onClose={existSelectionMode}>
        <NewTabActionsMenuPopup>
          <div css={STYLES_ACTIONS_MENU_WRAPPER} ref={forwardedRef}>
            <div css={Styles.HORIZONTAL_CONTAINER}>
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
            <div css={STYLES_ACTIONS_WRAPPER} style={{ marginLeft: "auto" }}>
              {onOpenURLs && (
                <OpenURLsAction
                  css={STYLES_ACTION_BUTTON_NEW_TAB}
                  onOpenLinks={onOpenURLs}
                />
              )}
              {onCloseTabs && (
                <CloseTabsAction
                  css={STYLES_ACTION_BUTTON_NEW_TAB}
                  onCloseTabs={onCloseTabs}
                />
              )}
              <CopyURLsAction css={STYLES_ACTION_BUTTON_NEW_TAB} />
              {onOpenSlatesJumper && (
                <OpenSlatesJumperAction
                  css={STYLES_ACTION_BUTTON_NEW_TAB}
                  onOpenSlatesJumper={onOpenSlatesJumper}
                />
              )}
              {onGroupURLs && (
                <GroupingAction
                  css={STYLES_ACTION_BUTTON_NEW_TAB}
                  onGroup={onGroupURLs}
                />
              )}
              {onSaveObjects && (
                <SavingAction
                  css={STYLES_ACTION_BUTTON_NEW_TAB}
                  onSaveObjects={onSaveObjects}
                />
              )}
            </div>
          </div>
        </NewTabActionsMenuPopup>
      </CloseOnEscape>
    );
  }
);

/* -----------------------------------------------------------------------------------------------*/

const JumperActionMenu = React.forwardRef(
  (
    { onOpenURLs, onCloseTabs, onOpenSlatesJumper, onGroupURLs, onSaveObjects },
    forwardedRef
  ) => {
    const { toggleCheckAll, isAllChecked, existSelectionMode } =
      useMultiSelectionContext();

    return (
      <CloseOnEscape onClose={existSelectionMode}>
        <Jumper.BottomPanel>
          <div css={STYLES_ACTIONS_MENU_WRAPPER} ref={forwardedRef}>
            <div css={Styles.HORIZONTAL_CONTAINER}>
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
            <div css={STYLES_ACTIONS_WRAPPER} style={{ marginLeft: "auto" }}>
              {onOpenURLs && <OpenURLsAction onOpenLinks={onOpenURLs} />}
              {onCloseTabs && <CloseTabsAction onCloseTabs={onCloseTabs} />}
              {onOpenSlatesJumper && (
                <OpenSlatesJumperAction
                  onOpenSlatesJumper={onOpenSlatesJumper}
                />
              )}
              <CopyURLsAction />
              {onGroupURLs && <GroupingAction onGroup={onGroupURLs} />}
              {onSaveObjects && <SavingAction onSaveObjects={onSaveObjects} />}
            </div>
          </div>
        </Jumper.BottomPanel>
      </CloseOnEscape>
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
