const domain = 'https://slate.host';

const domains = {
  api: 'https://slate-dev.onrender.com',
  cookie: 'https://slate.host'
}

const getSessionID = async () => {
  return new Promise((resolve, reject) => {
      chrome.cookies.get({"url": domain, "name": "WEB_SERVICE_SESSION_KEY"}, cookie => {
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
      chrome.cookies.remove({"url": domain, "name": "WEB_SERVICE_SESSION_KEY"}, cookie => {
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
  const response = await fetch(`${domain}/api/extension/get-api-keys`, {
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
  const response = await fetch(`${domain}/api/v2/get`, {
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
    const response = await fetch(`${domain}/api/extension/check-link`, {
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
  const response = await fetch(`${domain}/api/v2/create-link`, {
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
  console.log('upload data: ', json)
  
  if(json.decorator === "LINK_DUPLICATE") {
    chrome.tabs.sendMessage(parseInt(props.tab), { 
      run: 'UPLOAD_DUPLICATE',
      data: json.data[0] 
    });
    return;
  }

  if(json.decorator === "SERVER_CREATE_LINK_FAILED" || json.error === true) {
    chrome.tabs.sendMessage(parseInt(props.tab), { 
      run: 'UPLOAD_FAIL', 
    });
    return;
  }

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

const checkLoginData = async (tab) => {
  let session = await getSessionID();

  if(session === null) {
    setTimeout(() => { 
      chrome.tabs.sendMessage(tab.id, { run: 'AUTH_REQ' });
    }, 1000);    
    return;
  }else{
    let api = await getApiKey();
    let user = await getUser({ key: api });
    let check = await checkLink({ apiKey: api, tab: tab.url });
    chrome.tabs.sendMessage(tab.id, { run: 'CHECK_LINK', data: check, user: user });
    let data = { data: check, user: user, tab: tab.id }
    return data;
  }
}

const checkLoginSession = async (tab) => {
  if(tab) {
    chrome.cookies.onChanged.addListener(async (changeInfo) => {
      if(changeInfo.cookie.domain === "slate.host" && changeInfo.removed === false) {
        await checkLoginData(tab);
        chrome.tabs.update(tab.id, { highlighted: true });
        tab = null;
        return;
      }
    });
  }
}

chrome.action.onClicked.addListener(async (tab) => {
  chrome.tabs.sendMessage(tab.id, { run: 'LOAD_APP', type: 'LOADER_MAIN', tabId: tab.id });
  await checkLoginData(tab);
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if(command == 'open-app') {    
    chrome.tabs.sendMessage(tab.id, { run: 'LOAD_APP', type: 'LOADER_MAIN' });
    await checkLoginData(tab);
  }
  if(command == 'open-slate') {
    chrome.tabs.create({ 'url': `${domain}/_/data&extension=true&id=${tab.id}` });
  }
  if(command == 'direct-save') {
    chrome.tabs.sendMessage(tab.id, { run: 'LOAD_APP', type: 'LOADER_MINI' });
    let session = await checkLoginData(tab);

    if(session.user) {
      chrome.tabs.sendMessage(parseInt(tab.id), { run: 'OPEN_LOADING' });
      await handleSaveLink({ url: tab.url, tab: tab.id })
    }
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if(request.type === "GO_BACK") {
    chrome.tabs.update(parseInt(request.id), { highlighted: true });
    chrome.tabs.remove(parseInt(sender.tab.id));
  }

  if(request.type === "SAVE_LINK") {
    chrome.tabs.sendMessage(parseInt(sender.tab.id), { run: "OPEN_LOADING" });
    let data = await handleSaveLink({ url: sender.url, tab: sender.tab.id })
  }  

  if(request.type === "CHECK_LOGIN") {
    await checkLoginSession(sender.tab);
    return;
  }

  if(request.type === "SIGN_OUT") {
    await deleteSessionID();
    return;
  }
});

chrome.tabs.onUpdated.addListener(async (tabId , info , tab) => {
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
