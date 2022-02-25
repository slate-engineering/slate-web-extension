import * as React from "react";
import * as Constants from "../Common/constants";

export const messages = {
  saveLink: "SAVE_LINK",
  uploadStatus: "UPLOAD_STATUS",
};

// NOTE(amine): commands are defined in manifest.json
export const commands = {
  directSave: "direct-save",
};

export const uploadStates = {
  done: "done",
  duplicate: "duplicate",
  failed: "failed",
};

/* -------------------------------------------------------------------------------------------------
 * Upload status
 * -----------------------------------------------------------------------------------------------*/

/** ------------ Background ------------- */

const sendUploadStatusToContent = ({ tab, status, data }) => {
  chrome.tabs.sendMessage(parseInt(tab), {
    type: messages.uploadStatus,
    status,
    data,
  });
};

/** ------------ Content------------- */

export const forwardUploadStatusToApp = ({ status, data }) => {
  window.postMessage({ type: messages.uploadStatus, data, status }, "*");
};

/** ------------ App ------------- */

export const useUploadStatus = ({
  onDone,
  onSuccess,
  onDuplicate,
  onError,
}) => {
  React.useEffect(() => {
    let timer;
    let handleMessage = (event) => {
      let { data, type, status } = event.data;
      if (type !== messages.uploadStatus) return;

      if (status === uploadStates.done) {
        onSuccess(data);
      } else if (status === uploadStates.duplicate) {
        onDuplicate(data);
      } else if (status === uploadStates.failed) {
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

/* -------------------------------------------------------------------------------------------------
 * Upload requests
 * -----------------------------------------------------------------------------------------------*/

/** ------------ App ------------- */

// export const saveLink = ({}) => {};

/** ------------ Content------------- */

export const forwardSaveLinkRequestsToBackground = ({ url }) => {
  chrome.runtime.sendMessage({ type: messages.saveLink, url });
};

/** ------------ Background ------------- */

export const handleSaveLinkRequests = async ({
  apiKey,
  tab,
  url,
  background,
}) => {
  let response;
  try {
    response = await fetch(`${Constants.uri.hostname}/api/v3/create-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({ data: { url: url } }),
    });
  } catch (e) {
    console.log(e);
  }

  const json = await response.json();
  console.log("upload data: ", json);

  if (json.decorator === "LINK_DUPLICATE") {
    sendUploadStatusToContent({
      tab: parseInt(tab),
      status: uploadStates.duplicate,
      data: json.data[0],
    });
    return;
  }

  if (json.decorator === "SERVER_CREATE_LINK_FAILED" || json.error === true) {
    sendUploadStatusToContent({
      tab: parseInt(tab),
      status: uploadStates.failed,
    });
    return;
  }

  if (!background) {
    sendUploadStatusToContent({
      tab: parseInt(tab),
      status: uploadStates.done,
      data: json.data[0],
    });
  } else {
    //If background upload, dont send a message to a tab
    return;
  }

  return json.data[0];
};

// const handleSaveImage = async (props) => {
//   const url = `${Constants.uri.upload}/api/v3/public/upload-by-url`;

//   let response;
//   try {
//     response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: apiKey,
//       },
//       body: JSON.stringify({
//         data: {
//           url: props.url,
//           filename: props.url,
//         },
//       }),
//     });
//   } catch (e) {
//     console.log(e);
//   }

//   const json = await response.json();
//   return json;
// };
