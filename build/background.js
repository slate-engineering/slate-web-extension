/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/Core/browser/index.js
const messages = {
  historyChunkRequest: "HISTORY_CHUNK_REQUEST",
  historyChunkResponse: "HISTORY_CHUNK_RESPONSE",

  relatedLinksRequest: "RELATED_LINKS_REQUEST",
  relatedLinksResponse: "RELATED_LINKS_RESPONSE",

  windowsUpdate: "WINDOWS_UPDATE",
};

;// CONCATENATED MODULE: ./src/Core/views/index.js
const views_messages = {
  searchQueryRequest: "SEARCH_QUERY_REQUEST",
  searchQueryResponse: "SEARCH_QUERY_RESPONSE",

  viewFeedRequest: "VIEW_FEED_REQUEST",
  viewFeedResponse: "VIEW_FEED_RESPONSE",

  createViewByTag: "CREATE_VIEW_BY_TAG",
  createViewBySource: "CREATE_VIEW_BY_SOURCE",

  removeView: "REMOVE_VIEW",
};

const viewsType = {
  allOpen: "allOpen",
  recent: "recent",
  saved: "saved",
  files: "files",
  custom: "custom",
};

const defaultViews = {
  allOpen: { id: "allOpen", name: "All Open", type: viewsType.allOpen },
  recent: { id: "recent", name: "Recent", type: viewsType.recent },
  saved: {
    id: "saved",
    name: "Saved",
    type: viewsType.saved,
  },
  files: {
    id: "files",
    name: "Files",
    type: viewsType.files,
  },
};

const initialView = defaultViews.allOpen;

;// CONCATENATED MODULE: ./src/Core/viewer/index.js


const viewer_messages = {
  loadViewerDataRequest: "LOAD_VIEWER_DATA_REQUEST",
  loadViewerDataResponse: "LOAD_VIEWER_DATA_RESPONSE",

  updateViewer: "UPDATE_VIEWER",

  saveLink: "SAVE_LINK",
  savingStatus: "SAVING_STATUS",

  addObjectsToSlate: "ADD_OBJECTS_TO_SLATE",
  removeObjectsFromSlate: "REMOVE_OBJECTS_FROM_SLATE",
  createSlate: "CREATE_SLATE",

  getSavedLinksSourcesRequest: "GET_SAVED_LINKS_SOURCES_REQUEST",
  getSavedLinksSourcesResponse: "GET_SAVED_LINKS_SOURCES_RESPONSE",

  updateViewerSettings: "UPDATE_VIEWER_SETTINGS",
};

// NOTE(amine): commands are defined in manifest.json
const commands = {
  directSave: "direct-save",
};

const savingStates = {
  start: "start",
  done: "done",
  duplicate: "duplicate",
  failed: "failed",
};

const savingSources = {
  command: "command",
  app: "app",
};

const viewerInitialState = {
  isAuthenticated: false,
  initialView: initialView,
  windows: {
    data: { currentWindow: [], allOpen: [] },
  },
  // NOTE(amine):if there is one tab is open,populate the recent view
};

;// CONCATENATED MODULE: ./src/Common/constants.js
// NOTE(amine): commands are defined in manifest.json
const constants_commands = {
  openApp: "open-app",
  openSlate: "open-slate",
  openAppOnSlates: "open-app-on-slates",
};

const values = {
  version: "1.0.0",
  sds: "0.2.0",
};

const sizes = {
  mobile: 768,
  navigation: 288,
  sidebar: 416,
  header: 56,
  tablet: 960,
  desktop: 1024,
  desktopM: 1300,
  jumperFeedItem: 44,
  jumperFeedWrapper: 373,
  topOffset: 0, //NOTE(martina): Pushes UI down. 16 when there is a persistent announcement banner, 0 otherwise
};

const system = {
  //system color
  white: "#FFFFFF",
  grayLight6: "#F7F8F9",
  grayLight5: "#E5E8EA",
  grayLight4: "#D1D4D6",
  grayLight3: "#C7CACC",
  grayLight2: "#AEB0B2",
  gray: "#8E9093",
  grayDark2: "#636566",
  grayDark3: "#48494A",
  grayDark4: "#3A3B3C",
  grayDark5: "#2C2D2E",
  grayDark6: "#1C1D1E",
  black: "#00050A",

  blue: "#0084FF",
  green: "#34D159",
  yellow: "#FFD600",
  red: "#FF4530",
  purple: "#585CE6",
  teal: "#64C8FA",
  pink: "#FF375F",
  orange: "#FF9F00",

  blueLight6: "#D5EBFF",
  blueLight5: "#AAD7FF",
  blueLight4: "#80C3FF",
  blueLight3: "#55AEFF",
  bluelight2: "#2B99FF",
  blueDark2: "#006FD5",
  blueDark3: "#0059AA",
  blueDark4: "#004380",
  blueDark5: "#002D55",
  blueDark6: "#00172B",

  greenLight6: "#D5FFDE",
  greenLight5: "#AAFFBE",
  greenLight4: "#86FCA2",
  greenLight3: "#66F287",
  greenLight2: "#4BE46F",
  greenDark2: "#20B944",
  greenDark3: "#119D32",
  greenDark4: "#067C22",
  greenDark5: "#005514",
  greenDark6: "#002B09",

  yellowLight6: "#FFFFD5",
  yellowLight5: "#FFFBAA",
  yellowLight4: "#FFF280",
  yellowLight3: "#FFE655",
  yellowLight2: "#FFD62B",
  yellowDark2: "#D5AC00",
  yellowDark3: "#AA9100",
  yellowDark4: "#807300",
  yellowDark5: "#555100",
  yellowDark6: "#2B2A00",

  redLight6: "#FFD5D5",
  redLight5: "#FFAFAA",
  redLight4: "#FF8D80",
  redlight3: "#FF715E",
  redLight2: "#FF5944",
  redDark2: "#D52E1A",
  redDark3: "#AA1C09",
  redDark4: "#800E00",
  redDark5: "#550500",
  redDark6: "#2B0000",

  twitterBlue: "1DA1F2",
};

const semantic = {
  //semantic color
  textWhite: system.white,
  textGrayLight: system.grayLight3,
  textGray: system.gray,
  textGrayDark: system.grayDark3,
  textBlack: system.black,

  bgLight: system.grayLight6,

  bgGrayLight: system.grayLight5,
  bgGrayLight4: system.grayLight4,
  bgBlurWhite: "rgba(255, 255, 255, 0.7)",
  bgBlurWhiteOP: "rgba(255, 255, 255, 0.85)",
  bgBlurWhiteTRN: "rgba(255, 255, 255, 0.3)",
  bgBlurLight: "rgba(247, 248, 249, 0.7)",
  bgBlurLightOP: "rgba(247, 248, 249, 0.85)",
  bgBlurLight6: "rgba(247, 248, 249, 0.7)",
  bgBlurLight6OP: "rgba(247, 248, 249, 0.85)",
  bgBlurLight6TRN: "rgba(247, 248, 249, 0.3)",

  bgDark: system.grayDark6,
  bgLightDark: system.grayDark5,
  bgBlurBlack: "rgba(0, 5, 10, 0.5)",
  bgBlurBlackOP: "rgba(0, 5, 10, 0.85)",
  bgBlurBlackTRN: "rgba(0, 5, 10, 0.3)",
  bgBlurDark: "rgba(28, 29, 30, 0.7)",
  bgBlurDark6: "rgba(28, 29, 30, 0.5)",
  bgBlurDark6OP: "rgba(28, 29, 30, 0.85)",
  bgBlurDark6TRN: "rgba(28, 29, 30, 0.3)",

  borderLight: system.grayLight6,
  borderDark: system.grayDark6,
  borderGray: system.gray,
  borderGrayLight: system.grayLight5,
  borderGrayDark: system.grayDark5,
  borderGrayLight4: system.grayLight4,

  bgBlue: system.blueLight6,
  bgGreen: system.greenLight6,
  bgYellow: system.yellowLight6,
  bgWhite: system.white,
  bgRed: system.redLight6,
};

const shadow = {
  lightSmall: "0px 4px 16px 0 rgba(174, 176, 178, 0.1)",
  lightMedium: "0px 8px 32px 0 rgba(174, 176, 178, 0.2)",
  lightLarge: "0px 12px 64px 0 rgba(174, 176, 178, 0.3)",
  darkSmall: "0px 4px 16px 0 rgba(99, 101, 102, 0.1)",
  darkMedium: "0px 8px 32px 0 rgba(99, 101, 102, 0.2)",
  darkLarge: "0px 12px 64px 0 rgba(99, 101, 102, 0.3)",
  jumperLight: "0px 20px 36px 0 rgba(99, 101, 102, 0.6)",
  card: "0px 0px 32px #E5E8EA;",
};

const zindex = {
  navigation: 1,
  body: 2,
  sidebar: 5,
  alert: 3,
  header: 4,
  modal: 6,
  tooltip: 7,
  cta: 8,
  extensionJumper: 2147483600,
};

const font = {
  text: `'inter-regular', -apple-system, BlinkMacSystemFont, arial, sans-serif`,
  semiBold: `'inter-semi-bold', -apple-system, BlinkMacSystemFont, arial, sans-serif`,
  medium: `'inter-medium', -apple-system, BlinkMacSystemFont, arial, sans-serif`,
  mono: `'mono', monaco, monospace`,
  monoBold: `'mono-bold', monaco, monospace`,
  monoCode: `'fira-code-regular', mono, monospace`,
  monoCodeBold: `'fira-code-bold', mono-bold, monospace`,
  code: `'jet-brains-regular', mono, monospace`,
  codeBold: `'jet-brains-bold', mono, monospace`,
};

const typescale = {
  lvlN1: `0.75rem`,
  lvl0: `0.875rem`,
  lvl1: `1rem`,
  lvl2: `1.25rem`,
  lvl3: `1.563rem`,
  lvl4: `1.953rem`,
  lvl5: `2.441rem`,
  lvl6: `3.052rem`,
  lvl7: `3.815rem`,
  lvl8: `4.768rem`,
  lvl9: `5.96rem`,
  lvl10: `7.451rem`,
  lvl11: `9.313rem`,
};

const theme = {
  foreground: system.white,
  ctaBackground: system.blue,
  pageBackground: semantic.bgLight,
  pageText: system.black,
};

const gateways = {
  ipfs: "https://slate.textile.io/ipfs",
};

//NOTE(amine): local server uri's
// export const uri = {
//   hostname: "http://localhost:1337",
//   domain: "localhost:1337",
//   upload: "http://localhost:4242",
// };

//NOTE(martina): dev server uri's
// export const uri = {
//   hostname: "https://slate-dev.onrender.com",
//   domain: "slate-dev.onrender.com",
//   upload: "https://shovelstaging.onrender.com",
// };

//NOTE(martina): production server uri's
const uri = {
  hostname: "https://slate.host",
  domain: "slate.host",
  upload: "https://uploads.slate.host",
};

const NFTDomains = (/* unused pure expression or super */ null && (["foundation.app", "zora.co", "opensea.io"]));

// more important filetypes to consider:
// midi
// txt, rtf, docx
// html, css, js, other code-related extensions
// json, csv, other script/data extensions
const filetypes = {
  images: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  audio: ["audio/mpeg", "audio/aac", "audio/flac", "audio/wav", "audio/webm"],
  assets: ["font/ttf", "font/otf", "image/svg+xml"],
  videos: ["video/mpeg", "video/webm", "video/quicktime"],
  books: [
    "application/pdf",
    "application/epub+zip",
    "application/vnd.amazon.ebook",
  ],
};

const linkPreviewSizeLimit = 5000000; //NOTE(martina): 5mb limit for twitter preview images

// NOTE(amine): used to calculate how many cards will fit into a row in sceneActivity
const grids = {
  activity: {
    profileInfo: {
      width: 260,
    },
  },
  object: {
    desktop: { width: 248, rowGap: 20 },
    mobile: { width: 166, rowGap: 12 },
  },
  collection: {
    desktop: { width: 382, rowGap: 16 },
    mobile: { width: 280, rowGap: 8 },
  },
  profile: {
    desktop: { width: 248, rowGap: 16 },
    mobile: { width: 248, rowGap: 8 },
  },
};

const profileDefaultPicture =
  "https://slate.textile.io/ipfs/bafkreick3nscgixwfpq736forz7kzxvvhuej6kszevpsgmcubyhsx2pf7i";

const jumperSlateExtensionWrapper = "jumper-slate-extension-wrapper";

const jumperSlateExtensionModalsPortal = "slate-extension-modals";

;// CONCATENATED MODULE: ./src/Common/actions.js


const REQUEST_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

//NOTE(martina): used for calls to the server
const DEFAULT_OPTIONS = {
  method: "POST",
  headers: REQUEST_HEADERS,
  credentials: "include",
};

const returnJSON = async (route, options) => {
  try {
    const response = await fetch(route, options);
    const json = await response.json();

    return json;
  } catch (e) {
    if (e.name === "AbortError") return { aborted: true };
  }
};

const hydrateAuthenticatedUser = async () => {
  return await returnJSON(`${uri.hostname}/api/hydrate`, {
    ...DEFAULT_OPTIONS,
  });
};

const createLink = async (data, options) => {
  return await returnJSON(`${uri.hostname}/api/data/create-link`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
    ...options,
  });
};

const saveCopy = async (data, options) => {
  return await returnJSON(`${uri.hostname}/api/data/save-copy`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
    ...options,
  });
};

