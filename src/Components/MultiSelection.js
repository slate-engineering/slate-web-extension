import * as React from "react";
import * as Styles from "../Common/styles";
import * as Typography from "./system/Typography";
import * as SVG from "../Common/SVG";
import * as Jumper from "./jumper";

import {
  isObjectEmpty,
  removeKeyFromObject,
  isNewTab,
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
        toggleCheckAll();
        break;

      case e.shiftKey && e.code === "Space":
        e.preventDefault();
        checkIndexesInRange(findRecentlySelectedIndex(index), index);
        break;

      case e.code === "Space":
        e.preventDefault();
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

function Provider({ children, totalSelectableItems, ...props }) {
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

const GroupingAction = (props) => {
  return (
    <button css={STYLES_ACTION_BUTTON} {...props}>
      <SVG.SmileCircle height={16} width={16} />
      <Typography.H5 style={{ marginLeft: 4 }} color="textGrayDark">
        Group
      </Typography.H5>
    </button>
  );
};

const OpenLinksAction = (props) => {
  <button css={STYLES_ACTION_BUTTON} {...props}>
    <SVG.ExternalLink height={16} width={16} />
    <Typography.H5 style={{ marginLeft: 4 }} color="textGrayDark">
      Open
    </Typography.H5>
  </button>;
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

function ActionsMenu({ children }) {
  const {
    toggleCheckAll,
    isAllChecked,
    isMultiSelectMode,
    existSelectionMode,
  } = useMultiSelectionContext();
  console.log(isMultiSelectMode);

  if (!isMultiSelectMode) return null;

  if (isNewTab) {
    return (
      <CloseOnEscape onClose={existSelectionMode}>
        <div css={STYLES_ACTIONS_MENU_WRAPPER}>
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
            {children}
          </div>
        </div>
      </CloseOnEscape>
    );
  }

  return (
    <CloseOnEscape onClose={existSelectionMode}>
      <Jumper.BottomPanel>
        <div css={STYLES_ACTIONS_MENU_WRAPPER}>
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
            {children}
          </div>
        </div>
      </Jumper.BottomPanel>
    </CloseOnEscape>
  );
}

export {
  useMultiSelectionContext,
  Provider,
  ActionsMenu,
  GroupingAction,
  OpenLinksAction,
};
