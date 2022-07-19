import * as React from "react";

import { mergeRefs } from "../Common/utilities";
import { useEventListener, useIsomorphicLayoutEffect } from "../Common/hooks";

/* -------------------------------------------------------------------------------------------------
 * RovingTabIndex Provider
 * -----------------------------------------------------------------------------------------------*/

const useManageScrollPosition = ({
  axis,
  listRef,
  focusedElementsRefs,
  focusedIndex,
}) => {
  React.useLayoutEffect(() => {
    if (axis === "horizontals") return;

    const listNode = listRef.current;
    const focusedNode = focusedElementsRefs.current[focusedIndex]?.current;

    if (!listNode || !focusedNode) return;

    const listTop = listNode.scrollTop;
    const listBottom = listTop + listNode.offsetHeight;

    const focusedNodeHeight = focusedNode.offsetHeight;
    const focusedNodeTop = focusedNode.offsetTop;
    const focusedNodeBottom = focusedNodeTop + focusedNode.offsetHeight;

    if (focusedIndex === 0) listNode.scrollTo({ top: 0 });

    if (focusedNodeTop - focusedNodeHeight <= listTop) {
      const nextNodeIndex = focusedIndex - 1;
      const nextNode = focusedElementsRefs.current[nextNodeIndex]?.current;
      if (!nextNode) return;

      listNode.scrollTo({ top: nextNode.offsetTop });
      return;
    }

    if (focusedNodeBottom >= listBottom) {
      listNode.scrollTo({
        top:
          focusedNodeBottom - listNode.offsetHeight + focusedNode.offsetHeight,
      });
    }
  }, [focusedIndex]);
};

const rovingIndexContext = React.createContext({});
export const useRovingIndexContext = () => React.useContext(rovingIndexContext);

