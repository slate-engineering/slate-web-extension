//NOTE(martina): dev server uri's
export const uri = {
  hostname: "https://slate-dev.onrender.com",
  domain: "slate-dev.onrender.com",
  upload: "https://shovelstaging.onrender.com",
};

//NOTE(martina): production server uri's
// export const uri = {
//   hostname: "https://slate.host",
//   domain: "slate.host",
//   upload: "https://uploads.slate.host",
// };

const getSessionID = async () => {
  console.log("get session ID");
  return new Promise((resolve, reject) => {
    chrome.cookies.get(
      { url: Constants.uri.hostname, name: "WEB_SERVICE_SESSION_KEY" },
      (cookie) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(cookie);
        }
      }
    );
  });
};

const deleteSessionID = async () => {
  return new Promise((resolve, reject) => {
    chrome.cookies.remove(
      { url: Constants.uri.hostname, name: "WEB_SERVICE_SESSION_KEY" },
      (cookie) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(cookie);
        }
      }
    );
  });
};

const getApiKey = async () => {
  console.log("spot 0");
  let session;
  let response;
  try {
    session = await getSessionID();
    if (!session) {
      return;
    }
    response = await fetch(
      `${Constants.uri.hostname}/api/extension/get-api-keys`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            token: session.value,
          },
        }),
      }
    );
    console.log(response);
    console.log("spot 1");
  } catch (e) {
    console.log("caught an error in getapikey");
    console.log(e);
    return;
  }
  console.log("spot 2");
  const json = await response.json();
  console.log(json);
  console.log("spot 3");
  let apiKey = json.data[0].key;
  return apiKey;
};

const getUser = async (props) => {
  let response;
  try {
    response = await fetch(`${Constants.uri.hostname}/api/v3/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.key,
      },
    });
  } catch (e) {
    console.log(e);
  }

  if (!response) {
    return;
  }
  console.log(response);
  console.log("before get user convert to json");
  const json = await response.json();
  console.log("after get user convert to json");
  console.log(json);
  if (json.error) {
    console.log(json);
  }
  return json.user;
};

const checkLink = async (props) => {
  let response;
  try {
    console.log("before check link call");
    response = await fetch(
      `${Constants.uri.hostname}/api/extension/check-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.apiKey,
        },
        body: JSON.stringify({
          data: {
            url: props.tab,
          },
        }),
      }
    );
  } catch (e) {
    console.log(e);
  }
  console.log("after check link call");
  const json = await response.json();
  return json;
};

const handleSaveLink = async (props) => {
  const apiKey = await getApiKey();
  let response;
  try {
    response = await fetch(`${Constants.uri.hostname}/api/v3/create-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        data: {
          url: props.url,
        },
      }),
    });
  } catch (e) {
    console.log(e);
  }

  const json = await response.json();
  console.log("upload data: ", json);

  if (json.decorator === "LINK_DUPLICATE") {
    chrome.tabs.sendMessage(parseInt(props.tab), {
      run: "UPLOAD_DUPLICATE",
      data: json.data[0],
    });
    return;
  }

  if (json.decorator === "SERVER_CREATE_LINK_FAILED" || json.error === true) {
    chrome.tabs.sendMessage(parseInt(props.tab), {
      run: "UPLOAD_FAIL",
    });
    return;
  }

  if (!props.background) {
    chrome.tabs.sendMessage(parseInt(props.tab), {
      run: "UPLOAD_DONE",
      data: json.data[0],
    });
  } else {
    //If background upload, dont send a message to a tab
    return;
  }

  return json.data[0];
};

handleSaveImage = async (props) => {
  const apiKey = await getApiKey();
  const url = `${Constants.uri.upload}/api/v3/public/upload-by-url`;

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        data: {
          url: props.url,
          filename: props.url,
        },
      }),
    });
  } catch (e) {
    console.log(e);
  }

  const json = await response.json();
  return json;
};

const checkMatch = (list, url) => {
  const matches = RegExp(list.join("|")).exec(url);
  return matches;
};

const checkLoginData = async (tab) => {
  console.log("check login data");
  let session;
  try {
    session = await getSessionID();
  } catch (e) {
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, { run: "AUTH_REQ" });
    }, 1000);
    console.log("returned nothing from checklogindata");
    return;
  }
  console.log("passed session id");
  console.log(session);
  if (session === null) {
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, { run: "AUTH_REQ" });
    }, 1000);
    return;
  } else {
    let api = await getApiKey();
    console.log("before get user");
    let user = await getUser({ key: api });
    console.log("before check link");
    let check = await checkLink({ apiKey: api, tab: tab.url });
    console.log("after check link");
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, {
        run: "CHECK_LINK",
        data: check,
        user: user,
      });
    }, 1000);
    let data = { data: check, user: user, tab: tab.id };
    return data;
  }
};

const checkLoginSession = async (tab) => {
  console.log("check login session");
  if (tab) {
    chrome.cookies.onChanged.addListener(async (changeInfo) => {
      if (
        changeInfo.cookie.domain === Constants.uri.domain &&
        changeInfo.removed === false
      ) {
        await checkLoginData(tab);
        chrome.tabs.update(tab.id, { highlighted: true });
        tab = null;
        return;
      }
    });
  }
};

chrome.action.onClicked.addListener(async (tab) => {
  console.log("on clicked");
  chrome.tabs.sendMessage(tab.id, {
    run: "LOAD_APP",
    type: "LOADER_MAIN",
    tabId: tab.id,
  });
  await checkLoginData(tab);
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command == "open-app") {
    console.log("open app");
    chrome.tabs.sendMessage(tab.id, { run: "LOAD_APP", type: "LOADER_MAIN" });
    await checkLoginData(tab);
  }
  if (command == "open-slate") {
    chrome.tabs.create({
      url: `${Constants.uri.hostname}/_/data&extension=true&id=${tab.id}`,
    });
  }
  if (command == "direct-save") {
    console.log("direct save");
    let session = await checkLoginData(tab);

    if (session && session.user) {
      chrome.tabs.sendMessage(tab.id, { run: "LOAD_APP", type: "LOADER_MINI" });
      chrome.tabs.sendMessage(parseInt(tab.id), { run: "OPEN_LOADING" });
      await handleSaveLink({ url: tab.url, tab: tab.id });
    } else {
      chrome.tabs.sendMessage(tab.id, { run: "LOAD_APP", type: "LOADER_MAIN" });
    }
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === "GO_BACK") {
    chrome.tabs.update(parseInt(request.id), { highlighted: true });
    chrome.tabs.remove(parseInt(sender.tab.id));
  }

  if (request.type === "SAVE_LINK") {
    chrome.tabs.sendMessage(parseInt(sender.tab.id), { run: "OPEN_LOADING" });
    let data = await handleSaveLink({ url: sender.url, tab: sender.tab.id });
  }

  if (request.type === "CHECK_LOGIN") {
    await checkLoginSession(sender.tab);
    return;
  }

  if (request.type === "SIGN_OUT") {
    await deleteSessionID();
    return;
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (info.status == "complete") {
    const blacklist = ["chrome://", "localhost:", "cec.cx"];

    const domains = ["slate.host", "slate-dev.onrender.com"];

    const isBlacklisted = checkMatch(blacklist, tab.url);
    const isSlate = checkMatch(domains, tab.url);

    if (isBlacklisted) {
      return;
    }
  }
});
