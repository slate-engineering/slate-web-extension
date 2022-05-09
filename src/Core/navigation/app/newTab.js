import { messages } from "../";

export const openUrls = ({ urls, query }) =>
  chrome.runtime.sendMessage({ type: messages.openURLsRequest, urls, query });
