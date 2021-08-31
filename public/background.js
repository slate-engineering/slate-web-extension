const apiUrl = ``;

const getApiKey = async () => {
  var storage = new Promise(function (resolve, reject) {
    chrome.storage.local.get(["apiKey"], function (result) {
      resolve(result);
    });
  });
  return storage;
};

const handleSaveLink = async (props) => {
  const key = await getApiKey();
  const response = await fetch("https://slate-dev.onrender.com/api/v2/create-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: key.apiKey,
    },
    body: JSON.stringify({
      data: {
        url: props.url
      },
    }),
  });

  const json = await response.json();
  console.log('upload: ', json);

  if(!props.background) {
    chrome.tabs.sendMessage(parseInt(props.tab), { 
      run: 'UPLOAD_DONE', 
      data: json.data[0] 
    });
  }else{
    //If background upload, dont send a message to a tab
    return;
  }

  if(json.decorator === "LINK_DUPLICATE") {
    chrome.tabs.sendMessage(parseInt(props.tab), { 
      run: 'UPLOAD_DUPLICATE',
      data: json.data[0] 
    });
    return;
  }

  if(json.error === true) {
    chrome.tabs.sendMessage(parseInt(props.tab), { 
      run: 'UPLOAD_FAIL', 
    });
    return;
  }

  return json.data[0];
}

handleSaveImage = async (props) => {
  console.log(props)
  const key = await getApiKey();
  const url = 'https://uploads.slate.host/api/v2/public/upload-by-url';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': "application/json",
      Authorization: key.apiKey,
    },
    body: JSON.stringify({
      data: {
        url: props.url,
        filename: 'filename',
      },
    }),
  });

  const json = await response.json();
  console.log('done uploading', json)
  return json;
}

const checkMatch = (list, url) => {
  const matches = RegExp(list.join('|')).exec(url);
  return matches;
}

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.id, { run: 'LOAD_APP' });
});

chrome.commands.onCommand.addListener((command, tab) => {
  if(command == 'open-app') {
    chrome.tabs.sendMessage(tab.id, { run: 'LOAD_APP' });
  }
  if(command == 'open-slate') {
    chrome.tabs.create({ 'url': 'https://slate.host/_/data' });
  }
});

/*
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(","),
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  var mime = dataurl.split(",")[0].split(":")[1].split(";")[0];

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { mime });
}
*/

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  /*
  let filter = null;
  if(request.type === "OPEN_SEARCH") {
    if(request.filter) {

    }
    //Must pass &extension=true and the return tab id for back button function
    chrome.tabs.create({ url: 
      `https://slate.host/?query=${request.query}&filter=${request.filter}&extension=true&id=${sender.tab.id}`
    });
  }
  */

  if(request.type === "GO_BACK") {
    let openId = parseInt(request.id)
    let closeId = parseInt(sender.tab.id)
    chrome.tabs.update(openId, { highlighted: true });
    chrome.tabs.remove(closeId);
  }

  if(request.type === "SAVE_LINK") {
    chrome.tabs.sendMessage(parseInt(sender.tab.id), { run: "OPEN_LOADING" });
    let data = await handleSaveLink({ url: sender.url, tab: sender.tab.id })
    console.log('data: ', data)
    chrome.tabs.sendMessage(parseInt(sender.tab.id), { run: "UPLOAD_DONE", data: data });
  }
  /* 
  if(request.type === "TAKE_SCREENSHOT") {
    const key = await getApiKey();
    chrome.tabs.captureVisibleTab(null, null, async function(dataUrl) {
        console.log('this is the screenshot data: ', dataUrl)

        const final = dataURLtoBlob(dataUrl);
        const file = new File([final], sender.tab.title, { type: "image/jpg" });

        chrome.tabs.sendMessage(parseInt(sender.tab.id), { run: "SCREENSHOT_TAKEN" });

        const url = 'https://uploads.slate.host/api/public';
        let data = new FormData();
        data.append("data", file);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: key.apiKey,
          },
          body: data
        });

        const json = await response.json()
        console.log('done: ', json)

        chrome.tabs.sendMessage(parseInt(sender.tab.id), { run: "SCREENSHOT_DONE", data: json });
        
    });
    //chrome.tabs.sendMessage(parseInt(sender.tab.id), { run: "OPEN_LOADING" });
    //await handleSaveLink({ url: sender.url, tab: sender.tab.id })
  }
  */
  

  if(request.type === "OPEN_SETTINGS") {
    chrome.tabs.create({ url: 'settings.html' });
  }
  
  /*
  if(request.type === "TAKE_SCREENSHOT") {
    console.log('sending screenshot!!!!')
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log('this is the tab id: ', tab);
    //window.postMessage({ type: "UPLOAD_START" }, "*");
  }
  */
});

/*
chrome.runtime.onMessage.addListener(function(request, sender) {
    console.log('something was recieved here')
    if (request.type == "SAVE_LINK") {
      console.log('we are in the background now')
    }
});
*/

chrome.tabs.onUpdated.addListener(async function(tabId , info , tab) {
  if (info.status == "complete") {
    const blacklist = [
      'chrome://',
      'localhost:'
    ];

    const domains = [
      "slate.host",
      "slate-dev.onrender.com"
    ];

    const isBlacklisted = checkMatch(blacklist, tab.url);
    const isSlate = checkMatch(domains, tab.url);

    if (isBlacklisted) {
      return;
    }
  }
});

handleUploadImage = async (info, tabs) => {
  chrome.tabs.sendMessage(tabs.id, { run: 'LOAD_APP', type: 'uploading' });
  chrome.tabs.sendMessage(tabs.id, { run: 'LOAD_APP_WITH_TAGS' });
  const key = await getApiKey();
  const imageUrl = info.srcUrl;
  const filename = imageUrl.replace(/^.*[\\\/]/, '')
  const url = 'https://uploads.slate.host/api/v2/public/upload-by-url';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': "application/json",
      Authorization: key.apiKey,
    },
    body: JSON.stringify({
      data: {
        url: imageUrl,
        filename: filename,
      },
    }),
  });

  const json = await response.json();
  console.log('Upload data: ', json)
  return json;
}

chrome.contextMenus.create({
  title: "Slate",
  id: "parent",
  contexts: ["all"],
});

chrome.contextMenus.create({
  title: "Save to data",
  contexts: ["image"],
  parentId: "parent",
  id: "image_slate",
  onclick: handleUploadImage,
});

chrome.bookmarks.onCreated.addListener(async function(id, bookmark) {
  await handleSaveLink({ 
    url: bookmark.url, 
    background: true 
  })
});

chrome.downloads.onCreated.addListener(async function(download) {
  if(download.mime.startsWith('image/')) {
    await handleSaveImage({ 
      url: download.finalUrl, 
      background: true 
    })
    return;
  }

  await handleSaveLink({ 
    url: download.finalUrl, 
    background: true
  })
});
