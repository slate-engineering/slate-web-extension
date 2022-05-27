/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 418:
/***/ (function(module) {

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ 408:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;
/** @license React v17.0.2
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l=__webpack_require__(418),n=60103,p=60106;__webpack_unused_export__=60107;__webpack_unused_export__=60108;__webpack_unused_export__=60114;var q=60109,r=60110,t=60112;__webpack_unused_export__=60113;var u=60115,v=60116;
if("function"===typeof Symbol&&Symbol.for){var w=Symbol.for;n=w("react.element");p=w("react.portal");__webpack_unused_export__=w("react.fragment");__webpack_unused_export__=w("react.strict_mode");__webpack_unused_export__=w("react.profiler");q=w("react.provider");r=w("react.context");t=w("react.forward_ref");__webpack_unused_export__=w("react.suspense");u=w("react.memo");v=w("react.lazy")}var x="function"===typeof Symbol&&Symbol.iterator;
function y(a){if(null===a||"object"!==typeof a)return null;a=x&&a[x]||a["@@iterator"];return"function"===typeof a?a:null}function z(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}
var A={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},B={};function C(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A}C.prototype.isReactComponent={};C.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error(z(85));this.updater.enqueueSetState(this,a,b,"setState")};C.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};
function D(){}D.prototype=C.prototype;function E(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A}var F=E.prototype=new D;F.constructor=E;l(F,C.prototype);F.isPureReactComponent=!0;var G={current:null},H=Object.prototype.hasOwnProperty,I={key:!0,ref:!0,__self:!0,__source:!0};
function J(a,b,c){var e,d={},k=null,h=null;if(null!=b)for(e in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)H.call(b,e)&&!I.hasOwnProperty(e)&&(d[e]=b[e]);var g=arguments.length-2;if(1===g)d.children=c;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];d.children=f}if(a&&a.defaultProps)for(e in g=a.defaultProps,g)void 0===d[e]&&(d[e]=g[e]);return{$$typeof:n,type:a,key:k,ref:h,props:d,_owner:G.current}}
function K(a,b){return{$$typeof:n,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function L(a){return"object"===typeof a&&null!==a&&a.$$typeof===n}function escape(a){var b={"=":"=0",":":"=2"};return"$"+a.replace(/[=:]/g,function(a){return b[a]})}var M=/\/+/g;function N(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function O(a,b,c,e,d){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case n:case p:h=!0}}if(h)return h=a,d=d(h),a=""===e?"."+N(h,0):e,Array.isArray(d)?(c="",null!=a&&(c=a.replace(M,"$&/")+"/"),O(d,b,c,"",function(a){return a})):null!=d&&(L(d)&&(d=K(d,c+(!d.key||h&&h.key===d.key?"":(""+d.key).replace(M,"$&/")+"/")+a)),b.push(d)),1;h=0;e=""===e?".":e+":";if(Array.isArray(a))for(var g=
0;g<a.length;g++){k=a[g];var f=e+N(k,g);h+=O(k,b,c,f,d)}else if(f=y(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=e+N(k,g++),h+=O(k,b,c,f,d);else if("object"===k)throw b=""+a,Error(z(31,"[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b));return h}function P(a,b,c){if(null==a)return a;var e=[],d=0;O(a,e,"","",function(a){return b.call(c,a,d++)});return e}
function Q(a){if(-1===a._status){var b=a._result;b=b();a._status=0;a._result=b;b.then(function(b){0===a._status&&(b=b.default,a._status=1,a._result=b)},function(b){0===a._status&&(a._status=2,a._result=b)})}if(1===a._status)return a._result;throw a._result;}var R={current:null};function S(){var a=R.current;if(null===a)throw Error(z(321));return a}var T={ReactCurrentDispatcher:R,ReactCurrentBatchConfig:{transition:0},ReactCurrentOwner:G,IsSomeRendererActing:{current:!1},assign:l};
__webpack_unused_export__={map:P,forEach:function(a,b,c){P(a,function(){b.apply(this,arguments)},c)},count:function(a){var b=0;P(a,function(){b++});return b},toArray:function(a){return P(a,function(a){return a})||[]},only:function(a){if(!L(a))throw Error(z(143));return a}};__webpack_unused_export__=C;__webpack_unused_export__=E;__webpack_unused_export__=T;
__webpack_unused_export__=function(a,b,c){if(null===a||void 0===a)throw Error(z(267,a));var e=l({},a.props),d=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=G.current);void 0!==b.key&&(d=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)H.call(b,f)&&!I.hasOwnProperty(f)&&(e[f]=void 0===b[f]&&void 0!==g?g[f]:b[f])}var f=arguments.length-2;if(1===f)e.children=c;else if(1<f){g=Array(f);for(var m=0;m<f;m++)g[m]=arguments[m+2];e.children=g}return{$$typeof:n,type:a.type,
key:d,ref:k,props:e,_owner:h}};__webpack_unused_export__=function(a,b){void 0===b&&(b=null);a={$$typeof:r,_calculateChangedBits:b,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null};a.Provider={$$typeof:q,_context:a};return a.Consumer=a};__webpack_unused_export__=J;__webpack_unused_export__=function(a){var b=J.bind(null,a);b.type=a;return b};__webpack_unused_export__=function(){return{current:null}};__webpack_unused_export__=function(a){return{$$typeof:t,render:a}};__webpack_unused_export__=L;
__webpack_unused_export__=function(a){return{$$typeof:v,_payload:{_status:-1,_result:a},_init:Q}};__webpack_unused_export__=function(a,b){return{$$typeof:u,type:a,compare:void 0===b?null:b}};__webpack_unused_export__=function(a,b){return S().useCallback(a,b)};__webpack_unused_export__=function(a,b){return S().useContext(a,b)};__webpack_unused_export__=function(){};__webpack_unused_export__=function(a,b){return S().useEffect(a,b)};__webpack_unused_export__=function(a,b,c){return S().useImperativeHandle(a,b,c)};
__webpack_unused_export__=function(a,b){return S().useLayoutEffect(a,b)};__webpack_unused_export__=function(a,b){return S().useMemo(a,b)};__webpack_unused_export__=function(a,b,c){return S().useReducer(a,b,c)};__webpack_unused_export__=function(a){return S().useRef(a)};__webpack_unused_export__=function(a){return S().useState(a)};__webpack_unused_export__="17.0.2";


/***/ }),

