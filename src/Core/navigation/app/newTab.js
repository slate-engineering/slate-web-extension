import { messages } from "../";

export const createGroupFromUrls = ({ urls, title }) =>
  chrome.runtime.sendMessage({ type: messages.createGroup, urls, title });

export const openUrls = ({ urls, query }) =>
  chrome.runtime.sendMessage({ type: messages.openURLsRequest, urls, query });
