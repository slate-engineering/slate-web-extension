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
	  z-index: 9999;
	  border-radius: 16px;
	  color: ${Constants.semantic.textBlack};
	  font-family: "Inter";
	  padding-bottom: 8px;
	}

	.modalContent {
	  position: relative;
	  width: 100%;
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
	  background-color: #fff;
	  color: ${Constants.semantic.textBlack};
	  bottom: 0;
	  font-family: "Inter";
	  margin-left: 16px;
	  margin-right: 16px;
	  display: flex;
	}

	.modalButtonMain:hover {
	  background-color: ${Constants.system.grayLight6};
	}

	.modalButtonSVG {
	   margin-left: 16px;
	}

	.modalButtonText {
	  margin-left: 16px;
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
	  padding: 1px 3px 1px 3px;
	}

	.modalSystemText {
	  margin-left: 32px;
	  color: ${Constants.system.gray};
	  padding-top: 8px;
	  font-size: 14px;
	  font-weight: 600;
	  margin-bottom: 8px;
	}

	.modalHeader {
	  height: 52px;
	  border-bottom: 1px solid ${Constants.system.grayLight5};
	  line-height: 52px;
	  padding-left: 32px;
	}

	.modalGoBack {
	  margin-right: 14px;
	  background-color: ${Constants.system.grayLight5};
	  border-radius: 6px;
	  padding: 4px 4px;
	  cursor: pointer;
	  display: inline;
	}

	.modalHeaderTitle {
	  font-weight: 600;
	  font-family: 'Inter';
	  font-size: 16px;
	  display: inline;
	}

	.metadata {
	  position: relative;
	  background-color: transparent;
	  display: flex;
	  margin-top: 16px;
	  padding-left: 32px;
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
	  margin-left: 16px;
	}

	.metadataBox3 {
	  position: absolute;
	  right: 32px;
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
	  border-radius: 6px;
	  padding: 1px 3px 1px 3px;
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


`;

