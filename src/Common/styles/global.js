import * as Constants from "../../Common/constants";

import { css } from "@emotion/react";

/* prettier-ignore */
export const injectGlobalStyles = () => css`
  @font-face {
    font-family: 'mono';
    src: url('https://slate.textile.io/ipfs/bafkreialkhtjtpwocdadbmra3o7mii47bzgl3k2v2ossrpvhk3qqsbqtza');
  }

  @font-face {
    font-family: 'mono-bold';
    src: url('https://slate.textile.io/ipfs/bafkreigaktonxehwl5bzah5ze4iruw272qybj22wpy32pgrcka3y4jvhc4');
  }

  @font-face {
    font-family: 'inter-regular';
    src: url('https://slate.textile.io/ipfs/bafkreic3hkcuwvrmf6trweqcjp62valsfjh3zvwacikoreynakgw67wrvy');
  }

  @font-face {
    font-family: 'inter-semi-bold';
    src: url('https://slate.textile.io/ipfs/bafkreiaezvuz6wawoqyntfl4gbprol3e7majovgof3uxvhilvd2pgk4w54');
  }

  @font-face {
    font-family: 'inter-bold';
    src: url('https://slate.textile.io/ipfs/bafybeigljfbymd52vnrie6qkcy4u4kplsz4yen2idpizhr3dvrgy7kufaq');
  }

  @font-face {
    font-family: 'inter-medium';
    src: url('https://slate.textile.io/ipfs/bafkreiapyxmqjwoowqpek2cjocouzxoalwlzwwbv3dscug3e5l2ok7xmqe');
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
    -webkit-font-feature-settings: "liga"1, "ss01"1, "zero"1, "cv11"1, 'frac'1, 'calt'1, 'tnum'1;
    -moz-font-feature-settings: "liga"1, "ss01"1, "zero"1, "cv11"1, 'frac'1, 'calt'1, 'tnum'1;
    -ms-font-feature-settings: "liga"1, "ss01"1, "zero"1, "cv11"1, 'frac'1, 'calt'1, 'tnum'1;
    font-feature-settings: "liga"1, "ss01"1, "zero"1, "cv11"1, 'frac'1, 'calt'1, 'tnum'1;
  }
`;
