import * as React from "react";

import { CacheProvider as EmotionCacheProvider } from "@emotion/react";
import { injectGlobalStyles } from "../Common/styles/global";

import EmotionThemeProvider from "./EmotionThemeProvider";
import EmotionGlobalStyles from "./EmotionGlobalStyles";
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

  return (
    <ReactShadowRoot>
      <div id="react-shadow-root" ref={setShadowRefs} />
      {emotionCache && (
        <EmotionThemeProvider>
          <EmotionCacheProvider value={emotionCache}>
            <EmotionGlobalStyles styles={injectGlobalStyles} />
            {children}
          </EmotionCacheProvider>
        </EmotionThemeProvider>
      )}
    </ReactShadowRoot>
  );
}
