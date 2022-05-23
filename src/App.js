import * as React from "react";
import * as Navigation from "./Core/navigation/app";

import HistoryScene from "./scenes/history";
import ShadowDom from "./Components/ShadowDom";

import { NavigationProvider } from "./Core/navigation/app/jumper";
import { useOnWindowBlur } from "./Common/hooks";

function App() {
  useOnWindowBlur(Navigation.closeExtensionJumper);

  return (
    <NavigationProvider>
      <div style={{ all: "initial" }}>
        <ShadowDom>
          <HistoryScene />
        </ShadowDom>
      </div>
    </NavigationProvider>
  );
}

export default App;
