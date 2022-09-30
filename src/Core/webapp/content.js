import * as Constants from "~/common/constants";

const notifyTheAppThatExtensionIsDownloaded = () => {
  const currentPageUrl = document.URL;
  try {
    const { host } = new URL(currentPageUrl);
    if (host === Constants.uri.domain) {
      const extensionElement = document.getElementById("browser_extension");
      extensionElement.className = "isDownloaded";
    }
  } catch (e) {
    return;
  }
};

notifyTheAppThatExtensionIsDownloaded();
