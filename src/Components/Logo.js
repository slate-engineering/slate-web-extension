import * as React from "react";

import { getExtensionURL } from "~/common/utilities";

function Logo({ style, ...props }, ref) {
  return (
    <img
      src={getExtensionURL("/images/logo.png")}
      alt="Slate logo"
      height={16}
      width={16}
      ref={ref}
      style={{ display: "block", ...style }}
      {...props}
    />
  );
}

export default React.forwardRef(Logo);
