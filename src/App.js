import React, { useEffect } from "react";
import useState from "react-usestateref";
import Modal from "./Components/Modal";
import Toast from "./Components/Toast";
import ModalProvider from "./Contexts/ModalProvider";
import Hotkeys from "react-hot-keys";

import * as Strings from "./Common/strings";

function App() {
  const [isOpened, setIsOpened, isOpenedRef] = useState(true);
  const [isUploading, setIsUploading, isUploadingRef] = useState(false);
  //const [isScreenshot, setIsScreenshot] = useState(false);
  const [og, setOg] = useState({ image: null, title: null });
  const [checkLink, setCheckLink] = useState({ uploaded: false, data: null });
  const [files, setFiles, filesRef] = useState({ all: [] });

  //const [user, setUser] = useState({ signedin: false, data: null });

  async function updateUploadItem(props) {
    if (filesRef.current.all) {
      let arrayUpdate = [...filesRef.current.all];
      let update = arrayUpdate.map((file) =>
        file.id === props.id
          ? { ...file, status: props.status, cid: props.cid }
          : file
      );
      return update;
    }
  }

  function removeUploadItem(props) {
    let arrayRemove = [...filesRef.current.all];
    const removed = arrayRemove.filter((file) => file.id !== props.id);
    setFiles({ all: removed });
    return;
  }

  //Disable Up Down arrows in the main window to prevent page scrolls
  const onKeyDownMain = (e) => {
    if (
      ["ArrowUp", "ArrowDown"].indexOf(
        e.code
      ) > -1
    ) {
      e.preventDefault();
    }
  };

  function onKeyDown(keyName, e, handle) {
    if (keyName === "esc") {
      setIsOpened(false);
      window.removeEventListener("keydown", onKeyDownMain);
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

  const messageListeners = async () => {
    window.addEventListener("message", async function (event) {
      
      /*
      if (event.data.type === "UPLOAD_START") {
        //setIsOpened(false);
        setIsUploading(true);
      }
      */

      if (event.data.type === "SHOW_APP") {
        setIsOpened(true);
      }

      if (event.data.type === "CLOSE_APP") {
        window.removeEventListener("keydown", onKeyDownMain);
        setIsOpened(false);
      }

      if (event.data.type === "OPEN_LOADING") {
        setIsOpened(false)

        let newFileData = {
          title: event.data.title,
          image: event.data.image,
          id: event.data.id,
          status: "uploading",
          error: false,
          cid: null,
        };

        let checkIfUploading = filesRef.current.all.find((file) => {
          return file.id === event.data.id;
        });

        if (!checkIfUploading) {
          setFiles(() => ({
            all: [...filesRef.current.all, newFileData],
          }));
        }

        if (event.data.image) setOg({ image: event.data.image });
        setIsUploading(true);
        return;
      }

      if (event.data.type === "CHECK_LINK") {
        if (event.data.data.decorator === "LINK_FOUND") {
          setCheckLink({ uploaded: true, data: event.data.data });
        }
      }

      if (event.data.type === "UPLOAD_DONE") {
        let data = await updateUploadItem({
          id: event.data.id,
          status: 'complete',
          cid: event.data.data.cid
        })

        setFiles({ all: data });
        setTimeout(() => removeUploadItem({ id: event.data.id }), 3000);
        return;
      }

      if (event.data.type === "UPLOAD_DUPLICATE") {
        let data = await updateUploadItem({
          id: event.data.id,
          status: 'duplicate',
          error: false,
          cid: event.data.data.cid
        })

        setFiles({ all: data });
        setTimeout(() => removeUploadItem({ id: event.data.id }), 3000);
        return;
      }

      if (event.data.type === "UPLOAD_FAIL") {
        let data = await updateUploadItem({
          id: event.data.id,
          status: 'error',
          error: true,
          cid: null
        })

        setFiles({ all: data });
        setTimeout(() => removeUploadItem({ id: event.data.id }), 3000);
        return;
      }

    });
  }

  useEffect(() => {
    messageListeners();
    
    let meta = getMeta();
    setOg({ image: meta.image, favicon: meta.favicon });

    window.addEventListener("keydown", onKeyDownMain, false);

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
      <ModalProvider>
        <div>
          <Hotkeys
            keyName="esc,alt+b,alt+a,alt+c,alt+3"
            onKeyDown={onKeyDown.bind(this)}
          >
            <Modal image={og.image} favicon={og.favicon} link={checkLink} show={isOpenedRef.current} />
          </Hotkeys>
        </div>
      </ModalProvider>

      <ModalProvider>
        <div>
          <Toast
            image={og.image}
            title={document.title}
            files={filesRef.current}
            callback={(file) => removeUploadItem({ id: file.id })}
            show={isUploadingRef.current}
          />
        </div>
      </ModalProvider>
    </>
  );
}

export default App;
