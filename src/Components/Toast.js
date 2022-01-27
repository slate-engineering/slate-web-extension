import React, { useState, useEffect } from "react";
import { ModalContext } from "../Contexts/ModalProvider";

import * as Styles from "../Common/styles";

import { ToastSpinner } from "../Components/Loaders";

import * as SVG from "../Common/SVG";
import * as Strings from "../Common/strings";

const Toast = (props) => {
  const [favicon, setFavicon] = useState(null);
  const [upload, setUpload] = useState({
    status: "uploading",
    data: null,
  });

  const { title } = props;

  const handleCloseModal = () => {
    props.setIsUploading(false);
    window.postMessage({ type: "CLOSE_APP" }, "*");
  };

  const toastTimer = () => {
    const timer = setTimeout(() => {
      handleCloseModal();
    }, 10000);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    let handleMessage = (event) => {
      let { data, type } = event.data;
      if (type === "UPLOAD_DONE") {
        setUpload({
          status: "complete",
          data,
        });
      } else if (type === "UPLOAD_DUPLICATE") {
        setUpload({
          status: "duplicate",
          data,
        });
      } else if (type === "UPLOAD_FAIL") {
        setUpload({ status: "error" });
      } else {
        return;
      }
      toastTimer();
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const Footer = (props) => {
    let { status, data } = props.upload;
    let url = data ? Strings.getSlateFileLink(data.id) : null;

    return (
      <>
        {status === "uploading" && (
          <div className="loaderFooterLeft">
            <ToastSpinner style={{ marginRight: "8px" }} /> Saving...
          </div>
        )}

        {status === "complete" && (
          <div className="loaderFooter">
            <div className="loaderFooterLeft">Saved</div>
            <a href={url} className="modalLink" target="_blank">
              View
            </a>
          </div>
        )}

        {status === "duplicate" && (
          <div className="loaderFooter">
            <div className="loaderFooterLeft" style={{ color: "#34D159" }}>
              Already saved
            </div>
            <a href={url} className="modalLink" target="_blank">
              View
            </a>
          </div>
        )}

        {status === "error" && (
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
          <style>{Styles.toast}</style>
          <div id="modal" className="loaderWindow">
            <div className="loaderBox">
              <div
                className="loaderImage"
                style={{ backgroundImage: `url('${favicon}')` }}
              />
              <div className="loaderText">{title}</div>
              <div onClick={handleCloseModal} className="loaderClose">
                <SVG.Dismiss
                  width="20px"
                  height="20px"
                  style={{ display: "block" }}
                />
              </div>
            </div>
            <div className="loaderFooter">
              <Footer upload={upload} />
            </div>
          </div>
        </>
      )}
    </ModalContext.Consumer>
  );
};

export default Toast;
