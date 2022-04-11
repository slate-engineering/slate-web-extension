import * as React from "react";
import * as Navigation from "Utilities/navigation";
import * as Constants from "./Common/constants";

import UploadToast from "./Components/UploadToast";
import HistoryScene from "./scenes/history";
import ShadowDom from "./Components/ShadowDom";
import ModalProvider from "./Contexts/ModalProvider";

import { useEventListener } from "./Common/hooks";
import { useSearchParams } from "react-router-dom";

const useOg = () => {
  const [og, setOg] = React.useState({ image: null, title: null });
  React.useEffect(() => {
    const getMeta = () => {
      let meta = {};

      if (document.querySelector("meta[property='og:image']")) {
        meta.image = document
          .querySelector("meta[property='og:image']")
          .getAttribute("content");
      }

      if (document.querySelector("link[rel~='icon']")) {
        meta.favicon = document
          .querySelector("link[rel~='icon']")
          .getAttribute("href");
      }

      return meta;
    };

    let meta = getMeta();
    setOg({ image: meta.image, favicon: meta.favicon });
  }, []);
  return og;
};

function App() {
  // const [mini, setMini] = useState(true);
  //const [isScreenshot, setIsScreenshot] = useState(false);

  //const [user, setUser] = useState({ signedin: false, data: null });

  const [checkLink, setCheckLink] = React.useState({
    uploaded: false,
    data: null,
  });
  React.useEffect(() => {
    let handleMessage = (event) => {
      if (
        event.data.type === "CHECK_LINK" &&
        event.data.data.decorator === "LINK_FOUND"
      ) {
        setCheckLink({ uploaded: true, data: event.data.data });
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const og = useOg();

  Navigation.useHandleExternalNavigation();

  const [searchParams, setSearchParams] = useSearchParams();
  const isModalOpen = !!searchParams.get(Constants.routes.modal.key);

  React.useEffect(() => {
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
      // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    const handleVisibilityChange = () => {
      if (document[hidden])
        setSearchParams({ [Constants.routes.modal.key]: "" });
    };
    window.addEventListener(visibilityChange, handleVisibilityChange, false);
    return () =>
      window.removeEventListener(visibilityChange, handleVisibilityChange);
  }, []);

  return (
    <div style={{ all: "initial" }}>
      <ShadowDom>
        <UploadToast image={og.image} />
        {isModalOpen && (
          <ModalProvider>
            <HistoryScene />
          </ModalProvider>
          // <>
          //     <Modal image={og.image} favicon={og.favicon} link={checkLink} />
          // </>
        )}
      </ShadowDom>
    </div>
  );
}

export default App;
