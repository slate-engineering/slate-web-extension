import * as React from "react";
import * as Navigation from "Utilities/navigation";
import * as Constants from "./Common/constants";

import Modal from "./Components/Modal";
import UploadToast from "./Components/UploadToast";
import ModalProvider from "./Contexts/ModalProvider";
import ReactShadowRoot from "react-shadow-root";

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

  const [searchParams] = useSearchParams();
  const isModalOpen = !!searchParams.get(Constants.routes.modal.key);

  return (
    <div style={{ all: "initial" }}>
      <ReactShadowRoot>
        <UploadToast image={og.image} />

        {isModalOpen && (
          <ModalProvider>
            <Modal image={og.image} favicon={og.favicon} link={checkLink} />
          </ModalProvider>
        )}
      </ReactShadowRoot>
    </div>
  );
}

export default App;
