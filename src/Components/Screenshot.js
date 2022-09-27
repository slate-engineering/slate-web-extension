import React, { useState, useEffect, createRef } from "react";
import { ModalContext } from "../Contexts/ModalProvider";
import Button from "../components/Button";
import Metadata from "../components/Metadata";
import Image from "../components/Image";
import Search from "../components/Search";
import classes from "../App.module.css";
import { useScreenshot } from "use-react-screenshot";

import * as Constants from "common/constants";

const fetch = require("node-fetch");

const Screenshot = (props) => {
  const pageTitle = document.title;
  const modalTitle = `Take a screenshot of ${pageTitle}`;
  const count = 25;
  const title =
    modalTitle.slice(0, count) + (modalTitle.length > count ? "..." : "");

  const [visable, setVisable] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [upload, setUpload] = useState({
    status: false,
    data: null,
    title: title,
  });
  const [screenshotTaken, setScreenshotTaken] = useState(false);

  const ref = createRef(null);
  const [image, takeScreenshot] = useScreenshot();
  const getImage = () => {
    takeScreenshot(ref.current);
    console.log("screenshot taken now");
  };

  const handleCloseModal = () => {
    setVisable(false);
  };

  const onLoadHover = () => {
    console.log("hovering now");
  };

  const handleKeydown = (e) => {
    console.log("this is the key press event from loader", e);
  };

  window.addEventListener("message", function (event) {
    if (event.data.type === "SCREENSHOT_TAKEN") {
      console.log("this is the data from the screenshot done event", event);
      setScreenshotTaken(true);
      setVisable(true);
    }
    if (event.data.type === "SCREENSHOT_DONE") {
      console.log(
        "this is the data from the screenshot is uploaded hi event",
        event
      );
      setUpload({
        status: true,
        data: event.data.data.data.cid,
        title: "Screenshot uploaded",
      });
      setVisable(true);
    }
  });

  const loaderClose = () => {
    setUpload({ status: false, title: title });
    setScreenshotTaken(false);
    setVisable(false);
  };

  const takeFullPage = () => {
    setVisable(false);
    window.postMessage({ type: "TAKE_SCREENSHOT" }, "*");
  };

  const handleGoBack = () => {
    console.log("go back");
  };

  function FooterMain(props) {
    return (
      <>
        <div className={classes.loaderFooterLeft}>
          <a
            onClick={takeFullPage}
            style={{
              color: "#0084FF",
              fontWeight: "600",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Full screen
          </a>
        </div>
        <div>
          <a
            onClick={getImage}
            style={{
              color: "#0084FF",
              fontWeight: "600",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Select area
          </a>
        </div>
      </>
    );
  }

  function FooterUploading(props) {
    return (
      <>
        <div className={classes.loaderFooterLeft}>Saving...</div>
      </>
    );
  }

  function FooterDone(props) {
    let url = `${Constants.uri.upload}/_/data?cid=${props.cid}`;
    return (
      <>
        <div className={classes.loaderFooterLeft}>Saved</div>
        <div className={classes.loaderFooterRight}>
          <a
            href={url}
            style={{
              color: "#0084FF",
              fontWeight: "600",
              textDecoration: "none",
              cursor: "pointer",
            }}
            target="_blank"
          >
            View
          </a>
        </div>
      </>
    );
  }

  let footer = <FooterMain />;

  if (screenshotTaken) {
    footer = <FooterUploading />;
  }

  if (upload.status) {
    footer = <FooterDone cid={upload.data} />;
  }

  return (
    <div className={hidden ? classes.hiddenModal : classes.visableModal}>
      <ModalContext.Consumer>
        {({
          windowPosition,
          hasDraggedWindowPosition,
          extensionId,
          getExtensionId,
          pageData,
        }) => (
          <>
            {visable ? (
              <div
                id="modal"
                className={classes.loaderWindow}
                onMouseEnter={onLoadHover}
              >
                <div>
                  <div className={classes.loaderImage} onClick={handleGoBack}>
                    ←
                  </div>
                  <div className={classes.loaderText}>{upload.title}</div>
                  <div onClick={loaderClose} className={classes.loaderClose}>
                    X
                  </div>
                </div>
                <div className={classes.loaderFooter}>{footer}</div>
              </div>
            ) : (
              <div></div>
            )}
          </>
        )}
      </ModalContext.Consumer>
    </div>
  );
};

export default Screenshot;
