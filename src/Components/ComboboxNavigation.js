import * as React from "react";

import { mergeEvents, mergeRefs } from "~/common/utilities";
import { useEventListener } from "~/common/hooks";

const comboboxContext = React.createContext({});
const useComboboxContext = () => React.useContext(comboboxContext);

function ComboboxProvider({
  children,
  isMobile = false,
  isInfiniteList,
  onItemSubmit,
}) {
  const initialIndex = 0;
  const [selectedIdx, setSelectedIdx] = React.useState(initialIndex);

  const [isInputFocused, setInputFocus] = React.useState(true);
  const menuSelectionDisabled = isMobile || !isInputFocused;

  const menuItemsRef = React.useRef({});

  const inputElementRef = React.useRef();
  const registerInputRef = (node) => (inputElementRef.current = node);

  const registerMenuItem = ({ index, onSubmitRef, ref }) => {
    menuItemsRef.current[index] = { index, onSubmitRef, ref };
  };
  const cleanupMenuItem = (index) => {
    if (menuSelectionDisabled) return;
    if (index === selectedIdx) setSelectedIdx(initialIndex);

    delete menuItemsRef.current[index];
  };

  const menuElementRef = React.useRef();
  const registerMenuRef = (node) => {
    if (menuSelectionDisabled) return;
    menuElementRef.current = node;
  };
  const cleanupMenu = () => {
    setSelectedIdx(initialIndex);
    menuItemsRef.current = {};
    menuElementRef.current = undefined;
  };

  const isNavigatingViaKeyboard = React.useRef(true);
  const moveSelectionOnArrowUp = () => {
    isNavigatingViaKeyboard.current = true;
    if (menuSelectionDisabled) return;
    const prevIndex = selectedIdx - 1;
    let prevFocusedIndex = null;
    if (prevIndex >= initialIndex) {
      prevFocusedIndex = prevIndex;
    } else if (isInfiniteList) {
      prevFocusedIndex = initialIndex;
    } else {
      prevFocusedIndex = Math.max(...Object.keys(menuItemsRef.current));
    }
    setSelectedIdx(prevFocusedIndex);
  };

  const moveSelectionOnArrowDown = () => {
    isNavigatingViaKeyboard.current = true;
    if (menuSelectionDisabled) return;
    const nextIndex = selectedIdx + 1;
    const elementExists = !!menuItemsRef?.current?.[nextIndex];
    const nextFocusedIndex = elementExists ? nextIndex : initialIndex;
    setSelectedIdx(nextFocusedIndex);
  };

  const moveSelectionOnHover = (index) => {
    if (menuSelectionDisabled && !isInputFocused) {
      inputElementRef.current.focus();
    }

    isNavigatingViaKeyboard.current = false;
    const elementExists = menuItemsRef.current[index];
    if (!elementExists) {
      console.warn(
        "Combobox: The element you're trying to select doesn't exist"
      );
      return;
    }
    setSelectedIdx(index);
  };

  const applySelectedElement = () => {
    if (menuSelectionDisabled) return;
    menuItemsRef.current[selectedIdx].onSubmitRef.current(), onItemSubmit?.();
  };

  React.useLayoutEffect(() => {
    if (menuSelectionDisabled) return;

    //NOTE(amine): don't scroll automatically when the user is navigating using a mouse
    if (!isNavigatingViaKeyboard.current) return;
    const menuNode = menuElementRef.current;
    const selectedNode = menuItemsRef.current[selectedIdx]?.ref?.current;
    if (!menuNode || !selectedNode) return;

    const menuTop = menuNode.scrollTop;
    const menuBottom = menuTop + menuNode.offsetHeight;

    const selectedNodeHeight = selectedNode.offsetHeight;
    const selectedNodeTop = selectedNode.offsetTop;
    const selectedNodeBottom = selectedNodeTop + selectedNode.offsetHeight;

    if (selectedIdx === 0) menuNode.scrollTo({ top: 0 });

    if (selectedNodeTop - selectedNodeHeight <= menuTop) {
      const nextNodeIndex = selectedIdx - 1;
      const nextNode = menuItemsRef.current[nextNodeIndex]?.ref?.current;
      if (!nextNode) return;

      menuNode.scrollTo({ top: nextNode.offsetTop });
      return;
    }

    if (selectedNodeBottom >= menuBottom) {
      menuNode.scrollTo({
        top:
          selectedNodeBottom -
          menuNode.offsetHeight +
          selectedNode.offsetHeight,
      });
    }
  }, [selectedIdx, menuSelectionDisabled]);

  const contextValue = React.useMemo(
    () => [
      { selectedIdx, menuSelectionDisabled },
      {
        onItemSubmit,

        setInputFocus,
        registerInputRef,

        registerMenuItem,
        cleanupMenuItem,

        moveSelectionOnArrowUp,
        moveSelectionOnArrowDown,
        moveSelectionOnHover,
        applySelectedElement,

        registerMenuRef,
        cleanupMenu,
      },
    ],
    [selectedIdx, menuSelectionDisabled]
  );

  return (
    <comboboxContext.Provider value={contextValue}>
      {children}
    </comboboxContext.Provider>
  );
}

