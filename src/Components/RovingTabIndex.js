import * as React from "react";

import { mergeEvents, mergeRefs } from "~/common/utilities";
import {
  useEventListener,
  useIsomorphicLayoutEffect,
  useMounted,
} from "~/common/hooks";

/* -------------------------------------------------------------------------------------------------
 * RovingTabIndex Provider
 * -----------------------------------------------------------------------------------------------*/

const useManageScrollPosition = ({
  axis,
  listRef,
  focusedElementsRefs,
  focusedIndex,
  isNavigatingViaKeyboardRef,
}) => {
  React.useLayoutEffect(() => {
    if (axis === "horizontals" || !isNavigatingViaKeyboardRef.current) return;

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

/* -------------------------------------------------------------------------------------------------
 *  Provider
 * -----------------------------------------------------------------------------------------------*/

const ids = {};
const useHandleRestoreFocusOnMount = ({
  id,
  onRestoreFocus,
  withRestoreFocusOnMount,
  focusedIndex,
}) => {
  const shouldRestoreFocus = id && withRestoreFocusOnMount;

  React.useEffect(() => {
    if (shouldRestoreFocus && id in ids) {
      const prevSessionIndex = ids[id];
      onRestoreFocus(prevSessionIndex);
    }
  }, []);

  useMounted(() => {
    if (shouldRestoreFocus) {
      ids[id] = focusedIndex;
    }
  }, [focusedIndex]);
};

const Provider = React.forwardRef(
  (
    {
      id,
      withRestoreFocusOnMount,
      isInfiniteList,
      axis = "vertical",
      withFocusOnHover,
      children,
    },
    ref
  ) => {
    const isNavigatingViaKeyboardRef = React.useRef(true);

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
      isNavigatingViaKeyboardRef.current = true;

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
      isNavigatingViaKeyboardRef.current = true;

      const prevIndex = focusedIndex - 1;
      let prevFocusedIndex = null;
      if (prevIndex >= initialIndex) {
        prevFocusedIndex = prevIndex;
      } else if (isInfiniteList) {
        return;
      } else {
        prevFocusedIndex = Math.max(
          ...Object.keys(focusedElementsRefs.current)
        );
      }
      setFocusedIndex(prevFocusedIndex);
      focusElement(prevFocusedIndex);
    };

    const setIndexTo = (index) => {
      isNavigatingViaKeyboardRef.current = false;

      if (!focusedElementsRefs.current[index]) return;
      setFocusedIndex(index);
      focusElement(index);
    };

    useManageScrollPosition({
      isNavigatingViaKeyboardRef,
      listRef,
      focusedElementsRefs,
      focusedIndex,
      axis,
    });

    useHandleRestoreFocusOnMount({
      id,
      withRestoreFocusOnMount,
      focusedIndex,
      onRestoreFocus: setIndexTo,
    });

    React.useImperativeHandle(
      ref,
      () => {
        const focus = (fallback) => {
          const isFeedEmpty = !focusedElementsRefs.current[initialIndex];
          if (isFeedEmpty) {
            fallback?.();
            return;
          }
          focusElement(focusedIndex);
        };

        return { focus };
      },
      [focusedIndex]
    );

    const contextValue = React.useMemo(
      () => [
        { focusedIndex, axis, withFocusOnHover, withRestoreFocusOnMount },
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
    { focusedIndex, withFocusOnHover, withRestoreFocusOnMount },
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
    if (children.props.autoFocus && !withRestoreFocusOnMount) setIndexTo(index);

    // NOTE(amine): when an element is removed and is focused,move focus the next one
    return () => {
      syncFocusedIndexState({
        index: indexRef.current,
        isFocused: isFocusedBeforeUnmountingRef.current,
      });
    };
  }, []);

  const handleFocusOnMouseMove = () => {
    if (withFocusOnHover) setIndexTo(index);
  };

  const handleFocusOnMouseEnter = () => {
    if (withFocusOnHover) setIndexTo(index);
  };

  useEventListener(
    {
      type: "mousemove",
      handler: handleFocusOnMouseMove,
      ref,
      options: { once: true },
    },
    [focusedIndex]
  );

  return React.cloneElement(React.Children.only(children), {
    ...props,
    onMouseEnter: mergeEvents(handleFocusOnMouseEnter, children.onMouseEnter),
    tabIndex: focusedIndex === index ? 0 : -1,
    ref: mergeRefs([ref, forwardedRef, children.ref]),
  });
});

export { Provider, List, Item };