/***/ 294:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



if (true) {
  /* unused reexport */ __webpack_require__(408);
} else {}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {

;// CONCATENATED MODULE: ./src/Common/constants.js
// NOTE(amine): commands are defined in manifest.json
const commands = {
  openApp: "open-app",
  openSlate: "open-slate",
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
  borderGrayLight: system.grayLight5,
  borderDark: system.grayDark6,
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

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(294);
;// CONCATENATED MODULE: ./src/Utilities/upload.js



const messages = {
  saveLink: "SAVE_LINK",
  uploadStatus: "UPLOAD_STATUS",
};

// NOTE(amine): commands are defined in manifest.json
const upload_commands = {
  directSave: "direct-save",
};

const uploadStates = {
  start: "start",
  done: "done",
  duplicate: "duplicate",
  failed: "failed",
};

/* -------------------------------------------------------------------------------------------------
 * Upload status
 * -----------------------------------------------------------------------------------------------*/

/** ------------ Background ------------- */

const sendUploadStatusToContent = ({ tab, status, data }) => {
  chrome.tabs.sendMessage(parseInt(tab), {
    type: messages.uploadStatus,
    status,
    data,
  });
};

/** ------------ Content------------- */

const forwardUploadStatusToApp = ({ status, data }) => {
  window.postMessage({ type: messages.uploadStatus, data, status }, "*");
};

/** ------------ App ------------- */

const useUploadStatus = ({
  onStart,
  onDone,
  onSuccess,
  onDuplicate,
  onError,
}) => {
  React.useEffect(() => {
    let timer;
    let handleMessage = (event) => {
      let { data, type, status } = event.data;
      if (type !== messages.uploadStatus) return;

      if (status === uploadStates.start) {
        onStart();
      } else if (status === uploadStates.done) {
        onSuccess(data);
      } else if (status === uploadStates.duplicate) {
        onDuplicate(data);
      } else if (status === uploadStates.failed) {
        onError();
      } else {
        return;
      }
      timer = setTimeout(() => onDone(), 10000);
    };

    window.addEventListener("message", handleMessage);
    return () => (
      window.removeEventListener("message", handleMessage), clearTimeout(timer)
    );
  }, []);
};

/* -------------------------------------------------------------------------------------------------
 * Upload requests
 * -----------------------------------------------------------------------------------------------*/

/** ------------ App ------------- */

const sendSaveLinkRequest = () => {
  window.postMessage({ type: messages.saveLink }, "*");
};

/** ------------ Content------------- */

const forwardSaveLinkRequestsToBackground = ({ url }) => {
  chrome.runtime.sendMessage({ type: messages.saveLink, url });
};

/** ------------ Background ------------- */

const handleSaveLinkRequests = async ({
  apiKey,
  tab,
  url,
  background,
}) => {
  let response;
  try {
    sendUploadStatusToContent({
      tab: parseInt(tab),
      status: uploadStates.start,
    });

    response = await fetch(`${Constants.uri.hostname}/api/v3/create-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({ data: { url: url } }),
    });
  } catch (e) {
    console.log(e);
  }

  const json = await response.json();
  console.log("upload data: ", json);

  if (json.decorator === "LINK_DUPLICATE") {
    sendUploadStatusToContent({
      tab: parseInt(tab),
      status: uploadStates.duplicate,
      data: json.data[0],
    });
    return;
  }

  if (json.decorator === "SERVER_CREATE_LINK_FAILED" || json.error === true) {
    sendUploadStatusToContent({
      tab: parseInt(tab),
      status: uploadStates.failed,
    });
    return;
  }

  if (!background) {
    sendUploadStatusToContent({
      tab: parseInt(tab),
      status: uploadStates.done,
      data: json.data[0],
    });
  } else {
    //If background upload, dont send a message to a tab
    return;
  }

  return json.data[0];
};

// const handleSaveImage = async (props) => {
//   const url = `${Constants.uri.upload}/api/v3/public/upload-by-url`;

//   let response;
//   try {
//     response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: apiKey,
//       },
//       body: JSON.stringify({
//         data: {
//           url: props.url,
//           filename: props.url,
//         },
//       }),
//     });
//   } catch (e) {
//     console.log(e);
//   }

//   const json = await response.json();
//   return json;
// };

;// CONCATENATED MODULE: ./src/Core/history/index.js
const history_messages = {
  historyChunkRequest: "HISTORY_CHUNK_REQUEST",
  historyChunkResponse: "HISTORY_CHUNK_RESPONSE",

  relatedLinksRequest: "RELATED_LINKS_REQUEST",
  relatedLinksResponse: "RELATED_LINKS_RESPONSE",

  searchQueryRequest: "SEARCH_QUERY_REQUEST",
  searchQueryResponse: "SEARCH_QUERY_RESPONSE",

  viewByTypeRequest: "VIEW_BY_TYPE_REQUEST",
  viewByTypeResponse: "VIEW_BY_TYPE_RESPONSE",

  windowsUpdate: "WINDOWS_UPDATE",
};

const viewsType = {
  recent: "recent",
  currentWindow: "currentWindow",
  allOpen: "allOpen",
  relatedLinks: "relatedLinks",
};

;// CONCATENATED MODULE: ./src/Core/history/content.js


chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === history_messages.windowsUpdate) {
    window.postMessage(
      { type: history_messages.windowsUpdate, data: request.data },
      "*"
    );
  }
});

window.addEventListener("message", async function (event) {
  if (event.data.type === history_messages.historyChunkRequest) {
    chrome.runtime.sendMessage(
      { type: history_messages.historyChunkRequest, startIndex: event.data.startIndex },
      (response) =>
        window.postMessage(
          { type: history_messages.historyChunkResponse, data: response },
          "*"
        )
    );
  }

  if (event.data.type === history_messages.relatedLinksRequest) {
    chrome.runtime.sendMessage(
      { type: history_messages.relatedLinksRequest, url: event.data.url },
      (response) =>
        window.postMessage(
          { type: history_messages.relatedLinksResponse, data: response },
          "*"
        )
    );
  }

  if (event.data.type === history_messages.searchQueryRequest) {
    chrome.runtime.sendMessage(
      {
        type: history_messages.searchQueryRequest,
        query: event.data.query,
        viewType: event.data.viewType,
      },
      (response) =>
        window.postMessage(
          { type: history_messages.searchQueryResponse, data: response },
          "*"
        )
    );
  }

  if (event.data.type === history_messages.viewByTypeRequest) {
    chrome.runtime.sendMessage(
      { type: history_messages.viewByTypeRequest, query: event.data.query },
      (response) =>
        window.postMessage(
          { type: history_messages.viewByTypeResponse, data: response },
          "*"
        )
    );
  }
});

;// CONCATENATED MODULE: ./src/Core/navigation/index.js
const navigation_messages = {
  openExtensionJumperRequest: "OPEN_EXTENSION_JUMPER_REQUEST",
  closeExtensionJumperRequest: "CLOSE_EXTENSION_JUMPER_REQUEST",

  openURLsRequest: "OPEN_URLS_REQUEST",
};

;// CONCATENATED MODULE: ./src/Core/navigation/content.js




// SOURCE(amine): https://stackoverflow.com/questions/2592092/executing-script-elements-inserted-with-innerhtml
const setInnerHTML = (element, html) => {
  element.innerHTML = html;
  Array.from(element.querySelectorAll("script")).forEach((oldScript) => {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes).forEach((attr) =>
      newScript.setAttribute(attr.name, attr.value)
    );
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
};

const getExtensionJumperWrapper = () =>
  document.getElementById(jumperSlateExtensionWrapper);

const createExtensionJumperWrapper = () => {
  if (getExtensionJumperWrapper()) return;

  const wrapper = document.createElement("div");
  wrapper.setAttribute("id", jumperSlateExtensionWrapper);
  wrapper.setAttribute("data-url", chrome.runtime.getURL("/"));
  document.body.appendChild(wrapper);
};

const openApp = () => {
  const extensionOrigin = "chrome-extension://" + chrome.runtime.id;

  const isAppOpen = document.getElementById("modal-window-slate-extension");
  if (isAppOpen) return;

  createExtensionJumperWrapper();
  // Fetch the local React index.html page
  fetch(chrome.runtime.getURL("index.html"))
    .then((response) => response.text())
    .then((html) => {
      const styleStashHTML = html.replace(
        /\/static\//g,
        `${extensionOrigin}/static/`
      );
      setInnerHTML(getExtensionJumperWrapper(), styleStashHTML);
    })
    .catch((error) => {
      console.warn(error);
    });
};

const closeApp = () => {
  const extensionJumperWrapper = getExtensionJumperWrapper();
  extensionJumperWrapper.innerHTML = "";
};

/** ------------ Event Listeners ------------- */

let activeElement;
chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === navigation_messages.openExtensionJumperRequest) {
    activeElement = document.activeElement;
    openApp();
  }
});

window.addEventListener("message", async function (event) {
  if (event.data.type === navigation_messages.closeExtensionJumperRequest) {
    if (activeElement) activeElement.focus();
    closeApp();
  }

  if (event.data.type === navigation_messages.openURLsRequest) {
    chrome.runtime.sendMessage({
      type: navigation_messages.openURLsRequest,
      urls: event.data.urls,
      query: event.data.query,
    });
    return;
  }
});

;// CONCATENATED MODULE: ./src/content.js






// eslint-disable-next-line no-redeclare
/* global chrome */
if (window.location.href.startsWith(uri.hostname)) {
  if (window.location.href.includes("extension=true")) {
    document.addEventListener("keydown", function () {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      chrome.runtime.sendMessage({
        type: "GO_BACK",
        id: id,
      });
    });
  }
  //TODO: Have the extension change the 'download chrome extension' button
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === messages.uploadStatus) {
    forwardUploadStatusToApp({
      status: request.status,
      data: request.data,
    });
  }

  if (request.run === "AUTH_REQ") {
    window.postMessage({ type: "AUTH_REQ" }, "*");
    return true;
  }

  if (request.run === "CHECK_LINK") {
    window.postMessage(
      { type: "CHECK_LINK", data: request.data, user: request.user },
      "*"
    );
    return true;
  }
});

window.addEventListener("message", async function (event) {
  if (event.data.type === messages.saveLink) {
    forwardSaveLinkRequestsToBackground({
      url: event.data.url,
    });
  }

  if (event.data.run === "CHECK_LOGIN") {
    chrome.runtime.sendMessage({ type: "CHECK_LOGIN" });
    return true;
  }

  if (event.data.run === "SIGN_OUT") {
    chrome.runtime.sendMessage({ type: "SIGN_OUT" });
  }
});

}();
/******/ })()
;