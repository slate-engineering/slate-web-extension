import * as React from "react";
import * as Styles from "../Common/styles";
import * as SVG from "../Common/SVG";
import * as Strings from "../Common/strings";

import { ToastSpinner } from "../Components/Loaders";

const useUploadMessaging = ({ onDone, onSuccess, onDuplicate, onError }) => {
  React.useEffect(() => {
    let timer;
    let handleMessage = (event) => {
      let { data, type } = event.data;
      if (type === "UPLOAD_DONE") {
        onSuccess(data);
      } else if (type === "UPLOAD_DUPLICATE") {
        onDuplicate(data);
      } else if (type === "UPLOAD_FAIL") {
        onError();
      } else {
        return;
      }
      timer = setTimeout(() => onDone(), 10000);
    };

    window.addEventListener("message", handleMessage);
    return () => (
      window.removeEventListener("message", handleMessage), clearTimeout(timer)
    );
  }, []);
};

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

export default function ({ title, image, onDismiss }) {
  const [upload, setUpload] = React.useState({
    status: "uploading",
    data: null,
  });

  useUploadMessaging({
    onSuccess: (data) => setUpload({ status: "complete", data }),
    onDuplicate: (data) => setUpload({ status: "duplicate", data }),
    onError: () => setUpload({ status: "error" }),
    onDone: onDismiss,
  });

  const favicon = useGetFavicon({ image });
  let url = upload.data ? Strings.getSlateFileLink(upload.data.id) : null;

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
            onClick={onDismiss}
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
          {upload.status === "uploading" && (
            <div className="loaderFooterLeft">
              <ToastSpinner style={{ marginRight: "8px" }} /> Saving...
            </div>
          )}

          {upload.status === "complete" && (
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

          {upload.status === "duplicate" && (
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

          {upload.status === "error" && (
            <div className="loaderFooterLeft" style={{ color: "#FF4530" }}>
              Failed to save
            </div>
          )}
        </div>
      </div>
    </>
  );
}
