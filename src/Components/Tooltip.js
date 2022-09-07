import * as React from "react";
import * as Typography from "../Components/system/Typography";
import * as Styles from "../Common/styles";

import { isNewTab, mergeRefs } from "../Common/utilities";
import { useEscapeKey, useEventListener } from "../Common/hooks";
import { motion } from "framer-motion";
import { css } from "@emotion/react";
import { ModalsPortal } from "../Components/ModalsPortal";
import { Boundary } from "../Components/Boundary";

/* -------------------------------------------------------------------------------------------------
 *  Root
 * -----------------------------------------------------------------------------------------------*/

const TooltipContext = React.createContext({});
const useTooltipContext = () => React.useContext(TooltipContext);

function Root({ children, vertical = "below", horizontal = "right" }) {
  const [state, setState] = React.useState({
    isOpen: false,
    triggerRef: { current: null },
  });
  const showTooltip = () => setState((prev) => ({ ...prev, isOpen: true }));
  const hideTooltip = () => setState((prev) => ({ ...prev, isOpen: false }));
  const setTriggerRef = (triggerRef) =>
    setState((prev) => ({ ...prev, triggerRef }));

  const contextValue = React.useMemo(
    () => ({
      showTooltip,
      hideTooltip,
      setTriggerRef,
      vertical,
      horizontal,
      ...state,
    }),
    [state, vertical, horizontal]
  );

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Trigger
 * -----------------------------------------------------------------------------------------------*/

const Trigger = React.forwardRef(({ children, ...props }, forwardedRef) => {
  const { setTriggerRef, showTooltip, hideTooltip } = useTooltipContext();

  const ref = React.useRef();

  React.useEffect(() => {
    if (ref.current) setTriggerRef(ref);
  }, []);

  useEventListener({ type: "mouseenter", handler: showTooltip, ref });
  useEventListener({ type: "mouseleave", handler: hideTooltip, ref });
  useEventListener({ type: "click", handler: hideTooltip, ref });
  useEventListener({ type: "focus", handler: showTooltip, ref });
  useEventListener({ type: "blur", handler: hideTooltip, ref });

  return React.cloneElement(React.Children.only(children), {
    role: "tooltip",
    ...props,
    ref: mergeRefs([ref, forwardedRef, children.ref]),
  });
});

/* -------------------------------------------------------------------------------------------------
 *  Content
 * -----------------------------------------------------------------------------------------------*/

const getTooltipPosition = (
  triggerElement,
  TooltipElement,
  vertical,
  horizontal
) => {
  let yOffset = window.pageYOffset;
  let xOffset = window.pageXOffset;

  const triggerRect = triggerElement.getBoundingClientRect();
  const tooltipRect = TooltipElement.getBoundingClientRect();

  let position = {};
  switch (vertical) {
    case "above":
      position.top = `${triggerRect.top - tooltipRect.height + yOffset}px`;
      break;
    case "up":
      position.top = `${triggerRect.bottom - tooltipRect.height + yOffset}px`;
      break;
    case "center":
      position.top = `${
        triggerRect.top +
        0.5 * triggerRect.height -
        0.5 * tooltipRect.height +
        yOffset
      }px`;
      break;
    case "down":
      position.top = `${triggerRect.top + yOffset}px`;
      break;
    case "below":
      position.top = `${triggerRect.bottom + yOffset}px`;
      break;
  }
  switch (horizontal) {
    case "far-left":
      position.left = `${triggerRect.left - tooltipRect.width + xOffset}px`;
      break;
    case "left":
      position.left = `${triggerRect.right - tooltipRect.width + xOffset}px`;
      break;
    case "center":
      position.left = `${
        triggerRect.left +
        0.5 * triggerRect.width -
        0.5 * tooltipRect.width +
        xOffset
      }px`;
      break;
    case "right":
      position.left = `${triggerRect.left + xOffset}px`;
      break;
    case "far-right":
      position.left = `${triggerRect.right + xOffset}px`;
      break;
  }
  return position;
};

const adjustTooltipDirection = (
  triggerElement,
  TooltipElement,
  vertical,
  horizontal
) => {
  let yOffset = triggerElement ? triggerElement.scrollTop : window.pageYOffset;
  let xOffset = triggerElement ? triggerElement.scrollLeft : window.pageXOffset;

  const triggerRect = triggerElement.getBoundingClientRect();
  const tooltipRect = TooltipElement.getBoundingClientRect();

  if (!vertical) {
    if (tooltipRect.height > triggerRect.top + yOffset) {
      vertical = "below";
    } else {
      vertical = "above";
    }
  }
  if (!horizontal) {
    if (
      tooltipRect.width / 2 >
      triggerRect.left + triggerRect.width / 2 + xOffset
    ) {
      horizontal = "right";
    } else if (
      tooltipRect.width / 2 >
      triggerRect.right + triggerRect.width / 2 + xOffset
    ) {
      horizontal = "left";
    } else {
      horizontal = "center";
    }
  }
  return { vertical, horizontal };
};

const STYLES_CONTENT_WRAPPER = (theme) => css`
  z-index: ${theme.zindex.tooltip + !isNewTab
    ? theme.zindex.extensionJumper
    : 0};
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 8px;
  border: 1px solid ${theme.semantic.borderGrayLight4};
  padding: 6px 8px;

  box-shadow: ${theme.shadow.darkSmall};
  background-color: ${theme.semantic.bgWhite};
  @supports (
    (-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))
  ) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
  }
`;

function ContentWrapper({ children, css, style, ...props }) {
  const { hideTooltip, triggerRef, horizontal, vertical } = useTooltipContext();
  const [position, setPosition] = React.useState();

  const ref = React.useRef();

  React.useLayoutEffect(() => {
    if (ref) {
      const direction = adjustTooltipDirection(
        triggerRef.current,
        ref.current,
        vertical,
        horizontal
      );
      const position = getTooltipPosition(
        triggerRef.current,
        ref.current,
        direction.vertical,
        direction.horizontal
      );
      setPosition(position);
    }
  }, []);

  useEscapeKey(hideTooltip);
  useEventListener({ type: "scroll", handler: hideTooltip });

  return (
    <Boundary enabled={true} onOutsideRectEvent={hideTooltip}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        css={[STYLES_CONTENT_WRAPPER, css]}
        ref={ref}
        style={{ ...style, top: position?.top, left: position?.left }}
        hidden={!position}
        {...props}
      >
        {children}
      </motion.div>
    </Boundary>
  );
}

function Content({ children, ...props }) {
  const { isOpen } = useTooltipContext();

  if (!isOpen) return null;

  return (
    <ModalsPortal>
      <ContentWrapper {...props}>{children}</ContentWrapper>
    </ModalsPortal>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Shortcuts Tooltip
 * -----------------------------------------------------------------------------------------------*/

const ShortcutsTooltip = ({
  label,
  keyTrigger,
  id,
  children,
  vertical = "above",
  horizontal = "center",
  ...props
}) => {
  return (
    <Root vertical={vertical} horizontal={horizontal} {...props}>
      <Trigger aria-labelledby={id}>{children}</Trigger>
      <Content
        css={Styles.HORIZONTAL_CONTAINER_CENTERED}
        style={{ marginTop: vertical === "below" ? 4 : -4 }}
      >
        <Typography.H6 id={id} as="p" color="textGrayDark">
          {label}
        </Typography.H6>
        {keyTrigger && (
          <Typography.H6 as="p" color="textGray" style={{ marginLeft: 16 }}>
            {keyTrigger}
          </Typography.H6>
        )}
      </Content>
    </Root>
  );
};

export {
  // Fragments
  Root,
  Trigger,
  Content,
  // Prebuilt Components
  ShortcutsTooltip,
  // hooks
  useTooltipContext,
};
