export const constructWindowsFeed = ({ tabs, activeTabId, activeWindowId }) => {
  const allOpenFeedKeys = ["Current Window", "Other Windows"];
  let allOpenFeed = { ["Current Window"]: [], ["Other Windows"]: [] };

  tabs.forEach((tab) => {
    if (tab.windowId === activeWindowId) {
      if (tab.id === activeTabId) {
        allOpenFeed["Current Window"].unshift(tab);
      } else {
        allOpenFeed["Current Window"].push(tab);
      }
      return;
    }

    allOpenFeed["Other Windows"].push(tab);
  });

  return {
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

export const removeItemFromArrayInPlace = (array, predicate) => {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      array.splice(i, 1);
    }
  }
};
