//NOTE(martina): dev server uri's
const uri = {
  hostname: "https://slate-dev.onrender.com",
  domain: "slate-dev.onrender.com",
  upload: "https://shovelstaging.onrender.com",
};

//NOTE(martina): production server uri's
// const uri = {
//   hostname: "https://slate.host",
//   domain: "slate.host",
//   upload: "https://uploads.slate.host",
// };

/* global chrome */
if (window.location.href.startsWith(uri.hostname)) {
  if (window.location.href.includes("extension=true")) {
    document.addEventListener("keydown", function (e) {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      chrome.runtime.sendMessage({
        type: "GO_BACK",
        id: id,
      });
    });
  }
  //TODO: Have the extension change the 'download chrome extension' button
}

let isJumperOpen = false;

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  if (request.run === "LOAD_APP") {
    if (!isJumperOpen) {
      main({ type: request.type });
      isJumperOpen = true;
      return;
    }
    return;
  }

  if (request.run === "AUTH_REQ") {
    window.postMessage({ type: "AUTH_REQ" }, "*");
    return true;
  }

  if (request.run === "LOAD_APP_WITH_TAGS") {
    window.postMessage({ type: "LOAD_APP_WITH_TAGS" }, "*");
    return true;
  }

  if (request.run === "OPEN_LOADING") {
    window.postMessage({ type: "OPEN_LOADING" }, "*");
    return true;
  }

  if (request.run === "UPLOAD_DONE") {
    window.postMessage({ type: "UPLOAD_DONE", data: request.data }, "*");
    return true;
  }

  if (request.run === "UPLOAD_FAIL") {
    window.postMessage({ type: "UPLOAD_FAIL" }, "*");
    return true;
  }

  if (request.run === "UPLOAD_DUPLICATE") {
    window.postMessage({ type: "UPLOAD_DUPLICATE", data: request.data }, "*");
    return true;
  }

  if (request.run === "CHECK_LINK") {
    window.postMessage(
      { type: "CHECK_LINK", data: request.data, user: request.user },
      "*"
    );
    return true;
  }

  if (request.run === "OPEN_LINK") {
    window.postMessage({ type: "OPEN_LINK", data: request.data }, "*");
    return true;
  }
});

let loadedMain = false;

function main(props) {
  if (loadedMain) {
    if (props.type === "LOADER_MINI") {
      window.postMessage({ type: "OPEN_LOADING" }, "*");
    } else {
      window.postMessage({ type: "REOPEN_APP" }, "*");
    }
    return;
  }
  loadedMain = true;
  const extensionOrigin = "chrome-extension://" + chrome.runtime.id;

  if (props.type === "LOADER_MINI") {
    $(`<div id='slate-loader-type' data-type='mini'></div>`).prependTo("body");
  }

  if (!location.ancestorOrigins.contains(extensionOrigin)) {
    // Fetch the local React index.html page
    fetch(chrome.runtime.getURL("index.html"))
      .then((response) => response.text())
      .then((html) => {
        const styleStashHTML = html.replace(
          /\/static\//g,
          `${extensionOrigin}/static/`
        );
        $(styleStashHTML).prependTo("body");
      })
      .catch((error) => {
        console.warn(error);
      });
  }
}

window.addEventListener("message", async function (event) {
  if (event.data.run === "SAVE_LINK") {
    chrome.runtime.sendMessage({ type: "SAVE_LINK", url: event.data.url });
  }

  if (event.data.type === "UPLOAD_START") {
    window.postMessage({ type: "UPLOAD_START" }, "*");
  }

  if (event.data.run === "OPEN_LOADING") {
    chrome.runtime.sendMessage({ type: "SAVE_LINK", url: event.data.url });
    return true;
  }

  if (event.data.run === "OPEN_SETTINGS") {
    chrome.runtime.sendMessage({ type: "OPEN_SETTINGS" });
    return true;
  }

  if (event.data.run === "CHECK_LOGIN") {
    chrome.runtime.sendMessage({ type: "CHECK_LOGIN" });
    return true;
  }

  if (event.data.run === "SIGN_OUT") {
    chrome.runtime.sendMessage({ type: "SIGN_OUT" });
  }

  if (event.data.run === "SET_OPEN_FALSE") {
    isJumperOpen = false;
    chrome.runtime.sendMessage({ type: "SET_IS_SAVED_FALSE" });
  }

  if (event.source !== window) return;
});
