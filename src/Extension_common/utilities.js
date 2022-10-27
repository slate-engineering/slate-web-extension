export const isToday = (date) => {
  const today = new Date();
  return (
    today.getDate() == date.getDate() && today.getMonth() == date.getMonth()
  );
};

export const isYesterday = (date) => {
  const yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);
  return (
    yesterday.getDate() === date.getDate() &&
    yesterday.getMonth() === date.getMonth()
  );
};

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

export const constructSavedFeed = (objects) => {
  const ifKeyExistAppendValueElseCreate = ({ object, key, value }) =>
    key in object ? object[key].push(value) : (object[key] = [value]);

  let feed = {};
  objects.forEach((object) => {
    if (isToday(new Date(object.createdAt))) {
      ifKeyExistAppendValueElseCreate({
        object: feed,
        key: "Today",
        value: object,
      });
      return;
    }

    if (isYesterday(new Date(object.createdAt))) {
      ifKeyExistAppendValueElseCreate({
        object: feed,
        key: "Yesterday",
        value: object,
      });
      return;
    }

    const objectCreationDate = new Date(object.createdAt);
    const formattedDate = `${objectCreationDate.toLocaleDateString("en-EN", {
      weekday: "long",
    })}, ${objectCreationDate.toLocaleDateString("en-EN", {
      month: "short",
    })} ${objectCreationDate.getDate()} `;

    ifKeyExistAppendValueElseCreate({
      object: feed,
      key: formattedDate,
      value: object,
    });
  });

  const feedKeys = Object.keys(feed);

  return { feed, feedKeys };
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

export const isTabNewTab = (tab) => tab.url === "chrome://newtab/";
