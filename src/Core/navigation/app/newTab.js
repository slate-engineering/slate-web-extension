import { messages } from "../";

export const createGroupFromUrls = ({ urls, title }) =>
  chrome.runtime.sendMessage({ type: messages.createGroup, urls, title });

export const openUrls = ({ urls, query }) =>
  chrome.runtime.sendMessage({
    type: messages.openURLsRequest,
    urls,
    query: { target: "_self", ...query },
  });

export const closeTabs = (tabsId) =>
  chrome.runtime.sendMessage({ type: messages.closeTabs, tabsId });
