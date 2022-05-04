import * as Constants from "../../Common/constants";
import { messages } from "./";

export const handleOpenUrlsRequests = async ({ urls, query, sender }) => {
  if (query.newWindow) {
    await chrome.windows.create({ focused: true, url: urls });
    return;
  }

  if (query.tabId) {
    await chrome.windows.update(query.windowId, { focused: true });
    await chrome.tabs.update(query.tabId, { active: true });
    return;
  }

  for (let url of urls) {
    await chrome.tabs.create({ windowId: sender.tab.windowId, url });
  }
};

/** ------------ Event Listeners ------------- */

chrome.runtime.onMessage.addListener(async (request, sender) => {
  if (request.type === messages.openURLsRequest) {
    await handleOpenUrlsRequests({
      urls: request.urls,
      query: request.query,
      sender,
    });
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
