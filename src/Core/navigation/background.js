import * as Constants from "../../Common/constants";

import { messages } from "./";
import { getRootDomain } from "../../Extension_common/utilities";

export const handleOpenUrlsRequests = async ({ urls, query, sender }) => {
  if (query?.newWindow) {
    await chrome.windows.create({ focused: true, url: urls });
    return;
  }

  if (query?.tabId) {
    await chrome.windows.update(query.windowId, { focused: true });
    await chrome.tabs.update(query.tabId, { active: true });
    return;
  }

  for (let url of urls) {
    await chrome.tabs.create({ windowId: sender.tab.windowId, url });
  }
};

const createGroupFromUrls = async ({ urls, windowId, title }) => {
  const createdTabs = await Promise.all(
    urls.map(async (url) =>
      chrome.tabs.create({ url, windowId, active: false })
    )
  );

  const createdGroupId = await chrome.tabs.group({
    createProperties: { windowId },
    tabIds: createdTabs.map((tab) => tab.id),
  });

  chrome.tabGroups.update(createdGroupId, { title, collapsed: true });
};

/** ------------ Event Listeners ------------- */

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === messages.closeTabs) {
    request.tabsId.forEach((tabId) => {
      chrome.tabs.remove(tabId);
    });
    return true;
  }

  if (request.type === messages.openURLsRequest) {
    await handleOpenUrlsRequests({
      urls: request.urls,
      query: request.query,
      sender,
    });
    return true;
  }

  if (request.type === messages.createGroup) {
    console.log(`Create tabs group with title: ${request.title}`);
    createGroupFromUrls({
      urls: request.urls,
      windowId: sender.tab.windowId,
      title: request.title,
    }).then(sendResponse);
    return true;
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  chrome.tabs.sendMessage(parseInt(tab.id), {
    type: messages.openExtensionJumperRequest,
    data: { url: "/" },
  });
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === Constants.commands.openApp) {
    chrome.tabs.sendMessage(parseInt(tab.id), {
      type: messages.openExtensionJumperRequest,
      data: { url: "/", toggle: true },
    });
  }

  if (command === Constants.commands.openAppOnSlates) {
    const urls = [
      { url: tab.url, title: tab.title, rootDomain: getRootDomain(tab.url) },
    ];
    const urlsQuery = encodeURIComponent(JSON.stringify(urls));
    chrome.tabs.sendMessage(parseInt(tab.id), {
      type: messages.openExtensionJumperRequest,
      data: { url: `/slates?urls=${urlsQuery}` },
    });
  }

  if (command == Constants.commands.openSlate) {
    chrome.tabs.create({
      url: `${Constants.uri.hostname}/_/data&extension=true&id=${tab.id}`,
    });
  }
});
