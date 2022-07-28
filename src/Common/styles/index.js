import * as Constants from "../../Common/constants";

import { css } from "@emotion/react";

import Inter from "typeface-inter";

/* TYPOGRAPHY */

export const OVERFLOW_ELLIPSIS = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const LINK = css`
  text-decoration: none;
  color: ${Constants.semantic.textBlack};
  cursor: pointer;

  :visited {
    color: ${Constants.semantic.textBlack};
  }
`;

const TEXT = css`
  box-sizing: border-box;
  overflow-wrap: break-word;
  text-align: left;
  font-weight: normal;

  a {
    ${LINK}
  }
`;

export const H1 = css`
  font-family: ${Constants.font.medium};
  font-size: 2rem;
  line-height: 1.5;
  letter-spacing: -0.021px;

  ${TEXT}
`;

export const H2 = css`
  font-family: ${Constants.font.medium};
  font-size: 1.5rem;
  line-height: 1.5;
  letter-spacing: -0.019px;

  ${TEXT}
`;

export const H3 = css`
  font-family: ${Constants.font.medium};
  font-size: 20px;
  line-height: 28px;
  letter-spacing: -0.017px;

  ${TEXT}
`;

export const H4 = css`
  font-family: ${Constants.font.medium};
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.011px;

  ${TEXT}
`;

export const H5 = css`
  font-family: ${Constants.font.medium};
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.006px;

  ${TEXT}
`;

export const H6 = css`
  font-family: ${Constants.font.medium};
  font-size: 12px;
  line-height: 20px;
  letter-spacing: -0.01px;

  ${TEXT}
`;

export const P1 = css`
  font-family: ${Constants.font.text};
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.011px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    font-family: ${Constants.font.text};
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.006px;
  }

  ${TEXT}
`;

export const P2 = css`
  font-family: ${Constants.font.text};
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.006px;

  ${TEXT}
`;

export const P3 = css`
  font-family: ${Constants.font.text};
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;

  ${TEXT}
`;

export const C1 = css`
  font-family: ${Constants.font.code};
  font-size: 16px;
  line-height: 24px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    font-size: 14px;
    line-height: 20px;
  }

  ${TEXT}
`;

export const C2 = css`
  font-family: ${Constants.font.code};
  font-size: 14px;
  line-height: 20px;

  ${TEXT}
`;

export const C3 = css`
  font-family: ${Constants.font.code};
  font-size: 12px;
  line-height: 16px;

  ${TEXT}
`;

export const B1 = css`
  font-family: ${Constants.font.medium};
  font-size: 0.875rem;
  line-height: 20px;
  letter-spacing: -0.006px;

  ${TEXT}
`;

/* FREQUENTLY USED */

export const HORIZONTAL_CONTAINER = css`
  display: flex;
  flex-direction: row;
`;

export const VERTICAL_CONTAINER = css`
  display: flex;
  flex-direction: column;
`;

export const HORIZONTAL_CONTAINER_CENTERED = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const VERTICAL_CONTAINER_CENTERED = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CONTAINER_CENTERED = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ICON_CONTAINER = css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  margin: -4px;
  cursor: pointer;
  color: ${Constants.system.black};

  :hover {
    color: ${Constants.semantic.textGrayDark};
  }
`;

export const HOVERABLE = css`
  cursor: pointer;

  :hover {
    color: ${Constants.semantic.textGrayDark};
  }
`;

export const MOBILE_HIDDEN = css`
  @media (max-width: ${Constants.sizes.mobile}px) {
    display: none;
    pointer-events: none;
  }
`;

export const MOBILE_ONLY = css`
  @media (min-width: ${Constants.sizes.mobile}px) {
    display: none;
    pointer-events: none;
  }
`;

//NOTE(martina): resize so the image is fills its container from edge to edge, while maintaining aspect ratio. Any overflow is clipped
export const IMAGE_FILL = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

//NOTE(martina): resize so the image is contained within the bounds of its container, while maintaining aspect ratio. There is no overflow
export const IMAGE_FIT = css`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

