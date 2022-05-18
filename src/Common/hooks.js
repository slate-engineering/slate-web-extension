import * as React from "react";
import * as Constants from "../Common/constants";

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
