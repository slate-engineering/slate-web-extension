import * as Constants from "../Common/constants";

import { jsx } from "@emotion/react";

export const getAvatarUrl = (user) => {
  if (user.photo) return user.photo;

  let colors = ["A9B9C1", "5B6B74", "3C444A", "D4DBDF", "293137"];
  return `https://source.boringavatars.com/marble/24px/${user.id}?square&colors=${colors}`;
};

export const mergeEvents =
  (...handlers) =>
  (e) => {
    handlers.forEach((handler) => {
      if (handler) handler(e);
    });
  };

export const mergeRefs = (refs) => {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
};

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

// NOTE(amine): workaround to support css prop in cloned elements
// SOURCE(amine): https://github.com/emotion-js/emotion/issues/1404#issuecomment-504527459
export const cloneElementWithJsx = (element, config, ...children) => {
  return jsx(
    element.props["__EMOTION_TYPE_PLEASE_DO_NOT_USE__"]
      ? element.props["__EMOTION_TYPE_PLEASE_DO_NOT_USE__"]
      : element.type,
    {
      key: element.key !== null ? element.key : undefined,
      ref: element.ref,
      ...element.props,
      ...config,
      style: { ...element.props?.style, ...config?.style },
      css: [element.props?.css, config.css],
    },
    ...children
  );
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

export const copyToClipboard = (text) => navigator.clipboard.writeText(text);

export const isNewTab = window.location.protocol === "chrome-extension:";

export const getExtensionURL = (path) => {
  if (isNewTab) {
    return chrome.runtime.getURL(path);
  }

  return (
    document
      .getElementById(Constants.jumperSlateExtensionWrapper)
      .getAttribute("data-url") + path
  );
};

export const isObjectEmpty = (object) => {
  for (let key in object) {
    return false;
  }

  return true;
};

export const removeKeyFromObject = (key, object) => {
  const { [key]: deletedKey, ...newObject } = object;
  return newObject;
};

export const last = (array) => array[array.length - 1];

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
