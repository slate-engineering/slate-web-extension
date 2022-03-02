import * as React from "react";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";
import * as Strings from "../Common/strings";

import { ToastSpinner } from "./Loaders";
import { useUploadStatus } from "../Utilities/upload";

const useGetFavicon = ({ image }) => {
  const [favicon, setFavicon] = React.useState(null);
  const checkImage = (url) => {
    let favicon = new Image();
    favicon.addEventListener("load", () => {
      setFavicon(url);
    });
    favicon.src = url;
  };

  if (image) {
    checkImage(image);
  }
  return favicon;
};

const useToast = () => {
  const [isVisible, setVisibility] = React.useState(false);
  const showToast = () => setVisibility(true);
  const hideToast = () => setVisibility(false);
  return [isVisible, { showToast, hideToast }];
};

export default function ({ image }) {
  const [isVisible, { showToast, hideToast }] = useToast();

  const [status, setUploadStatus] = React.useState({
    current: "uploading",
    data: null,
  });
  useUploadStatus({
    onStart: showToast,
    onSuccess: (data) => setUploadStatus({ current: "complete", data }),
    onDuplicate: (data) => setUploadStatus({ current: "duplicate", data }),
    onError: () => setUploadStatus({ current: "error" }),
    onDone: hideToast,
  });

  const favicon = useGetFavicon({ image });

  if (!isVisible) return null;

  let url = status.data ? Strings.getSlateFileLink(status.data.id) : null;
  const { title } = document;

  return (
    <>
      <style>{Styles.toast}</style>
      <div id="modal" className="loaderWindow">
        <div className="loaderBox">
          <div
            className="loaderImage"
            style={{ backgroundImage: `url('${favicon}')` }}
          />
          <div className="loaderText">{title}</div>
          <button
            onClick={hideToast}
            style={{ padding: 2 }}
            className="loaderClose"
          >
            <SVG.Dismiss
              width="16px"
              height="16px"
              style={{ display: "block" }}
            />
          </button>
        </div>
        <div className="loaderFooter">
          {status.current === "uploading" && (
            <div className="loaderFooterLeft">
              <ToastSpinner style={{ marginRight: "8px" }} /> Saving...
            </div>
          )}

          {status.current === "complete" && (
            <div className="loaderFooter">
              <div className="loaderFooterLeft">Saved</div>
              <a
                href={url}
                className="modalLink"
                target="_blank"
                rel="noreferrer"
              >
                View
              </a>
            </div>
          )}

          {status.current === "duplicate" && (
            <div className="loaderFooter">
              <div className="loaderFooterLeft" style={{ color: "#34D159" }}>
                Already saved
              </div>
              <a
                href={url}
                className="modalLink"
                target="_blank"
                rel="noreferrer"
              >
                View
              </a>
            </div>
          )}

          {status.current === "error" && (
            <div className="loaderFooterLeft" style={{ color: "#FF4530" }}>
              Failed to save
            </div>
          )}
        </div>
      </div>
    </>
  );
}
