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
