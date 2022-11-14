import * as React from "react";
import * as SVG from "~/common/SVG";

import { css } from "@emotion/react";

const STYLES_CHECKBOX = css`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  margin: 0px;

  opacity: 0;
  cursor: pointer;
`;

const STYLES_CHECKBOX_PLACEHOLDER = (theme) => css`
  position: relative;
  width: 16px;
  height: 16px;
  background-color: transparent;
  border: 1px solid ${theme.semantic.borderGray};
  border-radius: 4px;

  &:focus-within {
    outline: 2px solid ${theme.system.blue};
  }
`;

const STYLES_CHECKBOX_PLACEHOLDER_CHECKED = (theme) => css`
  background-color: ${theme.system.blue} !important;
  color: ${theme.semantic.textWhite};
  border: none !important;
`;

const STYLES_CHEKMARK = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Checkbox = React.forwardRef(
  ({ checked, className, style, css, ...props }, ref) => {
    return (
      <div
        css={[
          STYLES_CHECKBOX_PLACEHOLDER,
          checked && STYLES_CHECKBOX_PLACEHOLDER_CHECKED,
          css,
        ]}
        style={style}
        className={className}
      >
        <input
          type="checkbox"
          css={STYLES_CHECKBOX}
          checked={checked}
          ref={ref}
          {...props}
        />
        {checked && (
          <SVG.Check
            height={12}
            width={12}
            css={STYLES_CHEKMARK}
            style={{ pointerEvents: "none" }}
          />
        )}
      </div>
    );
  }
);

export default Checkbox;
