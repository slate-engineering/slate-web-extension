import * as React from "react";
import * as SVG from "../Common/SVG";

export const LoadingSpinner = (props) => (
  <div className="svgcontainer">
    <span className="loaderSpinnerLarge">
      <SVG.Loader
        width="16px"
        height="16px"
        style={{ color: "#0084FF", display: "block", margin: "auto" }}
      />
    </span>
  </div>
);

export const ToastSpinner = (props) => (
  <div style={{ padding: "0px 4px", marginRight: 4 }}>
    <span className="loaderSpinner">
      <SVG.Loader style={{ color: "#0084FF", width: 16, height: 16 }} />
    </span>
  </div>
);
