import { useEventListener } from "Common/hooks";
import * as React from "react";

import { isObjectEmpty, removeKeyFromObject } from "../Common/utilities";

const multiSelectionContext = React.createContext({});

export const useMultiSelectionContext = () => {
  return React.useContext(multiSelectionContext);
};

/* -------------------------------------------------------------------------------------------------
 * Provider
 * -----------------------------------------------------------------------------------------------*/

const useMultiSelectionState = ({ totalSelectableItems }) => {
  const [checkedIndexes, setCheckedIndexes] = React.useState({});
  const isAllCheckedRef = React.useRef(false);

  const isIndexChecked = (index) => index in checkedIndexes;

  const toggleCheckIndex = (index) => {
    isAllCheckedRef.current = false;
    setCheckedIndexes((prev) => {
      if (isIndexChecked(index)) return removeKeyFromObject(index, prev);
      return { ...prev, [index]: true };
    });
  };

  const checkIndexesInRange = (start, end) => {
    isAllCheckedRef.current = false;
    const checkedIndexes = {};
    for (let i = start; i <= end; i++) {
      checkedIndexes[i] = true;
    }
    setCheckedIndexes((prev) => ({ ...prev, ...checkedIndexes }));
  };

  const checkAll = () => {
    isAllCheckedRef.current = true;
    checkIndexesInRange(0, totalSelectableItems - 1);
  };

  const toggleCheckAll = () => {
    const nextState = !isAllCheckedRef.current;
    if (nextState) {
      checkIndexesInRange(0, totalSelectableItems - 1);
      isAllCheckedRef.current = true;
      return;
    }
    setCheckedIndexes({});
    isAllCheckedRef.current = false;
  };

  const [isMultiSelectMode, setMultiSelectionMode] = React.useState(false);

  const existSelectionMode = () => (
    setCheckedIndexes({}), setMultiSelectionMode(false)
  );

  React.useLayoutEffect(() => {
    if (isObjectEmpty(checkedIndexes)) {
      setMultiSelectionMode(true);
    }
  }, [checkedIndexes]);

  React.useLayoutEffect(() => {
    if (isAllCheckedRef.current) {
      checkAll();
    }
  }, [totalSelectableItems]);

  return {
    checkedIndexes,
    isIndexChecked,
    toggleCheckIndex,
    checkIndexesInRange,
    isAllChecked: isAllCheckedRef.current,

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

export function Provider({ children, totalSelectableItems, ...props }) {
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
