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
  bgRed: system.redLight6,
};

const shadow = {
  lightSmall: "0px 4px 16px 0 rgba(174, 176, 178, 0.1)",
  lightMedium: "0px 8px 32px 0 rgba(174, 176, 178, 0.2)",
  lightLarge: "0px 12px 64px 0 rgba(174, 176, 178, 0.3)",
  darkSmall: "0px 4px 16px 0 rgba(99, 101, 102, 0.1)",
  darkMedium: "0px 8px 32px 0 rgba(99, 101, 102, 0.2)",
  darkLarge: "0px 12px 64px 0 rgba(99, 101, 102, 0.3)",
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

const routes = {
  modal: {
    key: "modal",
    values: {
      home: "home",
      shortcuts: "shortcuts",
      account: "account",
    },
  },
};

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(294);
;// CONCATENATED MODULE: ./src/Utilities/upload.js



const messages = {
  saveLink: "SAVE_LINK",
  uploadStatus: "UPLOAD_STATUS",
};

// NOTE(amine): commands are defined in manifest.json
const commands = {
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

    response = await fetch(`${uri.hostname}/api/v3/create-link`, {
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

;// CONCATENATED MODULE: ./src/Utilities/navigation.js




const navigation_messages = {
  navigate: "NAVIGATE",
  openApp: "OPEN_APP",
  openUrls: "OPEN_URLS",
};

// NOTE(amine): commands are defined in manifest.json
const navigation_commands = {
  openApp: "open-app",
  openSlate: "open-slate",
};

/* -------------------------------------------------------------------------------------------------
 *  Address bar
 * -----------------------------------------------------------------------------------------------*/

const ADDRESS_BAR_ELEMENT_ID = "slate-extension-address-bar";
const createAddressBarElement = () => {
  const element = document.createElement("div");
  element.setAttribute("id", ADDRESS_BAR_ELEMENT_ID);
  $(element).appendTo("html");
};
const getAddressBarElement = () =>
  document.getElementById(ADDRESS_BAR_ELEMENT_ID);

const DATA_CURRENT_URL = "data-current-url";
const getAddressBarUrl = () => {
  const element = document.getElementById(ADDRESS_BAR_ELEMENT_ID);
  return element.getAttribute(DATA_CURRENT_URL) || "/";
};
const updateAddressBarUrl = (url) => {
  let nextUrl = url;
  if (typeof url === "function") {
    const currentUrl = getAddressBarUrl();
    nextUrl = url(currentUrl);
  }

  const element = document.getElementById(ADDRESS_BAR_ELEMENT_ID);
  element.setAttribute(DATA_CURRENT_URL, nextUrl);
};

/** ------------ Background ------------- */

const sendNavigationRequestToContent = ({ tab, pathname, search }) => {
  chrome.tabs.sendMessage(parseInt(tab), {
    type: navigation_messages.navigate,
    data: { pathname, search },
  });
};

const sendOpenAppRequestToContent = ({ tab }) => {
  chrome.tabs.sendMessage(parseInt(tab), {
    type: navigation_messages.openApp,
  });
};

/** ------------ Content------------- */

const handleNavigationRequests = ({ pathname, search }) => {
  if (pathname) {
    navigateToUrl([pathname, search].join(""));
  } else {
    navigateToUrl((currentUrl) => {
      //NOTE(amine): using http://example as a workaround to get pathname using URL api.
      const { pathname } = new URL(currentUrl, "http://example");
      return [pathname, search].join("");
    });
  }
};

const openApp = (url = "/") => {
  const extensionOrigin = "chrome-extension://" + chrome.runtime.id;

  const isAppOpen = document.getElementById("modal-window-slate-extension");
  if (isAppOpen) return;
  createAddressBarElement();
  updateAddressBarUrl(url);
  // Fetch the local React index.html page
  fetch(chrome.runtime.getURL("index.html"))
    .then((response) => response.text())
    .then((html) => {
      const styleStashHTML = html.replace(
        /\/static\//g,
        `${extensionOrigin}/static/`
      );
      $(styleStashHTML).appendTo("html");
    })
    .catch((error) => {
      console.warn(error);
    });
};

const navigateToUrl = (url) => {
  const isAppOpen = document.getElementById("modal-window-slate-extension");

  if (isAppOpen) {
    updateAddressBarUrl(url);
  } else {
    openApp(url);
  }
};

const handleOpenUrlsRequests = async ({ urls, query, sender }) => {
  if (query.newWindow) {
    await chrome.windows.create({ focused: true, url: urls });
    return;
  }

  if (query.tabId) {
    await chrome.windows.update(query.windowId, { focused: true });
    await chrome.tabs.update(query.tabId, { active: true });
    return;
  }

  for (let url of urls) {
    await chrome.tabs.create({ windowId: sender.tab.windowId, url });
  }
};

const forwardOpenUrlsRequestToBackground = ({ urls, query }) => {
  chrome.runtime.sendMessage({ type: navigation_messages.openUrls, urls, query });
};

/** ------------ App ------------- */

const sendOpenUrlsRequest = ({ urls, query = { newWindow: false } }) =>
  window.postMessage({ type: navigation_messages.openUrls, urls, query }, "*");

const getInitialUrl = (/* unused pure expression or super */ null && (getAddressBarUrl));

const useHandleExternalNavigation = () => {
  let location = useLocation();
  const navigate = useNavigate();

  const storedLinkRef = React.useRef(null);
  React.useEffect(() => {
    updateAddressBarUrl(location.pathname + location.search);
    storedLinkRef.current = location.pathname + location.search;
  }, [location]);

  React.useEffect(() => {
    const element = getAddressBarElement();
    const handleMutation = (mutationList) => {
      const currentUrl = getAddressBarUrl();
      mutationList.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === DATA_CURRENT_URL &&
          storedLinkRef.current !== currentUrl
        ) {
          navigate(currentUrl);
        }
      });
    };

    const observer = new MutationObserver(handleMutation);
    observer.observe(element, { attributeFilter: [DATA_CURRENT_URL] });
  }, []);
};

;// CONCATENATED MODULE: ./src/Core/history/index.js
const history_messages = {
  requestHistoryDataByChunk: "REQUEST_HISTORY_DATA_BY_CHUNK",
  historyChunk: "HISTORY_CHUNK",
  windowsUpdate: "WINDOWS_UPDATE",
};

;// CONCATENATED MODULE: ./src/Core/history/background.js


/** ----------------------------------------- */

const Session = {
  createVisit: (historyItem, visit) => ({
    ...visit,
    title: historyItem.title,
    url: historyItem.url,
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

const HISTORY_LOCAL_STORAGE_KEY = "history_backup";
const historyInLocalStorage = {
  update: () => {
    chrome.storage.local.set({
      [HISTORY_LOCAL_STORAGE_KEY]: browserHistory.getInternalDB(),
    });
  },
  get: async () => {
    const results = await chrome.storage.local.get([HISTORY_LOCAL_STORAGE_KEY]);
    return results[HISTORY_LOCAL_STORAGE_KEY];
  },
};

/** ----------------------------------------- */

let BROWSER_HISTORY_INTERNAL_STORAGE;
const browserHistory = {
  addVisit: async (visit) => {
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
    historyInLocalStorage.update();
  },
  set: (history) => {
    BROWSER_HISTORY_INTERNAL_STORAGE = history;
    return BROWSER_HISTORY_INTERNAL_STORAGE;
  },
  getInternalDB: () => BROWSER_HISTORY_INTERNAL_STORAGE,
  get: async () => {
    if (BROWSER_HISTORY_INTERNAL_STORAGE) {
      return BROWSER_HISTORY_INTERNAL_STORAGE;
    }
    const localHistory = await historyInLocalStorage.get();
    if (localHistory) {
      return browserHistory.set(localHistory);
    }
    const history = await buildHistoryDBAndSaveItToStorage();
    return browserHistory.set(history);
  },
  removeSessionsOlderThanOneMonth: () => {
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
    historyInLocalStorage.update();
  },
};

const buildHistoryDBAndSaveItToStorage = async () => {
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

  historyInLocalStorage.update();

  return sessions;
};

/** ----------------------------------------- */

const Tabs = {
  create: (tab) => ({
    url: tab.url,
    id: tab.id,
    title: tab.title,
    favicon: tab.favIconUrl,
    windowId: tab.windowId,
  }),
  getActive: async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  },
};

const Windows = {
  getAll: async () => {
    const windows = await chrome.windows.getAll({ populate: true });
    return windows.map((window) => ({
      id: window.id,
      tabs: window.tabs.map(Tabs.create),
    }));
  },
};

/** ------------ listeners ------------- */

chrome.runtime.onStartup.addListener(() => {
  const ADaysInMs = 24 * 60 * 60 * 1000;
  setInterval(browserHistory.removeSessionsOlderThanOneMonth, ADaysInMs);
});

chrome.tabs.onRemoved.addListener(async () => {
  const activeTab = await Tabs.getActive();
  if (activeTab) {
    chrome.tabs.sendMessage(parseInt(activeTab.id), {
      data: {
        windows: await Windows.getAll(),
        activeWindowId: activeTab.windowId,
      },
      type: history_messages.windowsUpdate,
    });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status == "complete") {
    const activeTab = await Tabs.getActive();
    if (activeTab) {
      chrome.tabs.sendMessage(parseInt(activeTab.id), {
        data: {
          windows: await Windows.getAll(),
          activeWindowId: activeTab.windowId,
        },
        type: history_messages.windowsUpdate,
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

chrome.runtime.onMessage.addListener(async (request, sender) => {
  if (request.type === history_messages.requestHistoryDataByChunk) {
    const response = {};
    const history = await browserHistory.get();
    response.history = history.slice(
      request.startIndex,
      request.startIndex + 1000
    );
    response.canFetchMore =
      request.startIndex + response.history.length !== history.length;

    if (request.startIndex === 0) {
      response.activeWindowId = sender.tab.windowId;
      response.windows = await Windows.getAll();
    }

    chrome.tabs.sendMessage(parseInt(sender.tab.id), {
      data: response,
      type: history_messages.historyChunk,
    });
  }
});

;// CONCATENATED MODULE: ./src/background.js






const getSessionID = async () => {
  return new Promise((resolve, reject) => {
    chrome.cookies.get(
      { url: uri.hostname, name: "WEB_SERVICE_SESSION_KEY" },
      (cookie) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(cookie);
        }
      }
    );
  });
};

const deleteSessionID = async () => {
  return new Promise((resolve, reject) => {
    chrome.cookies.remove(
      { url: uri.hostname, name: "WEB_SERVICE_SESSION_KEY" },
      (cookie) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(cookie);
        }
      }
    );
  });
};

const getApiKey = async () => {
  let session;
  let response;
  try {
    session = await getSessionID();
    if (!session) {
      return;
    }
    response = await fetch(
      `${uri.hostname}/api/extension/get-api-keys`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            token: session.value,
          },
        }),
      }
    );
  } catch (e) {
    return;
  }
  const json = await response.json();
  let apiKey = json.data[0].key;
  return apiKey;
};

const getUser = async (props) => {
  let response;
  try {
    response = await fetch(`${uri.hostname}/api/v3/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.key,
      },
    });
  } catch (e) {
    console.log(e);
  }

  if (!response) {
    return;
  }
  const json = await response.json();
  if (json.error) {
    console.log(json);
  }
  return json.user;
};

const checkLink = async (props) => {
  let response;
  try {
    response = await fetch(
      `${uri.hostname}/api/extension/check-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.apiKey,
        },
        body: JSON.stringify({
          data: {
            url: props.tab,
          },
        }),
      }
    );
  } catch (e) {
    console.log(e);
  }
  const json = await response.json();
  return json;
};