const createSlate = async (data) => {
  return await returnJSON(`${uri.hostname}/api/slates/create`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

const removeFileFromSlate = async (data) => {
  return await returnJSON(`${uri.hostname}/api/slates/remove-file`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

const search = async (data) => {
  return await returnJSON(`${uri.hostname}/api/search/search`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

const createView = async (data) => {
  return await returnJSON(`${uri.hostname}/api/views/create`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

const removeView = async (data) => {
  return await returnJSON(`${uri.hostname}/api/views/delete`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

;// CONCATENATED MODULE: ./src/Extension_common/constants.js
const constants_gateways = {
  ipfs: "https://slate.textile.io/ipfs",
};

//NOTE(amine): local server uri's
// export const uri = {
//   hostname: "http://localhost:1337",
//   domain: "localhost:1337",
//   upload: "http://localhost:4242",
// };

//NOTE(martina): dev server uri's
// export const uri = {
//   hostname: "https://slate-dev.onrender.com",
//   domain: "slate-dev.onrender.com",
//   upload: "https://shovelstaging.onrender.com",
// };

//NOTE(martina): production server uri's

const constants_uri = {
  hostname: "https://slate.host",
  domain: "slate.host",
  upload: "https://uploads.slate.host",
};

const popularDomainsTitles = {
  "news.ycombinator.com": "Hacker news",
  "hackernews.com": "Hacker news",
};

;// CONCATENATED MODULE: ./src/Extension_common/utilities.js
const constructWindowsFeed = ({ tabs, activeTabId, activeWindowId }) => {
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

const getRootDomain = (url) => {
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    hostname = "";
  }
  const hostnameParts = hostname.split(".");
  return hostnameParts.slice(-(hostnameParts.length === 4 ? 3 : 2)).join(".");
};

;// CONCATENATED MODULE: ./src/Common/strings.js


const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = (DAY * 365) / 12;
const YEAR = DAY * 365;

const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 5);
};

const getKey = (text) => {
  if (isEmpty(text)) {
    return null;
  }

  return text.replace("Basic ", "");
};

const getPresentationSlateName = (slate) => {
  if (!isEmpty(slate.name)) {
    return slate.name;
  }

  return slate.slatename;
};

const getPresentationName = (user) => {
  if (!isEmpty(user.name)) {
    return user.name;
  }

  return user.username;
};

const zeroPad = (num, places) => {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
};

const getURLfromCID = (cid) => {
  return `${Constants.gateways.ipfs}/${cid}`;
};

const getApiUrl = {
  link: `${uri.hostname}/api/v3/create-link`,
  image: `${uri.hostname}/api/v3/public/upload-by-url`,
};

const getSlateFileLink = (id) => {
  return `${Constants.uri.hostname}/_/data?id=${id}&extension=true`;
};

const getUrlHost = (url) => {
  return new URL(url).hostname;
};

const truncateString = (count, string) => {
  return string.slice(0, count) + (string.length > count ? "..." : "");
};

const shortcuts = [
  { short: "⌥", key: "S", name: "Open extension" },
  { short: "⌥", key: "B", name: "Bookmark current page" },
  { short: "↑", key: "↓", extra: "←", name: "Navigate extension" },
  { short: "", key: "esc", name: "Close extension" },
  { short: "⌥", key: "O", name: "Open web app" },
];

// NOTE(jsign): Each epoch is 30s, then divide by 60 for getting mins, by 60 to get hours, then by 24 to get days
const getDaysFromEpoch = (epoch) => {
  const number = (epoch * 30) / DAY;
  const formatted = number.toFixed(2);
  return `${formatted} days`;
};

const toDateSinceEpoch = (epoch) => {
  return toDate(new Date().getTime() - epoch);
};

// export const getURLfromCIDWithExtension = (cid, name) => {
//   const url = getURLfromCID(cid);
//   const extension = getFileExtension(name);
//   if (!isEmpty(extension)) {
//     return `${url}.${getFileExtension(name)}`;
//   }

//   return url;
// };

const getURLFromPath = (path) => {
  return `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? ":" + window.location.port : ""
  }${path}`;
};

const getFileExtension = (name) => {
  if (!name || isEmpty(name)) {
    return "";
  }
  // if (name.lastIndexOf(".") !== -1) {
  //   return name.slice(name.lastIndexOf("."));
  // } else {
  //   return "";
  // }
  if (name.lastIndexOf(".") !== -1) {
    return name.slice(((name.lastIndexOf(".") - 1) >>> 0) + 2);
  }
  return "";
};

const createQueryParams = (params) => {
  let query = "?";
  let first = true;
  for (const [key, value] of Object.entries(params)) {
    if (!first) {
      query += "&";
    }
    query += `${key}=${value}`;
    first = false;
  }
  return query;
};

const getCIDFromIPFS = (url) => {
  // NOTE(andrew)
  const cid = url.includes("/ipfs/")
    ? // pull cid from a path format gateway
      url.split("/ipfs/")[1]
    : // pull cid from a subdomain format gateway
      url.match(/(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/i)[1];
  return cid;
};

const formatAsUploadMessage = (added, skipped, slate = false) => {
  let message = `${added || 0} file${added !== 1 ? "s" : ""} added${
    slate ? " to collection" : ""
  }. `;
  if (skipped) {
    message += `${skipped || 0} duplicate / existing file${
      added !== 1 ? "s were" : " was"
    } skipped.`;
  }
  return message;
};

const pluralize = (text, count) => {
  return count > 1 || count === 0 ? `${text}s` : text;
};

const toDate = (data) => {
  const date = new Date(data);
  return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
};

const formatNumber = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const elide = (string, length = 140, emptyState = "...") => {
  if (isEmpty(string)) {
    return emptyState;
  }

  if (string.length < length) {
    return string.trim();
  }

  return `${string.substring(0, length)}...`;
};

const isEmpty = (string) => {
  // NOTE(jim): This is not empty when its coerced into a string.
  if (string === 0) {
    return false;
  }

  if (!string) {
    return true;
  }

  if (typeof string === "object") {
    return true;
  }

  if (string.length === 0) {
    return true;
  }

  string = string.toString();

  return !string.trim();
};

const bytesToSize = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(dm)}${sizes[i]}`;
};

const getRemainingTime = (seconds) => {
  seconds = seconds > 0 ? seconds : 1;

  let [value, unit] =
    seconds < MINUTE
      ? [Math.round(seconds), "second"]
      : seconds < HOUR
      ? [Math.round(seconds / MINUTE), "minute"]
      : seconds < DAY
      ? [Math.round(seconds / HOUR), "hour"]
      : seconds < WEEK
      ? [Math.round(seconds / DAY), "day"]
      : seconds < MONTH
      ? [Math.round(seconds / WEEK), "week"]
      : seconds < YEAR
      ? [Math.round(seconds / MONTH), "month"]
      : [Math.round(seconds / YEAR), "year"];

  unit = pluralize(unit, value);

  return `${value} ${unit} remaining`;
};

const urlToCid = (url) => {
  return url
    .replace(`${Constants.gateways.ipfs}/`, "")
    .replace("https://", "")
    .replace("undefined", "")
    .replace(".ipfs.slate.textile.io", "")
    .replace("hub.textile.io/ipfs/", "");
};

const getQueryStringFromParams = (params) => {
  let pairs = Object.entries(params).map(([key, value]) => `${key}=${value}`);
  let query = "?".concat(pairs.join("&"));
  if (query.length === 1) {
    return "";
  }
  return query;
};

//NOTE(martina): works with both url and search passed in
const getParamsFromUrl = (url) => {
  let startIndex = url.indexOf("?") + 1;
  let search = url.slice(startIndex);
  if (search.length < 3) {
    return {};
  }
  let params = {};
  let pairs = search.split("&");
  for (let pair of pairs) {
    let key = pair.split("=")[0];
    let value = pair.slice(key.length + 1);
    if (key && value) {
      params[key] = value;
    }
  }
  return params;
};

const hexToRGBA = (hex, alpha = 1) => {
  hex = hex.replace("#", "");
  var r = parseInt(
    hex.length === 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2),
    16
  );
  var g = parseInt(
    hex.length === 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4),
    16
  );
  var b = parseInt(
    hex.length === 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6),
    16
  );
  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
};

const copyText = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  el.style.visibility = "hidden";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);

  return true;
};

// SOURCE(jim):
// https://gist.github.com/mathewbyrne/1280286
// modified to support chinese characters, base case, and german.
const createSlug = (text, base = "untitled") => {
  if (isEmpty(text)) {
    return base;
  }

  text = text.toString().toLowerCase();

  const sets = [
    { to: "a", from: "[ÀÁÂÃÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]" },
    { to: "ae", from: "[Ä]" },
    { to: "c", from: "[ÇĆĈČ]" },
    { to: "d", from: "[ÐĎĐÞ]" },
    { to: "e", from: "[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]" },
    { to: "g", from: "[ĜĞĢǴ]" },
    { to: "h", from: "[ĤḦ]" },
    { to: "i", from: "[ÌÍÎÏĨĪĮİỈỊ]" },
    { to: "j", from: "[Ĵ]" },
    { to: "ij", from: "[Ĳ]" },
    { to: "k", from: "[Ķ]" },
    { to: "l", from: "[ĹĻĽŁ]" },
    { to: "m", from: "[Ḿ]" },
    { to: "n", from: "[ÑŃŅŇ]" },
    { to: "o", from: "[ÒÓÔÕØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]" },
    { to: "oe", from: "[ŒÖ]" },
    { to: "p", from: "[ṕ]" },
    { to: "r", from: "[ŔŖŘ]" },
    { to: "s", from: "[ŚŜŞŠ]" },
    { to: "ss", from: "[ß]" },
    { to: "t", from: "[ŢŤ]" },
    { to: "u", from: "[ÙÚÛŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]" },
    { to: "ue", from: "[Ü]" },
    { to: "w", from: "[ẂŴẀẄ]" },
    { to: "x", from: "[ẍ]" },
    { to: "y", from: "[ÝŶŸỲỴỶỸ]" },
    { to: "z", from: "[ŹŻŽ]" },
    { to: "-", from: "[_]" },
  ];

  sets.forEach((set) => {
    text = text.replace(new RegExp(set.from, "gi"), set.to);
  });

  text = text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^a-zA-Z0-9_\u3400-\u9FBF\s-]/g, "") // Remove all non-word chars
    .replace(/\--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "")
    .trim(); // Trim - from start of text

  return text;
};

const capitalize = (str = "") => str[0].toUpperCase() + str.slice(1);

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/rng.js
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/regex.js
/* harmony default export */ var regex = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/validate.js


function validate(uuid) {
  return typeof uuid === 'string' && regex.test(uuid);
}

/* harmony default export */ var esm_browser_validate = (validate);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/stringify.js

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!esm_browser_validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ var esm_browser_stringify = (stringify);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v4.js



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return esm_browser_stringify(rnds);
}

/* harmony default export */ var esm_browser_v4 = (v4);
;// CONCATENATED MODULE: ./node_modules/fuse.js/dist/fuse.esm.js
/**
 * Fuse.js v6.5.3 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2021 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

function isArray(value) {
  return !Array.isArray
    ? getTag(value) === '[object Array]'
    : Array.isArray(value)
}

// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/baseToString.js
const INFINITY = 1 / 0;
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value
  }
  let result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result
}

function fuse_esm_toString(value) {
  return value == null ? '' : baseToString(value)
}

function isString(value) {
  return typeof value === 'string'
}

function isNumber(value) {
  return typeof value === 'number'
}

// Adapted from: https://github.com/lodash/lodash/blob/master/isBoolean.js
function isBoolean(value) {
  return (
    value === true ||
    value === false ||
    (isObjectLike(value) && getTag(value) == '[object Boolean]')
  )
}

function isObject(value) {
  return typeof value === 'object'
}

// Checks if `value` is object-like.
function isObjectLike(value) {
  return isObject(value) && value !== null
}

function isDefined(value) {
  return value !== undefined && value !== null
}

function isBlank(value) {
  return !value.trim().length
}

// Gets the `toStringTag` of `value`.
// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/getTag.js
function getTag(value) {
  return value == null
    ? value === undefined
      ? '[object Undefined]'
      : '[object Null]'
    : Object.prototype.toString.call(value)
}

const EXTENDED_SEARCH_UNAVAILABLE = 'Extended search is not available';

const INCORRECT_INDEX_TYPE = "Incorrect 'index' type";

const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) =>
  `Invalid value for key ${key}`;

const PATTERN_LENGTH_TOO_LARGE = (max) =>
  `Pattern length exceeds max of ${max}.`;

const MISSING_KEY_PROPERTY = (name) => `Missing ${name} property in key`;

const INVALID_KEY_WEIGHT_VALUE = (key) =>
  `Property 'weight' in key '${key}' must be a positive integer`;

const hasOwn = Object.prototype.hasOwnProperty;

class KeyStore {
  constructor(keys) {
    this._keys = [];
    this._keyMap = {};

    let totalWeight = 0;

    keys.forEach((key) => {
      let obj = createKey(key);

      totalWeight += obj.weight;

      this._keys.push(obj);
      this._keyMap[obj.id] = obj;

      totalWeight += obj.weight;
    });

    // Normalize weights so that their sum is equal to 1
    this._keys.forEach((key) => {
      key.weight /= totalWeight;
    });
  }
  get(keyId) {
    return this._keyMap[keyId]
  }
  keys() {
    return this._keys
  }
  toJSON() {
    return JSON.stringify(this._keys)
  }
}

function createKey(key) {
  let path = null;
  let id = null;
  let src = null;
  let weight = 1;

  if (isString(key) || isArray(key)) {
    src = key;
    path = createKeyPath(key);
    id = createKeyId(key);
  } else {
    if (!hasOwn.call(key, 'name')) {
      throw new Error(MISSING_KEY_PROPERTY('name'))
    }

    const name = key.name;
    src = name;

    if (hasOwn.call(key, 'weight')) {
      weight = key.weight;

      if (weight <= 0) {
        throw new Error(INVALID_KEY_WEIGHT_VALUE(name))
      }
    }

    path = createKeyPath(name);
    id = createKeyId(name);
  }

  return { path, id, weight, src }
}

function createKeyPath(key) {
  return isArray(key) ? key : key.split('.')
}

function createKeyId(key) {
  return isArray(key) ? key.join('.') : key
}

function get(obj, path) {
  let list = [];
  let arr = false;

  const deepGet = (obj, path, index) => {
    if (!isDefined(obj)) {
      return
    }
    if (!path[index]) {
      // If there's no path left, we've arrived at the object we care about.
      list.push(obj);
    } else {
      let key = path[index];

      const value = obj[key];

      if (!isDefined(value)) {
        return
      }

      // If we're at the last value in the path, and if it's a string/number/bool,
      // add it to the list
      if (
        index === path.length - 1 &&
        (isString(value) || isNumber(value) || isBoolean(value))
      ) {
        list.push(fuse_esm_toString(value));
      } else if (isArray(value)) {
        arr = true;
        // Search each item in the array.
        for (let i = 0, len = value.length; i < len; i += 1) {
          deepGet(value[i], path, index + 1);
        }
      } else if (path.length) {
        // An object. Recurse further.
        deepGet(value, path, index + 1);
      }
    }
  };

  // Backwards compatibility (since path used to be a string)
  deepGet(obj, isString(path) ? path.split('.') : path, 0);

  return arr ? list : list[0]
}

const MatchOptions = {
  // Whether the matches should be included in the result set. When `true`, each record in the result
  // set will include the indices of the matched characters.
  // These can consequently be used for highlighting purposes.
  includeMatches: false,
  // When `true`, the matching function will continue to the end of a search pattern even if
  // a perfect match has already been located in the string.
  findAllMatches: false,
  // Minimum number of characters that must be matched before a result is considered a match
  minMatchCharLength: 1
};

const BasicOptions = {
  // When `true`, the algorithm continues searching to the end of the input even if a perfect
  // match is found before the end of the same input.
  isCaseSensitive: false,
  // When true, the matching function will continue to the end of a search pattern even if
  includeScore: false,
  // List of properties that will be searched. This also supports nested properties.
  keys: [],
  // Whether to sort the result list, by score
  shouldSort: true,
  // Default sort function: sort by ascending score, ascending index
  sortFn: (a, b) =>
    a.score === b.score ? (a.idx < b.idx ? -1 : 1) : a.score < b.score ? -1 : 1
};

const FuzzyOptions = {
  // Approximately where in the text is the pattern expected to be found?
  location: 0,
  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.6,
  // Determines how close the match must be to the fuzzy location (specified above).
  // An exact letter match which is 'distance' characters away from the fuzzy location
  // would score as a complete mismatch. A distance of '0' requires the match be at
  // the exact location specified, a threshold of '1000' would require a perfect match
  // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
  distance: 100
};

const AdvancedOptions = {
  // When `true`, it enables the use of unix-like search commands
  useExtendedSearch: false,
  // The get function to use when fetching an object's properties.
  // The default will search nested paths *ie foo.bar.baz*
  getFn: get,
  // When `true`, search will ignore `location` and `distance`, so it won't matter
  // where in the string the pattern appears.
  // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
  ignoreLocation: false,
  // When `true`, the calculation for the relevance score (used for sorting) will
  // ignore the field-length norm.
  // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
  ignoreFieldNorm: false,
  // The weight to determine how much field length norm effects scoring.
  fieldNormWeight: 1
};

var Config = {
  ...BasicOptions,
  ...MatchOptions,
  ...FuzzyOptions,
  ...AdvancedOptions
};

const SPACE = /[^ ]+/g;

// Field-length norm: the shorter the field, the higher the weight.
// Set to 3 decimals to reduce index size.
function norm(weight = 1, mantissa = 3) {
  const cache = new Map();
  const m = Math.pow(10, mantissa);

  return {
    get(value) {
      const numTokens = value.match(SPACE).length;

      if (cache.has(numTokens)) {
        return cache.get(numTokens)
      }

      // Default function is 1/sqrt(x), weight makes that variable
      const norm = 1 / Math.pow(numTokens, 0.5 * weight);

      // In place of `toFixed(mantissa)`, for faster computation
      const n = parseFloat(Math.round(norm * m) / m);

      cache.set(numTokens, n);

      return n
    },
    clear() {
      cache.clear();
    }
  }
}

class FuseIndex {
  constructor({
    getFn = Config.getFn,
    fieldNormWeight = Config.fieldNormWeight
  } = {}) {
    this.norm = norm(fieldNormWeight, 3);
    this.getFn = getFn;
    this.isCreated = false;

    this.setIndexRecords();
  }
  setSources(docs = []) {
    this.docs = docs;
  }
  setIndexRecords(records = []) {
    this.records = records;
  }
  setKeys(keys = []) {
    this.keys = keys;
    this._keysMap = {};
    keys.forEach((key, idx) => {
      this._keysMap[key.id] = idx;
    });
  }
  create() {
    if (this.isCreated || !this.docs.length) {
      return
    }

    this.isCreated = true;

    // List is Array<String>
    if (isString(this.docs[0])) {
      this.docs.forEach((doc, docIndex) => {
        this._addString(doc, docIndex);
      });
    } else {
      // List is Array<Object>
      this.docs.forEach((doc, docIndex) => {
        this._addObject(doc, docIndex);
      });
    }

    this.norm.clear();
  }
  // Adds a doc to the end of the index
  add(doc) {
    const idx = this.size();

    if (isString(doc)) {
      this._addString(doc, idx);
    } else {
      this._addObject(doc, idx);
    }
  }
  // Removes the doc at the specified index of the index
  removeAt(idx) {
    this.records.splice(idx, 1);

    // Change ref index of every subsquent doc
    for (let i = idx, len = this.size(); i < len; i += 1) {
      this.records[i].i -= 1;
    }
  }
  getValueForItemAtKeyId(item, keyId) {
    return item[this._keysMap[keyId]]
  }
  size() {
    return this.records.length
  }
  _addString(doc, docIndex) {
    if (!isDefined(doc) || isBlank(doc)) {
      return
    }

    let record = {
      v: doc,
      i: docIndex,
      n: this.norm.get(doc)
    };

    this.records.push(record);
  }
  _addObject(doc, docIndex) {
    let record = { i: docIndex, $: {} };

    // Iterate over every key (i.e, path), and fetch the value at that key
    this.keys.forEach((key, keyIndex) => {
      // console.log(key)
      let value = this.getFn(doc, key.path);

      if (!isDefined(value)) {
        return
      }

      if (isArray(value)) {
        let subRecords = [];
        const stack = [{ nestedArrIndex: -1, value }];

        while (stack.length) {
          const { nestedArrIndex, value } = stack.pop();

          if (!isDefined(value)) {
            continue
          }

          if (isString(value) && !isBlank(value)) {
            let subRecord = {
              v: value,
              i: nestedArrIndex,
              n: this.norm.get(value)
            };

            subRecords.push(subRecord);
          } else if (isArray(value)) {
            value.forEach((item, k) => {
              stack.push({
                nestedArrIndex: k,
                value: item
              });
            });
          } else ;
        }
        record.$[keyIndex] = subRecords;
      } else if (!isBlank(value)) {
        let subRecord = {
          v: value,
          n: this.norm.get(value)
        };

        record.$[keyIndex] = subRecord;
      }
    });

    this.records.push(record);
  }
  toJSON() {
    return {
      keys: this.keys,
      records: this.records
    }
  }
}

function createIndex(
  keys,
  docs,
  { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}
) {
  const myIndex = new FuseIndex({ getFn, fieldNormWeight });
  myIndex.setKeys(keys.map(createKey));
  myIndex.setSources(docs);
  myIndex.create();
  return myIndex
}

function parseIndex(
  data,
  { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}
) {
  const { keys, records } = data;
  const myIndex = new FuseIndex({ getFn, fieldNormWeight });
  myIndex.setKeys(keys);
  myIndex.setIndexRecords(records);
  return myIndex
}

function computeScore$1(
  pattern,
  {
    errors = 0,
    currentLocation = 0,
    expectedLocation = 0,
    distance = Config.distance,
    ignoreLocation = Config.ignoreLocation
  } = {}
) {
  const accuracy = errors / pattern.length;

  if (ignoreLocation) {
    return accuracy
  }

  const proximity = Math.abs(expectedLocation - currentLocation);

  if (!distance) {
    // Dodge divide by zero error.
    return proximity ? 1.0 : accuracy
  }

  return accuracy + proximity / distance
}

function convertMaskToIndices(
  matchmask = [],
  minMatchCharLength = Config.minMatchCharLength
) {
  let indices = [];
  let start = -1;
  let end = -1;
  let i = 0;

  for (let len = matchmask.length; i < len; i += 1) {
    let match = matchmask[i];
    if (match && start === -1) {
      start = i;
    } else if (!match && start !== -1) {
      end = i - 1;
      if (end - start + 1 >= minMatchCharLength) {
        indices.push([start, end]);
      }
      start = -1;
    }
  }

  // (i-1 - start) + 1 => i - start
  if (matchmask[i - 1] && i - start >= minMatchCharLength) {
    indices.push([start, i - 1]);
  }

  return indices
}

// Machine word size
const MAX_BITS = 32;

function fuse_esm_search(
  text,
  pattern,
  patternAlphabet,
  {
    location = Config.location,
    distance = Config.distance,
    threshold = Config.threshold,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    includeMatches = Config.includeMatches,
    ignoreLocation = Config.ignoreLocation
  } = {}
) {
  if (pattern.length > MAX_BITS) {
    throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS))
  }

  const patternLen = pattern.length;
  // Set starting location at beginning text and initialize the alphabet.
  const textLen = text.length;
  // Handle the case when location > text.length
  const expectedLocation = Math.max(0, Math.min(location, textLen));
  // Highest score beyond which we give up.
  let currentThreshold = threshold;
  // Is there a nearby exact match? (speedup)
  let bestLocation = expectedLocation;

  // Performance: only computer matches when the minMatchCharLength > 1
  // OR if `includeMatches` is true.
  const computeMatches = minMatchCharLength > 1 || includeMatches;
  // A mask of the matches, used for building the indices
  const matchMask = computeMatches ? Array(textLen) : [];

  let index;

  // Get all exact matches, here for speed up
  while ((index = text.indexOf(pattern, bestLocation)) > -1) {
    let score = computeScore$1(pattern, {
      currentLocation: index,
      expectedLocation,
      distance,
      ignoreLocation
    });

    currentThreshold = Math.min(score, currentThreshold);
    bestLocation = index + patternLen;

    if (computeMatches) {
      let i = 0;
      while (i < patternLen) {
        matchMask[index + i] = 1;
        i += 1;
      }
    }
  }

  // Reset the best location
  bestLocation = -1;

  let lastBitArr = [];
  let finalScore = 1;
  let binMax = patternLen + textLen;

  const mask = 1 << (patternLen - 1);

  for (let i = 0; i < patternLen; i += 1) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from the match location we can stray
    // at this error level.
    let binMin = 0;
    let binMid = binMax;

    while (binMin < binMid) {
      const score = computeScore$1(pattern, {
        errors: i,
        currentLocation: expectedLocation + binMid,
        expectedLocation,
        distance,
        ignoreLocation
      });

      if (score <= currentThreshold) {
        binMin = binMid;
      } else {
        binMax = binMid;
      }

      binMid = Math.floor((binMax - binMin) / 2 + binMin);
    }

    // Use the result from this iteration as the maximum for the next.
    binMax = binMid;

    let start = Math.max(1, expectedLocation - binMid + 1);
    let finish = findAllMatches
      ? textLen
      : Math.min(expectedLocation + binMid, textLen) + patternLen;

    // Initialize the bit array
    let bitArr = Array(finish + 2);

    bitArr[finish + 1] = (1 << i) - 1;

    for (let j = finish; j >= start; j -= 1) {
      let currentLocation = j - 1;
      let charMatch = patternAlphabet[text.charAt(currentLocation)];

      if (computeMatches) {
        // Speed up: quick bool to int conversion (i.e, `charMatch ? 1 : 0`)
        matchMask[currentLocation] = +!!charMatch;
      }

      // First pass: exact match
      bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch;

      // Subsequent passes: fuzzy match
      if (i) {
        bitArr[j] |=
          ((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1 | lastBitArr[j + 1];
      }

      if (bitArr[j] & mask) {
        finalScore = computeScore$1(pattern, {
          errors: i,
          currentLocation,
          expectedLocation,
          distance,
          ignoreLocation
        });

        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (finalScore <= currentThreshold) {
          // Indeed it is
          currentThreshold = finalScore;
          bestLocation = currentLocation;

          // Already passed `loc`, downhill from here on in.
          if (bestLocation <= expectedLocation) {
            break
          }

          // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.
          start = Math.max(1, 2 * expectedLocation - bestLocation);
        }
      }
    }

    // No hope for a (better) match at greater error levels.
    const score = computeScore$1(pattern, {
      errors: i + 1,
      currentLocation: expectedLocation,
      expectedLocation,
      distance,
      ignoreLocation
    });

    if (score > currentThreshold) {
      break
    }

    lastBitArr = bitArr;
  }

  const result = {
    isMatch: bestLocation >= 0,
    // Count exact matches (those with a score of 0) to be "almost" exact
    score: Math.max(0.001, finalScore)
  };

  if (computeMatches) {
    const indices = convertMaskToIndices(matchMask, minMatchCharLength);
    if (!indices.length) {
      result.isMatch = false;
    } else if (includeMatches) {
      result.indices = indices;
    }
  }

  return result
}

function createPatternAlphabet(pattern) {
  let mask = {};

  for (let i = 0, len = pattern.length; i < len; i += 1) {
    const char = pattern.charAt(i);
    mask[char] = (mask[char] || 0) | (1 << (len - i - 1));
  }

  return mask
}

class BitapSearch {
  constructor(
    pattern,
    {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreLocation = Config.ignoreLocation
    } = {}
  ) {
    this.options = {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive,
      ignoreLocation
    };

    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();

    this.chunks = [];

    if (!this.pattern.length) {
      return
    }

    const addChunk = (pattern, startIndex) => {
      this.chunks.push({
        pattern,
        alphabet: createPatternAlphabet(pattern),
        startIndex
      });
    };

    const len = this.pattern.length;

    if (len > MAX_BITS) {
      let i = 0;
      const remainder = len % MAX_BITS;
      const end = len - remainder;

      while (i < end) {
        addChunk(this.pattern.substr(i, MAX_BITS), i);
        i += MAX_BITS;
      }

      if (remainder) {
        const startIndex = len - MAX_BITS;
        addChunk(this.pattern.substr(startIndex), startIndex);
      }
    } else {
      addChunk(this.pattern, 0);
    }
  }

  searchIn(text) {
    const { isCaseSensitive, includeMatches } = this.options;

    if (!isCaseSensitive) {
      text = text.toLowerCase();
    }

    // Exact match
    if (this.pattern === text) {
      let result = {
        isMatch: true,
        score: 0
      };

      if (includeMatches) {
        result.indices = [[0, text.length - 1]];
      }

      return result
    }

    // Otherwise, use Bitap algorithm
    const {
      location,
      distance,
      threshold,
      findAllMatches,
      minMatchCharLength,
      ignoreLocation
    } = this.options;

    let allIndices = [];
    let totalScore = 0;
    let hasMatches = false;

    this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
      const { isMatch, score, indices } = fuse_esm_search(text, pattern, alphabet, {
        location: location + startIndex,
        distance,
        threshold,
        findAllMatches,
        minMatchCharLength,
        includeMatches,
        ignoreLocation
      });

      if (isMatch) {
        hasMatches = true;
      }

      totalScore += score;

      if (isMatch && indices) {
        allIndices = [...allIndices, ...indices];
      }
    });

    let result = {
      isMatch: hasMatches,
      score: hasMatches ? totalScore / this.chunks.length : 1
    };

    if (hasMatches && includeMatches) {
      result.indices = allIndices;
    }

    return result
  }
}

class BaseMatch {
  constructor(pattern) {
    this.pattern = pattern;
  }
  static isMultiMatch(pattern) {
    return getMatch(pattern, this.multiRegex)
  }
  static isSingleMatch(pattern) {
    return getMatch(pattern, this.singleRegex)
  }
  search(/*text*/) {}
}

function getMatch(pattern, exp) {
  const matches = pattern.match(exp);
  return matches ? matches[1] : null
}

// Token: 'file

class ExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'exact'
  }
  static get multiRegex() {
    return /^="(.*)"$/
  }
  static get singleRegex() {
    return /^=(.*)$/
  }
  search(text) {
    const isMatch = text === this.pattern;

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    }
  }
}

// Token: !fire

class InverseExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'inverse-exact'
  }
  static get multiRegex() {
    return /^!"(.*)"$/
  }
  static get singleRegex() {
    return /^!(.*)$/
  }
  search(text) {
    const index = text.indexOf(this.pattern);
    const isMatch = index === -1;

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    }
  }
}

// Token: ^file

class PrefixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'prefix-exact'
  }
  static get multiRegex() {
    return /^\^"(.*)"$/
  }
  static get singleRegex() {
    return /^\^(.*)$/
  }
  search(text) {
    const isMatch = text.startsWith(this.pattern);

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    }
  }
}

// Token: !^fire

class InversePrefixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'inverse-prefix-exact'
  }
  static get multiRegex() {
    return /^!\^"(.*)"$/
  }
  static get singleRegex() {
    return /^!\^(.*)$/
  }
  search(text) {
    const isMatch = !text.startsWith(this.pattern);

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    }
  }
}

// Token: .file$

class SuffixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'suffix-exact'
  }
  static get multiRegex() {
    return /^"(.*)"\$$/
  }
  static get singleRegex() {
    return /^(.*)\$$/
  }
  search(text) {
    const isMatch = text.endsWith(this.pattern);

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [text.length - this.pattern.length, text.length - 1]
    }
  }
}

// Token: !.file$

class InverseSuffixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'inverse-suffix-exact'
  }
  static get multiRegex() {
    return /^!"(.*)"\$$/
  }
  static get singleRegex() {
    return /^!(.*)\$$/
  }
  search(text) {
    const isMatch = !text.endsWith(this.pattern);
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    }
  }
}

class FuzzyMatch extends BaseMatch {
  constructor(
    pattern,
    {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreLocation = Config.ignoreLocation
    } = {}
  ) {
    super(pattern);
    this._bitapSearch = new BitapSearch(pattern, {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive,
      ignoreLocation
    });
  }
  static get type() {
    return 'fuzzy'
  }
  static get multiRegex() {
    return /^"(.*)"$/
  }
  static get singleRegex() {
    return /^(.*)$/
  }
  search(text) {
    return this._bitapSearch.searchIn(text)
  }
}

// Token: 'file

class IncludeMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'include'
  }
  static get multiRegex() {
    return /^'"(.*)"$/
  }
  static get singleRegex() {
    return /^'(.*)$/
  }
  search(text) {
    let location = 0;
    let index;

    const indices = [];
    const patternLen = this.pattern.length;

    // Get all exact matches
    while ((index = text.indexOf(this.pattern, location)) > -1) {
      location = index + patternLen;
      indices.push([index, location - 1]);
    }

    const isMatch = !!indices.length;

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices
    }
  }
}

// ❗Order is important. DO NOT CHANGE.
const searchers = [
  ExactMatch,
  IncludeMatch,
  PrefixExactMatch,
  InversePrefixExactMatch,
  InverseSuffixExactMatch,
  SuffixExactMatch,
  InverseExactMatch,
  FuzzyMatch
];

const searchersLen = searchers.length;

// Regex to split by spaces, but keep anything in quotes together
const SPACE_RE = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/;
const OR_TOKEN = '|';

// Return a 2D array representation of the query, for simpler parsing.
// Example:
// "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]
function parseQuery(pattern, options = {}) {
  return pattern.split(OR_TOKEN).map((item) => {
    let query = item
      .trim()
      .split(SPACE_RE)
      .filter((item) => item && !!item.trim());

    let results = [];
    for (let i = 0, len = query.length; i < len; i += 1) {
      const queryItem = query[i];

      // 1. Handle multiple query match (i.e, once that are quoted, like `"hello world"`)
      let found = false;
      let idx = -1;
      while (!found && ++idx < searchersLen) {
        const searcher = searchers[idx];
        let token = searcher.isMultiMatch(queryItem);
        if (token) {
          results.push(new searcher(token, options));
          found = true;
        }
      }

      if (found) {
        continue
      }

      // 2. Handle single query matches (i.e, once that are *not* quoted)
      idx = -1;
      while (++idx < searchersLen) {
        const searcher = searchers[idx];
        let token = searcher.isSingleMatch(queryItem);
        if (token) {
          results.push(new searcher(token, options));
          break
        }
      }
    }

    return results
  })
}

// These extended matchers can return an array of matches, as opposed
// to a singl match
const MultiMatchSet = new Set([FuzzyMatch.type, IncludeMatch.type]);

/**
 * Command-like searching
 * ======================
 *
 * Given multiple search terms delimited by spaces.e.g. `^jscript .python$ ruby !java`,
 * search in a given text.
 *
 * Search syntax:
 *
 * | Token       | Match type                 | Description                            |
 * | ----------- | -------------------------- | -------------------------------------- |
 * | `jscript`   | fuzzy-match                | Items that fuzzy match `jscript`       |
 * | `=scheme`   | exact-match                | Items that are `scheme`                |
 * | `'python`   | include-match              | Items that include `python`            |
 * | `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
 * | `^java`     | prefix-exact-match         | Items that start with `java`           |
 * | `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
 * | `.js$`      | suffix-exact-match         | Items that end with `.js`              |
 * | `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |
 *
 * A single pipe character acts as an OR operator. For example, the following
 * query matches entries that start with `core` and end with either`go`, `rb`,
 * or`py`.
 *
 * ```
 * ^core go$ | rb$ | py$
 * ```
 */
class ExtendedSearch {
  constructor(
    pattern,
    {
      isCaseSensitive = Config.isCaseSensitive,
      includeMatches = Config.includeMatches,
      minMatchCharLength = Config.minMatchCharLength,
      ignoreLocation = Config.ignoreLocation,
      findAllMatches = Config.findAllMatches,
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance
    } = {}
  ) {
    this.query = null;
    this.options = {
      isCaseSensitive,
      includeMatches,
      minMatchCharLength,
      findAllMatches,
      ignoreLocation,
      location,
      threshold,
      distance
    };

    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
    this.query = parseQuery(this.pattern, this.options);
  }

  static condition(_, options) {
    return options.useExtendedSearch
  }

  searchIn(text) {
    const query = this.query;

    if (!query) {
      return {
        isMatch: false,
        score: 1
      }
    }

    const { includeMatches, isCaseSensitive } = this.options;

    text = isCaseSensitive ? text : text.toLowerCase();

    let numMatches = 0;
    let allIndices = [];
    let totalScore = 0;

    // ORs
    for (let i = 0, qLen = query.length; i < qLen; i += 1) {
      const searchers = query[i];

      // Reset indices
      allIndices.length = 0;
      numMatches = 0;

      // ANDs
      for (let j = 0, pLen = searchers.length; j < pLen; j += 1) {
        const searcher = searchers[j];
        const { isMatch, indices, score } = searcher.search(text);

        if (isMatch) {
          numMatches += 1;
          totalScore += score;
          if (includeMatches) {
            const type = searcher.constructor.type;
            if (MultiMatchSet.has(type)) {
              allIndices = [...allIndices, ...indices];
            } else {
              allIndices.push(indices);
            }
          }
        } else {
          totalScore = 0;
          numMatches = 0;
          allIndices.length = 0;
          break
        }
      }

      // OR condition, so if TRUE, return
      if (numMatches) {
        let result = {
          isMatch: true,
          score: totalScore / numMatches
        };

        if (includeMatches) {
          result.indices = allIndices;
        }

        return result
      }
    }

    // Nothing was matched
    return {
      isMatch: false,
      score: 1
    }
  }
}

const registeredSearchers = [];

function register(...args) {
  registeredSearchers.push(...args);
}

function createSearcher(pattern, options) {
  for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
    let searcherClass = registeredSearchers[i];
    if (searcherClass.condition(pattern, options)) {
      return new searcherClass(pattern, options)
    }
  }

  return new BitapSearch(pattern, options)
}

const LogicalOperator = {
  AND: '$and',
  OR: '$or'
};

const KeyType = {
  PATH: '$path',
  PATTERN: '$val'
};

const isExpression = (query) =>
  !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);

const isPath = (query) => !!query[KeyType.PATH];

const isLeaf = (query) =>
  !isArray(query) && isObject(query) && !isExpression(query);

const convertToExplicit = (query) => ({
  [LogicalOperator.AND]: Object.keys(query).map((key) => ({
    [key]: query[key]
  }))
});

// When `auto` is `true`, the parse function will infer and initialize and add
// the appropriate `Searcher` instance
function parse(query, options, { auto = true } = {}) {
  const next = (query) => {
    let keys = Object.keys(query);

    const isQueryPath = isPath(query);

    if (!isQueryPath && keys.length > 1 && !isExpression(query)) {
      return next(convertToExplicit(query))
    }

    if (isLeaf(query)) {
      const key = isQueryPath ? query[KeyType.PATH] : keys[0];

      const pattern = isQueryPath ? query[KeyType.PATTERN] : query[key];

      if (!isString(pattern)) {
        throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key))
      }

      const obj = {
        keyId: createKeyId(key),
        pattern
      };

      if (auto) {
        obj.searcher = createSearcher(pattern, options);
      }

      return obj
    }

    let node = {
      children: [],
      operator: keys[0]
    };

    keys.forEach((key) => {
      const value = query[key];

      if (isArray(value)) {
        value.forEach((item) => {
          node.children.push(next(item));
        });
      }
    });

    return node
  };

  if (!isExpression(query)) {
    query = convertToExplicit(query);
  }

  return next(query)
}

// Practical scoring function
function computeScore(
  results,
  { ignoreFieldNorm = Config.ignoreFieldNorm }
) {
  results.forEach((result) => {
    let totalScore = 1;

    result.matches.forEach(({ key, norm, score }) => {
      const weight = key ? key.weight : null;

      totalScore *= Math.pow(
        score === 0 && weight ? Number.EPSILON : score,
        (weight || 1) * (ignoreFieldNorm ? 1 : norm)
      );
    });

    result.score = totalScore;
  });
}

function transformMatches(result, data) {
  const matches = result.matches;
  data.matches = [];

  if (!isDefined(matches)) {
    return
  }

  matches.forEach((match) => {
    if (!isDefined(match.indices) || !match.indices.length) {
      return
    }

    const { indices, value } = match;

    let obj = {
      indices,
      value
    };

    if (match.key) {
      obj.key = match.key.src;
    }

    if (match.idx > -1) {
      obj.refIndex = match.idx;
    }

    data.matches.push(obj);
  });
}

function transformScore(result, data) {
  data.score = result.score;
}

function format(
  results,
  docs,
  {
    includeMatches = Config.includeMatches,
    includeScore = Config.includeScore
  } = {}
) {
  const transformers = [];

  if (includeMatches) transformers.push(transformMatches);
  if (includeScore) transformers.push(transformScore);

  return results.map((result) => {
    const { idx } = result;

    const data = {
      item: docs[idx],
      refIndex: idx
    };

    if (transformers.length) {
      transformers.forEach((transformer) => {
        transformer(result, data);
      });
    }

    return data
  })
}

class Fuse {
  constructor(docs, options = {}, index) {
    this.options = { ...Config, ...options };

    if (
      this.options.useExtendedSearch &&
      !true
    ) {}

    this._keyStore = new KeyStore(this.options.keys);

    this.setCollection(docs, index);
  }

  setCollection(docs, index) {
    this._docs = docs;

    if (index && !(index instanceof FuseIndex)) {
      throw new Error(INCORRECT_INDEX_TYPE)
    }

    this._myIndex =
      index ||
      createIndex(this.options.keys, this._docs, {
        getFn: this.options.getFn,
        fieldNormWeight: this.options.fieldNormWeight
      });
  }

  add(doc) {
    if (!isDefined(doc)) {
      return
    }

    this._docs.push(doc);
    this._myIndex.add(doc);
  }

  remove(predicate = (/* doc, idx */) => false) {
    const results = [];

    for (let i = 0, len = this._docs.length; i < len; i += 1) {
      const doc = this._docs[i];
      if (predicate(doc, i)) {
        this.removeAt(i);
        i -= 1;
        len -= 1;

        results.push(doc);
      }
    }

    return results
  }

  removeAt(idx) {
    this._docs.splice(idx, 1);
    this._myIndex.removeAt(idx);
  }

  getIndex() {
    return this._myIndex
  }

  search(query, { limit = -1 } = {}) {
    const {
      includeMatches,
      includeScore,
      shouldSort,
      sortFn,
      ignoreFieldNorm
    } = this.options;

    let results = isString(query)
      ? isString(this._docs[0])
        ? this._searchStringList(query)
        : this._searchObjectList(query)
      : this._searchLogical(query);

    computeScore(results, { ignoreFieldNorm });

    if (shouldSort) {
      results.sort(sortFn);
    }

    if (isNumber(limit) && limit > -1) {
      results = results.slice(0, limit);
    }

    return format(results, this._docs, {
      includeMatches,
      includeScore
    })
  }

  _searchStringList(query) {
    const searcher = createSearcher(query, this.options);
    const { records } = this._myIndex;
    const results = [];

    // Iterate over every string in the index
    records.forEach(({ v: text, i: idx, n: norm }) => {
      if (!isDefined(text)) {
        return
      }

      const { isMatch, score, indices } = searcher.searchIn(text);

      if (isMatch) {
        results.push({
          item: text,
          idx,
          matches: [{ score, value: text, norm, indices }]
        });
      }
    });

    return results
  }

  _searchLogical(query) {

    const expression = parse(query, this.options);

    const evaluate = (node, item, idx) => {
      if (!node.children) {
        const { keyId, searcher } = node;

        const matches = this._findMatches({
          key: this._keyStore.get(keyId),
          value: this._myIndex.getValueForItemAtKeyId(item, keyId),
          searcher
        });

        if (matches && matches.length) {
          return [
            {
              idx,
              item,
              matches
            }
          ]
        }

        return []
      }

      const res = [];
      for (let i = 0, len = node.children.length; i < len; i += 1) {
        const child = node.children[i];
        const result = evaluate(child, item, idx);
        if (result.length) {
          res.push(...result);
        } else if (node.operator === LogicalOperator.AND) {
          return []
        }
      }
      return res
    };

    const records = this._myIndex.records;
    const resultMap = {};
    const results = [];

    records.forEach(({ $: item, i: idx }) => {
      if (isDefined(item)) {
        let expResults = evaluate(expression, item, idx);

        if (expResults.length) {
          // Dedupe when adding
          if (!resultMap[idx]) {
            resultMap[idx] = { idx, item, matches: [] };
            results.push(resultMap[idx]);
          }
          expResults.forEach(({ matches }) => {
            resultMap[idx].matches.push(...matches);
          });
        }
      }
    });

    return results
  }

  _searchObjectList(query) {
    const searcher = createSearcher(query, this.options);
    const { keys, records } = this._myIndex;
    const results = [];

    // List is Array<Object>
    records.forEach(({ $: item, i: idx }) => {
      if (!isDefined(item)) {
        return
      }

      let matches = [];

      // Iterate over every key (i.e, path), and fetch the value at that key
      keys.forEach((key, keyIndex) => {
        matches.push(
          ...this._findMatches({
            key,
            value: item[keyIndex],
            searcher
          })
        );
      });

      if (matches.length) {
        results.push({
          idx,
          item,
          matches
        });
      }
    });

    return results
  }
  _findMatches({ key, value, searcher }) {
    if (!isDefined(value)) {
      return []
    }

    let matches = [];

    if (isArray(value)) {
      value.forEach(({ v: text, i: idx, n: norm }) => {
        if (!isDefined(text)) {
          return
        }

        const { isMatch, score, indices } = searcher.searchIn(text);

        if (isMatch) {
          matches.push({
            score,
            key,
            value: text,
            idx,
            norm,
            indices
          });
        }
      });
    } else {
      const { v: text, n: norm } = value;

      const { isMatch, score, indices } = searcher.searchIn(text);

      if (isMatch) {
        matches.push({ score, key, value: text, norm, indices });
      }
    }

    return matches
  }
}

Fuse.version = '6.5.3';
Fuse.createIndex = createIndex;
Fuse.parseIndex = parseIndex;
Fuse.config = Config;

{
  Fuse.parseQuery = parse;
}

{
  register(ExtendedSearch);
}



;// CONCATENATED MODULE: ./src/Core/viewer/background.js












const background_getRootDomain = (url) => {
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    hostname = "";
  }
  const hostnameParts = hostname.split(".");
  return hostnameParts.slice(-(hostnameParts.length === 4 ? 3 : 2)).join(".");
};

const getTitleFromRootDomain = (rootDomain) => {
  let title = popularDomainsTitles[rootDomain];
  if (title) return title;

  const domainsPart = rootDomain.split(".");
  if (domainsPart.length === 2) return capitalize(domainsPart[0]);

  return capitalize(rootDomain);
};

const getDomainOrigin = (url) => {
  let origin;
  try {
    origin = new URL(url).origin;
  } catch (e) {
    origin = "";
  }
  return origin + "/";
};

const getFileUrl = (object) =>
  object.isLink ? object.url : `${constants_gateways.ipfs}/${object.cid}`;

// NOTE(amine): custom id to make sure app don't rerender when we replace optimistic data with the server's data
const createViewCustomId = ({ name, source, slatename }) => {
  if (source) return name + source;
  return name + slatename;
};

const getViewId = ({ viewer, customId }) => {
  return viewer.viewsIdsLookup[customId];
};
/** ----------------------------------------- */

const VIEWER_INITIAL_STATE = {
  objects: [],
  objectsMetadata: {},
  // NOTE(amine): { key: URL, value: id || 'savingStates.start' when saving an object (will be updated with the id when it's saved)}
  savedObjectsLookup: {},

  savedObjectsSlates: {},
  slatesLookup: {},
  slates: [],

  viewsSourcesLookup: {},
  viewsSlatesLookup: {},
  viewsIdsLookup: {},
  views: [],

  sources: {},

  settings: { isSavedViewActivated: false, isFilesViewActivated: false },

  lastFetched: null,
  isAuthenticated: false,
};

let VIEWER_INTERNAL_STORAGE;
const VIEWER_LOCAL_STORAGE_KEY = "viewer_backup";

class ViewerHandler {
  constructor() {
    this.observers = [];
  }

  onChange(callback) {
    this.observers.push(callback);
  }

  notifyChange(viewer) {
    this.observers.forEach((callback) => callback(viewer));
  }

  async _getFromLocalStorage() {
    const result = await chrome.storage.local.get([VIEWER_LOCAL_STORAGE_KEY]);
    return result[VIEWER_LOCAL_STORAGE_KEY];
  }

  async _updateStorage(viewer) {
    chrome.storage.local.set({
      [VIEWER_LOCAL_STORAGE_KEY]: viewer,
    });
  }

  async _getObjectIdFromUrl(url) {
    const viewer = await this.get();
    return viewer.savedObjectsLookup[url];
  }

  _serialize(viewer) {
    const serializedViewer = {
      objects: [],
      objectsMetadata: {},
      savedObjectsLookup: {},

      savedObjectsSlates: {},
      slatesLookup: {},
      slates: viewer.slates.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),

      viewsSourcesLookup: {},
      viewsSlatesLookup: {},
      viewsIdsLookup: {},
      views: viewer.views || [],
      settings: viewer.settings || VIEWER_INITIAL_STATE.settings,

      sources: {},
    };

    serializedViewer.views.forEach((view) => {
      const { filterBySource, filterBySlateId } = view;

      if (filterBySource) {
        const viewCustomId = createViewCustomId({
          name: view.name,
          source: filterBySource,
        });
        serializedViewer.viewsIdsLookup[viewCustomId] = view.id;
        serializedViewer.viewsSourcesLookup[filterBySource] =
          this.serializeView(view);
        return;
      }

      const slate = viewer.slates.find((slate) => slate.id === filterBySlateId);
      if (slate) {
        const viewCustomId = createViewCustomId({
          name: view.name,
          slatename: slate.slatename || slate.name,
        });
        serializedViewer.viewsIdsLookup[viewCustomId] = view.id;
        serializedViewer.viewsSlatesLookup[slate.slatename] =
          this.serializeView(view);
      }
    });

    serializedViewer.objects = viewer.library.map((object) => {
      serializedViewer.objectsMetadata[getFileUrl(object)] = {
        id: object.id,
        cid: object.cid,
      };

      if (object.isLink) {
        serializedViewer.savedObjectsLookup[object.url] = true;
      }

      const fileUrl = getFileUrl(object);
      serializedViewer.savedObjectsLookup[fileUrl] = true;

      return this._serializeObject(object);
    });

    viewer.slates.forEach((slate) => {
      const { savedObjectsSlates, slatesLookup } = serializedViewer;
      if (!slatesLookup[slate.name]) slatesLookup[slate.name] = {};

      slate.objects.forEach((object) => {
        const objectUrl = getFileUrl(object);
        slatesLookup[slate.name][objectUrl] = true;

        if (!savedObjectsSlates[objectUrl]) savedObjectsSlates[objectUrl] = [];
        savedObjectsSlates[objectUrl].push(slate.name);
      });
    });

    return serializedViewer;
  }

  _serializeObject(object) {
    if (object.isLink) {
      return {
        title: object.linkName,
        favicon: object.linkFavicon,
        url: object.url,
        rootDomain: background_getRootDomain(object.url),
        cid: object.cid,
        isLink: true,
        isSaved: true,
      };
    }

    const fileUrl = getFileUrl(object);

    return {
      title: object.name,
      rootDomain: constants_uri.domain,
      url: fileUrl,
      cid: object.cid,
      isLink: false,
      isSaved: true,
    };
  }

  serializeView({ name, filterBySource, filterBySlateId, metadata }) {
    let customId = createViewCustomId({
      name,
      source: filterBySource,
      slatename: name,
    });
    return {
      id: customId,
      name,
      type: viewsType.custom,
      filterBySource: filterBySource,
      filterBySlateId: !!filterBySlateId,
      metadata,
    };
  }

  _set(viewer) {
    this._updateStorage(viewer);
    VIEWER_INTERNAL_STORAGE = viewer;

    this.notifyChange(viewer);
    return VIEWER_INTERNAL_STORAGE;
  }

  async get() {
    if (VIEWER_INTERNAL_STORAGE) return VIEWER_INTERNAL_STORAGE;

    const localViewer = await this._getFromLocalStorage();
    if (localViewer) {
      VIEWER_INTERNAL_STORAGE = localViewer;
      return localViewer;
    }

    VIEWER_INTERNAL_STORAGE = VIEWER_INITIAL_STATE;
    return VIEWER_INTERNAL_STORAGE;
  }

  async getSavedLinksSources() {
    const createSource = (object) => {
      const rootDomain = background_getRootDomain(object.url);
      return {
        rootDomain,
        favicon: object.favicon,
        title: getTitleFromRootDomain(rootDomain),
        source: getDomainOrigin(object.url),
      };
    };

    const removeDuplicates = (sources) => {
      const duplicates = {};
      const newSources = [];
      for (let source of sources) {
        if (source.rootDomain in duplicates) continue;
        duplicates[source.rootDomain] = true;
        newSources.push(source);
      }

      return newSources;
    };

    const viewer = await this.get();
    const sources = viewer.objects.map(createSource);
    return removeDuplicates(sources);
  }

  async checkIfAuthenticated() {
    return (await this.get()).isAuthenticated;
  }

  async checkIfLinkIsSaved(url) {
    const viewer = await this.get();
    return !!viewer.savedObjectsLookup[url];
  }

  async reset() {
    this._set(VIEWER_INITIAL_STATE);
  }

  async sync({ shouldSync } = {}) {
    //NOTE(amine): only sync when there are no running actions

    const viewer = await hydrateAuthenticatedUser();

    if (viewer.data) {
      const prevViewer = await this.get();
      const serializedViewer = this._serialize({
        ...prevViewer,
        ...viewer.data,
      });
      if (shouldSync && !shouldSync()) return;
      this._set({
        ...serializedViewer,
        lastFetched: new Date().toString(),
        isAuthenticated: true,
      });
      return;
    }

    this.reset(VIEWER_INITIAL_STATE);
  }
}

const Viewer = new ViewerHandler();

class ViewerActionsHandler {
  constructor() {
    this.runningActions = [];
  }

  _registerRunningAction() {
    this.runningActions.push("");
  }

  _cleanupCleanupAction() {
    setTimeout(() => {
      this.runningActions.pop();
      if (!this.runningActions.length) {
        const shouldSync = () => !this.runningActions.length;
        Viewer.sync({ shouldSync });
      }
    }, 500);
  }

  _addObjectsToViewer({ viewer, objects }) {
    objects.forEach((object) => {
      if (object.url in viewer.savedObjectsLookup) {
        return;
      }
      viewer.savedObjectsLookup[object.url] = savingStates.start;
      viewer.objects.push({
        title: object.title,
        url: object.title,
        favicon: object.favicon,
        rootDomain: background_getRootDomain(object.url),
        isSaved: true,
      });
    });
    return viewer;
  }

  async _removeObjectsFromViewer({ viewer, objects }) {
    objects.forEach(({ url }) => {
      delete viewer.savedObjectsLookup[url];
      viewer.objects = objects.filter((object) => object.url !== url);
    });

    return viewer;
  }

  _addSlateToViewer({ viewer, slateName }) {
    viewer.slatesLookup[slateName] = {};
    viewer.slates.push({
      slatename: slateName,
      name: slateName,
      createAt: new Date().toDateString(),
    });
    return viewer;
  }

  _removeSlateFromViewer({ viewer, slateName }) {
    delete viewer.slatesLookup[slateName];

    viewer.slates = viewer.slates.filter(
      (slate) => slate.slatename !== slateName
    );
    return viewer;
  }

  _addObjectsToViewerSlate({ viewer, objects, slateName }) {
    objects.forEach(({ url }) => {
      viewer.slatesLookup[slateName][url] = true;
    });

    objects.forEach(({ url }) => {
      if (!(url in viewer.savedObjectsSlates))
        viewer.savedObjectsSlates[url] = [];
      viewer.savedObjectsSlates[url].push(slateName);
    });

    return viewer;
  }

  _removeObjectsFromViewerSlate({ viewer, objects, slateName }) {
    objects.forEach(({ url }) => {
      if (slateName in viewer.slatesLookup) {
        delete viewer.slatesLookup[slateName][url];
      }
    });

    objects.forEach(({ url }) => {
      const filterOutSlateName = (slate) => slate !== slateName;
      viewer.savedObjectsSlates[url] =
        viewer.savedObjectsSlates[url].filter(filterOutSlateName);
    });

    return viewer;
  }

  async updateViewerSettings({ isSavedViewActivated, isFilesViewActivated }) {
    let viewer = await Viewer.get();

    this._registerRunningAction();

    if (typeof isSavedViewActivated === "boolean") {
      viewer.settings.isSavedViewActivated = isSavedViewActivated;
    }

    if (typeof isFilesViewActivated === "boolean") {
      viewer.settings.isFilesViewActivated = isFilesViewActivated;
    }

    Viewer._set(viewer);

    this._cleanupCleanupAction();
  }

  /**
   * @description save a link and send saving status to new tab and the jumper
   *
   * @param {Object} Arguments
   * @param {string} Arguments.objects - objects to save
   * @param {Chrome.tab} Arguments.tab - tab to which we'll send saving status
   * @param {string} [Arguments.source="app"] - which source triggered saving, either via command or the app
   */

  async saveLink({ objects, slateName, tab, source = savingSources.app }) {
    this._registerRunningAction();

    let viewer = await Viewer.get();
    const areObjectsBeingSaved = objects.every(
      ({ url }) => viewer.savedObjectsLookup[url] === savingStates.start
    );

    if (areObjectsBeingSaved) return;

    const sendStatusUpdate = (status) => {
      if (source === savingSources.command) {
        // NOTE(amine): you can only save one object via command
        const { url, title, favicon } = objects[0];
        chrome.tabs.sendMessage(parseInt(tab.id), {
          type: viewer_messages.savingStatus,
          data: { savingStatus: status, url, title, favicon, source },
        });
      }
    };

    sendStatusUpdate(savingStates.start);

    const objectsToBeSaved = objects.filter(
      ({ url }) => !(url in viewer.savedObjectsLookup)
    );

    viewer = this._addObjectsToViewer({
      viewer,
      objects: objectsToBeSaved,
    });

    if (slateName) {
      viewer = this._addObjectsToViewerSlate({
        viewer,
        objects: objectsToBeSaved,
        slateName,
      });
    }
    Viewer._set(viewer);

    let payload = {};
    payload.urls = objectsToBeSaved.map(({ url }) => url);
    if (slateName) {
      const slatePayload = viewer.slates.find(
        (slate) => slate.name === slateName
      );
      payload.slate = slatePayload;
    }

    const response = await createLink(payload);

    if (!response || response.error) {
      sendStatusUpdate(savingStates.failed);
      let viewer = await Viewer.get();
      if (slateName) {
        viewer = this._removeObjectsFromViewerSlate({
          viewer,
          objects: objectsToBeSaved,
          slateName,
        });
      }
      viewer = this._removeObjectsFromViewer({
        viewer: viewer,
        objects: objectsToBeSaved,
      });
      Viewer._set(viewer);
      return;
    }

    sendStatusUpdate(savingStates.done);

    this._cleanupCleanupAction();
  }

  async addObjectsToSlate({ slateName, objects }) {
    let viewer = await Viewer.get();
    if (!(slateName in viewer.slatesLookup)) {
      return;
    }

    viewer = this._addObjectsToViewerSlate({
      viewer,
      objects,
      slateName,
    });
    Viewer._set(viewer);

    const filesPayload = objects.map(({ url }) => ({
      id: viewer.objectsMetadata[url].id,
      cid: viewer.objectsMetadata[url].cid,
    }));

    const slatePayload = viewer.slates.find(
      (slate) => slate.name === slateName
    );

    const response = await saveCopy({
      files: filesPayload,
      slate: slatePayload,
    });

    if (!response || response.error) {
      viewer = await Viewer.get();
      viewer = this._removeObjectsFromViewerSlate({
        viewer,
        objects,
        slateName,
      });
      Viewer._set(viewer);
    }

    return;
  }

  async removeObjectsFromSlate({ slateName, objects }) {
    let viewer = await Viewer.get();
    if (!(slateName in viewer.slatesLookup)) {
      return;
    }

    const filesIdsPayload = objects.map(
      ({ url }) => viewer.objectsMetadata[url].id
    );

    const slatePayload = viewer.slates.find(
      (slate) => slate.name === slateName
    );

    viewer = await this._removeObjectsFromViewerSlate({
      viewer,
      objects,
      slateName,
    });

    const isSlateEmpty =
      Object.keys(viewer.slatesLookup[slateName]).length === 0;
    // NOTE(amine): if the request fails, we'll use oldSlate to add that slate back
    let oldSlate;
    if (isSlateEmpty) {
      oldSlate = viewer.slates.find((slate) => slate.slatename === slateName);
      viewer = this._removeSlateFromViewer({ viewer, slateName });
    }

    Viewer._set(viewer);

    const response = await removeFileFromSlate({
      ids: filesIdsPayload,
      slateId: slatePayload.id,
    });

    if (!response || response.error) {
      viewer = await this.get();
      if (isSlateEmpty) {
        viewer.slates.push(oldSlate);
        oldSlate.objects.forEach((object) => {
          const objectUrl = getFileUrl(object);
          viewer.slatesLookup[slateName][objectUrl] = true;
        });
      }
      viewer = this._addObjectsToViewerSlate({
        viewer,
        objects,
        slateName,
      });
      Viewer._set(viewer);
    }

    return;
  }

  async createSlate({ slateName, objects }) {
    let viewer = await Viewer.get();
    if (slateName in viewer.slatesLookup) return;

    this._registerRunningAction();

    viewer = this._addSlateToViewer({ viewer, slateName });
    viewer = this._addObjectsToViewerSlate({
      viewer,
      objects,
      slateName,
    });
    Viewer._set(viewer);

    const response = await createSlate({
      name: slateName,
      isPublic: false,
    });

    if (!response || response.error) {
      let viewer = await Viewer.get();
      viewer = this._removeObjectsFromViewerSlate({
        viewer,
        objects,
        slateName,
      });
      viewer = this._removeSlateFromViewer({ viewer, slateName });
      Viewer._set(viewer);
      return;
    } else {
      const viewer = await Viewer.get();
      viewer.slates = viewer.slates.filter(
        (slate) => slate.slatename !== slateName
      );
      viewer.slates.unshift(response.slate);
      Viewer._set(viewer);
    }

    const savedObjects = [];
    const unsavedObjects = [];
    for (let object of objects) {
      if (await Viewer.checkIfLinkIsSaved(object.url)) {
        savedObjects.push(object);
        continue;
      }
      unsavedObjects.push(object);
    }

    this._cleanupCleanupAction();

    Promise.all([
      ViewerActions.addObjectsToSlate({
        objects: savedObjects,
        slateName: slateName,
      }),
      ViewerActions.saveLink({
        objects: unsavedObjects,
        slateName,
      }),
    ]);
  }

  _addViewToViewer({ viewer, name, filterBySource, filterBySlateId, favicon }) {
    const newView = {
      id: esm_browser_v4(),
      createdAt: "",
      updatedAt: "",
      metadata: {},
    };

    if (filterBySlateId) {
      const customId = createViewCustomId({ name, slatename: name });
      viewer.viewsIdsLookup[customId] = newView.id;

      viewer.viewsSlatesLookup[name] = Viewer.serializeView({
        ...newView,
        name,
        filterBySlateId: !!filterBySlateId,
      });
      viewer.views.push({
        ...newView,
        name,
        filterBySlateId,
      });
      return viewer;
    }

    const customId = createViewCustomId({ name, source: filterBySource });
    viewer.viewsIdsLookup[customId] = newView.id;

    const rootDomain = background_getRootDomain(filterBySource);
    viewer.viewsSourcesLookup[filterBySource] = Viewer.serializeView({
      ...newView,
      name: getTitleFromRootDomain(rootDomain),
      filterBySource: !!filterBySource,
      metadata: { favicon },
    });
    viewer.views.push({
      ...newView,
      name: getTitleFromRootDomain(rootDomain),
      filterBySource,
      metadata: { favicon },
    });

    return viewer;
  }

  _removeViewFromViewer({ viewer, customId }) {
    let id = getViewId({ viewer, customId });
    const view = viewer.views.find((view) => view.id === id);
    if (!view) return;

    if (view.filterBySource) {
      delete viewer.viewsSourcesLookup[view.filterBySource];
    } else {
      delete viewer.viewsSlatesLookup[view.filterBySlateId];
    }

    delete viewer.viewsIdsLookup[customId];

    viewer.views = viewer.views.filter((item) => item.id !== view.id);

    return viewer;
  }

  async createView({ slateName, source }) {
    this._registerRunningAction();
    let viewer = await Viewer.get();

    let name;
    let filterBySlateId;
    let filterBySource;
    let metadata = {};
    let customId;

    if (slateName) {
      customId = createViewCustomId({ name, slatename: name });
      name = slateName;
      const slate = viewer.slates.find(
        (slate) => slate.slatename === slateName || slate.name === slateName
      );
      filterBySlateId = slate.id;
    } else {
      customId = createViewCustomId({ name, source });
      const rootDomain = background_getRootDomain(source);
      name = getTitleFromRootDomain(rootDomain);
      filterBySource = source;

      const sources = await Viewer.getSavedLinksSources();
      const favicon =
        sources.find((sourceData) => sourceData.source === source)?.favicon ||
        undefined;
      metadata = { favicon };
    }

    viewer = this._addViewToViewer({
      viewer,
      name,
      filterBySource,
      filterBySlateId,
      favicon: metadata.favicon,
    });
    Viewer._set(viewer);

    const response = await createView({
      name,
      metadata: metadata,
      filterBySlateId,
      filterBySource,
    });

    if (!response || response.error) {
      let viewer = await Viewer.get();
      viewer = this._removeViewFromViewer({ viewer, customId });
      Viewer._set(viewer);
    }

    this._cleanupCleanupAction();
  }

  async removeView({ customId }) {
    this._registerRunningAction();

    let viewer = await Viewer.get();

    const viewId = getViewId({ viewer, customId });
    const deletedView = viewer.views.find((view) => view.id === viewId);
    if (!deletedView) return;

    viewer = this._removeViewFromViewer({ viewer, customId });
    Viewer._set(viewer);

    const response = await removeView({
      id: viewId,
    });

    if (!response || response.error) {
      let viewer = await Viewer.get();
      viewer = this._addViewToViewer({
        viewer,
        name: deletedView.name,
        filterBySource: deletedView.filterBySource,
        filterBySlateId: deletedView.filterBySlateId,
        favicon: deletedView.metadata.favicon,
      });
      Viewer._set(viewer);
    }

    this._cleanupCleanupAction();
  }

  async search(query) {
    const response = await search({
      types: ["FILE", "SLATE"],
      query,
      grouped: true,
    });

    if (!response || response.error) {
      return;
    }

    const { slates, files: objects } = response.results;
    const serializedObjects = [];
    const duplicates = {};

    for (let object of objects) {
      // NOTE(amine): due to a bug (when deleting a file, we didn't delete it from search index)
      //              we get duplicates and deleted files in search result
      const url = getFileUrl(object);
      const isSaved = await Viewer.checkIfLinkIsSaved(object.url);
      if (url in duplicates || !isSaved) {
        continue;
      }
      duplicates[object.url] = true;
      serializedObjects.push(Viewer._serializeObject(object));
    }
    return { slates: slates || [], files: serializedObjects };
  }

  async searchSlates(query) {
    const viewer = await Viewer.get(query);
    const options = {
      findAllMatches: true,
      shouldSort: true,
      threshold: 0.5,
      keys: ["slatename", "name"],
    };

    const fuse = new Fuse(viewer.slates, options);
    const results = fuse.search(query);

    return results.map(({ item: { slatename, name } }) => name || slatename);
  }
}

const ViewerActions = new ViewerActionsHandler();

/** ------------ Event listeners ------------- */

Viewer.onChange(async (viewerData) => {
  const activeTab = await Tabs.getActive();
  if (!activeTab) return;
  const slates = viewerData.slates.map(({ name }) => name);
  const views = viewerData.views.map(Viewer.serializeView);
  const {
    savedObjectsLookup,
    savedObjectsSlates,
    slatesLookup,
    viewsSlatesLookup,
    viewsSourcesLookup,
    settings,
  } = viewerData;

  chrome.tabs.sendMessage(parseInt(activeTab.id), {
    type: viewer_messages.updateViewer,
    data: {
      slates,
      settings,
      savedObjectsLookup,
      savedObjectsSlates,
      slatesLookup,
      views,
      viewsSlatesLookup,
      viewsSourcesLookup,
    },
  });
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command == commands.directSave) {
    if (await Viewer.checkIfAuthenticated()) {
      ViewerActions.saveLink({
        objects: [{ url: tab.url, title: tab.title, favicon: tab.favIconUrl }],
        tab,
        source: savingSources.command,
      });
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  Viewer.sync();
});

chrome.cookies.onChanged.addListener((e) => {
  if (e.cookie.domain !== constants_uri.domain) return;

  if (e.removed && (e.cause === "expired_overwrite" || e.cause === "expired")) {
    Viewer.reset();
  }

  if (!e.removed && e.cause === "explicit") {
    Viewer.sync();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === viewer_messages.updateViewerSettings) {
    ViewerActions.updateViewerSettings({
      isSavedViewActivated: request.isSavedViewActivated,
      isFilesViewActivated: request.isFilesViewActivated,
    }).then(sendResponse);
    return true;
  }

  if (request.type === viewer_messages.getSavedLinksSourcesRequest) {
    Viewer.getSavedLinksSources().then(sendResponse);
    return true;
  }

  if (request.type === viewer_messages.saveLink) {
    ViewerActions.saveLink({
      objects: request.objects,
      tab: sender.tab,
      source: request.source,
    }).then(sendResponse);
    return true;
  }

  if (request.type === viewer_messages.addObjectsToSlate) {
    const handleAddObjectsToSlate = async ({ objects, slateName }) => {
      const savedObjects = [];
      const unsavedObjects = [];
      for (let object of objects) {
        if (await Viewer.checkIfLinkIsSaved(object.url)) {
          savedObjects.push(object);
          continue;
        }
        unsavedObjects.push(object);
      }

      Promise.all([
        ViewerActions.addObjectsToSlate({
          objects: savedObjects,
          slateName: slateName,
        }),
        ViewerActions.saveLink({
          objects: unsavedObjects,
          slateName,
        }),
      ]);
    };

    handleAddObjectsToSlate({
      objects: request.objects,
      slateName: request.slateName,
    }).then(sendResponse);

    return true;
  }

  if (request.type === viewer_messages.createSlate) {
    ViewerActions.createSlate({
      objects: request.objects,
      slateName: request.slateName,
    }).then(sendResponse);
    return true;
  }

  if (request.type === viewer_messages.removeObjectsFromSlate) {
    ViewerActions.removeObjectsFromSlate({
      objects: request.objects,
      slateName: request.slateName,
    }).then(sendResponse);
    return true;
  }

  if (request.type === viewer_messages.loadViewerDataRequest) {
    const getInitialData = async () => {
      const isAuthenticated = await Viewer.checkIfAuthenticated();

      if (!isAuthenticated) {
        return { isAuthenticated };
      }

      const openTabs = await Windows.getAllTabs();

      const { allOpenFeedKeys, allOpenFeed } = constructWindowsFeed({
        tabs: openTabs,
        activeTabId: sender.tab.id,
        activeWindowId: sender.tab.windowId,
      });

      const viewerData = await Viewer.get();

      const slates = viewerData.slates.map(({ name }) => name);

      const views = viewerData.views.map(Viewer.serializeView);

      const {
        savedObjectsLookup,
        savedObjectsSlates,
        slatesLookup,
        viewsSourcesLookup,
        viewsSlatesLookup,
        settings,
      } = viewerData;

      Viewer.sync();

      const response = {
        ...viewerInitialState,
        isAuthenticated,
        settings,

        slates,
        savedObjectsLookup,
        savedObjectsSlates,
        slatesLookup,

        views,
        viewsSourcesLookup,
        viewsSlatesLookup,

        windows: {
          data: {
            allOpenFeedKeys,
            allOpenFeed,
          },
          params: {
            activeWindowId: sender.tab.windowId,
            activeTabId: sender.tab.id,
          },
        },
      };

      // NOTE(amine): if there is only one tab open, preload recent view
      // if (response.windows.data.allOpen.length === 1) {
      //   response.recent = await browserHistory.getChunk();
      //   response.initialView = viewsType.recent;
      // }

      return response;
    };

    getInitialData().then(sendResponse);
    return true;
  }
});

;// CONCATENATED MODULE: ./src/Core/browser/background.js






const browser_background_getRootDomain = (url) => {
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    hostname = "";
  }
  const hostnameParts = hostname.split(".");
  return hostnameParts.slice(-(hostnameParts.length === 4 ? 3 : 2)).join(".");
};

const removeDuplicatesFromSearchResults = (result) => {
  const isAlreadyAdded = {};

  const visitWithSameTitle = {};
  const doesVisitExistWithSameTitle = (visit) =>
    `${browser_background_getRootDomain(visit.url)}-${visit.title}` in visitWithSameTitle;
  const addVisitToDuplicateList = (visit) =>
    visitWithSameTitle[`${browser_background_getRootDomain(visit.url)}-${visit.title}`].push(
      visit
    );
  const createVisitDuplicate = (visit) => {
    visitWithSameTitle[`${browser_background_getRootDomain(visit.url)}-${visit.title}`] = [];
    return visitWithSameTitle[`${browser_background_getRootDomain(visit.url)}-${visit.title}`];
  };

  const MAX_SEARCH_RESULT = 300;
  const cleanedResult = [];
  for (let { item } of result) {
    for (let visit of item.visits) {
      if (cleanedResult.length > MAX_SEARCH_RESULT) {
        return cleanedResult;
      }

      if (visit.url in isAlreadyAdded) continue;

      isAlreadyAdded[visit.url] = true;

      if (doesVisitExistWithSameTitle(visit)) {
        addVisitToDuplicateList(visit);
        continue;
      }

      cleanedResult.push({
        ...visit,
        relatedVisits: createVisitDuplicate(visit),
      });
    }
  }
  return cleanedResult;
};

/** ----------------------------------------- */

const Session = {
  createVisit: (historyItem, visit) => ({
    ...visit,
    title: historyItem.title,
    url: historyItem.url,
    rootDomain: browser_background_getRootDomain(historyItem.url),
    favicon:
      "https://s2.googleusercontent.com/s2/favicons?domain_url=" +
      historyItem.url,
  }),
  create: (visit) => ({
    id: Math.round(new Date().getTime()),
    title: visit.title,
    visitTime: visit.visitTime,
    visits: [visit],
  }),
  addVisitToSession: ({ session, visit }) => {
    session.visits.unshift(visit);
    session.visitTime = visit.visitTime;
  },
};

/** ----------------------------------------- */

let BROWSER_HISTORY_INTERNAL_STORAGE;
const HISTORY_LOCAL_STORAGE_KEY = "history_backup";

class BrowserHistory {
  _set(history) {
    BROWSER_HISTORY_INTERNAL_STORAGE = history;
    return BROWSER_HISTORY_INTERNAL_STORAGE;
  }

  async _buildHistory() {
    const getHistoryItems = async () => {
      const microsecondsPerMonth = 1000 * 60 * 60 * 24 * 31;
      const twoMonthsAgo = new Date().getTime() - microsecondsPerMonth * 2;
      return await chrome.history.search({
        text: "",
        startTime: twoMonthsAgo,
        maxResults: 2_147_483_647,
      });
    };

    const getHistoryVisits = async (historyItems) => {
      const visits = [];
      for (const historyItem of historyItems) {
        const urlVisits = await chrome.history.getVisits({
          url: historyItem.url,
        });

        for (const item of urlVisits) {
          visits.push(Session.createVisit(historyItem, item));
        }
      }

      return visits.sort((a, b) => a.visitTime - b.visitTime);
    };

    const createSessionsList = (visits) => {
      const sessions = [];
      const microsecondsPerMonth = 1000 * 60 * 60 * 24 * 31;
      const isVisitedInTheCurrentMonth = (visit) =>
        +visit.visitTime > new Date().getTime() - microsecondsPerMonth;

      for (let currentVisit of visits) {
        if (currentVisit.referringVisitId === "0") {
          if (isVisitedInTheCurrentMonth(currentVisit)) {
            sessions.push(Session.create(currentVisit));
          }
        } else {
          let isFound = false;
          for (let i = 0; i < sessions.length; i++) {
            for (let j = 0; j < sessions[i].visits.length; j++) {
              // If there is a session with the same referral id
              // append the current visit to that session
              if (
                currentVisit.referringVisitId === sessions[i].visits[j].visitId
              ) {
                Session.addVisitToSession({
                  session: sessions[i],
                  visit: currentVisit,
                });
                isFound = true;
                break;
              }
            }
            if (isFound) break;
          }

          if (!isFound && isVisitedInTheCurrentMonth(currentVisit))
            sessions.push(Session.create(currentVisit));
        }
      }

      return sessions.sort((a, b) => b.visitTime - a.visitTime);
    };

    const historyItems = await getHistoryItems();
    const visits = await getHistoryVisits(historyItems);
    const sessions = createSessionsList(visits);

    return sessions;
  }

  async _updateLocalStorage() {
    chrome.storage.local.set({
      [HISTORY_LOCAL_STORAGE_KEY]: await browserHistory.get(),
    });
  }

  async _getFromLocalStorage() {
    const result = await chrome.storage.local.get([HISTORY_LOCAL_STORAGE_KEY]);
    return result[HISTORY_LOCAL_STORAGE_KEY];
  }

  async addVisit(visit) {
    const history = await browserHistory.get();

    if (visit.referringVisitId === "0") {
      history.unshift(Session.create(visit));
    } else {
      let isFound = false;
      for (let i = 0; i < history.length; i++) {
        for (let j = 0; j < history[i].visits.length; j++) {
          // If there is a visit im the current session with the same referral id
          // append the current visit to that session's visits
          if (visit.referringVisitId === history[i].visits[j].visitId) {
            Session.addVisitToSession({ session: history[i], visit });
            isFound = true;
            break;
          }
        }
        if (isFound) break;
      }

      if (!isFound) history.unshift(Session.create(visit));
    }

    history.sort((a, b) => b.visitTime - a.visitTime);
    await this._updateLocalStorage();
  }

  async get() {
    if (BROWSER_HISTORY_INTERNAL_STORAGE) {
      return BROWSER_HISTORY_INTERNAL_STORAGE;
    }
    const localHistory = await this._getFromLocalStorage();
    if (localHistory) {
      return this._set(localHistory);
    }
    const history = await this._buildHistory();
    this._set(history);
    await this._updateLocalStorage();
    return history;
  }

  async removeSessionsOlderThanOneMonth() {
    const history = BROWSER_HISTORY_INTERNAL_STORAGE;
    if (!history) return;

    const isMonthOld = (date) => {
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

      const now = new Date();
      const timeDiffInMs = now.getTime() - date.getTime();

      if (timeDiffInMs >= thirtyDaysInMs) {
        return true;
      } else {
        return false;
      }
    };

    for (let i = history.length - 1; i >= 0; i--) {
      const currentSession = history[i];
      if (isMonthOld(currentSession.visitTime)) {
        history.pop();
      } else {
        break;
      }
    }
    await this._updateLocalStorage();
  }

  async search(query) {
    const options = {
      findAllMatches: true,
      includeMatches: true,
      minMatchCharLength: query.length,
      keys: ["visits.url", "visits.title"],
    };

    const history = await this.get();
    const fuse = new Fuse(history, options);

    const cleanedResult = removeDuplicatesFromSearchResults(fuse.search(query));

    return cleanedResult.map((item) => ({
      title: item.title,
      favicon: item.favIconUrl,
      url: item.url,
      rootDomain: item.rootDomain,
    }));
  }

  async getRelatedLinks(url) {
    const getVisitsFromSearchResult = (searchResult) => {
      const result = [];

      for (let { item, matches } of searchResult) {
        const { visits } = item;
        matches.forEach(({ refIndex }) => {
          result.push(visits[refIndex]);
        });
      }

      return result;
    };

    const removeDuplicatesFromVisits = (visits) => {
      const duplicates = {};

      const cleanedVisits = [];
      for (let visit of visits) {
        if (visit.url in duplicates) continue;
        duplicates[visit.url] = true;
        cleanedVisits.push(visit);
      }

      const result = [];
      const visitsWithSameTitle = {};
      for (let item of cleanedVisits) {
        if (item.title in visitsWithSameTitle) {
          visitsWithSameTitle[item.title].push({
            title: item.title,
            favicon: item?.favIconUrl || item.favicon,
            url: item.url,
            rootDomain: item.rootDomain,
          });
          continue;
        } else {
          visitsWithSameTitle[item.title] = [];
        }

        result.push({
          ...item,
          relatedVisits: visitsWithSameTitle[item.title],
        });
      }

      return result;
    };

    const options = {
      findAllMatches: true,
      threshold: 0.0,
      includeMatches: true,
      keys: ["visits.url"],
    };
    const history = await this.get();
    const historyFuse = new Fuse(history, options);
    const historySearchResult = historyFuse.search(url);
    const visitsResult = getVisitsFromSearchResult(historySearchResult);

    const savedFilesFuseOptions = {
      findAllMatches: true,
      threshold: 0.0,
      keys: ["url"],
    };
    const savedFiles = await Viewer.get();
    const savedFilesFuse = new Fuse(savedFiles.objects, savedFilesFuseOptions);
    const savedFilesSearchResult = savedFilesFuse.search(url);

    const cleanedVisits = removeDuplicatesFromVisits([
      ...savedFilesSearchResult.map(({ item }) => item),
      ...visitsResult,
    ]);

    return cleanedVisits.map((item) => ({
      title: item.title,
      favicon: item?.favIconUrl || item.favicon,
      url: item.url,
      rootDomain: item.rootDomain,
      relatedVisits: item.relatedVisits,
    }));
  }

  async getChunk(startIndex = 0, endIndex) {
    const history = await browserHistory.get();

    const historyChunk = history.slice(startIndex, endIndex);

    for (let session of historyChunk) {
      session.visits = await Promise.all(
        session.visits.map(async (visit) => ({
          ...visit,
          isSaved: await Viewer.checkIfLinkIsSaved(visit.url),
        }))
      );
    }

    return {
      history: historyChunk,
      canFetchMore: startIndex + historyChunk.length !== history.length,
    };
  }
}

const browserHistory = new BrowserHistory();

/** ----------------------------------------- */

const Tabs = {
  create: (tab) => ({
    id: tab.id,
    windowId: tab.windowId,
    title: tab.title,
    favicon: tab.favIconUrl,
    url: tab.url,
    rootDomain: browser_background_getRootDomain(tab.url),
  }),
  getActive: async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  },
};

const Windows = {
  getAllTabsInWindow: async (windowId) => {
    const window = await chrome.windows.get(windowId, { populate: true });
    const tabs = window.tabs.map(Tabs.create);
    return tabs;
  },
  getAllTabs: async () => {
    const windows = await chrome.windows.getAll({ populate: true });
    const tabs = windows.flatMap((window) => window.tabs.map(Tabs.create));
    return tabs;
  },
  getAll: async () => {
    const windows = await chrome.windows.getAll({ populate: true });
    return windows.map((window) => ({
      id: window.id,
      tabs: window.tabs.map(Tabs.create),
    }));
  },
  search: async (query, { windowId } = {}) => {
    const options = {
      findAllMatches: true,
      includeMatches: true,
      minMatchCharLength: query.length,
      keys: ["url", "title"],
    };

    const windows = await chrome.windows.getAll({ populate: true });
    let tabs = windows.flatMap(({ tabs }) => tabs);
    if (windowId) {
      tabs = tabs.filter((tab) => tab.windowId === windowId);
    }

    const fuse = new Fuse(tabs, options);
    const searchResult = fuse.search(query);
    return searchResult.map(({ item }) => Tabs.create(item));
  },
};

/** ------------ Event listeners ------------- */

chrome.runtime.onStartup.addListener(() => {
  const ADaysInMs = 24 * 60 * 60 * 1000;
  setInterval(browserHistory.removeSessionsOlderThanOneMonth, ADaysInMs);
});

chrome.tabs.onRemoved.addListener(async () => {
  const activeTab = await Tabs.getActive();

  if (activeTab) {
    const openTabs = await Windows.getAllTabs();

    chrome.tabs.sendMessage(parseInt(activeTab.id), {
      type: messages.windowsUpdate,
      data: { openTabs, activeTabId: activeTab.id },
    });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status == "complete") {
    const activeTab = await Tabs.getActive();
    if (activeTab) {
      const openTabs = await Windows.getAllTabs();

      chrome.tabs.sendMessage(parseInt(activeTab.id), {
        type: messages.windowsUpdate,
        data: { openTabs, activeTabId: activeTab.id },
      });
    }

    const historyItem = { url: tab.url, title: tab.title };
    const visits = await chrome.history.getVisits({
      url: historyItem.url,
    });
    if (visits.length === 0) return;

    const latestVisit = visits[visits.length - 1];

    const sessionVisit = Session.createVisit(historyItem, latestVisit);
    await browserHistory.addVisit(sessionVisit);
  }
});

chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
  if (!bookmark.url) return;

  if (await Viewer.checkIfAuthenticated()) {
    const activeTab = await Tabs.getActive();
    ViewerActions.saveLink({
      objects: [{ url: bookmark.url, title: bookmark.title }],
      tab: activeTab,
      source: savingSources.command,
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === messages.historyChunkRequest) {
    browserHistory
      .getChunk(
        request.startIndex,
        request.startIndex + (request.startIndex === 0 ? 200 : 500)
      )
      .then(sendResponse);

    return true;
  }

  if (request.type === messages.relatedLinksRequest) {
    console.log(`RELATED LINKS FOR ${request.url}`);
    browserHistory.getRelatedLinks(request.url).then((result) => {
      sendResponse({
        result,
        url: request.url,
      });
    });
    return true;
  }
});

;// CONCATENATED MODULE: ./src/Core/navigation/index.js
const navigation_messages = {
  openExtensionJumperRequest: "OPEN_EXTENSION_JUMPER_REQUEST",
  closeExtensionJumperRequest: "CLOSE_EXTENSION_JUMPER_REQUEST",

  openURLsRequest: "OPEN_URLS_REQUEST",

  createGroup: "BROWSER_CREATE_GROUP",

  closeTabs: "CLOSE_TABS",
};

/* -----------------------------------------------------------------------------------------------*/

const ADDRESS_BAR_ELEMENT_ID = "slate-extension-address-bar";

const ADDRESS_BAR_CURRENT_URL_ATTRIBUTE = "data-current-url";

const createAddressBarElement = () => {
  const element = document.createElement("div");
  element.setAttribute("id", ADDRESS_BAR_ELEMENT_ID);
  document.body.appendChild(element);
};
const getAddressBarElement = () =>
  document.getElementById(ADDRESS_BAR_ELEMENT_ID);

const getAddressBarUrl = () => {
  const element = document.getElementById(ADDRESS_BAR_ELEMENT_ID);
  return element.getAttribute(ADDRESS_BAR_CURRENT_URL_ATTRIBUTE) || "/";
};
const updateAddressBarUrl = (url) => {
  const element = document.getElementById(ADDRESS_BAR_ELEMENT_ID);
  element.setAttribute(ADDRESS_BAR_CURRENT_URL_ATTRIBUTE, url);
};

;// CONCATENATED MODULE: ./src/Core/navigation/background.js





const handleOpenUrlsRequests = async ({ urls, query, sender }) => {
  if (query?.newWindow) {
    await chrome.windows.create({ focused: true, url: urls });
    return;
  }

  if (query?.tabId) {
    await chrome.windows.update(query.windowId, { focused: true });
    await chrome.tabs.update(query.tabId, { active: true });
    return;
  }

  for (let url of urls) {
    await chrome.tabs.create({ windowId: sender.tab.windowId, url });
  }
};

const createGroupFromUrls = async ({ urls, windowId, title }) => {
  const createdTabs = await Promise.all(
    urls.map(async (url) =>
      chrome.tabs.create({ url, windowId, active: false })
    )
  );

  const createdGroupId = await chrome.tabs.group({
    createProperties: { windowId },
    tabIds: createdTabs.map((tab) => tab.id),
  });

  chrome.tabGroups.update(createdGroupId, { title, collapsed: true });
};

/** ------------ Event Listeners ------------- */

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === navigation_messages.closeTabs) {
    request.tabsId.forEach((tabId) => {
      chrome.tabs.remove(tabId);
    });
    return true;
  }

  if (request.type === navigation_messages.openURLsRequest) {
    await handleOpenUrlsRequests({
      urls: request.urls,
      query: request.query,
      sender,
    });
    return true;
  }

  if (request.type === navigation_messages.createGroup) {
    console.log(`Create tabs group with title: ${request.title}`);
    createGroupFromUrls({
      urls: request.urls,
      windowId: sender.tab.windowId,
      title: request.title,
    }).then(sendResponse);
    return true;
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  chrome.tabs.sendMessage(parseInt(tab.id), {
    type: navigation_messages.openExtensionJumperRequest,
    data: { url: "/" },
  });
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command == constants_commands.openApp) {
    chrome.tabs.sendMessage(parseInt(tab.id), {
      type: navigation_messages.openExtensionJumperRequest,
      data: { url: "/" },
    });
  }

  if (command == constants_commands.openAppOnSlates) {
    const urls = [
      { url: tab.url, title: tab.title, rootDomain: getRootDomain(tab.url) },
    ];
    const urlsQuery = encodeURIComponent(JSON.stringify(urls));
    chrome.tabs.sendMessage(parseInt(tab.id), {
      type: navigation_messages.openExtensionJumperRequest,
      data: { url: `/slates?urls=${urlsQuery}` },
    });
  }

  if (command == constants_commands.openSlate) {
    chrome.tabs.create({
      url: `${uri.hostname}/_/data&extension=true&id=${tab.id}`,
    });
  }
});

;// CONCATENATED MODULE: ./src/Core/views/background.js






class ViewsHandler {
  async search({ query, view }) {
    if (view.type === viewsType.allOpen) {
      return Windows.search(query);
    }

    if (view.type === viewsType.recent) {
      return await browserHistory.search(query);
    }

    if (view.type === viewsType.custom) {
      const handleFetchCustomFeed = async (viewCustomId) => {
        const viewer = await Viewer.get();
        const viewId = getViewId({ viewer, customId: viewCustomId });
        const view = viewer.views.find((view) => view.id === viewId);

        if (!view) return [];

        if (view.filterBySource) {
          const feed = await browserHistory.getRelatedLinks(
            view.filterBySource
          );
          return feed;
        }

        if (view.filterBySlateId) {
          const slate = viewer.slates.find(
            (slate) => slate.id === view.filterBySlateId
          );

          if (!slate) return [];

          return slate.objects.map(Viewer._serializeObject);
        }
      };

      const viewsResult = await handleFetchCustomFeed(view.id);
      const options = {
        findAllMatches: true,
        shouldSort: true,
        threshold: 0.5,
        keys: ["url", "title"],
      };

      const fuse = new Fuse(viewsResult, options);
      const results = fuse.search(query);

      return results.map(({ item }) => item);
    }
  }
}

const Views = new ViewsHandler();

/** ------------ Event listeners ------------- */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === views_messages.viewFeedRequest) {
    console.log(`VIEW FOR`, request.view);

    const handleFetchCustomFeed = async (viewCustomId) => {
      const viewer = await Viewer.get();
      const viewId = getViewId({ viewer, customId: viewCustomId });
      const view = viewer.views.find((view) => view.id === viewId);

      if (!view) return [];

      if (view.filterBySource) {
        const feed = await browserHistory.getRelatedLinks(view.filterBySource);

        return feed;
      }

      if (view.filterBySlateId) {
        const slate = viewer.slates.find(
          (slate) => slate.id === view.filterBySlateId
        );

        if (!slate) return [];

        return slate.objects.map(Viewer._serializeObject);
      }
    };

    if (request.view.type === viewsType.custom) {
      handleFetchCustomFeed(request.view.id).then((res) =>
        sendResponse({
          result: res,
          view: request.view,
        })
      );
      return true;
    }

    if (request.view.type === viewsType.saved) {
      Viewer.get().then((res) =>
        sendResponse({
          result: res.objects.filter((object) => object.isLink),
          view: request.view,
        })
      );
      return true;
    }

    if (request.view.type === viewsType.files) {
      Viewer.get().then((res) =>
        sendResponse({
          result: res.objects.filter((object) => !object.isLink),
          view: request.view,
        })
      );
      return true;
    }
  }

  if (request.type === views_messages.createViewByTag) {
    ViewerActions.createView({ slateName: request.slateName }).then(
      sendResponse
    );
    return true;
  }

  if (request.type === views_messages.createViewBySource) {
    ViewerActions.createView({ source: request.source }).then(sendResponse);
    return true;
  }

  if (request.type === views_messages.removeView) {
    ViewerActions.removeView({ customId: request.id }).then(sendResponse);
    return true;
  }

  if (request.type === views_messages.searchQueryRequest) {
    const searchHandler = async ({ query, view }) => {
      let slates = [];
      const searchFeedKeys = ["Saved"];
      const searchFeed = {};

      const handleSlatesSearch = async () => {
        slates = await ViewerActions.searchSlates(query);
      };

      const handleSavedFilesSearch = async () => {
        const savedSearchResult = await ViewerActions.search(query);
        searchFeed["Saved"] = savedSearchResult.files;
      };

      const handleViewsSearch = async () => {
        if (view.type !== viewsType.saved && view.type !== viewsType.files) {
          const viewsSearchResult = await Views.search({
            view,
            query,
          });
          searchFeedKeys.push(view.name);
          searchFeed[view.name] = viewsSearchResult;
        }
      };

      await Promise.all([
        handleSavedFilesSearch(),
        handleSlatesSearch(),
        handleViewsSearch(),
      ]);

      return { query, slates, searchFeedKeys, searchFeed };
    };

    searchHandler({
      query: request.query,
      view: request.view,
    }).then(sendResponse);

    return true;
  }
});

;// CONCATENATED MODULE: ./src/background.js





/******/ })()
;