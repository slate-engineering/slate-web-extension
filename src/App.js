import React, { useState, useEffect } from "react";
import Modal from "./Components/Modal";
import Toast from "./Components/Toast";
import Screenshot from "./Components/Screenshot";
import ModalProvider from "./Contexts/ModalProvider";
import Hotkeys from "react-hot-keys";

import * as Strings from "./Common/strings";

function App() {
  const [isOpened, setIsOpened] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  //const [isScreenshot, setIsScreenshot] = useState(false);
  const [og, setOg] = useState({ image: null, title: null });
  const [checkLink, setCheckLink] = useState({ uploaded: false, data: null });

  //const [user, setUser] = useState({ signedin: false, data: null });

  function onKeyDown(keyName, e, handle) {
    if (keyName === "esc") {
      setIsOpened(false);
    }

    if (keyName === "alt+b" || keyName === "enter") {
      if (checkLink.uploaded === false) {
        window.postMessage(
          { run: "OPEN_LOADING", url: window.location.href },
          "*"
        );
      } else {
        let url = Strings.getSlateFileLink(checkLink.data.data.cid);
        window.open(url, "_blank").focus();
        return;
      }
    }

    if (keyName === "alt+a") {
      window.postMessage({ run: "OPEN_ACCOUNT_PAGE" }, "*");
    }

    if (keyName === "alt+c") {
      window.postMessage({ run: "OPEN_SHORTCUTS_PAGE" }, "*");
    }
  }

  window.addEventListener("message", function (event) {
    if (event.data.type === "UPLOAD_START") {
      setIsOpened(false);
      setIsUploading(true);
    }

    if (event.data.type === "CLOSE_APP") {
      setIsOpened(false);
    }

    if (event.data.type === "OPEN_LOADING") {
      setIsOpened(false);
      setIsUploading(true);
    }

    if (event.data.type === "CHECK_LINK") {
      if (event.data.data.decorator === "LINK_FOUND") {
        setCheckLink({ uploaded: true, data: event.data.data });
      }
    }
    /*
    if (event.data.type === "OPEN_SCREENSHOT_SHORTCUT") {
      setIsOpened(false);
      setIsScreenshot(true);
    }
    */
  });

  useEffect(() => {
    let meta = getMeta();
    setOg({ image: meta.image, favicon: meta.favicon });
  }, []);

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

  return (
    <>
      {isOpened && (
        <ModalProvider>
          <div>
            <Hotkeys
              keyName="esc,alt+b,alt+a,alt+c,alt+3,enter"
              onKeyDown={onKeyDown.bind(this)}
            >
              <Modal image={og.image} favicon={og.favicon} link={checkLink} />
            </Hotkeys>
          </div>
        </ModalProvider>
      )}

      {isUploading && <Toast image={og.image} title={document.title} />}
    </>
  );
}

export default App;
