import React, { useEffect } from "react";
import useState from "react-usestateref";

import { ModalContext } from "../Contexts/ModalProvider";

import ReactShadowRoot from "react-shadow-root";
import * as Styles from "../Common/styles";

import { ToastSpinner } from "../Components/Loaders";

import * as SVG from "../Common/SVG";
import * as Strings from "../Common/strings";

const Toast = (props) => {
  const [favicon, setFavicon] = useState(null);
  const [uploads, setUploads, uploadsRef] = useState({ all: [] });

  let count = 28;
  let title = Strings.truncateString(count, props.title);

  const Footer = (props) => {
    let url = props.upload.cid
      ? Strings.getSlateFileLink(props.upload.cid, 100)
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

  const _handleCloseToast = (file) => {
    props.callback(file);            
  }

  return (
    <ModalContext.Consumer>
      {({ pageData }) => (
        <>
          <ReactShadowRoot>
            <style>{Styles.toast}</style>
            
            {props.show &&
            
              <div className="loaderWindowTwo">
                {props.files.all.map((file) => {
                  return(
                    <div id="modal" className="loaderWindowMain">
                      <div className="loaderContent">
                        <div className="loaderText">
                          {favicon ? (
                            <img className="loaderImage" src={file.image} />
                          ) : (
                            <div className="loaderImageBlank"></div>
                          )}
                          {file.title ? 
                            Strings.truncateString(25, file.title)
                          :
                            Strings.truncateString(25, props.title)
                          }
                          <div onClick={() => _handleCloseToast(file)} className="loaderClose">
                            <SVG.Dismiss width="20px" height="20px" />
                          </div>
                        </div>
                        <div className="loaderFooter">
                          <Footer upload={file} />
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          }
          </ReactShadowRoot>
        </>
      )}
    </ModalContext.Consumer>
  );
};

export default Toast;
