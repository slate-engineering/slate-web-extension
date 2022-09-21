import * as React from "react";
import * as SVG from "../Common/SVG";

import { css } from "@emotion/react";

const STYLES_SVG_CONTAINER = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const STYLES_LOADER_SPINNER_LARGE = css`
  @keyframes slate-client-animation-spin {
    from {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  transform: translate(-50%, -50%);
  display: block;
  animation: slate-client-animation-spin 1.5s cubic-bezier(0.5, 0.1, 0.4, 0.7)
    infinite;
`;

export const LoadingSpinner = ({ style, ...props }) => (
  <div css={STYLES_SVG_CONTAINER}>
    <span css={STYLES_LOADER_SPINNER_LARGE}>
      <SVG.Loader
        width="16px"
        height="16px"
        style={{ color: "#0084FF", display: "block", margin: "auto", ...style }}
        {...props}
      />
    </span>
  </div>
);

export const ToastSpinner = (props) => (
  <div className="loaderSpinner" style={props.style}>
    <SVG.Loader style={{ color: "#0084FF", width: 16, height: 16 }} />
  </div>
);
