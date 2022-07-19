import * as Constants from "../../Common/constants";

import { messages } from "./";

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
  if (request.type === messages.closeTab) {
    chrome.tabs.remove(request.tabId);
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
  });
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command == Constants.commands.openApp) {
    chrome.tabs.sendMessage(parseInt(tab.id), {
      type: messages.openExtensionJumperRequest,
    });
  }

  if (command == Constants.commands.openSlate) {
    chrome.tabs.create({
      url: `${Constants.uri.hostname}/_/data&extension=true&id=${tab.id}`,
    });
  }
});
