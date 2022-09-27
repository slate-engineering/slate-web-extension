import * as React from "react";
import * as Navigation from "./core/navigation/app/jumper";
import * as Jumper from "./components/jumper";
import * as Onboarding from "./components/Onboarding";

import ShadowDom from "./components/ShadowDom";
import HomeScene from "./scenes/jumper/home";
import SlatesScene from "./scenes/jumper/slates";
import SettingsScene from "./scenes/jumper/settings";

import { Route } from "./core/navigation/app/jumper";
import { useOnWindowBlur } from "./common/hooks";
import { ViewerProvider } from "./core/viewer/app/jumper";
import {
  ModalsPortalProvider,
  ModalsContainer,
} from "./components/ModalsPortal";

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
