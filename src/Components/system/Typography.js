import * as React from "react";
import * as Constants from "~/common/constants";
import * as Styles from "~/common/styles";
import * as Strings from "~/common/strings";

import { css, jsx } from "@emotion/react";

const LINK_STYLES = `
  font-family: ${Constants.font.text};
  font-weight: 400;
  text-decoration: none;
  color: ${Constants.system.grayLight2};
  cursor: pointer;
  transition: 200ms ease color;
  :hover {
    color: ${Constants.system.grayDark6};
  }
`;

const useColorProp = (color) =>
  React.useMemo(
    () => (theme) => {
      if (!color) return;
      if (!(color in theme.system) && !(color in theme.semantic)) {
        console.warn(`${color} doesn't exist in our design system`);
        return;
      }
      return css({ color: theme.system[color] || theme.semantic[color] });
    },
    [color]
  );

const truncateElements = (nbrOfLines) =>
  nbrOfLines &&
  css`
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    -webkit-line-clamp: ${nbrOfLines};
    display: -webkit-box;
    -webkit-box-orient: vertical;
  `;

const STYLES_LINK = css`
  ${LINK_STYLES}
`;

const STYLES_LINK_DARK = css`
  color: ${Constants.system.grayLight2};
  :hover {
    color: ${Constants.system.white};
  }
`;

const ANCHOR = `
  a {
    ${LINK_STYLES}
  }
`;

const onDeepLink = async (object) => {
  let slug = object.deeplink
    .split("/")
    .map((string) => Strings.createSlug(string, ""))
    .join("/");
  //TODO(martina): moved this cleanup here rather than when entering the info b/c it doesn't allow you to enter "-"'s if used during input. Switch to a dropdown / search later
  if (!object.deeplink.startsWith("/")) {
    slug = "/" + slug;
  }
  return window.open(slug);
};

const outboundRE = /^[a-z]+:/i;
const isExternal = (path) => outboundRE.test(path);

export const A = ({ href, children, dark }) => {
  // setup default linkProps
  const linkProps = {
    href,
    target: isExternal(href) ? "_blank" : "_self",
    rel: isExternal(href) ? "external nofollow" : "",
    css: Styles.LINK,
    children,
    // css: dark ? STYLES_LINK_DARK : STYLES_LINK,
  };

  // process all types of Slate links
  switch (href.charAt(0)) {
    case "@": {
      // mention links
      const mention = href.substr(1).toLowerCase();
      linkProps.href = `/${mention}`;
      break;
    }
    case "#": {
      // hash deepLinks
      // TODO: disabled in Markdown for now
      const tag = href.substr(1).toLowerCase();
      linkProps.href = `/${tag}`;
      linkProps.onClick = (e) => {
        e.preventDefault();
        onDeepLink({ deeplink: tag });
      };
      break;
    }
    default: {
    }
  }
  return <a {...linkProps}>{children}</a>;
};

// const STYLES_H1 = css`
//   box-sizing: border-box;
//   font-size: ${Constants.typescale.lvl4};
//   line-height: 1.1;
//   font-family: ${Constants.font.semiBold};
//   font-weight: 400;
//   color: inherit;
//   text-decoration: none;
//   display: block;
//   overflow-wrap: break-word;

//   :hover {
//     color: inherit;
//   }

//   :visited {
//     color: inherit;
//   }

//   strong {
//     font-family: ${Constants.font.semiBold};
//     font-weight: 400;
//   }

//   ${ANCHOR}
// `;

