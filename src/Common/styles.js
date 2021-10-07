import * as Constants from "../Common/constants";
import Inter from "typeface-inter";

export const main = `
	.modalWindow {
	  top: 50%;
	  left: 50%;
	  transform: translate(-50%, -50%);
	  will-change: transform;
	  position: fixed;
	  background: ${Constants.system.white};
	  width: 640px;  
	  height: 400px;
	  border: 1px solid ${Constants.system.grayLight5};
	  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);
	  z-index: 99999;
	  border-radius: 16px;
	  color: ${Constants.semantic.textBlack};
	  font-family: "Inter";
	  padding-bottom: 8px;
	}

	.modalContent {
	  position: relative;
	  width: 100%;
	  height: 100%;
	}

	.modalBackground {
	  background-color: transparent;
	  width: 100vw;
	  height: 100vh;
	  position: fixed;
	  cursor: pointer;
	  z-index: 9998;
	}

	.modalButtonMain {
	  outline: 0;
	  border: 0;
	  border-radius: 12px;
	  height: 48px;
	  line-height: 48px;
	  font-size: 16px;
	  user-select: none;
	  cursor: pointer;
	  background-color: ${Constants.system.white};
	  color: ${Constants.semantic.textBlack};
	  bottom: 0;
	  font-family: "Inter";
	  margin-left: 8px;
	  margin-right: 8px;
	  display: flex;
	}

	.modalButtonMain:hover {
	  background-color: ${Constants.system.grayLight6};
	}

	.modalButtonSVG {
	   margin-left: 12px;
	}

	.modalButtonText {
	  margin-left: 20px;
	  font-family: "Inter";
	}

	.modalCommandIcon {
	  background-color:  ${Constants.system.grayLight6};
	  color: ${Constants.semantic.textGray};
	  border-radius: 6px;
	  padding: 1px;
	  margin-right: 4px;
	}

	.modalKeyIcon {
	  background-color: ${Constants.system.grayLight6};
	  color: ${Constants.semantic.textGray};
	  border-radius: 6px;
	  padding: 2px 4px 2px 4px;
	}

	.modalSystemText {
	  margin-left: 20px;
	  color: ${Constants.system.gray};
	  padding-top: 4px;
	  font-size: 14px;
	  font-weight: 600;
	  margin-bottom: 8px;
	}

	.modalHeader {
	  height: 52px;
	  border-bottom: 1px solid ${Constants.system.grayLight5};
	  padding-left: 16px;
	}

	.modalGoBack {
	  margin-right: 28px;
	  margin-top: 14px;
	  background-color: ${Constants.system.grayLight5};
	  border-radius: 8px;
	  cursor: pointer;
	  width: 24px;
	  height: 24px;
	  display: inline-block;
	  position: absolute;
	}

	.modalHeaderTitle {
	  font-weight: 500;
	  line-height: 52px;
	  font-family: 'Inter';
	  font-size: 16px;
	  display: inline;
	  margin-left: 40px;
	}

	.metadata {
	  position: relative;
	  background-color: transparent;
	  display: flex;
	  margin-top: 16px;
	  padding-left: 20px;
	  padding-bottom: 16px;
	  border-bottom: 1px solid ${Constants.system.grayLight5};
	}

	.metadataBox {
	}

	.metadataImage {
	  border-radius: 8px;
	  margin-top: 8px;
	  object-fit: cover;
	  min-height: 20px;
	  min-width: 20px;
	}

	.metadataBox2 {
	  margin-left: 20px;
	}

	.metadataBox3 {
	  position: absolute;
	  right: 20px;
	}

	.metaDataTitle {
	  color: ${Constants.semantic.textBlack};
	  font-family: "Inter";
	  font-weight: 600;
	  font-size: 16px;
	  margin-bottom: 4px;
	}

	.modalCloseButton {
	  color: ${Constants.semantic.textBlack};
	  font-family: "Inter";
	  font-weight: 600;
	  font-size: 16px;
	}

	.metaDataUrl {
	  color: ${Constants.semantic.textBlack};
	  font-family: "Inter";
	  font-weight: 400;
	  font-size: 16px;
	}

	.modalTableContent {
	  display: flex;
	  justify-content: left;
	  padding-top: 12px;
	  padding-bottom: 12px;
	  font-size: 14px;
	  color: ${Constants.semantic.textBlack};
	}

	.modalShortcut {
	  width: auto;
	  background-color: ${Constants.system.grayLight6};
	  color: ${Constants.semantic.textGray};
	  border-radius: 6px;
	  padding: 2px 3px 2px 3px;
	  margin-right: 4px;
	}

	.modalTableHeader {
	  display: flex;
	  justify-content: left;
	  border-bottom: 1px solid ${Constants.system.grayLight5}; 
	  padding-top: 12px;
	  padding-bottom: 12px;
	  font-size: 12px;
	  color: ${Constants.system.gray};
	}

	.modalAccount {
	  vertical-align: middle;
	  justify-content: center;
	  align-items: center;
	  position: relative;
	}

	.modalAccountAvatar {
		object-fit: cover;
		border-radius: 20px;
		display: block;
		margin-left: auto;
		margin-right: auto;
		justify-content: center;
		align-items: center;
		clear: both;
	}

	.modalAccountAvatarBlank {
		background-color: ${Constants.system.grayLight5};
		border-radius: 20px;
		display: block;
		margin-left: auto;
		margin-right: auto;
		justify-content: center;
		align-items: center;
		clear: both;
	}

	.modalAccountContent {
	  margin: 0 auto;
	  position: absolute;
	  left: 50%;
	  top: 50%;
	  margin-top: 150px;
	  transform: translate(-50%, -50%);
	}

	.modalAccountUsername {
	  text-align: center;
	  font-size: 16px;
	  font-weight: 600;
	  padding-top: 16px;
	  display: flex;
	  margin: auto 0;
	  justify-content: center;
	  clear: both;
	  align-items: center;
	}

	.modalAccountStorage {
	  text-align: center;
	  font-size: 14px;
	  font-weight: 400;
	  padding-top: 4px;
	  display: flex;
	  margin: auto 0;
	  justify-content: center;
	  clear: both;
	  align-items: center;
	}

	.modalSmallButton {
	  width: auto;
	  margin-top: 32px;
	  text-align: center;
	  clear: both;
	  background-color: ${Constants.system.grayLight5};
	  color: ${Constants.semantic.textBlack};
	  border-radius: 8px;
	  padding: 8px 24px;
	  font-size: 14px;
	  font-weight: 600;
	  border: 0;
	  cursor: pointer;
	}

	.modalProgressContainer {
	  margin: 8px 0 8px 0;
	  width: 240px;
	  background-color: ${Constants.system.white};
	  border-radius: 2px;
	  border: 2px solid ${Constants.system.grayLight4};
	}

	.modalProgressBar {
	  height: 8px;
	  background-color: ${Constants.system.blue};
	  border-radius: 2px;
	}

	.primaryButton {
		font-size: 14px;
		font-weight: 500;
		font-family: 'Inter';
		background-color: ${Constants.system.blue};
		color: ${Constants.system.white};
		border: 0;
		border-radius: 12px;
		padding: 4px 24px;
		cursor: pointer;
	}

	.loginHeader {
		font-size: 24px; 
		font-family: 'Inter';
		margin-left: 20px;
		margin-top: 114px;
		margin-bottom: 0px;
		font-weight: 500;
	}

	.loginSubtitle {
		font-size: 14px;
		margin-left: 20px;
		margin-top: 6px;
	}

	.loaderSpinner {
		margin: 0 auto;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: block;
  		animation: slate-client-animation-spin 1.5s cubic-bezier(0.5, 0.1, 0.4, 0.7) infinite;
	}

	.loaderSpinnerSVG {
		display: block;
		color: ${Constants.system.blue};
		height: 16px;
		width: 16px;
	}
	
	@keyframes slate-client-animation-spin {
		from {
		  -webkit-transform: rotate(0deg);
		  transform: rotate(0deg);
		}
		to {
		  -webkit-transform: rotate(360deg);
		  transform: rotate(360deg);
		}
	}
`;

