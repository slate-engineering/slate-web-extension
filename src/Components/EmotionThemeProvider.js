import * as React from "react";
import * as Constants from "../Common/constants";

import { ThemeProvider } from "@emotion/react";

export default function EmotionThemeProvider({ children }) {
  const theme = React.useMemo(
    () => ({
      sizes: Constants.sizes,
      system: Constants.system,
      shadow: Constants.shadow,
      zindex: Constants.zindex,
      font: Constants.font,
      typescale: Constants.typescale,
      semantic: Constants.semantic,
      grids: Constants.grids,
    }),
    []
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
