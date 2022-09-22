import * as React from "react";
import * as Jumper from "./jumper";
import * as Typography from "./system/Typography";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";

import { useViewer } from "../Core/viewer/app/jumper";
import { css } from "@emotion/react";

const STYLES_PERMISSION_ONBOARDING_WRAPPER = css`
  ${Styles.HORIZONTAL_CONTAINER};
  width: 344px;
  padding: 16px 20px;
`;

const STYLES_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.B1};
  padding: 1px 12px 3px;
  border-radius: 8px;
  &:focus {
    outline: 2px solid ${theme.system.blue};
  }
`;

const STYLES_BUTTON_PRIMARY = (theme) => css`
  ${STYLES_BUTTON(theme)};
  background-color: ${theme.system.blue};
  color: ${theme.semantic.bgWhite};
  &:hover {
    color: ${theme.semantic.bgWhite};
  }
`;
const STYLES_BUTTON_SECONDARY = (theme) => css`
  ${STYLES_BUTTON(theme)};
  background-color: ${theme.semantic.bgGrayLight};
  color: ${theme.semantic.textBlack};
  &:hover {
    color: ${theme.semantic.textBlack};
  }
`;

function PermissionsOnboarding() {
  const viewer = useViewer();

  if (!viewer.settings.hasCompletedExtensionOBFirstStep) {
    return (
      <Jumper.BottomPanel css={STYLES_PERMISSION_ONBOARDING_WRAPPER}>
        <div style={{ padding: 2 }}>
          <SVG.Hash width={16} height={16} />
        </div>
        <div style={{ marginLeft: 8 }}>
          <Typography.H5 color="textBlack">
            Slate connects with your browser history so you can search and
            organize them.
          </Typography.H5>
          <div css={Styles.HORIZONTAL_CONTAINER} style={{ marginTop: 8 }}>
            <button css={STYLES_BUTTON_PRIMARY}>Got it</button>
            <button css={STYLES_BUTTON_SECONDARY} style={{ marginLeft: 4 }}>
              Go to settings
            </button>
          </div>
        </div>
      </Jumper.BottomPanel>
    );
  }

  if (!viewer.settings.hasCompletedExtensionOBSecondStep) {
    return (
      <Jumper.BottomPanel css={STYLES_PERMISSION_ONBOARDING_WRAPPER}>
        <div style={{ padding: 2 }}>
          <SVG.Hash width={16} height={16} />
        </div>
        <div style={{ marginLeft: 8 }}>
          <Typography.H5 color="textBlack">
            Slate auto-saves your bookmarks so you can keep using Chrome to
            collect links.
          </Typography.H5>
          <div css={Styles.HORIZONTAL_CONTAINER} style={{ marginTop: 8 }}>
            <button css={STYLES_BUTTON_PRIMARY}>Got it</button>
            <button css={STYLES_BUTTON_SECONDARY} style={{ marginLeft: 4 }}>
              Go to settings
            </button>
          </div>
        </div>
      </Jumper.BottomPanel>
    );
  }

  return null;
}

export { PermissionsOnboarding };
