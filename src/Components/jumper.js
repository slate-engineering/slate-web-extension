import * as React from "react";
import * as ReactDom from "react-dom";
import * as Styles from "../Common/styles";

import { css } from "@emotion/react";
import { useTrapFocusInShadowDom } from "../Common/hooks";
import { mergeRefs } from "Common/utilities";
import { Divider } from "../Components/Divider";

// NOTE(amine): used to fix stacking issues in overflowing parts
const JumperContext = React.createContext({});
const useJumperContext = () => React.useContext(JumperContext);

const JumperPanelsPortal = ({ children }) => {
  const { jumperNode } = useJumperContext();
  if (!jumperNode) return null;

  return ReactDom.createPortal(children, jumperNode);
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

const STYLES_JUMPER_ROOT_FIXED_POSITION = css`
  width: ${JUMPER_WIDTH}px;
  height: ${JUMPER_HEIGHT}px;
  position: fixed;
  z-index: 23423423432;
  top: 50%;
  left: 50%;
  margin-left: calc(-696px / 2);
  margin-top: calc(-548px / 2);
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
    (-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))
  ) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurLight};
  }

  ${STYLES_JUMPER_FADE_IN_ANIMATION};
`;

const useCloseJumperOnEsc = ({ onClose }) => {
  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
};

function Root({ children, onClose }) {
  const wrapperRef = React.useRef();
  useTrapFocusInShadowDom({ ref: wrapperRef });

  useCloseJumperOnEsc({ onClose });

  const [jumperNode, setJumperNode] = React.useState(null);
  const contextValue = React.useMemo(() => ({ jumperNode }), [jumperNode]);

  return (
    <JumperContext.Provider value={contextValue}>
      <div
        css={STYLES_JUMPER_ROOT_FIXED_POSITION}
        ref={mergeRefs([wrapperRef, setJumperNode])}
      >
        <div css={STYLES_JUMPER_ROOT}>{children}</div>
      </div>
    </JumperContext.Provider>
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

function Body({ children, ...props }) {
  return <div {...props}>{children}</div>;
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

const STYLES_JUMPER_TOP_PANEL = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER};
  position: absolute;
  z-index: -1;
  left: 0%;
  top: -17px;

  width: 100%;
  transform: translateY(-100%);

  border-radius: 16px;
  background-color: white;
  border: 1px solid ${theme.semantic.borderGrayLight4};
  box-shadow: ${theme.shadow.jumperLight};

  @supports (
    (-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))
  ) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhite};
  }

  ${STYLES_JUMPER_TOP_PANEL_FADE_IN};
`;

const TopPanel = ({ children }) => {
  return (
    <JumperPanelsPortal>
      <div css={STYLES_JUMPER_TOP_PANEL}>{children}</div>
    </JumperPanelsPortal>
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

  background-color: ${theme.semantic.bgWhite};
  @supports (
    (-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))
  ) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurLightOP};
  }
`;

const SidePanel = ({ children }) => {
  return (
    <JumperPanelsPortal>
      <div css={STYLES_JUMPER_SIDE_PANEL}>{children}</div>
    </JumperPanelsPortal>
  );
};

export { Root, Header, Body, Divider, TopPanel, SidePanel };