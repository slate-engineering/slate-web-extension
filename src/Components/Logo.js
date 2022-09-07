import * as React from "react";

import { getExtensionURL } from "../Common/utilities";

function Logo(props, ref) {
  return (
    <img
      src={getExtensionURL("/images/logo.png")}
      alt="Slate logo"
      height={16}
      width={16}
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Logo);
