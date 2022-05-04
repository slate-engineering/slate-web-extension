import { messages } from "./";

export const openUrls = (urls) =>
  window.postMessage(() => ({ type: messages.openURLsRequest, urls }), "*");

export const closeExtensionJumper = () => {
  window.postMessage({ type: messages.closeExtensionJumperRequest }, "*");
};
