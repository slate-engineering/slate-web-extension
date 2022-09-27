import * as React from "react";

import { Global as EmotionGlobal } from "@emotion/react";
import { injectGlobalStyles, FontFaces } from "../common/styles/global";
import { isNewTab } from "../common/utilities";

// NOTE(amine): inject font faces to dom when using jumper (custom fonts don't load in the shadow dom)
if (!isNewTab) {
  const style = document.createElement("style");
  style.dataset.description = "slate-font-faces";

  style.appendChild(document.createTextNode(FontFaces));
  document.head.appendChild(style);
}

export default function EmotionGlobalStyles() {
  return <EmotionGlobal styles={injectGlobalStyles} />;
}
