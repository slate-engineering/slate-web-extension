import { useEventListener } from "Common/hooks";
import * as React from "react";

//NOTE(martina): This component behaves unusually sometimes when there is a click on an SVG. It will count it as an out of rectangle event. Solve this issue with adding { pointerEvents: "none" } to the SVG

function Boundary({ children, enabled, onOutsideRectEvent, ...props }) {
  const rootRef = React.useRef();

  const handleClick = React.useCallback(
    (e) => {
      if (!enabled) return;

      const parent = rootRef.current;
      const target = e.composedPath()[0];

      // NOTE(jim): anything with `data-menu` is also ignored...
      if (!target || !parent) {
        return;
      }

      if (target instanceof SVGElement) {
        return;
      }

      if (!target.isConnected || !parent.isConnected) {
        return;
      }

      const doesRootContainTarget = parent.contains(target);
      if (parent && !doesRootContainTarget) {
        onOutsideRectEvent(e);
      }
    },
    [enabled]
  );

  useEventListener({ handler: handleClick, type: "click" }, [handleClick]);

  return (
    <div ref={rootRef} {...props}>
      {children}
    </div>
  );
}

export { Boundary };
