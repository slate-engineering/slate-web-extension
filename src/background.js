import * as Constants from "./Common/constants";
import * as UploadUtilities from "./Utilities/upload";

import "./Core/history/background";
import "./Core/navigation/background";
import "./Core/views/background";
import "./Core/viewer/background";

const getSessionID = async () => {
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
  } catch (e) {
    return;
  }
  const json = await response.json();
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
  const json = await response.json();
  if (json.error) {
    console.log(json);
  }
  return json.user;
};

const checkLink = async (props) => {
  let response;
  try {
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
  const json = await response.json();
  return json;
};

// const checkMatch = (list, url) => {
//   const matches = RegExp(list.join("|")).exec(url);
//   return matches;
// };

const checkLoginData = async (tab) => {
  let session;
  try {
    session = await getSessionID();
  } catch (e) {
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, { run: "AUTH_REQ" });
    }, 1000);
    return;
  }
  if (session === null) {
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, { run: "AUTH_REQ" });
    }, 1000);
    return;
  } else {
    let api = await getApiKey();
    let user = await getUser({ key: api });
    let check = await checkLink({ apiKey: api, tab: tab.url });
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

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command == UploadUtilities.commands.directSave) {
    let session = await checkLoginData(tab);

    if (session && session.user) {
      // NOTE(amine): update auth code
      //   Navigation.sendOpenAppRequestToContent({ tab: tab.id });
      //   const apiKey = await getApiKey();
      //   await UploadUtilities.handleSaveLinkRequests({
      //     url: tab.url,
      //     tab: tab.id,
      //     apiKey,
      //   });
      // } else {
      //   Navigation.sendNavigationRequestToContent({
      //     tab: tab.id,
      //     search: `?${Constants.routes.modal.key}=${Constants.routes.modal.values.home}`,
      //   });
      // }
    }
  }
});

chrome.runtime.onMessage.addListener(async (request, sender) => {
  if (request.type === UploadUtilities.messages.saveLink) {
    const apiKey = await getApiKey();
    await UploadUtilities.handleSaveLinkRequests({
      url: sender.url,
      tab: sender.tab.id,
      apiKey,
    });
  }

  if (request.type === "GO_BACK") {
    chrome.tabs.update(parseInt(request.id), { highlighted: true });
    chrome.tabs.remove(parseInt(sender.tab.id));
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

// chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
//   if (info.status == "complete") {
//     const blacklist = ["chrome://", "localhost:", "cec.cx"];
//     const isBlacklisted = checkMatch(blacklist, tab.url);

//     // const domains = ["slate.host", "slate-dev.onrender.com"];
//     // const isSlate = checkMatch(domains, tab.url);

//     if (isBlacklisted) {
//       return;
//     }
//   }
// });
