const getSessionID = async () => {
  return new Promise((resolve, reject) => {
      chrome.cookies.get({"url": "https://slate.host", "name": "WEB_SERVICE_SESSION_KEY"}, cookie => {
          if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError));
          } else {
              resolve(cookie);
          }
      });
  });
};

const deleteSessionID = async () => {
  return new Promise((resolve, reject) => {
      chrome.cookies.remove({"url": "https://slate.host", "name": "WEB_SERVICE_SESSION_KEY"}, cookie => {
          if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError));
          } else {
              resolve(cookie);
          }
      });
  });
};

const getApiKey = async () => {
  let session = await getSessionID();
  const url = 'https://slate.host/api/extension/get-api-keys';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': "application/json",
    },
    body: JSON.stringify({
      data: {
        token: session.value,
      },
    }),
  });

  const json = await response.json();
  let apiKey = json.data[0].key;
  return apiKey;
};

const getUser = async (props) => {
  const response = await fetch('https://slate.host/api/v2/get', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: props.key,
    }
  });

  if (!response) {
    return;
  }

  const json = await response.json();
  if (json.error) {
    console.log(json);
  } else {
    const collections = json.collections;
    const user = json.user;
  }

  return json.user;
}

const checkLink = async (props) => {
    const response = await fetch('https://slate.host/api/extension/check-link', {
    method: 'POST',
    headers: {
      'Content-Type': "application/json",
      Authorization: props.apiKey,
    },
    body: JSON.stringify({
      data: {
        url: props.tab,
      },
    }),
  });

  const json = await response.json();
  return json;
}

const handleSaveLink = async (props) => {

  const apiKey = await getApiKey();
  const response = await fetch("https://slate.host/api/v2/create-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      data: {
        url: props.url
      },
    }),
  });

  const json = await response.json();

  if(!props.background) {
    chrome.tabs.sendMessage(parseInt(props.tab), { 
      run: 'UPLOAD_DONE', 
      data: json.data[0], 
      tab: props.tab
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
  const apiKey = await getApiKey();
  const url = 'https://uploads.slate.host/api/v2/public/upload-by-url';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      data: {
        url: props.url,
        filename: props.url,
      },
    }),
  });

  const json = await response.json();
  return json;
}

const checkMatch = (list, url) => {
  const matches = RegExp(list.join('|')).exec(url);
  return matches;
}

chrome.browserAction.onClicked.addListener(async function(tab) {
  chrome.tabs.sendMessage(tab.id, { run: 'LOAD_APP' });

  let session = await getSessionID();

  if(session === null) {
    setTimeout(function(){ 
      chrome.tabs.sendMessage(tab.id, { run: 'AUTH_REQ' });
    }, 1000);    
  }else{
    let api = await getApiKey();
    let user = await getUser({ key: api });
    let check = await checkLink({ apiKey: api, tab: tab.url });
    chrome.tabs.sendMessage(tab.id, { run: 'CHECK_LINK', data: check, user: user });
  }
});

chrome.commands.onCommand.addListener((command, tab) => {
  if(command == 'open-app') {    
    chrome.tabs.sendMessage(tab.id, { run: 'LOAD_APP' });
  }
  if(command == 'open-slate') {
    chrome.tabs.create({ 'url': `https://slate.host/_/data&extension=true&id=${tab.id}` });
  }
});

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  if(request.type === "GO_BACK") {
    let openId = parseInt(request.id)
    let closeId = parseInt(sender.tab.id)
    chrome.tabs.update(openId, { highlighted: true });
    chrome.tabs.remove(closeId);
  }

  if(request.type === "SAVE_LINK") {
    chrome.tabs.sendMessage(parseInt(sender.tab.id), { run: "OPEN_LOADING" });
    let data = await handleSaveLink({ url: sender.url, tab: sender.tab.id })
  }  

  if(request.type === "SIGN_OUT") {
    await deleteSessionID();
    return;
  }
});

chrome.tabs.onUpdated.addListener(async function(tabId , info , tab) {
  if (info.status == "complete") {
    const blacklist = [
      'chrome://',
      'localhost:',
      'cec.cx'
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

/*
TODO (jason) add back for sprint 2

handleUploadImage = async (info, tabs) => {
  chrome.tabs.sendMessage(tabs.id, { run: 'LOAD_APP', type: 'uploading' });
  chrome.tabs.sendMessage(tabs.id, { run: 'LOAD_APP_WITH_TAGS' });
  const key = await getApiKey();
  const filename = info.srcUrl.replace(/^.*[\\\/]/, '')
  const url = 'https://uploads.slate.host/api/v2/public/upload-by-url';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': "application/json",
      Authorization: key.apiKey,
    },
    body: JSON.stringify({
      data: {
        url: info.srcUrl,
        filename: filename,
      },
    }),
  });

  const json = await response.json();
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
*/
