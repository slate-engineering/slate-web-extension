import * as React from "react";
import * as Styles from "../Common/styles";
import * as Typography from "./system/Typography";
import * as SVG from "../Common/SVG";

import { css } from "@emotion/react";
import { Checkbox } from "./system";
import { useEscapeKey } from "../Common/hooks";

const STYLES_WRAPPER = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  width: 100%;
  height: 48px;
  border-radius: 16px;
  border: 1px solid ${theme.semantic.borderGrayLight4};
  padding: 0px 20px;
`;

const STYLES_ACTION_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  color: ${theme.semantic.textGrayDark};
`;

export default function MultiSelectActions({
  isAllChecked,
  onAllCheckedChange,
  onOpen,
  onGroup,
  onClose,
}) {
  useEscapeKey(onClose);

  return (
    <div css={STYLES_WRAPPER}>
      <div css={Styles.HORIZONTAL_CONTAINER}>
        <Checkbox
          id="select_all_checkbox"
          checked={isAllChecked}
          onChange={(e) => onAllCheckedChange(e.target.checked)}
        />
        <Typography.H5
          as="label"
          for="select_all_checkbox"
          style={{ marginLeft: 12 }}
          color="textGrayDark"
        >
          Select All
        </Typography.H5>
      </div>
      <div
        css={Styles.HORIZONTAL_CONTAINER_CENTERED}
        style={{ marginLeft: "auto" }}
      >
        <button css={STYLES_ACTION_BUTTON} onClick={onGroup}>
          <SVG.SmileCircle height={16} width={16} />
          <Typography.H5 style={{ marginLeft: 4 }} color="textGrayDark">
            Group
          </Typography.H5>
        </button>
        <button
          css={STYLES_ACTION_BUTTON}
          style={{ marginLeft: 24 }}
          onClick={onOpen}
        >
          <SVG.ExternalLink height={16} width={16} />
          <Typography.H5 style={{ marginLeft: 4 }} color="textGrayDark">
            Open
          </Typography.H5>
        </button>
      </div>
    </div>
  );
}
