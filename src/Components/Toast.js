import React, { useState, useEffect } from "react";
import { ModalContext } from "../Contexts/ModalProvider";

import ReactShadowRoot from "react-shadow-root";
import * as Styles from "../Common/styles";

import { ToastSpinner } from "../Components/Loaders";

import * as SVG from "../Common/SVG";
import * as Strings from "../Common/strings";

const Toast = (props) => {
  const [favicon, setFavicon] = useState(null);
  const [visable, setVisable] = useState(true);
  const [upload, setUpload] = useState({
    status: "uploading",
    data: null,
    error: false,
    tab: null,
  });

  const handleCloseModal = () => {
    setVisable(false);
  };

  const toastTimer = () => {
    const timer = setTimeout(() => {
      handleCloseModal();
    }, 10000);
    return () => clearTimeout(timer);
  };

  const messageListeners = () => {
    window.addEventListener("message", function (event) {
      if (event.data.type === "UPLOAD_DONE") {
        setUpload({
          status: "complete",
          data: event.data.data.cid,
          tab: event.data.tab,
        });
        toastTimer();
        return;
      }

      if (event.data.type === "UPLOAD_FAIL") {
        setUpload({ status: "error" });
        toastTimer();
        return;
      }

      if (event.data.type === "UPLOAD_DUPLICATE") {
        setUpload({
          status: "duplicate",
          data: event.data.data.cid,
        });
        toastTimer();
        return;
      }
    });
  };

  useEffect(() => {
    messageListeners();
  }, []);

  let count = 28;
  let title = Strings.truncateString(count, props.title);

  const Footer = (props) => {
    let url = props.upload.data
      ? Strings.getSlateFileLink(props.upload.data, props.upload.tab)
      : null;
    return (
      <>
        {props.upload.status === "uploading" && (
          <div className="loaderFooterLeft">
            <ToastSpinner /> Saving...
          </div>
        )}

        {props.upload.status === "complete" && (
          <>
            <div className="loaderFooterLeft">Saved</div>
            <div className="loaderFooterRight">
              <a href={url} className="modalLink" target="_blank">
                View
              </a>
            </div>
          </>
        )}

        {props.upload.status === "duplicate" && (
          <>
            <div className="loaderFooterLeft" style={{ color: "#34D159" }}>
              Already exists
            </div>
            <div className="loaderFooterRight">
              <a href={url} className="modalLink" target="_blank">
                View
              </a>
            </div>
          </>
        )}

        {props.upload.status === "error" && (
          <div className="loaderFooterLeft" style={{ color: "#FF4530" }}>
            Failed to save
          </div>
        )}
      </>
    );
  };

  const checkImage = (url) => {
    let favicon = new Image();
    favicon.addEventListener("load", () => {
      setFavicon(url);
    });
    favicon.src = url;
  };

  if (props.image) {
    checkImage(props.image);
  }

  return (
    <ModalContext.Consumer>
      {({ pageData }) => (
        <>
          <ReactShadowRoot>
            <style>{Styles.toast}</style>
            {visable && (
              <div id="modal" className="loaderWindow">
                <div className="loaderContent">
                  <div className="loaderText">
                    {favicon ? (
                      <img
                        className="loaderImage"
                        src={favicon}
                        alt={`Favicon`}
                      />
                    ) : (
                      <div className="loaderImageBlank"></div>
                    )}
                    {title}
                    <div onClick={handleCloseModal} className="loaderClose">
                      <SVG.Dismiss width="20px" height="20px" />
                    </div>
                  </div>
                  <div className="loaderFooter">
                    <Footer upload={upload} />
                  </div>
                </div>
              </div>
            )}
          </ReactShadowRoot>
        </>
      )}
    </ModalContext.Consumer>
  );
};

export default Toast;