const Provider = React.forwardRef(
  ({ isInfiniteList, axis = "vertical", children }, ref) => {
    const focusedElementsRefs = React.useRef({});
    const initialIndex = 0;
    const [focusedIndex, setFocusedIndex] = React.useState(initialIndex);

    const registerItem = ({ index, ref }) => {
      focusedElementsRefs.current[index] = ref;
      if (ref.current === document.activeElement) setFocusedIndex(index);
    };

    const cleanupItem = (index) => {
      delete focusedElementsRefs.current[index];
    };

    const listRef = React.useRef();
    const isFocusWithinBeforeCleanup = React.useRef(false);
    const registerList = (ref) => {
      listRef.current = ref.current;
      //NOTE(amine): if a child element was focused before unmounting, focus the first child when mounting
      if (isFocusWithinBeforeCleanup.current) {
        focusElement(focusedIndex);
        isFocusWithinBeforeCleanup.current = false;
      }
    };
    const cleanupList = () => {
      setFocusedIndex(0);
      const listElement = listRef.current;
      if (!listElement) return;
      const root = listRef.current.getRootNode() || document;
      if (listElement.contains(root.activeElement)) {
        isFocusWithinBeforeCleanup.current = true;
      }
    };

    const syncFocusedIndexState = ({ index, isFocused }) => {
      if (!isFocused) return;
      const calculatedMaxIndex = Math.max(
        ...Object.keys(focusedElementsRefs.current)
      );
      const maxIndex = Number.isFinite(calculatedMaxIndex)
        ? calculatedMaxIndex
        : index;
      const minIndex = initialIndex;
      if (index >= maxIndex) {
        setIndexTo(maxIndex);
      } else if (index <= minIndex) {
        setIndexTo(minIndex);
      } else {
        setIndexTo(index);
      }
    };

    const focusElement = (index) => {
      const focusedElementRef = focusedElementsRefs.current[index];
      if (focusedElementRef) {
        focusedElementRef.current.focus({ preventScroll: true });
      }
    };

    const setIndexToNextElement = () => {
      const nextIndex = focusedIndex + 1;
      const elementsExists = focusedElementsRefs.current[nextIndex];
      if (!elementsExists && isInfiniteList) {
        return;
      }
      const nextFocusedIndex = elementsExists ? nextIndex : initialIndex;
      setFocusedIndex(nextFocusedIndex);
      focusElement(nextFocusedIndex);
    };

    const setIndexPreviousElement = () => {
      const prevIndex = focusedIndex - 1;
      let prevFocusedIndex = null;
      if (prevIndex >= initialIndex) {
        prevFocusedIndex = prevIndex;
      } else {
        prevFocusedIndex = Math.max(
          ...Object.keys(focusedElementsRefs.current)
        );
      }
      setFocusedIndex(prevFocusedIndex);
      focusElement(prevFocusedIndex);
    };

    const setIndexTo = (index) => {
      if (!focusedElementsRefs.current[index]) return;
      setFocusedIndex(index);
      focusElement(index);
    };

    useManageScrollPosition({
      listRef,
      focusedElementsRefs,
      focusedIndex,
      axis,
    });

    React.useImperativeHandle(
      ref,
      () => ({
        focusSelectedElement: () => focusElement(focusedIndex),
      }),
      [focusedIndex]
    );

    const contextValue = React.useMemo(
      () => [
        { focusedIndex, axis },
        {
          registerItem,
          cleanupItem,

          registerList,
          cleanupList,

          syncFocusedIndexState,
          setIndexToNextElement,
          setIndexPreviousElement,
          setIndexTo,
        },
      ],
      [focusedIndex]
    );

    return (
      <rovingIndexContext.Provider value={contextValue}>
        {children}
      </rovingIndexContext.Provider>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * RovingTabIndex List
 * -----------------------------------------------------------------------------------------------*/

const useRovingHandler = ({ ref }) => {
  const [{ axis }, { setIndexToNextElement, setIndexPreviousElement }] =
    useRovingIndexContext();

  const keyUpHandler = (e) => {
    const preventDefaults = () => (e.preventDefault(), e.stopPropagation());
    if (axis === "vertical") {
      if (e.key === "ArrowUp") preventDefaults(), setIndexPreviousElement();
      if (e.key === "ArrowDown") preventDefaults(), setIndexToNextElement();
      return;
    }
    if (e.key === "ArrowLeft") preventDefaults(), setIndexPreviousElement();
    if (e.key === "ArrowRight") preventDefaults(), setIndexToNextElement();
  };
  useEventListener({
    type: "keydown",
    handler: keyUpHandler,
    ref,
  });
};

const List = React.forwardRef(({ children, ...props }, forwardedRef) => {
  const ref = React.useRef();
  useRovingHandler({ ref });

  const [, { cleanupList, registerList }] = useRovingIndexContext();

  React.useLayoutEffect(() => {
    if (ref.current) registerList(ref);
    return cleanupList;
  }, []);

  return React.cloneElement(React.Children.only(children), {
    ref: mergeRefs([ref, forwardedRef]),
    style: { position: "relative", ...children.props.style },
    ...props,
  });
});

/* -------------------------------------------------------------------------------------------------
 * RovingTabIndex Item
 * -----------------------------------------------------------------------------------------------*/

const Item = React.forwardRef(({ children, index, ...props }, forwardedRef) => {
  const [
    { focusedIndex },
    { registerItem, cleanupItem, syncFocusedIndexState, setIndexTo },
  ] = useRovingIndexContext();
  const ref = React.useRef();

  const indexRef = React.useRef(index);
  useIsomorphicLayoutEffect(() => {
    indexRef.current = index;
    if (!ref.current) return;

    registerItem({ index, ref });
    return () => cleanupItem(index);
  }, [index]);

  const isFocusedBeforeUnmountingRef = React.useRef();
  React.useLayoutEffect(() => {
    const element = ref.current;
    return () =>
      (isFocusedBeforeUnmountingRef.current =
        element === element.getRootNode().activeElement);
  }, []);

  React.useEffect(() => {
    if (!ref.current) return;
    if (children.props.autoFocus) setIndexTo(index);

    // NOTE(amine): when an element is removed and is focused,move focus the next one
    return () => {
      syncFocusedIndexState({
        index: indexRef.current,
        isFocused: isFocusedBeforeUnmountingRef.current,
      });
    };
  }, []);

  return React.cloneElement(React.Children.only(children), {
    ...props,
    tabIndex: focusedIndex === index ? 0 : -1,
    ref: mergeRefs([ref, forwardedRef, children.ref]),
  });
});

export { Provider, List, Item };