/* -----------------------------------------------------------------------------------------------*/

const ComboboxInput = React.forwardRef(
  ({ onKeyDown, onFocus, onBlur, children, ...props }, ref) => {
    const [
      ,
      {
        registerInputRef,
        setInputFocus,
        moveSelectionOnArrowUp,
        moveSelectionOnArrowDown,
        applySelectedElement,
      },
    ] = useComboboxContext();

    const keyDownHandler = (e) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          moveSelectionOnArrowUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          moveSelectionOnArrowDown();
          break;
        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          applySelectedElement();
          break;
      }
    };

    return React.cloneElement(React.Children.only(children), {
      onFocus: mergeEvents(() => setInputFocus(true), onFocus),
      onBlur: mergeEvents(() => setInputFocus(false), onBlur),
      onKeyDown: mergeEvents(
        children.props.onKeyDown,
        keyDownHandler,
        onKeyDown
      ),
      ref: mergeRefs([ref, children.ref, registerInputRef]),
      ...props,
    });
  }
);

/* -----------------------------------------------------------------------------------------------*/

function ComboboxMenuButton({
  children,
  index,
  onSelect,
  onSubmit,
  onMouseDown,
  onClick,
  ...props
}) {
  const [
    { selectedIdx, menuSelectionDisabled },
    { registerMenuItem, cleanupMenuItem, moveSelectionOnHover, onItemSubmit },
  ] = useComboboxContext();
  const handleMouseDown = (e) => e.preventDefault();
  const handleClick = () => (onSubmit?.(), onItemSubmit?.());

  const ref = React.useRef();

  //NOTE(amine): fix closure stale state
  const onSubmitRef = React.useRef(onSubmit);
  onSubmitRef.current = onSubmit;
  React.useEffect(() => {
    registerMenuItem({ index, onSubmitRef: onSubmitRef, ref });
    return () => cleanupMenuItem(index);
  }, [index]);

  React.useLayoutEffect(() => {
    if (onSelect && selectedIdx === index) {
      onSelect();
    }
  }, [selectedIdx === index]);

  const handleOnMouseMove = () => {
    if (menuSelectionDisabled || selectedIdx !== index) {
      moveSelectionOnHover(index);
    }
  };

  useEventListener(
    {
      type: "mousemove",
      handler: handleOnMouseMove,
      ref,
      options: { once: true },
    },
    [selectedIdx, menuSelectionDisabled]
  );

  return React.cloneElement(React.Children.only(children), {
    tabIndex: -1,
    onMouseDown: mergeEvents(handleMouseDown, onMouseDown),
    onMouseEnter: mergeEvents(handleOnMouseMove, children.onMouseEnter),
    onClick: mergeEvents(handleClick, onClick),
    ref: ref,
    ...props,
  });
}

/* -----------------------------------------------------------------------------------------------*/

const ComboboxMenu = React.forwardRef(({ children, ...props }, ref) => {
  const [, { registerMenuRef, cleanupMenu }] = useComboboxContext();

  React.useLayoutEffect(() => cleanupMenu, []);
  return React.cloneElement(React.Children.only(children), {
    ref: mergeRefs([ref, children.ref, registerMenuRef]),
    style: { position: "relative", ...children.props.style },
    ...props,
  });
});

/* -----------------------------------------------------------------------------------------------*/

export const Combobox = {
  Provider: ComboboxProvider,
  Input: ComboboxInput,
  Menu: ComboboxMenu,
  MenuButton: ComboboxMenuButton,
};

export const useComboboxNavigation = () => {
  const [{ selectedIdx, menuSelectionDisabled }] = useComboboxContext();
  const checkIfIndexSelected = (index) => {
    if (menuSelectionDisabled) return false;
    return selectedIdx === index;
  };
  return { checkIfIndexSelected };
};
