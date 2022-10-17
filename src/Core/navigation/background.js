import * as Constants from "~/common/constants";

import { messages } from "./";
import { getRootDomain } from "~/extension_common/utilities";
import { Viewer } from "~/core/viewer/background";

export const handleOpenUrlsRequests = async ({
  urls: passedUrls,
  query,
  sender,
}) => {
  let urls = [];
  for (const url of passedUrls) {
    const objectMetada = await Viewer.getObjectMetadataByUrl(url);
    // NOTE(amine): when given a file url, change it to slate.host url;
    if (objectMetada && !objectMetada.isLink) {
      const newUrl = await Viewer.getObjectAppLink(url);
      urls.push(newUrl);
    } else {
      urls.push(url);
    }
  }

  if (query?.newWindow) {
    await chrome.windows.create({ focused: true, url: urls });
    return;
  }

  if (query?.tabId) {
    await chrome.windows.update(query.windowId, { focused: true });
    await chrome.tabs.update(query.tabId, { active: true });
    return;
  }

  if (urls?.length === 1) {
    let url = urls[0];

    if (query?.target === "_blank") {
      await chrome.tabs.create({ windowId: sender.tab.windowId, url });
    } else {
      await chrome.tabs.update(sender.tab.id, { active: true, url });
    }
    return;
  }

  for (let url of urls) {
    await chrome.tabs.create({ windowId: sender.tab.windowId, url });
  }
};

const createGroupFromUrls = async ({ urls: passedUrls, windowId, title }) => {
  let urls = [];
  for (const url of passedUrls) {
    const objectMetada = await Viewer.getObjectMetadataByUrl(url);
    // NOTE(amine): when given a file url, change it to slate.host url;
    if (objectMetada && !objectMetada.isLink) {
      const newUrl = await Viewer.getObjectAppLink(url);
      urls.push(newUrl);
    } else {
      urls.push(url);
    }
  }

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
