import * as React from "react";
import * as ReactDom from "react-dom";
import * as Styles from "../Common/styles";

import { css } from "@emotion/react";
import { useEscapeKey, useTrapFocus } from "../Common/hooks";
import { getExtensionURL } from "../Common/utilities";
import { Divider } from "../Components/Divider";
import { Boundary } from "../Components/Boundary";

// NOTE(amine): used to fix stacking issues in overflowing parts
const JumperContext = React.createContext({});
const useJumperContext = () => React.useContext(JumperContext);

const JumperTopPanelPortal = ({ children }) => {
  const { jumperTopPanelNode } = useJumperContext();
  if (!jumperTopPanelNode) return null;

  return ReactDom.createPortal(children, jumperTopPanelNode);
};

const JumperBottomPanelPortal = ({ children }) => {
  const { jumperBottomPanelNode } = useJumperContext();
  if (!jumperBottomPanelNode) return null;

  return ReactDom.createPortal(children, jumperBottomPanelNode);
};

const JUMPER_WIDTH = 700;
const JUMPER_HEIGHT = 432;

/* -------------------------------------------------------------------------------------------------
 *  Root
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_FADE_IN_ANIMATION = css`
  @keyframes jumper-fade-in {
    0% {
      opacity: 0;
      transform: translateY(100px);
    }
    57% {
      opacity: 0;
      transform: translateY(100px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  animation: jumper-fade-in 200ms ease;
`;

const STYLES_JUMPER_ROOT_FIXED_POSITION = (theme) => css`
  width: ${JUMPER_WIDTH}px;
  height: ${JUMPER_HEIGHT}px;
  position: fixed;
  z-index: ${theme.zindex.extensionJumper};
  top: 50%;
  left: 50%;
  margin-left: calc(-696px / 2);
  margin-top: calc(-548px / 2);
`;

const STYLES_JUMPER_ROOT_ANIMATION_WRAPPER = css`
  position: relative;
  height: 100%;
  width: 100%;

  ${STYLES_JUMPER_FADE_IN_ANIMATION};
`;

const STYLES_JUMPER_ROOT_BACKGROUND = css`
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  background-image: url("${getExtensionURL("/images/bg-jumper-body.png")}");
  background-size: contain;
`;

const STYLES_JUMPER_ROOT = (theme) => css`
  ${Styles.VERTICAL_CONTAINER};
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px solid ${theme.semantic.borderGrayLight4};
  box-shadow: ${theme.shadow.jumperLight};
  //NOTE(amine): when changing border-radius, change it also in STYLES_MARBLE_WRAPPER and STYLES_APP_MODAL_BACKGROUND
  border-radius: 16px;
  overflow: hidden;

  background-color: ${theme.semantic.white};
  border-radius: 16px;
  @supports (
    (-webkit-backdrop-filter: blur(45px)) or (backdrop-filter: blur(45px))
  ) {
    -webkit-backdrop-filter: blur(45px);
    backdrop-filter: blur(45px);
    background-color: ${theme.semantic.bgBlurLight6};
  }
`;

function Root({ children, onClose }) {
  const wrapperRef = React.useRef();
  useTrapFocus({ ref: wrapperRef });

  useEscapeKey(onClose);

  const [jumperTopPanelNode, setJumperTopPanelNode] = React.useState(null);
  const [jumperBottomPanelNode, setJumperBottomPanelNode] =
    React.useState(null);
  const contextValue = React.useMemo(
    () => ({ jumperTopPanelNode, jumperBottomPanelNode }),
    [jumperTopPanelNode, jumperBottomPanelNode]
  );

  return (
    <Boundary enabled onOutsideRectEvent={onClose}>
      <JumperContext.Provider value={contextValue}>
        <div css={STYLES_JUMPER_ROOT_FIXED_POSITION} ref={wrapperRef}>
          <div ref={setJumperTopPanelNode} />
          <div css={STYLES_JUMPER_ROOT_ANIMATION_WRAPPER}>
            <div css={STYLES_JUMPER_ROOT_BACKGROUND} />
            <div css={STYLES_JUMPER_ROOT}>{children}</div>
          </div>
          <div ref={setJumperBottomPanelNode} />
        </div>
      </JumperContext.Provider>
    </Boundary>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Header
 * -----------------------------------------------------------------------------------------------*/

