import React, { useState } from "react";
import { ModalContext } from "../Contexts/ModalProvider";

import ReactShadowRoot from "react-shadow-root";
import * as Styles from "../Common/styles";

import Loaders from "../Components/Loaders";

import * as SVG from "../Common/SVG";
import * as Strings from "../Common/strings";

const Toast = (props) => {
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

  window.addEventListener("message", function (event) {
    if (event.data.type === "UPLOAD_DONE") {
      setUpload({
        status: "complete",
        data: event.data.data.cid,
        tab: event.data.tab
      });
      const timer = setTimeout(() => {
        handleCloseModal();
      }, 10000);
      return () => clearTimeout(timer);
    }

    if (event.data.type === "UPLOAD_FAIL") {
      setUpload({ status: "error" });
    }

    if (event.data.type === "UPLOAD_DUPLICATE") {
      setUpload({
        status: "duplicate",
        data: event.data.data.cid,
      });
    }
  });

  let count = 28;
  let title = Strings.truncateString(count, props.title)
 
  const Footer = (props) => {
    let url = props.upload.data
      ? Strings.getSlateFileLink(props.upload.data, props.upload.tab)
      : null;
    return (
      <>
        {props.upload.status === "uploading" && (
          <div className="loaderFooterLeft">
            <Loaders /> Saving...
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
            <div
              className="loaderFooterLeft"
              style={{ color: "#34D159" }}
            >
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
          <div
            className="loaderFooterLeft"
            style={{ color: "#FF4530" }}
          >
            Failed to save
          </div>
        )}
      </>
    );
  };

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
                    <img className="loaderImage" src={props.image} />
                    {title}
                    <div
                      onClick={handleCloseModal}
                      className="loaderClose"
                    >
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
