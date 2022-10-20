import * as React from "react";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";

const STYLES_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  display: flex;
  background-color: ${theme.semantic.bgBlurWhite};
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px ${theme.system.grayLight5}, ${theme.shadow.lightLarge};
  transition: box-shadow 0.3s;
  color: ${theme.semantic.textBlack};
  :hover {
    box-shadow: 0 0 0 1px ${theme.system.blue}, ${theme.shadow.lightLarge};
  }

  path {
    transition: stroke 0.3s;
  }
  :hover path {
    stroke: ${theme.system.blue};
  }
`;

const CopyButton = React.forwardRef(({ isCopied, onClick, ...props }, ref) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(e);
  };

  return (
    <button css={STYLES_BUTTON} onClick={handleClick} ref={ref} {...props}>
      {isCopied ? (
        <SVG.Check width={16} height={16} />
      ) : (
        <SVG.CopyAndPaste width={16} height={16} />
      )}
    </button>
  );
});

export default CopyButton;
