import * as React from "react";

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
