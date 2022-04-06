import * as React from "react";
import * as Constants from "../Common/constants";

import {
  CacheProvider as EmotionCacheProvider,
  ThemeProvider as EmotionThemeProvider,
  Global as EmotionGlobal,
} from "@emotion/react";
import { injectGlobalStyles } from "../Common/styles/global";

import ReactShadowRoot from "react-shadow-root";
import createCache from "@emotion/cache";

// Define custom location to insert Emotion styles (instead of document head)
// From: https://emotion.sh/docs/cache-provider

export default function ShadowDom({ children }) {
  const [emotionCache, setEmotionCache] = React.useState(null);

  function setEmotionStyles(ref) {
    if (ref && !emotionCache) {
      const createdEmotionWithRef = createCache({
        key: "slate_styles",
        container: ref,
      });
      setEmotionCache(createdEmotionWithRef);
    }
  }

  function setShadowRefs(ref) {
    setEmotionStyles(ref);
  }

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

  return (
    <ReactShadowRoot>
      <div id="react-shadow-root" ref={setShadowRefs} />
      {emotionCache && (
        <EmotionThemeProvider theme={theme}>
          <EmotionCacheProvider value={emotionCache}>
            <EmotionGlobal styles={injectGlobalStyles} />
            {children}
          </EmotionCacheProvider>
        </EmotionThemeProvider>
      )}
    </ReactShadowRoot>
  );
}