/* COMMON GRIDS */
export const OBJECTS_PREVIEW_GRID = (theme) => css`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${theme.grids.object.desktop.width}px, 1fr)
  );
  grid-gap: 24px ${theme.grids.object.desktop.rowGap}px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    grid-gap: 20px ${theme.grids.object.mobile.rowGap}px;
    grid-template-columns: repeat(
      auto-fill,
      minmax(${theme.grids.object.mobile.width}px, 1fr)
    );
  }
`;

export const BUTTON_RESET = css`
  ${HOVERABLE};
  padding: 0;
  margin: 0;
  background-color: unset;
  border: none;
  cursor: pointer;
  outline: 0;
  border: 0;
`;

export const COLLECTIONS_PREVIEW_GRID = (theme) => css`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${theme.grids.collection.desktop.width}px, 1fr)
  );
  grid-gap: 24px ${theme.grids.collection.desktop.rowGap}px;

  @media (max-width: ${Constants.sizes.desktop}px) {
    grid-gap: 20px ${theme.grids.collection.mobile.rowGap}px;
    grid-template-columns: repeat(
      auto-fill,
      minmax(${theme.grids.collection.mobile.width}px, 1fr)
    );
  }
`;

export const PROFILE_PREVIEW_GRID = (theme) => css`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${theme.grids.profile.desktop.width}px, 1fr)
  );
  grid-gap: 24px ${theme.grids.profile.desktop.rowGap}px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    grid-gap: 20px ${theme.grids.profile.mobile.rowGap}px;
    grid-template-columns: repeat(
      auto-fill,
      minmax(${theme.grids.profile.mobile.width}px, 1fr)
    );
  }
`;

export const PAGE_CONTENT_WRAPPER = (theme) => css`
  width: 100%;
  min-height: calc(
    100vh - ${theme.sizes.filterNavbar}px - ${theme.sizes.header}px
  );
  padding: 20px 20px 44px;
  @media (max-width: ${theme.sizes.mobile}px) {
    padding: 16px 16px 44px;
  }
`;

export const PAGE_EMPTY_STATE_WRAPPER = (theme) => css`
  height: calc(100vh - ${theme.sizes.filterNavbar + theme.sizes.header}px);
  padding: 20px;
  @media (max-width: ${theme.sizes.mobile}px) {
    padding: 0px;
    height: calc(100vh - ${theme.sizes.header}px - 44px);
  }
`;

