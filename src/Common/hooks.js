import * as React from "react";
import * as Constants from "../Common/constants";

import { last } from "../Common/utilities";
import { v4 as uuid } from "uuid";

export const useEventListener = (
  { type, handler, ref, options, enabled = true },
  dependencies
) => {
  React.useEffect(() => {
    if (!enabled) return;

    let element = window;
    if (ref) element = ref.current;

    if (!element) return;

    element.addEventListener(type, handler, options);
    return () => element.removeEventListener(type, handler, options);
  }, dependencies);
};

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export const useOnWindowBlur = (callback) => {
  React.useEffect(() => {
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
      // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    const handleVisibilityChange = () => {
      if (document[hidden]) callback();
    };
    window.addEventListener(visibilityChange, handleVisibilityChange, false);
    return () =>
      window.removeEventListener(visibilityChange, handleVisibilityChange);
  }, []);
};

export const useMediaQuery = (getMediaQuery) => {
  const MEDIA_SIZE = getMediaQuery(Constants.sizes) || Constants.sizes.mobile;
  const mediaQuery = `(max-width: ${MEDIA_SIZE}px)`;

  const [isMatchingQuery, setMatchingQuery] = React.useState(true);

  const handleResize = () => {
    const isMatchingQuery = window.matchMedia(mediaQuery).matches;
    setMatchingQuery(isMatchingQuery);
  };

  React.useEffect(() => {
    if (!window) return;

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // NOTE(amine): currently only support mobile breakpoint, we can add more breakpoints as needed.
  return isMatchingQuery;
};

// SOURCE(amine): https://zellwk.com/blog/keyboard-focusable-elements/
const getFocusableElements = (element = document) =>
  [
    ...element.querySelectorAll(
      'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
    ),
  ]
    // NOTE(amine): remove disabled buttons and elements with aria-hidden attribute
    .filter(
      (el) =>
        !el.hasAttribute("disabled") &&
        !el.getAttribute("aria-hidden") &&
        el.getAttribute("tabindex") !== "-1"
    );

/* NOTE(amine): used to trap focus inside a component. **/
export const useTrapFocus = ({ ref }) => {
  const handleFocus = (e) => {
    if (!ref.current) return;
    const elements = getFocusableElements(ref.current);
    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];

    const isTabPressed = e.key === "Tab" || e.keyCode === "9";
    if (!isTabPressed) return;

    const shadowRoot = ref.current.getRootNode();
    const { activeElement } = shadowRoot;

    if (e.shiftKey) {
      if (activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  useEventListener({ type: "keydown", handler: handleFocus }, []);
};

export const usePreviousValue = (value) => {
  const prevValue = React.useRef(value);

  React.useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return prevValue.current;
};

let layers = [];
const removeLayer = (id) => (layers = layers.filter((layer) => layer !== id));
const isDeepestLayer = (id) => last(layers) === id;

export const useEscapeKey = (callback) => {
  const layerIdRef = React.useRef();
  React.useEffect(() => {
    layerIdRef.current = uuid();
    layers.push(layerIdRef.current);
    return () => removeLayer(layerIdRef.current);
  }, []);

  const handleKeyUp = React.useCallback(
    (e) => {
      if (e.key === "Escape" && isDeepestLayer(layerIdRef.current))
        callback?.(e);
    },
    [callback]
  );
  useEventListener({ type: "keyup", handler: handleKeyUp }, [handleKeyUp]);
};

export const useRestoreFocus = ({ isEnabled } = { isEnabled: true }) => {
  const activeElementRef = React.useRef();
  React.useMemo(() => {
    const lastActiveElement =
      typeof document !== "undefined" ? document.activeElement : null;

    activeElementRef.current = lastActiveElement;
  }, []);

  React.useLayoutEffect(() => {
    if (!isEnabled) return;
    return () => {
      const lastActiveElement = activeElementRef.current;
      console.log("item to focus", lastActiveElement);
      lastActiveElement?.focus?.();
    };
  }, [isEnabled]);
};

export const useMounted = (callback, deps) => {
  const isMountedRef = React.useRef(false);
  React.useEffect(() => {
    isMountedRef.current = true;

    if (isMountedRef.current) {
      return callback();
    }
  }, deps);
};
