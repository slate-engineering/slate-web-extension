import { messages } from "../";

export const openUrls = ({ urls, query }) =>
  window.postMessage({ type: messages.openURLsRequest, urls, query }, "*");

export const closeExtensionJumper = () => {
  window.postMessage({ type: messages.closeExtensionJumperRequest }, "*");
};