// TODO(amine): delete these styles
export const main = `
	.modalWindow {
	  top: 50%;
	  left: 50%;
	  transform: translate(-50%, -50%);
	  will-change: transform;
	  position: fixed;
	  background: ${Constants.system.white};
	  width: 640px;
	  height: 350px;
	  border: 1px solid ${Constants.system.grayLight5};
	  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);
	  z-index: 2100000000;
	  border-radius: 16px;
	  color: ${Constants.semantic.textBlack};
	  font-family: 'inter', -apple-system, BlinkMacSystemFont, arial, sans-serif;
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
	  z-index: 210000000;
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
	  margin-left: 8px;
	  margin-right: 8px;
	  display: grid;
	  grid-template-columns: 50px 1fr auto;
	  align-items: center;
	  justify-content: center;
	}

	.modalButtonMain:hover {
	  background-color: ${Constants.system.grayLight6};
	}

	.modalButtonSVG {
	   margin-left: 12px;
	}

	.modalButtonText {
	  font-weight: 400;
	}

	.svgcontainer {
	  width: 50px;
	  height: 50px;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}

	.modalCommandIcon {
	  background-color:  ${Constants.system.grayLight6};
	  color: ${Constants.semantic.textGray};
	  border-radius: 6px;
	  padding: 2px 4px 2px 4px;
	}

	.modalKeyIcon {
	  background-color: ${Constants.system.grayLight6};
	  color: ${Constants.semantic.textGray};
	  border-radius: 6px;
	  padding: 2px 4px 2px 4px;
	  margin-right: 4px;
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
	  padding-left: 20px;
	  display: flex;
	  align-items: center;
	  gap: 20px;
	}

	.modalGoBack {
	  background-color: ${Constants.system.grayLight5};
	  border-radius: 8px;
	  cursor: pointer;
	  width: 24px;
	  height: 24px;
	  display: inline-block;
	  background-size: cover;
  	  background-position: 50% 50%;
	}

	.modalHeaderTitle {
	  font-weight: 500;
	  font-size: 16px;
	  display: inline;
	}

	.metadata {
	  background-color: transparent;
	  margin: 16px 8px 0 8px;
	  padding-bottom: 16px;
	  border-bottom: 1px solid ${Constants.system.grayLight5};
	  display: grid;
	  grid-template-columns: 50px 1fr auto;
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

	}

	.metadataBox3 {
	  position: absolute;
	  right: 20px;
	}

	.metaDataTitle {
	  color: ${Constants.semantic.textBlack};
	  font-weight: 600;
	  font-size: 16px;
	  margin-bottom: 4px;
	}

	.modalCloseButton {
	  color: ${Constants.semantic.textBlack};
	  font-weight: 600;
	  font-size: 16px;
	}

	.metaDataUrl {
	  color: ${Constants.semantic.textBlack};
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
	  line-height: 32px;
	  height: 32px;
	  margin-top: 32px;
	  text-align: center;
	  clear: both;
	  background-color: ${Constants.system.grayLight5};
	  color: ${Constants.semantic.textBlack};
	  border-radius: 8px;
	  padding: 0 24px;
	  font-size: 14px;
	  font-weight: 500;
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
		background-color: ${Constants.system.blue};
		color: ${Constants.system.white};
		border: 0;
		border-radius: 12px;
		padding: 0 24px;
		height: 32px;
		line-height: 32px;
		cursor: pointer;
	}

	.loginHeader {
		font-size: 24px;
		margin-left: 20px;
		margin-top: 100px;
		margin-bottom: 0px;
		font-weight: 500;
	}

	.loginSubtitle {
		font-size: 14px;
		margin-left: 20px;
		margin-top: 6px;
	}

	.loaderSpinnerLarge {
		margin: 0 auto;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: block;
  		animation: slate-client-animation-spin 1.5s cubic-bezier(0.5, 0.1, 0.4, 0.7) infinite;
	}

	.loaderSpinnerSmall {
		margin: 0 auto;
		position: absolute;
		display: block;
  		animation: slate-client-animation-spin 1.5s cubic-bezier(0.5, 0.1, 0.4, 0.7) infinite;
	}

	.loaderSpinnerSVG {
		display: block;
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

export const toast = `
	.loaderWindow {
		font-family: 'inter', -apple-system, BlinkMacSystemFont, arial, sans-serif;
		font-size: 14px;
		position: fixed;
		top: 16px;
		right: 16px;
		background: ${Constants.system.white};
		width: 320px;
		height: 88px;
		max-width: 320px;
		max-height: 88px;
		box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;
		z-index: 2100000000;
		border-radius: 10px;
		border: 0;
		color: ${Constants.system.black};
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 14px;
		box-sizing: border-box;
	}

	.loaderText {
		color: ${Constants.system.black};
		font-weight: 600;
		cursor: default;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;
		-webkit-line-clamp: 1;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}

	.loaderBox {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 14px;
	}

	.loaderImage {
		line-height: 40px;
		object-fit: cover;
		border-radius: 10px;
		width: 24px;
		height: 24px;
		background-color: ${Constants.system.grayLight5};
		background-size: cover;
  	  	background-position: 50% 50%;
	}

	.loaderFooter {
		font-weight: 400;
		width: 100%;
		color: ${Constants.system.gray};
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.loaderFooterLeft {
		display: inline-flex;
		flex-direction: row;
		align-items: center;
	}

	.loaderClose {
		cursor: pointer;
		padding: 0;
 		margin: 0;
  		background-color: unset;
  		border: none;
  		cursor: pointer;
  		outline: 0;
  		border: 0;
		color: ${Constants.system.gray};
	}

	.loaderClose:hover {
	  	transition: 0.3s;
	  	color: ${Constants.system.black};
	}

	.loaderSpinner {
		animation: slate-client-animation-spin 1.5s cubic-bezier(0.5, 0.1, 0.4, 0.7) infinite;
		display: flex;
		width: 16px;
		height: 16px;
	  	justify-content: center;
	  	align-items: center;
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
