/* global chrome */
if(window.location.href.startsWith('https://slate.host')) {

  if(window.location.href.includes('extension=true')) {
    document.addEventListener('keydown', function(e) {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      chrome.runtime.sendMessage({ 
        type: 'GO_BACK',
        id: id 
      });
    });

  }
  //TODO: Have the extension change the 'download chrome extension' button
}

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  if(request.run === "LOAD_APP") {
    main();

    return true;
  }

  if(request.run === "LOAD_APP_WITH_TAGS") {
    window.postMessage({ type: "LOAD_APP_WITH_TAGS" }, "*");
    return true;
  }

  if(request.run === "OPEN_LOADING") {
    window.postMessage({ type: "OPEN_LOADING" }, "*");
    return true;
  }

  if(request.run === "UPLOAD_DONE") {
    window.postMessage({ type: "UPLOAD_DONE", data: request.data }, "*");
    return true;
  }

  if(request.run === "UPLOAD_FAIL") {
    window.postMessage({ type: "UPLOAD_FAIL" }, "*");
    return true;
  } 

  if(request.run === "UPLOAD_DUPLICATE") {
    window.postMessage({ type: "UPLOAD_DUPLICATE", data: request.data }, "*");
    return true;
  } 
});

function main() {
  const extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
  if (!location.ancestorOrigins.contains(extensionOrigin)) {
    // Fetch the local React index.html page
    fetch(chrome.runtime.getURL('index.html') /*, options */)
      .then((response) => response.text())
      .then((html) => {
        const styleStashHTML = html.replace(/\/static\//g, `${extensionOrigin}/static/`);
        $(styleStashHTML).prependTo('body');
      })
      .catch((error) => {
        console.warn(error);
      });
  }  

}

window.addEventListener("message", async function(event) {
  if(event.data.run === "SAVE_LINK") {
    chrome.runtime.sendMessage({ type: "SAVE_LINK", url: event.data.url });
  }

  if(event.data.type === "UPLOAD_START") {
    window.postMessage({ type: "UPLOAD_START" }, "*");
  }

  if(event.data.run === "OPEN_LOADING") {
    console.log('opening loader')
    chrome.runtime.sendMessage({ type: "SAVE_LINK", url: event.data.url });
    return true;
  }

  if(event.data.run === "OPEN_SETTINGS") {
    chrome.runtime.sendMessage({ type: "OPEN_SETTINGS" });
    return true;
  }

  if (event.source !== window) return;
});