export const H1 = ({ as = "h1", nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(
    () => truncateElements(nbrOflines),
    [nbrOflines]
  );
  const COLOR_STYLES = useColorProp(color);

  return jsx(
    as,
    { ...props, css: [Styles.H1, TRUNCATE_STYLE, COLOR_STYLES, props?.css] },
    children
  );
};

export const H2 = ({ as = "h2", nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(
    () => truncateElements(nbrOflines),
    [nbrOflines]
  );
  const COLOR_STYLES = useColorProp(color);

  return jsx(
    as,
    { ...props, css: [Styles.H2, TRUNCATE_STYLE, COLOR_STYLES, props?.css] },
    children
  );
};

export const H3 = ({ as = "h3", nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(
    () => truncateElements(nbrOflines),
    [nbrOflines]
  );
  const COLOR_STYLES = useColorProp(color);

  return jsx(
    as,
    { ...props, css: [Styles.H3, TRUNCATE_STYLE, COLOR_STYLES, props?.css] },
    children
  );
};

export const H4 = ({ as = "h4", nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(
    () => truncateElements(nbrOflines),
    [nbrOflines]
  );
  const COLOR_STYLES = useColorProp(color);

  return jsx(
    as,
    { ...props, css: [Styles.H4, TRUNCATE_STYLE, COLOR_STYLES, props?.css] },
    children
  );
};

export const H5 = React.forwardRef(
  ({ as = "h5", nbrOflines, children, color, ...props }, ref) => {
    const TRUNCATE_STYLE = React.useMemo(
      () => truncateElements(nbrOflines),
      [nbrOflines]
    );
    const COLOR_STYLES = useColorProp(color);

    return jsx(
      as,
      {
        ...props,
        css: [Styles.H5, TRUNCATE_STYLE, COLOR_STYLES, props?.css],
        ref,
      },
      children
    );
  }
);

export const H6 = React.forwardRef(
  ({ as = "h6", nbrOflines, children, color, ...props }, ref) => {
    const TRUNCATE_STYLE = React.useMemo(
      () => truncateElements(nbrOflines),
      [nbrOflines]
    );
    const COLOR_STYLES = useColorProp(color);

    return jsx(
      as,
      {
        ...props,
        css: [Styles.H6, TRUNCATE_STYLE, COLOR_STYLES, props?.css],
        ref,
      },
      children
    );
  }
);

export const P1 = ({ as = "p", nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(
    () => truncateElements(nbrOflines),
    [nbrOflines]
  );
  const COLOR_STYLES = useColorProp(color);

  return jsx(
    as,
    { ...props, css: [Styles.P1, TRUNCATE_STYLE, COLOR_STYLES, props?.css] },
    children
  );
};

export const P2 = ({ as = "p", nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(
    () => truncateElements(nbrOflines),
    [nbrOflines]
  );
  const COLOR_STYLES = useColorProp(color);

  return jsx(
    as,
    { ...props, css: [Styles.P2, TRUNCATE_STYLE, COLOR_STYLES, props?.css] },
    children
  );
};

export const P3 = React.forwardRef(
  ({ as = "p", nbrOflines, children, color, ...props }, ref) => {
    const TRUNCATE_STYLE = React.useMemo(
      () => truncateElements(nbrOflines),
      [nbrOflines]
    );
    const COLOR_STYLES = useColorProp(color);
    return jsx(
      as,
      {
        ...props,
        css: [Styles.P3, TRUNCATE_STYLE, COLOR_STYLES, props?.css],
        ref,
      },
      children
    );
  }
);

export const C1 = ({ as = "p", nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(
    () => truncateElements(nbrOflines),
    [nbrOflines]
  );
  const COLOR_STYLES = useColorProp(color);

  return jsx(
    as,
    { ...props, css: [Styles.C1, TRUNCATE_STYLE, COLOR_STYLES, props?.css] },
    children
  );
};

export const C2 = ({ as = "p", nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(
    () => truncateElements(nbrOflines),
    [nbrOflines]
  );
  const COLOR_STYLES = useColorProp(color);

  return jsx(
    as,
    { ...props, css: [Styles.C2, TRUNCATE_STYLE, COLOR_STYLES, props?.css] },
    children
  );
};

export const C3 = ({ as = "p", nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(
    () => truncateElements(nbrOflines),
    [nbrOflines]
  );
  const COLOR_STYLES = useColorProp(color);

  return jsx(
    as,
    { ...props, css: [Styles.C3, TRUNCATE_STYLE, COLOR_STYLES, props?.css] },
    children
  );
};

export const B1 = ({ as = "p", nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(
    () => truncateElements(nbrOflines),
    [nbrOflines]
  );
  const COLOR_STYLES = useColorProp(color);

  return jsx(
    as,
    { ...props, css: [Styles.B1, TRUNCATE_STYLE, COLOR_STYLES, props?.css] },
    children
  );
};

const STYLES_UL = css`
  box-sizing: border-box;
  padding-left: 24px;
`;

export const UL = ({ as = "ul", children, props }) =>
  jsx(as, { ...props, css: [STYLES_UL, props?.css] }, children);

const STYLES_OL = css`
  box-sizing: border-box;
  padding-left: 24px;
`;

export const OL = ({ as = "ol", children, props }) =>
  jsx(as, { ...props, css: [STYLES_OL, props?.css] }, children);

const STYLES_LI = css`
  box-sizing: border-box;
  margin-top: 12px;
  strong {
    font-family: ${Constants.font.semiBold};
    font-weight: 400;
  }
`;

export const LI = ({ as = "li", children, props }) =>
  jsx(as, { ...props, css: [STYLES_LI, props?.css] }, children);
