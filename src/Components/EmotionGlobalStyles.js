import * as React from "react";

import { Global as EmotionGlobal } from "@emotion/react";
import { injectGlobalStyles } from "../Common/styles/global";

export default function EmotionGlobalStyles() {
  return <EmotionGlobal styles={injectGlobalStyles} />;
}
