import * as React from "react";
import * as Navigation from "./Core/navigation/app/jumper";
import * as Jumper from "./Components/jumper";
import * as Onboarding from "./Components/Onboarding";

import ShadowDom from "./Components/ShadowDom";
import HomeScene from "./scenes/jumper/home";
import SlatesScene from "./scenes/jumper/slates";
import SettingsScene from "./scenes/jumper/settings";

import { Route } from "./Core/navigation/app/jumper";
import { useOnWindowBlur } from "./Common/hooks";
import { ViewerProvider } from "./Core/viewer/app/jumper";
import {
  ModalsPortalProvider,
  ModalsContainer,
} from "./Components/ModalsPortal";

function App() {
  useOnWindowBlur(Navigation.closeExtensionJumper);

  const { closeTheJumper } = Navigation.useNavigation();

  return (
    <div style={{ all: "initial" }}>
      <ShadowDom>
        <ViewerProvider>
          <ModalsPortalProvider>
            <ModalsContainer />
            <Jumper.Root onClose={closeTheJumper}>
              <Route path="/" component={HomeScene} />
              <Route path="/slates" component={SlatesScene} />
              <Route path="/settings" component={SettingsScene} />
              <Onboarding.PermissionsOnboarding />
            </Jumper.Root>
          </ModalsPortalProvider>
        </ViewerProvider>
      </ShadowDom>
    </div>
  );
}

export default App;
