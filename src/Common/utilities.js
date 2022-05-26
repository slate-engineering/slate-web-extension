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
