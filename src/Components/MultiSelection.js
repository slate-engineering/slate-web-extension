import { useEventListener } from "Common/hooks";
import * as React from "react";

import { isObjectEmpty, removeKeyFromObject } from "../Common/utilities";
import { usePreviousValue } from "../Common/hooks";

const multiSelectionContext = React.createContext({});

export const useMultiSelectionContext = () => {
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
    if (isObjectEmpty(checkedIndexes)) {
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
