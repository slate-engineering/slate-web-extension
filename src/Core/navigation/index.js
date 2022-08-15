export const messages = {
  openExtensionJumperRequest: "OPEN_EXTENSION_JUMPER_REQUEST",
  closeExtensionJumperRequest: "CLOSE_EXTENSION_JUMPER_REQUEST",

  openURLsRequest: "OPEN_URLS_REQUEST",

  createGroup: "BROWSER_CREATE_GROUP",

  closeTabs: "CLOSE_TABS",
};

/* -----------------------------------------------------------------------------------------------*/

const ADDRESS_BAR_ELEMENT_ID = "slate-extension-address-bar";

export const ADDRESS_BAR_CURRENT_URL_ATTRIBUTE = "data-current-url";

export const createAddressBarElement = () => {
  const element = document.createElement("div");
  element.setAttribute("id", ADDRESS_BAR_ELEMENT_ID);
  document.body.appendChild(element);
};
export const getAddressBarElement = () =>
  document.getElementById(ADDRESS_BAR_ELEMENT_ID);

export const getAddressBarUrl = () => {
  const element = document.getElementById(ADDRESS_BAR_ELEMENT_ID);
  return element.getAttribute(ADDRESS_BAR_CURRENT_URL_ATTRIBUTE) || "/";
};
export const updateAddressBarUrl = (url) => {
  const element = document.getElementById(ADDRESS_BAR_ELEMENT_ID);
  element.setAttribute(ADDRESS_BAR_CURRENT_URL_ATTRIBUTE, url);
};
