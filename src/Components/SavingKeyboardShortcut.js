import * as React from "react";
import * as Styles from "~/common/styles";
import * as Typography from "~/components/system/Typography";

import { css } from "@emotion/react";
import { isUsingMac } from "~/common/utilities";

const STYLES_SAVING_SHORTCUT_ICON = (theme) => css`
  padding: 8px;
  width: 32px;
  line-height: 16px;
  text-align: center;
  background-color: ${theme.semantic.bgGrayLight};
  border-radius: 8px;
  color: ${theme.semantic.textBlack};
`;
function SavingKeyboardShortcut(props) {
  return (
    <div css={Styles.HORIZONTAL_CONTAINER_CENTERED} {...props}>
      <Typography.H4 as="p" color="textBlack" css={STYLES_SAVING_SHORTCUT_ICON}>
        {isUsingMac ? "⌥" : "Alt"}
      </Typography.H4>
      <Typography.H4
        as="p"
        color="textBlack"
        css={STYLES_SAVING_SHORTCUT_ICON}
        style={{ marginLeft: 4 }}
      >
        {isUsingMac ? "S" : "B"}
      </Typography.H4>
    </div>
  );
}

export { SavingKeyboardShortcut };
