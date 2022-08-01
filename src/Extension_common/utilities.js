export const constructWindowsFeed = ({ tabs, activeWindowId, activeTabId }) => {
  const currentWindowFeedKeys = ["Current Tab", "Others"];
  let currentWindowFeed = { ["Current Tab"]: [], ["Others"]: [] };

  const allOpenFeedKeys = ["Current Window", "Others"];
  let allOpenFeed = { ["Current Window"]: [], Others: [] };

  tabs.forEach((tab) => {
    if (tab.windowId === activeWindowId) {
      if (tab.id === activeTabId) {
        currentWindowFeed["Current Tab"].push(tab);
      } else {
        currentWindowFeed["Others"].push(tab);
      }

      allOpenFeed["Current Window"].push(tab);
      return;
    }

    allOpenFeed["Others"].push(tab);
  });

  return {
    currentWindowFeed,
    currentWindowFeedKeys,
    allOpenFeed,
    allOpenFeedKeys,
  };
};

export const getRootDomain = (url) => {
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    hostname = "";
  }
  const hostnameParts = hostname.split(".");
  return hostnameParts.slice(-(hostnameParts.length === 4 ? 3 : 2)).join(".");
};
