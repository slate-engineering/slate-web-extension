import * as React from "react";
import * as Navigation from "./Core/navigation/app/jumper";
import * as Jumper from "./Components/jumper";

import ShadowDom from "./Components/ShadowDom";
import HomeScene from "./scenes/jumper/home";
import SlatesScene from "./scenes/jumper/slates";

import { Route } from "./Core/navigation/app/jumper";
import { useOnWindowBlur } from "./Common/hooks";
import { ViewerProvider } from "./Core/viewer/app/jumper";

function App() {
  useOnWindowBlur(Navigation.closeExtensionJumper);

  const { closeTheJumper } = Navigation.useNavigation();

  return (
    <div style={{ all: "initial" }}>
      <ShadowDom>
        <ViewerProvider>
          <Jumper.Root onClose={closeTheJumper}>
            <Route path="/" component={HomeScene} />
            <Route path="/slates" component={SlatesScene} />
          </Jumper.Root>
        </ViewerProvider>
      </ShadowDom>
    </div>
  );
}

export default App;