export const toast = `
	.loaderWindow {
		top: 0%;
		right: 0%;
		margin-top: 2em;
		margin-right: 2em;
		position: fixed;
		background: ${Constants.system.white};
		width: 320px;  
		height: 88px;
		max-width: 320px;  
		max-height: 88px;
		box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;
		z-index: 99999;
		border-radius: 10px;
		border: 0;
		color: ${Constants.system.black};
	}

	.loaderBody {
		width: 100%;
	}

	.loaderContent {
		color: ${Constants.system.white};
		font-size: 14px;
	}

	.loaderText {
		font-family: 'Inter';
		color: ${Constants.system.black};
		padding-left: 48px;
		line-height: 48px;
		font-weight: 600;
		cursor: default;
	}

	.loaderBox {
		width: 32px;
		height: 32px;
		background-color: #F2F2F7;
		color: ${Constants.system.gray};
	}

	.loaderImage {
		position: absolute;
		line-height: 40px;
		top: 14px;
		left: 14px;
		object-fit: cover;
		border-radius: 10px;
		width: 24px;
		height: 24px;
	}

	.loaderImageBlank {
		position: absolute;
		line-height: 40px;
		top: 14px;
		left: 14px;
		border-radius: 10px;
		width: 24px;
		height: 24px;
		background-color: ${Constants.system.grayLight5};
	}

	.loaderFooter {
		bottom: 0px;
		width: 100%;  
		height: 40px;
		line-height: 40px;
		background-color: ;
		color: ${Constants.system.gray};
		border-radius: 0 0 10px 10px; 
	}

	.loaderFooterRight {
		text-align: right;
		right: 14px;
		font-weight: 400;
		font-family: 'Inter';
		display: inline;
		position: absolute;
	}

	.loaderFooterLeft {
		text-align: left;
		font-weight: 400;
		font-family: 'Inter';
		left: 0px;
		padding-left: 14px;
		display: inline;
	}

	.loaderClose {
		cursor: pointer;
		text-align: 'right';
		right: 14px;
		display: inline;
		position: absolute;
		color: ${Constants.system.gray};
		line-height: 48px;
	}

	.loaderClose:hover {
	  	transition: 0.3s;
	  	color: ${Constants.system.black};
	}

	.loaderSpinner {
		margin-right: 8px;
		display: inline-block;
		margin-left: 4px;
	  	justify-content: center;
	  	align-items: center;
		animation: slate-client-animation-spin 1.5s cubic-bezier(0.5, 0.1, 0.4, 0.7) infinite;
	}

	.loaderSpinnerSVG {
		display: block;
		margin: auto;
		color: ${Constants.system.blue};
		height: 16px;
		width: 16px;
	}

	.modalLink {
		color: ${Constants.system.blue};
		font-weight: 600;
		text-decoration: none;
	}
	
	@keyframes slate-client-animation-spin {
		from {
		  -webkit-transform: rotate(0deg);
		  transform: rotate(0deg);
		}
		to {
		  -webkit-transform: rotate(360deg);
		  transform: rotate(360deg);
		}
	}

`;


