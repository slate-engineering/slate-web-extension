/*! For license information please see background.js.LICENSE.txt */
!function(){"use strict";var e={418:function(e){var t=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable;function o(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},a=0;a<10;a++)t["_"+String.fromCharCode(a)]=a;if("0123456789"!==Object.getOwnPropertyNames(t).map((function(e){return t[e]})).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach((function(e){r[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}()?Object.assign:function(e,n){for(var s,i,c=o(e),u=1;u<arguments.length;u++){for(var d in s=Object(arguments[u]))a.call(s,d)&&(c[d]=s[d]);if(t){i=t(s);for(var p=0;p<i.length;p++)r.call(s,i[p])&&(c[i[p]]=s[i[p]])}}return c}},408:function(e,t,a){var r=a(418);if("function"==typeof Symbol&&Symbol.for){var o=Symbol.for;o("react.element"),o("react.portal"),o("react.fragment"),o("react.strict_mode"),o("react.profiler"),o("react.provider"),o("react.context"),o("react.forward_ref"),o("react.suspense"),o("react.memo"),o("react.lazy")}"function"==typeof Symbol&&Symbol.iterator;function n(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,a=1;a<arguments.length;a++)t+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var s={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},i={};function c(e,t,a){this.props=e,this.context=t,this.refs=i,this.updater=a||s}function u(){}function d(e,t,a){this.props=e,this.context=t,this.refs=i,this.updater=a||s}c.prototype.isReactComponent={},c.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error(n(85));this.updater.enqueueSetState(this,e,t,"setState")},c.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},u.prototype=c.prototype;var p=d.prototype=new u;p.constructor=d,r(p,c.prototype),p.isPureReactComponent=!0;Object.prototype.hasOwnProperty},294:function(e,t,a){a(408)}},t={};function a(r){var o=t[r];if(void 0!==o)return o.exports;var n=t[r]={exports:{}};return e[r](n,n.exports,a),n.exports}!function(){const e="https://slate.host";a(294);const t=({tab:e,status:t,data:a})=>{chrome.tabs.sendMessage(parseInt(e),{type:"UPLOAD_STATUS",status:t,data:a})},r=async({apiKey:a,tab:r,url:o,background:n})=>{let s;try{s=await fetch(`${e}/api/v3/create-link`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:a},body:JSON.stringify({data:{url:o}})})}catch(e){console.log(e)}const i=await s.json();if(console.log("upload data: ",i),"LINK_DUPLICATE"!==i.decorator)if("SERVER_CREATE_LINK_FAILED"!==i.decorator&&!0!==i.error){if(!n)return t({tab:parseInt(r),status:"done",data:i.data[0]}),i.data[0]}else t({tab:parseInt(r),status:"failed"});else t({tab:parseInt(r),status:"duplicate",data:i.data[0]})},o=async()=>new Promise(((t,a)=>{chrome.cookies.get({url:e,name:"WEB_SERVICE_SESSION_KEY"},(e=>{chrome.runtime.lastError?a(chrome.runtime.lastError):t(e)}))})),n=async()=>{let t,a;try{if(t=await o(),!t)return;a=await fetch(`${e}/api/extension/get-api-keys`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:{token:t.value}})})}catch(e){return}return(await a.json()).data[0].key},s=async t=>{let a;try{a=await o()}catch(e){return void setTimeout((()=>{chrome.tabs.sendMessage(t.id,{run:"AUTH_REQ"})}),1e3)}if(null!==a){let a=await n(),r=await(async t=>{let a;try{a=await fetch(`${e}/api/v3/get`,{method:"GET",headers:{"Content-Type":"application/json",Authorization:t.key}})}catch(e){console.log(e)}if(!a)return;const r=await a.json();return r.error&&console.log(r),r.user})({key:a}),o=await(async t=>{let a;try{a=await fetch(`${e}/api/extension/check-link`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:t.apiKey},body:JSON.stringify({data:{url:t.tab}})})}catch(e){console.log(e)}return await a.json()})({apiKey:a,tab:t.url});return setTimeout((()=>{chrome.tabs.sendMessage(t.id,{run:"CHECK_LINK",data:o,user:r})}),1e3),{data:o,user:r,tab:t.id}}setTimeout((()=>{chrome.tabs.sendMessage(t.id,{run:"AUTH_REQ"})}),1e3)};chrome.action.onClicked.addListener((async e=>{chrome.tabs.sendMessage(e.id,{run:"LOAD_APP",type:"LOADER_MAIN",tabId:e.id}),await s(e)})),chrome.commands.onCommand.addListener((async(t,a)=>{if("open-app"==t&&(chrome.tabs.sendMessage(a.id,{run:"LOAD_APP",type:"LOADER_MAIN"}),await s(a)),"open-slate"==t&&chrome.tabs.create({url:`${e}/_/data&extension=true&id=${a.id}`}),"direct-save"==t){let e=await s(a);if(e&&e.user){chrome.tabs.sendMessage(a.id,{run:"LOAD_APP",type:"LOADER_MINI"}),chrome.tabs.sendMessage(parseInt(a.id),{run:"OPEN_LOADING"});const e=await n();await r({url:a.url,tab:a.id,apiKey:e})}else chrome.tabs.sendMessage(a.id,{run:"LOAD_APP",type:"LOADER_MAIN"})}})),chrome.runtime.onMessage.addListener((async(t,a)=>{if("GO_BACK"===t.type&&(chrome.tabs.update(parseInt(t.id),{highlighted:!0}),chrome.tabs.remove(parseInt(a.tab.id))),"SAVE_LINK"===t.type){chrome.tabs.sendMessage(parseInt(a.tab.id),{run:"OPEN_LOADING"});const e=await n();await r({url:a.url,tab:a.tab.id,apiKey:e})}"CHECK_LOGIN"!==t.type?"SIGN_OUT"!==t.type||await(async()=>new Promise(((t,a)=>{chrome.cookies.remove({url:e,name:"WEB_SERVICE_SESSION_KEY"},(e=>{chrome.runtime.lastError?a(chrome.runtime.lastError):t(e)}))})))():await(async e=>{e&&chrome.cookies.onChanged.addListener((async t=>{if("slate.host"===t.cookie.domain&&!1===t.removed)return await s(e),chrome.tabs.update(e.id,{highlighted:!0}),void(e=null)}))})(a.tab)})),chrome.tabs.onUpdated.addListener((async(e,t,a)=>{if("complete"!=t.status||(r=["chrome://","localhost:","cec.cx"],o=a.url,!RegExp(r.join("|")).exec(o)))var r,o}))}()}();