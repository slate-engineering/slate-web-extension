import * as React from "react";

import * as Constants from "../Common/constants";

export const Divider = ({
  width,
  height = "1px",
  color = Constants.system.grayLight4,
  css,
  ...props
}) => {
  return (
    <div
      css={[
        (theme) => ({
          height,
          width,
          minHeight: height,
          backgroundColor:
            theme.system?.[color] || theme.semantic?.[color] || color,
        }),
        css,
      ]}
      {...props}
    />
  );
};
