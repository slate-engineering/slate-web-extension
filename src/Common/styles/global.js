import * as Constants from "~/common/constants";

import { css } from "@emotion/react";
import { getExtensionURL } from "~/common/utilities";

export const FontFaces = `
  @font-face {
    font-family: 'inter-regular';
    src: url('${getExtensionURL("/fonts/inter-regular.ttf")}');
  }

  @font-face {
    font-family: 'inter-semi-bold';
    src: url('${getExtensionURL("/fonts/inter-semi-medium.ttf")}');
  }

  @font-face {
    font-family: 'inter-bold';
    src: url('${getExtensionURL("/fonts/inter-bold.ttf")}');
  }

  @font-face {
    font-family: 'inter-medium';
    src: url('${getExtensionURL("/fonts/inter-medium.ttf")}');
  }
`;

/* prettier-ignore */
export const injectGlobalStyles = () => css`
  ${FontFaces};

  svg {
    display: block;
  }

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
  }

  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  html, body {
    background: ${Constants.system.white};
    color: ${Constants.system.black};
    font-size: 16px;
    font-family: ${Constants.font.text};
    scrollbar-width: none;
    -ms-overflow-style: -ms-autohiding-scrollbar;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  * {
    -webkit-font-feature-settings: "liga"1, "ss01"1, "zero"1, "cv11"1, 'frac'1, 'calt'1, 'tnum'1;
    -moz-font-feature-settings: "liga"1, "ss01"1, "zero"1, "cv11"1, 'frac'1, 'calt'1, 'tnum'1;
    -ms-font-feature-settings: "liga"1, "ss01"1, "zero"1, "cv11"1, 'frac'1, 'calt'1, 'tnum'1;
    font-feature-settings: "liga"1, "ss01"1, "zero"1, "cv11"1, 'frac'1, 'calt'1, 'tnum'1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
   }
`;
