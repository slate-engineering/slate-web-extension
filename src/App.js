import * as React from "react";
import * as Navigation from "./Core/navigation/app";

import HistoryScene from "./scenes/history";
import ShadowDom from "./Components/ShadowDom";

import { NavigationProvider } from "./Core/navigation/app/jumper";
import { useOnWindowBlur } from "./Common/hooks";
import { DataPreloader } from "./Core/initialLoad/app/jumper";

function App() {
  useOnWindowBlur(Navigation.closeExtensionJumper);

  return (
    <NavigationProvider>
      <div style={{ all: "initial" }}>
        <ShadowDom>
          <DataPreloader>
            <HistoryScene />
          </DataPreloader>
        </ShadowDom>
      </div>
    </NavigationProvider>
  );
}

export default App;
