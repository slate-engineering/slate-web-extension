import React, { useState, useEffect } from "react";
import Modal from "./Components/Modal";
import Toast from "./Components/Toast";
import ModalProvider from "./Contexts/ModalProvider";
import Hotkeys from "react-hot-keys";
import ReactShadowRoot from "react-shadow-root";

import * as Strings from "./Common/strings";

function App() {
  // const [mini, setMini] = useState(true);
  const [isOpened, setIsOpened] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  //const [isScreenshot, setIsScreenshot] = useState(false);
  const [og, setOg] = useState({ image: null, title: null });
  const [checkLink, setCheckLink] = useState({ uploaded: false, data: null });

  //const [user, setUser] = useState({ signedin: false, data: null });

  //Disable Up Down arrows in the main window to prevent page scrolls
  const onKeyDownMain = (e) => {
    if (["ArrowUp", "ArrowDown"].indexOf(e.code) > -1) {
      e.preventDefault();
    }
  };

  function onKeyDown(keyName, e, handle) {
    console.log("app.js on key down");
    if (keyName === "esc") {
      setIsOpened(false);
      window.removeEventListener("keydown", onKeyDownMain);
      window.postMessage({ run: "SET_OPEN_FALSE" }, "*");
    }

    // if (keyName === "alt+b" || keyName === "enter") {
    //   if (checkLink.uploaded === false) {
    //     window.postMessage(
    //       { run: "OPEN_LOADING", url: window.location.href },
    //       "*"
    //     );
    //   } else {
    //     let url = Strings.getSlateFileLink(checkLink.data.data.id);
    //     window.open(url, "_blank").focus();
    //     return;
    //   }
    // }

    if (keyName === "alt+a") {
      window.postMessage({ run: "OPEN_ACCOUNT_PAGE" }, "*");
    }

    if (keyName === "alt+c") {
      window.postMessage({ run: "OPEN_SHORTCUTS_PAGE" }, "*");
    }
  }

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

  useEffect(() => {
    let loaderType = document.getElementById("slate-loader-type");
    if (loaderType) {
      // setMini(false);
      setIsOpened(false);
      setIsUploading(true);
    }
    let meta = getMeta();
    setOg({ image: meta.image, favicon: meta.favicon });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDownMain);

    return () => {
      window.removeEventListener("keydown", onKeyDownMain);
    };
  }, []);

  useEffect(() => {
    let handleMessage = (event) => {
      if (event.data.type === "REOPEN_APP") {
        setIsOpened(true);
        setIsUploading(false);
        // setMini(false);
      }

      if (event.data.type === "UPLOAD_START") {
        setIsOpened(false);
        setIsUploading(true);
      }

      if (event.data.type === "CLOSE_APP") {
        window.removeEventListener("keydown", onKeyDownMain);
        setIsOpened(false);
        setIsUploading(false);
        window.postMessage({ run: "SET_OPEN_FALSE" }, "*");
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
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div style={{ all: "initial" }}>
      <ReactShadowRoot>
        {isOpened && (
          <ModalProvider>
            <div>
              <Hotkeys
                keyName="esc,alt+b,alt+a,alt+c,alt+3"
                onKeyDown={onKeyDown.bind(this)}
              >
                <Modal image={og.image} favicon={og.favicon} link={checkLink} />
              </Hotkeys>
            </div>
          </ModalProvider>
        )}

        {isUploading && (
          <Toast
            image={og.image}
            title={document.title}
            setIsUploading={setIsUploading}
          />
        )}
      </ReactShadowRoot>
    </div>
  );
}

export default App;
