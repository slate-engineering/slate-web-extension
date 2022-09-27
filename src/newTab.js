import * as React from "react";
import * as Constants from "~/common/constants";

import ReactDOM from "react-dom";
import HistoryScene from "~/scenes/newTabHistory";
import EmotionThemeProvider from "~/components/EmotionThemeProvider";
import EmotionGlobalStyles from "~/components/EmotionGlobalStyles";

import { ViewerProvider } from "~/core/viewer/app/newTab";
import { ModalsPortalProvider } from "~/components/ModalsPortal";

ReactDOM.render(
  <>
    <React.StrictMode>
      <EmotionThemeProvider>
        <EmotionGlobalStyles />
        <ViewerProvider>
          <ModalsPortalProvider
            defaultContainer={document.getElementById(
              Constants.jumperSlateExtensionModalsPortal
            )}
          >
            <HistoryScene />
          </ModalsPortalProvider>
        </ViewerProvider>
      </EmotionThemeProvider>
    </React.StrictMode>
  </>,
  document.getElementById("modal-window-slate-extension")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
