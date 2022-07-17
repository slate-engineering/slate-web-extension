import React from "react";
import ReactDOM from "react-dom";
import HistoryScene from "./scenes/newTabHistory";
import EmotionThemeProvider from "./Components/EmotionThemeProvider";
import EmotionGlobalStyles from "./Components/EmotionGlobalStyles";

import { ViewerProvider } from "./Core/viewer/app/newTab";

ReactDOM.render(
  <>
    <React.StrictMode>
      <EmotionThemeProvider>
        <EmotionGlobalStyles />
        <ViewerProvider>
          <HistoryScene />
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