// const checkMatch = (list, url) => {
//   const matches = RegExp(list.join("|")).exec(url);
//   return matches;
// };

const checkLoginData = async (tab) => {
  let session;
  try {
    session = await getSessionID();
  } catch (e) {
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, { run: "AUTH_REQ" });
    }, 1000);
    return;
  }
  if (session === null) {
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, { run: "AUTH_REQ" });
    }, 1000);
    return;
  } else {
    let api = await getApiKey();
    let user = await getUser({ key: api });
    let check = await checkLink({ apiKey: api, tab: tab.url });
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, {
        run: "CHECK_LINK",
        data: check,
        user: user,
      });
    }, 1000);
    let data = { data: check, user: user, tab: tab.id };
    return data;
  }
};

const checkLoginSession = async (tab) => {
  if (tab) {
    chrome.cookies.onChanged.addListener(async (changeInfo) => {
      if (
        changeInfo.cookie.domain === uri.domain &&
        changeInfo.removed === false
      ) {
        await checkLoginData(tab);
        chrome.tabs.update(tab.id, { highlighted: true });
        tab = null;
        return;
      }
    });
  }
};

chrome.action.onClicked.addListener(async (tab) => {
  sendNavigationRequestToContent({
    tab: tab.id,
    search: `?${routes.modal.key}=${routes.modal.values.home}`,
  });
  await checkLoginData(tab);
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command == navigation_commands.openApp) {
    sendNavigationRequestToContent({
      tab: tab.id,
      search: `?${routes.modal.key}=${routes.modal.values.home}`,
    });
    await checkLoginData(tab);
  }

  if (command == navigation_commands.openSlate) {
    chrome.tabs.create({
      url: `${uri.hostname}/_/data&extension=true&id=${tab.id}`,
    });
  }

  if (command == commands.directSave) {
    let session = await checkLoginData(tab);

    if (session && session.user) {
      sendOpenAppRequestToContent({ tab: tab.id });
      const apiKey = await getApiKey();
      await handleSaveLinkRequests({
        url: tab.url,
        tab: tab.id,
        apiKey,
      });
    } else {
      sendNavigationRequestToContent({
        tab: tab.id,
        search: `?${routes.modal.key}=${routes.modal.values.home}`,
      });
    }
  }
});

chrome.runtime.onMessage.addListener(async (request, sender) => {
  if (request.type === messages.saveLink) {
    const apiKey = await getApiKey();
    await handleSaveLinkRequests({
      url: sender.url,
      tab: sender.tab.id,
      apiKey,
    });
  }

  if (request.type === navigation_messages.openUrls) {
    await handleOpenUrlsRequests({
      urls: request.urls,
      query: request.query,
      sender,
    });
    return true;
  }

  if (request.type === "GO_BACK") {
    chrome.tabs.update(parseInt(request.id), { highlighted: true });
    chrome.tabs.remove(parseInt(sender.tab.id));
  }

  if (request.type === "CHECK_LOGIN") {
    await checkLoginSession(sender.tab);
    return;
  }

  if (request.type === "SIGN_OUT") {
    await deleteSessionID();
    return;
  }
});

// chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
//   if (info.status == "complete") {
//     const blacklist = ["chrome://", "localhost:", "cec.cx"];
//     const isBlacklisted = checkMatch(blacklist, tab.url);

//     // const domains = ["slate.host", "slate-dev.onrender.com"];
//     // const isSlate = checkMatch(domains, tab.url);

//     if (isBlacklisted) {
//       return;
//     }
//   }
// });

}();
/******/ })()
;