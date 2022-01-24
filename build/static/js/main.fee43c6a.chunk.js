(window["webpackJsonpSlate for Web"]=window["webpackJsonpSlate for Web"]||[]).push([[0],{12:function(t,e,n){t.exports=n(22)},22:function(t,e,n){"use strict";n.r(e);var a=n(0),r=n.n(a),o=n(8),i=n.n(o),l=n(1),c=r.a.createContext({}),s=function(t){var e=t.children,n=Object(a.useState)({title:document.title,description:document.description,url:window.location.href}),o=Object(l.a)(n,2),i=o[0];o[1];return Object(a.useEffect)((function(){window.addEventListener("message",(function(t){t.source,window}))}),[]),r.a.createElement(c.Provider,{value:{pageData:i}},e)},d="#FFFFFF",m="#F7F8F9",u="#E5E8EA",p="#D1D4D6",g="#C7CACC",h="#8E9093",x="#48494A",f="#2C2D2E",E="#1C1D1E",b="#00050A",w="#0084FF",v="#D5EBFF",k="#D5FFDE",y="#FFFFD5",C="#FFD5D5",L={textWhite:d,textGrayLight:g,textGray:h,textGrayDark:x,textBlack:b,bgLight:m,bgGrayLight:u,bgBlurWhite:"rgba(255, 255, 255, 0.7)",bgBlurWhiteOP:"rgba(255, 255, 255, 0.85)",bgBlurWhiteTRN:"rgba(255, 255, 255, 0.3)",bgBlurLight6:"rgba(247, 248, 249, 0.7)",bgBlurLight6OP:"rgba(247, 248, 249, 0.85)",bgBlurLight6TRN:"rgba(247, 248, 249, 0.3)",bgDark:E,bgLightDark:f,bgBlurBlack:"rgba(0, 5, 10, 0.5)",bgBlurBlackOP:"rgba(0, 5, 10, 0.85)",bgBlurBlackTRN:"rgba(0, 5, 10, 0.3)",bgBlurDark:"rgba(28, 29, 30, 0.7)",bgBlurDark6:"rgba(28, 29, 30, 0.5)",bgBlurDark6OP:"rgba(28, 29, 30, 0.85)",bgBlurDark6TRN:"rgba(28, 29, 30, 0.3)",borderLight:m,borderGrayLight:u,borderDark:E,borderGrayDark:f,borderGrayLight4:p,bgBlue:v,bgGreen:k,bgYellow:y,bgRed:C},N="https://slate.host",O=(n(17),"\n\t.modalWindow {\n\t  top: 50%;\n\t  left: 50%;\n\t  transform: translate(-50%, -50%);\n\t  will-change: transform;\n\t  position: fixed;\n\t  background: ".concat(d,";\n\t  width: 640px;  \n\t  height: 350px;\n\t  border: 1px solid ").concat(u,";\n\t  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);\n\t  z-index: 2100000000;\n\t  border-radius: 16px;\n\t  color: ").concat(L.textBlack,';\n\t  font-family: "Inter";\n\t}\n\n\t.modalContent {\n\t  position: relative;\n\t  width: 100%;\n\t  height: 100%;\n\t}\n\n\t.modalBackground {\n\t  background-color: transparent;\n\t  width: 100vw;\n\t  height: 100vh;\n\t  position: fixed;\n\t  cursor: pointer;\n\t  z-index: 210000000;\n\t}\n\n\t.modalButtonMain {\n\t  outline: 0;\n\t  border: 0;\n\t  border-radius: 12px;\n\t  height: 48px;\n\t  line-height: 48px;\n\t  font-size: 16px;\n\t  user-select: none;\n\t  cursor: pointer;\n\t  background-color: ').concat(d,";\n\t  color: ").concat(L.textBlack,';\n\t  bottom: 0;\n\t  font-family: "Inter";\n\t  margin-left: 8px;\n\t  margin-right: 8px;\n\t  display: grid;\n\t  grid-template-columns: 50px 1fr auto; \n\t  align-items: center;\n\t  justify-content: center;\n\t}\n\n\t.modalButtonMain:hover {\n\t  background-color: ').concat(m,';\n\t}\n\n\t.modalButtonSVG {\n\t   margin-left: 12px;\n\t}\n\n\t.modalButtonText {\n\t  font-family: "Inter";\n\t  font-weight: 400;\n\t}\n\n\t.svgcontainer {\n\t  width: 50px;\n\t  height: 50px;\n\t  display: flex;\n\t  align-items: center;\n\t  justify-content: center;\n\t}\n\n\t.modalCommandIcon {\n\t  background-color:  ').concat(m,";\n\t  color: ").concat(L.textGray,";\n\t  border-radius: 6px;\n\t  padding: 2px 4px 2px 4px;\n\t}\n\n\t.modalKeyIcon {\n\t  background-color: ").concat(m,";\n\t  color: ").concat(L.textGray,";\n\t  border-radius: 6px;\n\t  padding: 2px 4px 2px 4px;\n\t  margin-right: 4px;\n\t}\n\n\t.modalSystemText {\n\t  margin-left: 20px;\n\t  color: ").concat(h,";\n\t  padding-top: 4px;\n\t  font-size: 14px;\n\t  font-weight: 600;\n\t  margin-bottom: 8px;\n\t}\n\n\t.modalHeader {\n\t  height: 52px;\n\t  border-bottom: 1px solid ").concat(u,";\n\t  padding-left: 20px;\n\t}\n\n\t.modalGoBack {\n\t  margin-right: 20px;\n\t  margin-top: 14px;\n\t  background-color: ").concat(u,";\n\t  border-radius: 8px;\n\t  cursor: pointer;\n\t  width: 24px;\n\t  height: 24px;\n\t  display: inline-block;\n\t  position: absolute;\n\t  background-size: cover;\n  \t  background-position: 50% 50%;\n\t}\n\n\t.modalHeaderTitle {\n\t  font-weight: 500;\n\t  line-height: 52px;\n\t  font-family: 'Inter';\n\t  font-size: 16px;\n\t  display: inline;\n\t  margin-left: 40px;\n\t}\n\n\t.metadata {\n\t  background-color: transparent;\n\t  margin: 16px 8px 0 8px;\n\t  padding-bottom: 16px;\n\t  border-bottom: 1px solid ").concat(u,";\n\t  display: grid;\n\t  grid-template-columns: 50px 1fr auto; \n\t}\n\n\t.metadataBox {\n\t}\n\n\t.metadataImage {\n\t  border-radius: 8px;\n\t  margin-top: 8px;\n\t  object-fit: cover;\n\t  min-height: 20px;\n\t  min-width: 20px;\n\t}\n\n\t.metadataBox2 {\n\n\t}\n\n\t.metadataBox3 {\n\t  position: absolute;\n\t  right: 20px;\n\t}\n\n\t.metaDataTitle {\n\t  color: ").concat(L.textBlack,';\n\t  font-family: "Inter";\n\t  font-weight: 600;\n\t  font-size: 16px;\n\t  margin-bottom: 4px;\n\t}\n\n\t.modalCloseButton {\n\t  color: ').concat(L.textBlack,';\n\t  font-family: "Inter";\n\t  font-weight: 600;\n\t  font-size: 16px;\n\t}\n\n\t.metaDataUrl {\n\t  color: ').concat(L.textBlack,';\n\t  font-family: "Inter";\n\t  font-weight: 400;\n\t  font-size: 16px;\n\t}\n\n\t.modalTableContent {\n\t  display: flex;\n\t  justify-content: left;\n\t  padding-top: 12px;\n\t  padding-bottom: 12px;\n\t  font-size: 14px;\n\t  color: ').concat(L.textBlack,";\n\t}\n\n\t.modalShortcut {\n\t  width: auto;\n\t  background-color: ").concat(m,";\n\t  color: ").concat(L.textGray,";\n\t  border-radius: 6px;\n\t  padding: 2px 3px 2px 3px;\n\t  margin-right: 4px;\n\t}\n\n\t.modalTableHeader {\n\t  display: flex;\n\t  justify-content: left;\n\t  border-bottom: 1px solid ").concat(u,"; \n\t  padding-top: 12px;\n\t  padding-bottom: 12px;\n\t  font-size: 12px;\n\t  color: ").concat(h,";\n\t}\n\n\t.modalAccount {\n\t  vertical-align: middle;\n\t  justify-content: center;\n\t  align-items: center;\n\t  position: relative;\n\t}\n\n\t.modalAccountAvatar {\n\t\tobject-fit: cover;\n\t\tborder-radius: 20px;\n\t\tdisplay: block;\n\t\tmargin-left: auto;\n\t\tmargin-right: auto;\n\t\tjustify-content: center;\n\t\talign-items: center;\n\t\tclear: both;\n\t}\n\n\t.modalAccountAvatarBlank {\n\t\tbackground-color: ").concat(u,";\n\t\tborder-radius: 20px;\n\t\tdisplay: block;\n\t\tmargin-left: auto;\n\t\tmargin-right: auto;\n\t\tjustify-content: center;\n\t\talign-items: center;\n\t\tclear: both;\n\t}\n\n\t.modalAccountContent {\n\t  margin: 0 auto;\n\t  position: absolute;\n\t  left: 50%;\n\t  top: 50%;\n\t  margin-top: 150px;\n\t  transform: translate(-50%, -50%);\n\t}\n\n\t.modalAccountUsername {\n\t  text-align: center;\n\t  font-size: 16px;\n\t  font-weight: 600;\n\t  padding-top: 16px;\n\t  display: flex;\n\t  margin: auto 0;\n\t  justify-content: center;\n\t  clear: both;\n\t  align-items: center;\n\t}\n\n\t.modalAccountStorage {\n\t  text-align: center;\n\t  font-size: 14px;\n\t  font-weight: 400;\n\t  padding-top: 4px;\n\t  display: flex;\n\t  margin: auto 0;\n\t  justify-content: center;\n\t  clear: both;\n\t  align-items: center;\n\t}\n\n\t.modalSmallButton {\n\t  width: auto;\n\t  line-height: 32px;\n\t  height: 32px;\n\t  margin-top: 32px;\n\t  text-align: center;\n\t  clear: both;\n\t  background-color: ").concat(u,";\n\t  color: ").concat(L.textBlack,";\n\t  border-radius: 8px;\n\t  padding: 0 24px;\n\t  font-size: 14px;\n\t  font-weight: 500;\n\t  border: 0;\n\t  cursor: pointer;\n\t}\n\n\t.modalProgressContainer {\n\t  margin: 8px 0 8px 0;\n\t  width: 240px;\n\t  background-color: ").concat(d,";\n\t  border-radius: 2px;\n\t  border: 2px solid ").concat(p,";\n\t}\n\n\t.modalProgressBar {\n\t  height: 8px;\n\t  background-color: ").concat(w,";\n\t  border-radius: 2px;\n\t}\n\n\t.primaryButton {\n\t\tfont-size: 14px;\n\t\tfont-weight: 500;\n\t\tfont-family: 'Inter';\n\t\tbackground-color: ").concat(w,";\n\t\tcolor: ").concat(d,";\n\t\tborder: 0;\n\t\tborder-radius: 12px;\n\t\tpadding: 0 24px;\n\t\theight: 32px;\n\t\tline-height: 32px;\n\t\tcursor: pointer;\n\t}\n\n\t.loginHeader {\n\t\tfont-size: 24px; \n\t\tfont-family: 'Inter';\n\t\tmargin-left: 20px;\n\t\tmargin-top: 100px;\n\t\tmargin-bottom: 0px;\n\t\tfont-weight: 500;\n\t}\n\n\t.loginSubtitle {\n\t\tfont-size: 14px;\n\t\tmargin-left: 20px;\n\t\tmargin-top: 6px;\n\t}\n\n\t.loaderSpinnerLarge {\n\t\tmargin: 0 auto;\n\t\tposition: absolute;\n\t\tleft: 50%;\n\t\ttop: 50%;\n\t\ttransform: translate(-50%, -50%);\n\t\tdisplay: block;\n  \t\tanimation: slate-client-animation-spin 1.5s cubic-bezier(0.5, 0.1, 0.4, 0.7) infinite;\n\t}\n\n\t.loaderSpinnerSmall {\n\t\tmargin: 0 auto;\n\t\tposition: absolute;\n\t\tdisplay: block;\n  \t\tanimation: slate-client-animation-spin 1.5s cubic-bezier(0.5, 0.1, 0.4, 0.7) infinite;\n\t}\n\n\t.loaderSpinnerSVG {\n\t\tdisplay: block;\n\t\tcolor: ").concat(w,";\n\t\theight: 16px;\n\t\twidth: 16px;\n\t}\n\n\t.modalLink {\n\t\tcolor: ").concat(w,";\n\t\tfont-weight: 600;\n\t\ttext-decoration: none;\n\t}\n\t\n\t@keyframes slate-client-animation-spin {\n\t\tfrom {\n\t\t  -webkit-transform: rotate(0deg);\n\t\t  transform: rotate(0deg);\n\t\t}\n\t\tto {\n\t\t  -webkit-transform: rotate(360deg);\n\t\t  transform: rotate(360deg);\n\t\t}\n\t}\n")),B="\n\t.loaderWindow {\n\t\ttop: 0%;\n\t\tright: 0%;\n\t\tmargin-top: 2em;\n\t\tmargin-right: 2em;\n\t\tposition: fixed;\n\t\tbackground: ".concat(d,";\n\t\twidth: 320px;  \n\t\theight: 88px;\n\t\tmax-width: 320px;  \n\t\tmax-height: 88px;\n\t\tbox-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;\n\t\tz-index: 2100000000;\n\t\tborder-radius: 10px;\n\t\tborder: 0;\n\t\tcolor: ").concat(b,";\n\t}\n\n\t.loaderBody {\n\t\twidth: 100%;\n\t}\n\n\t.loaderContent {\n\t\tcolor: ").concat(d,";\n\t\tfont-size: 14px;\n\t}\n\n\t.loaderText {\n\t\tfont-family: 'Inter';\n\t\tcolor: ").concat(b,";\n\t\tpadding-left: 48px;\n\t\tline-height: 48px;\n\t\tfont-weight: 600;\n\t\tcursor: default;\n\t}\n\n\t.loaderBox {\n\t\twidth: 32px;\n\t\theight: 32px;\n\t\tbackground-color: #F2F2F7;\n\t\tcolor: ").concat(h,";\n\t}\n\n\t.loaderImage {\n\t\tposition: absolute;\n\t\tline-height: 40px;\n\t\ttop: 14px;\n\t\tleft: 14px;\n\t\tobject-fit: cover;\n\t\tborder-radius: 10px;\n\t\twidth: 24px;\n\t\theight: 24px;\n\t}\n\n\t.loaderImageBlank {\n\t\tposition: absolute;\n\t\tline-height: 40px;\n\t\ttop: 14px;\n\t\tleft: 14px;\n\t\tborder-radius: 10px;\n\t\twidth: 24px;\n\t\theight: 24px;\n\t\tbackground-color: ").concat(u,";\n\t}\n\n\t.loaderFooter {\n\t\tbottom: 0px;\n\t\twidth: 100%;  \n\t\theight: 40px;\n\t\tline-height: 40px;\n\t\tbackground-color: ;\n\t\tcolor: ").concat(h,";\n\t\tborder-radius: 0 0 10px 10px; \n\t}\n\n\t.loaderFooterRight {\n\t\ttext-align: right;\n\t\tright: 14px;\n\t\tfont-weight: 400;\n\t\tfont-family: 'Inter';\n\t\tdisplay: inline;\n\t\tposition: absolute;\n\t}\n\n\t.loaderFooterLeft {\n\t\ttext-align: left;\n\t\tfont-weight: 400;\n\t\tfont-family: 'Inter';\n\t\tleft: 0px;\n\t\tpadding-left: 14px;\n\t\tdisplay: inline;\n\t}\n\n\t.loaderClose {\n\t\tcursor: pointer;\n\t\ttext-align: 'right';\n\t\tright: 14px;\n\t\tdisplay: inline;\n\t\tposition: absolute;\n\t\tcolor: ").concat(h,";\n\t\tline-height: 48px;\n\t}\n\n\t.loaderClose:hover {\n\t  \ttransition: 0.3s;\n\t  \tcolor: ").concat(b,";\n\t}\n\n\t.loaderSpinner {\n\t\tmargin-right: 8px;\n\t\tdisplay: inline-block;\n\t\tmargin-left: 4px;\n\t  \tjustify-content: center;\n\t  \talign-items: center;\n\t\tanimation: slate-client-animation-spin 1.5s cubic-bezier(0.5, 0.1, 0.4, 0.7) infinite;\n\t}\n\n\t.loaderSpinnerSVG {\n\t\tdisplay: block;\n\t\tmargin: auto;\n\t\tcolor: ").concat(w,";\n\t\theight: 16px;\n\t\twidth: 16px;\n\t}\n\n\t.modalLink {\n\t\tcolor: ").concat(w,";\n\t\tfont-weight: 600;\n\t\ttext-decoration: none;\n\t}\n\t\n\t@keyframes slate-client-animation-spin {\n\t\tfrom {\n\t\t  -webkit-transform: rotate(0deg);\n\t\t  transform: rotate(0deg);\n\t\t}\n\t\tto {\n\t\t  -webkit-transform: rotate(360deg);\n\t\t  transform: rotate(360deg);\n\t\t}\n\t}\n\n"),S=n(2),j=n.n(S),F=n(5),A=n(9),D=n.n(A),_=function(t){return r.a.createElement("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round",height:t.height,style:t.style},r.a.createElement("path",{d:"M8 1.68237V4.34904"}),r.a.createElement("path",{d:"M8 12.3491V15.0158"}),r.a.createElement("path",{d:"M3.28662 3.63574L5.17329 5.52241"}),r.a.createElement("path",{d:"M10.8267 11.1758L12.7133 13.0624"}),r.a.createElement("path",{d:"M1.33337 8.34912H4.00004"}),r.a.createElement("path",{d:"M12 8.34912H14.6667"}),r.a.createElement("path",{d:"M3.28662 13.0624L5.17329 11.1758"}),r.a.createElement("path",{d:"M10.8267 5.52241L12.7133 3.63574"}))},P=function(t){return r.a.createElement("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",height:t.height,style:t.style},r.a.createElement("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),r.a.createElement("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"}))},M=function(t){return r.a.createElement("svg",{height:t.height,style:t.style,viewBox:"0 0 14 14",xmlns:"http://www.w3.org/2000/svg"},r.a.createElement("g",{fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round"},r.a.createElement("path",{d:"M11 1C10.4696 1 9.96086 1.21071 9.58579 1.58579C9.21071 1.96086 9 2.46957 9 3V11C9 11.5304 9.21071 12.0391 9.58579 12.4142C9.96086 12.7893 10.4696 13 11 13C11.5304 13 12.0391 12.7893 12.4142 12.4142C12.7893 12.0391 13 11.5304 13 11C13 10.4696 12.7893 9.96086 12.4142 9.58579C12.0391 9.21071 11.5304 9 11 9H3C2.46957 9 1.96086 9.21071 1.58579 9.58579C1.21071 9.96086 1 10.4696 1 11C1 11.5304 1.21071 12.0391 1.58579 12.4142C1.96086 12.7893 2.46957 13 3 13C3.53043 13 4.03914 12.7893 4.41421 12.4142C4.78929 12.0391 5 11.5304 5 11V3C5 2.46957 4.78929 1.96086 4.41421 1.58579C4.03914 1.21071 3.53043 1 3 1C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3C1 3.53043 1.21071 4.03914 1.58579 4.41421C1.96086 4.78929 2.46957 5 3 5H11C11.5304 5 12.0391 4.78929 12.4142 4.41421C12.7893 4.03914 13 3.53043 13 3C13 2.46957 12.7893 1.96086 12.4142 1.58579C12.0391 1.21071 11.5304 1 11 1Z",strokeWidth:"1.33333"})))},T=function(t){return r.a.createElement("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",height:t.height,style:t.style},r.a.createElement("g",{fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},r.a.createElement("path",{d:"M12 2L2 7L12 12L22 7L12 2Z"}),r.a.createElement("path",{d:"M2 17L12 22L22 17"}),r.a.createElement("path",{d:"M2 12L12 17L22 12"})))},I=function(t){return r.a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",height:t.height,style:t.style},t),r.a.createElement("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),r.a.createElement("line",{x1:"6",y1:"6",x2:"18",y2:"18"}))},G=function(t){return r.a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},t),r.a.createElement("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),r.a.createElement("line",{x1:"5",y1:"12",x2:"19",y2:"12"}))},H=function(t){return r.a.createElement("svg",Object.assign({viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2"},t),r.a.createElement("polyline",{points:"15 18 9 12 15 6"}))},z=function(t){return r.a.createElement("svg",Object.assign({width:"16",height:"17",viewBox:"0 0 16 17",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t),r.a.createElement("path",{d:"M14.6666 7.88674V8.50007C14.6658 9.93769 14.2003 11.3365 13.3395 12.488C12.4788 13.6394 11.2688 14.4817 9.89022 14.8893C8.5116 15.297 7.03815 15.248 5.68963 14.7498C4.3411 14.2516 3.18975 13.3308 2.40729 12.1248C1.62482 10.9188 1.25317 9.49212 1.34776 8.05762C1.44235 6.62312 1.99812 5.25762 2.93217 4.16479C3.86621 3.07195 5.1285 2.31033 6.53077 1.9935C7.93304 1.67668 9.40016 1.82163 10.7133 2.40674",stroke:"#34D159","stroke-width":"1.25","stroke-linecap":"round","stroke-linejoin":"round"}),r.a.createElement("path",{d:"M14.6667 3.16675L8 9.84008L6 7.84008",stroke:"#34D159","stroke-width":"1.25","stroke-linecap":"round","stroke-linejoin":"round"}))},W=function(t){return r.a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},t),r.a.createElement("path",{d:"M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"}),r.a.createElement("path",{d:"M17 8L12 3L7 8"}),r.a.createElement("path",{d:"M12 3V15"}))},U=function(t){return r.a.createElement("svg",Object.assign({width:20,height:20,viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t),r.a.createElement("path",{d:"M15.3334 16V14.6667C15.3334 13.9594 15.0524 13.2811 14.5523 12.781C14.0522 12.281 13.3739 12 12.6667 12H7.33335C6.62611 12 5.94783 12.281 5.44774 12.781C4.94764 13.2811 4.66669 13.9594 4.66669 14.6667V16",stroke:"#00050A","stroke-width":"1.33333","stroke-linecap":"round","stroke-linejoin":"round"}),r.a.createElement("path",{d:"M9.99998 9.33333C11.4727 9.33333 12.6666 8.13943 12.6666 6.66667C12.6666 5.19391 11.4727 4 9.99998 4C8.52722 4 7.33331 5.19391 7.33331 6.66667C7.33331 8.13943 8.52722 9.33333 9.99998 9.33333Z",stroke:"#00050A","stroke-width":"1.33333","stroke-linecap":"round","stroke-linejoin":"round"}))},V=(n(11),"".concat(N,"/api/v2/create-link"),"".concat(N,"/api/v2/public/upload-by-url"),function(t,e){return"".concat(N,"/_/data?cid=").concat(t,"&extension=true&id=").concat(e)}),K=function(t,e){return e.slice(0,t)+(e.length>t?"...":"")},R=[{short:"\u2325",key:"S",name:"Open extension"},{short:"\u2325",key:"B",name:"Bookmark current page"},{short:"\u2191",key:"\u2193",extra:"\u2190",name:"Navigate extension"},{short:"",key:"esc",name:"Close extension"},{short:"\u2325",key:"O",name:"Open web app"}],q=function(t){var e={command:r.a.createElement(M,{width:"16px",height:"16px"}),plus:r.a.createElement(G,{width:"20px",height:"20px"}),account:r.a.createElement(U,{width:"22px",height:"22px"}),uploads:r.a.createElement(W,{width:"16px",height:"16px"}),eye:r.a.createElement(T,{width:"16px",height:"16px"})}[t.icon],n=function(e){if("OPEN_LINK"!==t.run)window.postMessage({run:t.run},"*");else{var n=V(t.data.data.data.cid,100);window.open(n,"_blank").focus()}};return t.onEnter&&t.id===t.highlight&&n(),r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{onClick:n,className:"modalButtonMain",onMouseEnter:function(){t.onChange(t.id)},style:{backgroundColor:t.id===t.highlight?"#F7F8F9":"#fff"}},r.a.createElement("div",{className:"svgcontainer"},e),r.a.createElement("div",{className:"modalButtonText"},t.text),t.id===t.highlight&&r.a.createElement("div",{style:{position:"absolute",right:"20px",color:"#8E9093",fontSize:"14px"}},r.a.createElement("span",{className:"modalKeyIcon"},"enter"),r.a.createElement("span",{className:"modalCommandIcon"},"\u23ce"))))},Z=function(t){var e,n=Object(a.useState)(null),o=Object(l.a)(n,2),i=o[0],c=o[1],s=K(45,t.data.title);return function(t){var e=new Image;e.addEventListener("load",(function(){c(t)})),e.src=t}(t.image),r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"metadata"},r.a.createElement("div",{className:"svgContainer",style:{height:"50px"}},t.status.uploaded?r.a.createElement(z,{width:"16px",height:"16px",style:{marginTop:"16px",marginLeft:"16px"}}):r.a.createElement(P,{width:"16px",height:"16px",style:{marginTop:"16px",marginLeft:"16px"}})),r.a.createElement("div",{className:"metadataBox2"},r.a.createElement("div",{className:"metaDataTitle"},s),r.a.createElement("div",{style:{lineHeight:"16px"},className:"metaDataUrl"},(e=t.data.url,new URL(e).hostname))),r.a.createElement("div",{className:"metadataBox3"},r.a.createElement("img",{height:"32px",src:i}))))},J=function(t){var e=function(t){if(t.data.photo)return t.data.photo;return"https://source.boringavatars.com/marble/24px/".concat(t.id,"?square&colors=").concat(["A9B9C1","5B6B74","3C444A","D4DBDF","293137"])}(t.user);return r.a.createElement("div",{className:"modalHeader"},t.goBack?r.a.createElement("div",{className:"modalGoBack",onClick:function(){window.postMessage({run:"OPEN_HOME_PAGE"},"*")}},r.a.createElement(H,{width:"16px",height:"16px",style:{margin:"auto",marginTop:"3px",display:"block"}})):r.a.createElement("div",{className:"modalGoBack",style:{backgroundImage:"url('".concat(e,"')")}}),r.a.createElement("p",{className:"modalHeaderTitle"},t.title))},Y=function(t){return a.createElement("div",{className:"svgcontainer"},a.createElement("span",{className:"loaderSpinnerLarge"},a.createElement(_,{width:"16px",height:"16px",style:{color:"#0084FF",display:"block",margin:"auto"}})))},Q=function(t){return a.createElement(a.Fragment,null,a.createElement("span",{className:"loaderSpinner"},a.createElement(_,{width:"16px",height:"16px",style:{color:"#0084FF",display:"block",margin:"auto"}})))},X=n(3),$=function(t){var e=D()(1),n=Object(l.a)(e,3),a=n[0],o=n[1],i=n[2],c=D()(!1),s=Object(l.a)(c,3),d=(s[0],s[1]),m=s[2],u=function(t){o(t)};function p(){return(p=Object(F.a)(j.a.mark((function t(e,n,a){var r,l;return j.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if("up"!==e){t.next=8;break}if(1!==i.current){t.next=5;break}return t.abrupt("return");case 5:r=i.current-1,o(r);case 7:return t.abrupt("return");case 8:if("down"!==e){t.next=16;break}if(3!==i.current){t.next=13;break}return t.abrupt("return");case 13:l=i.current+1,o(l);case 15:return t.abrupt("return");case 16:"enter"===e&&(console.log("enter on : ",i.current),d(!0));case 17:case"end":return t.stop()}}),t)})))).apply(this,arguments)}return r.a.createElement(r.a.Fragment,null,t.loaded?r.a.createElement(r.a.Fragment,null,t.user?r.a.createElement(r.a.Fragment,null,r.a.createElement(X.a,{keyName:"down,up,left,right,enter",onKeyDown:function(t,e,n){return p.apply(this,arguments)}.bind(void 0)},r.a.createElement(J,{title:"Slate Web Extension",user:t.user}),r.a.createElement(Z,{data:t.pageData,image:t.image,favicon:t.favicon,status:t.status}),r.a.createElement("div",{style:{paddingTop:"8px"}},t.status.uploaded?r.a.createElement(q,{id:1,text:"View on Slate",shortcut:"enter",command:"\u23ce",icon:"eye",run:"OPEN_LINK",data:t.status,highlight:a,onChange:u,onEnter:m.current}):r.a.createElement(q,{id:1,text:"Add to my library",shortcut:"enter",command:"\u23ce",icon:"plus",run:"SAVE_LINK",data:t.pageData,highlight:a,onChange:u,onEnter:m.current}),r.a.createElement("p",{className:"modalSystemText"},"System"),r.a.createElement(q,{id:2,text:"Shortcuts",icon:"command",run:"OPEN_SHORTCUTS_PAGE",highlight:a,onChange:u,onEnter:m.current}),r.a.createElement(q,{id:3,text:"Account",icon:"account",run:"OPEN_ACCOUNT_PAGE",data:t.pageData,highlight:a,onChange:u,onEnter:m.current})))):r.a.createElement(r.a.Fragment,null,r.a.createElement(J,{title:"Slate Web Extension",user:t.user}),r.a.createElement("div",null,r.a.createElement("p",{className:"loginHeader"},"Welcome to Slate for Chrome"),r.a.createElement("p",{className:"loginSubtitle"},"Your personal search engine for the web."),r.a.createElement("div",{onClick:function(){window.open("https://slate.host/_/auth","_blank").focus(),window.postMessage({run:"CHECK_LOGIN"},"*")},className:"primaryButton",style:{bottom:"16px",right:"16px",position:"absolute"}},"Sign in")))):r.a.createElement(Y,null))},tt=function(t){function e(){return(e=Object(F.a)(j.a.mark((function t(e,n,a){return j.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n.preventDefault(),"left"===e&&window.postMessage({run:"OPEN_HOME_PAGE"},"*");case 2:case"end":return t.stop()}}),t)})))).apply(this,arguments)}return r.a.createElement(r.a.Fragment,null,r.a.createElement(X.a,{keyName:"left",onKeyDown:function(t,n,a){return e.apply(this,arguments)}.bind(void 0)},r.a.createElement(J,{title:"Shortcuts",goBack:!0,user:t.user}),r.a.createElement("div",{className:"modalTableHeader"},r.a.createElement("div",{style:{marginLeft:"56px"}},"Name"),r.a.createElement("div",{style:{marginLeft:"400px",position:"absolute"}},"Shortcut")),R.map((function(t){return r.a.createElement("div",{className:"modalTableContent"},r.a.createElement("div",{style:{marginLeft:"56px"}},t.name),r.a.createElement("div",{style:{marginLeft:"400px",position:"absolute"}},t.short&&r.a.createElement("span",{className:"modalShortcut"},t.short),r.a.createElement("span",{className:"modalShortcut"},t.key),t.extra&&r.a.createElement("span",{className:"modalShortcut"},t.extra)))}))))},et=function(t){var e=t.user.data.photo;function n(){return(n=Object(F.a)(j.a.mark((function t(e,n,a){return j.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n.preventDefault(),"left"===e&&window.postMessage({run:"OPEN_HOME_PAGE"},"*");case 2:case"end":return t.stop()}}),t)})))).apply(this,arguments)}if(!e){e="https://source.boringavatars.com/marble/24px/".concat(t.user.id,"?square&colors=").concat(["A9B9C1","5B6B74","3C444A","D4DBDF","293137"])}return r.a.createElement(r.a.Fragment,null,r.a.createElement(X.a,{keyName:"left",onKeyDown:function(t,e,a){return n.apply(this,arguments)}.bind(void 0)},r.a.createElement(J,{title:"Account",goBack:!0,user:t.user}),r.a.createElement("div",{className:"modalAccount"},r.a.createElement("div",{className:"modalAccountContent"},e?r.a.createElement("img",{className:"modalAccountAvatar",width:"64px",height:"64px",src:e}):r.a.createElement("div",{className:"modalAccountAvatarBlank",style:{width:"64px",height:"64px"}}),r.a.createElement("div",{className:"modalAccountUsername"},t.user.data.name),r.a.createElement("div",{className:"modalAccountStorage"},r.a.createElement("a",{className:"modalLink",href:"https://slate.host/_/data",target:"_blank"},"View profile"))))))},nt=function(t){var e=Object(a.useState)(!1),n=Object(l.a)(e,2),o=n[0],i=n[1],s=Object(a.useState)({active:"home"}),d=Object(l.a)(s,2),m=d[0],u=d[1],p=Object(a.useState)(null),g=Object(l.a)(p,2),h=g[0],x=g[1],f=function(){window.postMessage({type:"CLOSE_APP"},"*")};return Object(a.useEffect)((function(){var t=function(t){"AUTH_REQ"===t.data.type&&(x(null),i(!0)),"OPEN_HOME_PAGE"===t.data.run&&u({active:"home"}),"OPEN_SHORTCUTS_PAGE"===t.data.run&&u({active:"shortcuts"}),"OPEN_ACCOUNT_PAGE"===t.data.run&&u({active:"account"}),"CHECK_LINK"===t.data.type&&(x(t.data.user),i(!0))};return window.addEventListener("message",t),function(){window.removeEventListener("message",t)}}),[]),r.a.createElement(c.Consumer,null,(function(e){var n=e.pageData;return r.a.createElement(r.a.Fragment,null,r.a.createElement("style",null,O),r.a.createElement("div",{id:"modal",className:"modalWindow"},r.a.createElement("div",{className:"modalContent"},"home"===m.active&&r.a.createElement($,{pageData:n,image:t.image,favicon:t.favicon,status:t.link,user:h,loaded:o}),"shortcuts"===m.active&&r.a.createElement(tt,{user:h,loaded:o}),"account"===m.active&&r.a.createElement(et,{user:h,loaded:o}))),r.a.createElement("div",{className:"modalBackground",onClick:f}))}))},at=n(6),rt=n.n(at),ot=function(t){var e=Object(a.useState)(null),n=Object(l.a)(e,2),o=n[0],i=n[1],s=Object(a.useState)(!0),d=Object(l.a)(s,2),m=d[0],u=d[1],p=Object(a.useState)({status:"uploading",data:null,error:!1,tab:null}),g=Object(l.a)(p,2),h=g[0],x=g[1],f=function(){u(!1)},E=function(){var t=setTimeout((function(){f()}),1e4);return function(){return clearTimeout(t)}};Object(a.useEffect)((function(){window.addEventListener("message",(function(t){return"UPLOAD_DONE"===t.data.type?(x({status:"complete",data:t.data.data.cid,tab:t.data.tab}),void E()):"UPLOAD_FAIL"===t.data.type?(x({status:"error"}),void E()):"UPLOAD_DUPLICATE"===t.data.type?(x({status:"duplicate",data:t.data.data.cid}),void E()):void 0}))}),[]);var b=K(28,t.title),w=function(t){var e=t.upload.data?V(t.upload.data,t.upload.tab):null;return r.a.createElement(r.a.Fragment,null,"uploading"===t.upload.status&&r.a.createElement("div",{className:"loaderFooterLeft"},r.a.createElement(Q,null)," Saving..."),"complete"===t.upload.status&&r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"loaderFooterLeft"},"Saved"),r.a.createElement("div",{className:"loaderFooterRight"},r.a.createElement("a",{href:e,className:"modalLink",target:"_blank"},"View"))),"duplicate"===t.upload.status&&r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"loaderFooterLeft",style:{color:"#34D159"}},"Already exists"),r.a.createElement("div",{className:"loaderFooterRight"},r.a.createElement("a",{href:e,className:"modalLink",target:"_blank"},"View"))),"error"===t.upload.status&&r.a.createElement("div",{className:"loaderFooterLeft",style:{color:"#FF4530"}},"Failed to save"))};return t.image&&function(t){var e=new Image;e.addEventListener("load",(function(){i(t)})),e.src=t}(t.image),r.a.createElement(c.Consumer,null,(function(t){t.pageData;return r.a.createElement(r.a.Fragment,null,r.a.createElement(rt.a,null,r.a.createElement("style",null,B),m&&r.a.createElement("div",{id:"modal",className:"loaderWindow"},r.a.createElement("div",{className:"loaderContent"},r.a.createElement("div",{className:"loaderText"},o?r.a.createElement("img",{className:"loaderImage",src:o,alt:"Favicon"}):r.a.createElement("div",{className:"loaderImageBlank"}),b,r.a.createElement("div",{onClick:f,className:"loaderClose"},r.a.createElement(I,{width:"20px",height:"20px"}))),r.a.createElement("div",{className:"loaderFooter"},r.a.createElement(w,{upload:h}))))))}))};var it=function(){var t=Object(a.useState)(!0),e=Object(l.a)(t,2),n=e[0],o=e[1],i=Object(a.useState)(!0),c=Object(l.a)(i,2),d=c[0],m=c[1],u=Object(a.useState)(!1),p=Object(l.a)(u,2),g=p[0],h=p[1],x=Object(a.useState)({image:null,title:null}),f=Object(l.a)(x,2),E=f[0],b=f[1],w=Object(a.useState)({uploaded:!1,data:null}),v=Object(l.a)(w,2),k=v[0],y=v[1],C=function(t){["ArrowUp","ArrowDown"].indexOf(t.code)>-1&&t.preventDefault()};return Object(a.useEffect)((function(){document.getElementById("slate-loader-type")||o(!1);var t=function(){var t={};return document.querySelector("meta[property='og:image']")&&(t.image=document.querySelector("meta[property='og:image']").getAttribute("content")),document.querySelector("link[rel~='icon']")&&(t.favicon=document.querySelector("link[rel~='icon']").getAttribute("href")),t}();b({image:t.image,favicon:t.favicon})}),[]),Object(a.useEffect)((function(){return window.addEventListener("keydown",C),function(){window.addEventremoveEventListenerListener("keydown",C)}}),[]),Object(a.useEffect)((function(){var t=function(t){"UPLOAD_START"===t.data.type&&(m(!1),h(!0)),"CLOSE_APP"===t.data.type&&(window.removeEventListener("keydown",C),m(!1),window.postMessage({run:"SET_OPEN_FALSE"},"*")),"OPEN_LOADING"===t.data.type&&(m(!1),h(!0)),"CHECK_LINK"===t.data.type&&"LINK_FOUND"===t.data.data.decorator&&y({uploaded:!0,data:t.data.data})};return window.addEventListener("message",t),function(){window.removeEventListener("message",t)}}),[]),r.a.createElement("div",{style:{all:"initial"}},r.a.createElement(rt.a,null,d&&!n&&r.a.createElement(s,null,r.a.createElement("div",null,r.a.createElement(X.a,{keyName:"esc,alt+b,alt+a,alt+c,alt+3",onKeyDown:function(t,e,n){if("esc"===t&&(m(!1),window.removeEventListener("keydown",C),window.postMessage({run:"SET_OPEN_FALSE"},"*")),"alt+b"===t||"enter"===t){if(!1!==k.uploaded){var a=V(k.data.data.cid);return void window.open(a,"_blank").focus()}window.postMessage({run:"OPEN_LOADING",url:window.location.href},"*")}"alt+a"===t&&window.postMessage({run:"OPEN_ACCOUNT_PAGE"},"*"),"alt+c"===t&&window.postMessage({run:"OPEN_SHORTCUTS_PAGE"},"*")}.bind(this)},r.a.createElement(nt,{image:E.image,favicon:E.favicon,link:k})))),g&&r.a.createElement(ot,{image:E.image,title:document.title})))};i.a.render(r.a.createElement(r.a.Fragment,null,r.a.createElement(r.a.StrictMode,null,r.a.createElement(it,null))),document.getElementById("modal-window-slate-extension"))}},[[12,1,2]]]);
//# sourceMappingURL=main.fee43c6a.chunk.js.map