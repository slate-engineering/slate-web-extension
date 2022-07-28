import * as React from "react";
import * as ReactDOM from "react-dom";

import { css } from "@emotion/react";

const STYLES_MENU_ACTIONS_WRAPPER = (theme) => css`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 30px;

  width: 100%;
  max-width: 878px;
  z-index: ${theme.zindex.modal};

  border-radius: 12px;
  background-color: ${theme.system.black};
  box-shadow: ${theme.shadow.darkSmall};
`;

export default function ActionsMenuPopup({ children, ...props }) {
  return (
    <ActionsMenuPortal>
      <div css={STYLES_MENU_ACTIONS_WRAPPER} {...props}>
        {children}
      </div>
    </ActionsMenuPortal>
  );
}

function ActionsMenuPortal({ children }) {
  return ReactDOM.createPortal(children, document.body);
}
