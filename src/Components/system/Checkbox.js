import * as React from "react";
import * as SVG from "../../Common/SVG";

import { css } from "@emotion/react";

const STYLES_CHECKBOX = css`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  padding: 2px;

  z-index: 1;
  opacity: 0;
  cursor: pointer;
`;

const STYLES_CHECKBOX_WRAPPER = css`
  position: relative;
  height: 20px;
  width: 20px;
  border-radius: 4px;
`;

const STYLES_CHECKBOX_PLACEHOLDER = (theme) => css`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  padding: 2px;
  background-color: transparent;
  border: 1px solid ${theme.semantic.borderGray};
  border-radius: 4px;

  &:focus-within {
    outline: 2px solid ${theme.system.blue};
  }
`;

const STYLES_CHECKBOX_PLACEHOLDER_CHECKED = (theme) => css`
  background-color: ${theme.system.blue};
  color: ${theme.semantic.textWhite};
  border: none;
`;

const Checkbox = React.forwardRef(
  ({ checked, className, style, ...props }, ref) => {
    return (
      <div className={className} style={style} css={STYLES_CHECKBOX_WRAPPER}>
        <div
          css={[
            STYLES_CHECKBOX_PLACEHOLDER,
            checked && STYLES_CHECKBOX_PLACEHOLDER_CHECKED,
          ]}
        >
          {checked && (
            <SVG.Check
              height={12}
              width={12}
              style={{ pointerEvents: "none" }}
            />
          )}
          <input
            type="checkbox"
            css={STYLES_CHECKBOX}
            checked={checked}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);

export default Checkbox;