function Header({ children, style, ...props }) {
  return (
    <div style={style} {...props}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Body
 * -----------------------------------------------------------------------------------------------*/
const STYLES_BODY_WRAPPER = (theme) => css`
  height: ${theme.sizes.jumperFeedWrapper}px;
  padding: 0 8px 8px;
`;

function Body({ children, css, ...props }) {
  return (
    <div css={[STYLES_BODY_WRAPPER, css]} {...props}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Top panel
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_TOP_PANEL_FADE_IN = css`
  @keyframes views-menu-fade-in {
    from {
      opacity: 0;
      transform: translateY(calc(-100% + 16px));
    }
    to {
      opacity: 1;
      transform: translateY(-100%);
    }
  }

  animation: views-menu-fade-in 100ms ease;
`;

const STYLES_JUMPER_TOP_PANEL_ANIMATION_WRAPPER = css`
  position: absolute;
  z-index: -1;
  left: 0%;
  top: -12px;
  transform: translateY(-100%);

  ${STYLES_JUMPER_TOP_PANEL_FADE_IN};
`;

const STYLES_JUMPER_TOP_PANEL_BACKGROUND = css`
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  background-image: url("${getExtensionURL(
    "/images/bg-jumper-top-panel.png"
  )}");
  background-size: contain;
  border-radius: 16px;
`;

const STYLES_JUMPER_TOP_PANEL = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER};

  position: relative;
  border-radius: 16px;
  background-color: white;
  border: 1px solid ${theme.semantic.borderGrayLight4};
  box-shadow: ${theme.shadow.jumperLight};

  @supports (
    (-webkit-backdrop-filter: blur(45px)) or (backdrop-filter: blur(45px))
  ) {
    -webkit-backdrop-filter: blur(45px);
    backdrop-filter: blur(45px);
    background-color: ${theme.semantic.bgBlurLight6};
  }
`;

const TopPanel = ({ children, containerStyle }) => {
  return (
    <JumperTopPanelPortal>
      <div
        style={containerStyle}
        css={STYLES_JUMPER_TOP_PANEL_ANIMATION_WRAPPER}
      >
        <div css={STYLES_JUMPER_TOP_PANEL_BACKGROUND} />
        <div css={STYLES_JUMPER_TOP_PANEL}>{children}</div>
      </div>
    </JumperTopPanelPortal>
  );
};

/* -------------------------------------------------------------------------------------------------
 *  Bottom panel
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_BOTTOM_PANEL_FADE_IN = css`
  @keyframes views-menu-fade-in {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(calc(100% + 12px));
    }
  }

  animation: views-menu-fade-in 100ms ease;
`;

const STYLES_JUMPER_BOTTOM_PANEL_ANIMATION_WRAPPER = css`
  position: absolute;
  left: 0%;
  bottom: 0px;
  transform: translateY(calc(100% + 12px));

  width: fit-content;
  border-radius: 16px;

  ${STYLES_JUMPER_BOTTOM_PANEL_FADE_IN};
`;

const STYLES_JUMPER_BOTTOM_PANEL_BACKGROUND = css`
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  border-radius: inherit;
  height: 100%;
  background-image: url("${getExtensionURL(
    "/images/bg-jumper-top-panel.png"
  )}");
  background-size: contain;
`;

const STYLES_JUMPER_BOTTOM_PANEL = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER};

  width: ${JUMPER_WIDTH}px;
  border-radius: inherit;
  background-color: white;
  border: 1px solid ${theme.semantic.borderGrayLight4};
  box-shadow: ${theme.shadow.jumperLight};

  @supports (
    (-webkit-backdrop-filter: blur(45px)) or (backdrop-filter: blur(45px))
  ) {
    -webkit-backdrop-filter: blur(45px);
    backdrop-filter: blur(45px);
    background-color: ${theme.semantic.bgBlurLight6};
  }
`;

const BottomPanel = ({ children, css, ...props }) => {
  return (
    <JumperBottomPanelPortal>
      <div css={STYLES_JUMPER_BOTTOM_PANEL_ANIMATION_WRAPPER}>
        <div css={STYLES_JUMPER_BOTTOM_PANEL_BACKGROUND} />
        <div css={[STYLES_JUMPER_BOTTOM_PANEL, css]} {...props}>
          {children}
        </div>
      </div>
    </JumperBottomPanelPortal>
  );
};
/* -------------------------------------------------------------------------------------------------
 *  Right panel
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_SIDE_PANEL = (theme) => css`
  position: absolute;
  height: 376px;
  width: calc(((100vw - ${JUMPER_WIDTH}px) / 2) - 24px * 2);
  max-width: 348px;
  bottom: 0%;
  right: -16px;
  transform: translateX(100%);
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  border-radius: 24px;
  box-shadow: ${theme.shadow.lightLarge};
  border: 1px solid ${theme.semantic.borderGrayLight};

  background-color: ${theme.semantic.bgLight};
`;

const SidePanel = ({ children, css, ...props }) => {
  return (
    <JumperTopPanelPortal>
      <div css={[STYLES_JUMPER_SIDE_PANEL, css]} {...props}>
        {children}
      </div>
    </JumperTopPanelPortal>
  );
};

export { Root, Header, Body, Divider, TopPanel, BottomPanel, SidePanel };
